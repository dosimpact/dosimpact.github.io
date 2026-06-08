import { useState, useCallback, useRef, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import { LangGraphMessageAccumulator } from "./LangGraphMessageAccumulator";
import {
  type EventType,
  type LangChainMessageTupleEvent,
  LangGraphKnownEventTypes,
  type LangGraphTupleMetadata,
  type OnMessageChunkCallback,
  type OnValuesEventCallback,
  type OnUpdatesEventCallback,
  type OnSubgraphUpdatesEventCallback,
  type OnSubgraphValuesEventCallback,
  type OnCustomEventCallback,
  type OnErrorEventCallback,
  type OnSubgraphErrorEventCallback,
  type OnInfoEventCallback,
  type OnMetadataEventCallback,
  type RemoveUIMessage,
  type UIMessage,
} from "./types";
import { useAui } from "@assistant-ui/store";
import { normalizeLangGraphTupleMessage } from "./normalizeLangGraphTupleMessage";

// LangGraph 스트림 이벤트를 React state로 누적하는 핵심 훅입니다.
// 메시지, interrupt, metadata, Generative UI 상태를 한 번의 send 흐름에서 함께 관리합니다.
const DEFAULT_UI_STATE_KEY = "ui";

const parseEventType = (
  event: string,
): { type: string; namespace: string | undefined } => {
  const pipeIndex = event.indexOf("|");
  if (pipeIndex === -1) return { type: event, namespace: undefined };
  return {
    type: event.slice(0, pipeIndex),
    namespace: event.slice(pipeIndex + 1),
  };
};

const isUIUpdate = (
  value: unknown,
): value is
  | UIMessage
  | RemoveUIMessage
  | readonly (UIMessage | RemoveUIMessage)[] => {
  if (Array.isArray(value)) return value.every(isUIUpdate);
  if (value == null || typeof value !== "object") return false;
  const v = value as { type?: unknown; id?: unknown };
  if (typeof v.id !== "string") return false;
  return v.type === "ui" || v.type === "remove-ui";
};

export type LangGraphCommand = {
  resume: string;
};

export type LangGraphSendMessageConfig = {
  command?: LangGraphCommand;
  runConfig?: unknown;
  checkpointId?: string;
};

export type LangGraphMessagesEvent<TMessage> = {
  event: EventType;
  data: TMessage[] | any;
};

export type LangGraphStreamCallback<TMessage> = (
  messages: TMessage[],
  config: LangGraphSendMessageConfig & {
    abortSignal: AbortSignal;
    initialize: () => Promise<{
      remoteId: string;
      externalId: string | undefined;
    }>;
  },
) =>
  | Promise<AsyncGenerator<LangGraphMessagesEvent<TMessage>>>
  | AsyncGenerator<LangGraphMessagesEvent<TMessage>>;

export type LangGraphInterruptState = {
  value?: any;
  resumable?: boolean;
  when?: string;
  ns?: string[];
};

const ROLE_TO_TYPE: Record<string, string> = {
  user: "human",
  assistant: "ai",
  system: "system",
  tool: "tool",
};

const normalizeMessageType = <TMessage>(message: TMessage): TMessage => {
  const msg = message as Record<string, unknown>;
  if (msg.type) return message;
  const role = msg.role as string | undefined;
  if (role && role in ROLE_TO_TYPE) {
    const { role: _, ...rest } = msg;
    return { ...rest, type: ROLE_TO_TYPE[role] } as TMessage;
  }
  return message;
};

const extractMessagesFromUpdates = <TMessage>(
  data: Record<string, unknown>,
): TMessage[] => {
  // { messages: [...] } shape
  if (Array.isArray(data.messages)) {
    return (data.messages as TMessage[]).map(normalizeMessageType);
  }

  // { nodeName: { messages: [...] } } shape
  const messages: TMessage[] = [];
  for (const value of Object.values(data)) {
    if (value && typeof value === "object" && "messages" in value) {
      const nodeMessages = (value as Record<string, unknown>).messages;
      if (Array.isArray(nodeMessages)) {
        messages.push(
          ...(nodeMessages as TMessage[]).map(normalizeMessageType),
        );
      }
    }
  }
  return messages;
};

const extractNewMessagesFromValues = <TMessage extends { id?: string }>(
  valuesMessages: TMessage[],
  accumulator: LangGraphMessageAccumulator<TMessage>,
): TMessage[] => {
  // tuple 스트림으로 이미 받은 메시지는 values 스냅샷에서 중복 추가하지 않습니다.
  const existing = new Set(
    accumulator
      .getMessages()
      .map((m) => m.id)
      .filter(Boolean),
  );
  return valuesMessages.filter((m) => m.id && !existing.has(m.id));
};

const DEFAULT_APPEND_MESSAGE = <TMessage>(
  _: TMessage | undefined,
  curr: TMessage,
) => curr;

export const useLangGraphMessages = <TMessage extends { id?: string }>({
  stream,
  appendMessage = DEFAULT_APPEND_MESSAGE,
  eventHandlers,
  uiStateKey = DEFAULT_UI_STATE_KEY,
}: {
  stream: LangGraphStreamCallback<TMessage>;
  appendMessage?: (prev: TMessage | undefined, curr: TMessage) => TMessage;
  /**
   * State key under which `typedUi` writes UI messages in the graph state.
   * Must match the `stateKey` option passed to `typedUi(config, { stateKey })`
   * on the server. Defaults to `"ui"`.
   */
  uiStateKey?: string;
  eventHandlers?: {
    onMessageChunk?: OnMessageChunkCallback;
    onValues?: OnValuesEventCallback;
    onUpdates?: OnUpdatesEventCallback;
    onSubgraphValues?: OnSubgraphValuesEventCallback;
    onSubgraphUpdates?: OnSubgraphUpdatesEventCallback;
    onMetadata?: OnMetadataEventCallback;
    onInfo?: OnInfoEventCallback;
    onError?: OnErrorEventCallback;
    onSubgraphError?: OnSubgraphErrorEventCallback;
    onCustomEvent?: OnCustomEventCallback;
  };
}) => {
  // state와 ref를 같이 유지해서 async stream 루프 안에서도 최신 메시지 목록을 읽을 수 있게 합니다.
  const [interrupt, setInterrupt] = useState<
    LangGraphInterruptState | undefined
  >();
  const [messages, _setMessages] = useState<TMessage[]>([]);
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  const setMessagesImmediate = useCallback((msgs: TMessage[]) => {
    messagesRef.current = msgs;
    _setMessages(msgs);
  }, []);

  const [uiMessages, _setUIMessages] = useState<UIMessage[]>([]);
  const uiMessagesRef = useRef(uiMessages);
  uiMessagesRef.current = uiMessages;

  const setUIMessagesImmediate = useCallback((next: UIMessage[]) => {
    uiMessagesRef.current = next;
    _setUIMessages(next);
  }, []);

  const [messageMetadata, setMessageMetadata] = useState<
    Map<string, LangGraphTupleMetadata>
  >(new Map());
  const abortControllerRef = useRef<AbortController | null>(null);

  const {
    onMessageChunk,
    onValues,
    onUpdates,
    onSubgraphValues,
    onSubgraphUpdates,
    onMetadata,
    onInfo,
    onError,
    onSubgraphError,
    onCustomEvent,
  } = useMemo(() => eventHandlers ?? {}, [eventHandlers]);

  const aui = useAui();
  const sendMessage = useCallback(
    async (
      newMessages: TMessage[],
      config: LangGraphSendMessageConfig,
      onComplete?: () => void,
    ) => {
      const abortController = new AbortController();
      abortControllerRef.current = abortController;
      try {
        // 새 메시지에는 id를 보장해야 이후 chunk/metadata 병합 기준으로 사용할 수 있습니다.
        const newMessagesWithId = newMessages.map((m) =>
          m.id ? m : { ...m, id: uuidv4() },
        );

        const accumulator = new LangGraphMessageAccumulator({
          initialMessages: messagesRef.current,
          initialUIMessages: uiMessagesRef.current,
          appendMessage,
        });
        setMessagesImmediate(accumulator.addMessages(newMessagesWithId));

        const response = await stream(newMessagesWithId, {
          ...config,
          abortSignal: abortController.signal,
          initialize: async () => {
            return await aui.threadListItem().initialize();
          },
        });

        let hasTupleMessageEvents = false;
        let lastValuesMessages: TMessage[] | null = null;
        let lastValuesUIMessages: UIMessage[] | null = null;
        // LangGraph streamMode별 이벤트를 한 루프에서 처리합니다.
        // updates/values는 상태 스냅샷, messages는 token 단위 tuple, custom은 Generative UI 이벤트로 봅니다.
        for await (const chunk of response) {
          const { type: eventType, namespace: eventNamespace } = parseEventType(
            chunk.event,
          );
          switch (eventType) {
            case LangGraphKnownEventTypes.MessagesPartial:
            case LangGraphKnownEventTypes.MessagesComplete:
              setMessagesImmediate(accumulator.addMessages(chunk.data));
              break;
            case LangGraphKnownEventTypes.Updates: {
              if (eventNamespace) {
                onSubgraphUpdates?.(eventNamespace, chunk.data);
                break;
              }
              onUpdates?.(chunk.data);
              // updates 이벤트는 node별 partial state일 수 있으므로 messages 필드만 추출해서 upsert합니다.
              const extracted = extractMessagesFromUpdates<TMessage>(
                chunk.data,
              );
              if (extracted.length > 0) {
                setMessagesImmediate(accumulator.addMessages(extracted));
              }
              setInterrupt(chunk.data.__interrupt__?.[0]);
              break;
            }
            case LangGraphKnownEventTypes.Values:
              if (eventNamespace) {
                onSubgraphValues?.(eventNamespace, chunk.data);
                break;
              }
              onValues?.(chunk.data);
              if (Array.isArray(chunk.data?.messages)) {
                // values는 전체 state snapshot입니다. tuple 이벤트가 없으면 authoritative state로 교체합니다.
                lastValuesMessages = chunk.data.messages;
                if (hasTupleMessageEvents) {
                  const newMessages = extractNewMessagesFromValues(
                    chunk.data.messages,
                    accumulator,
                  );
                  if (newMessages.length > 0) {
                    setMessagesImmediate(accumulator.addMessages(newMessages));
                  }
                } else {
                  setMessagesImmediate(
                    accumulator.replaceMessages(chunk.data.messages),
                  );
                }
              }
              if (Array.isArray(chunk.data?.[uiStateKey])) {
                // values는 전체 state snapshot이므로 UI 목록도 통째로 교체합니다.
                const valuesUIMessages = chunk.data[uiStateKey] as UIMessage[];
                lastValuesUIMessages = valuesUIMessages;
                setUIMessagesImmediate(
                  accumulator.replaceUIMessages(valuesUIMessages),
                );
              }
              break;
            case LangGraphKnownEventTypes.Messages: {
              hasTupleMessageEvents = true;
              // messages tuple은 실시간 token/tool-call chunk와 metadata를 가장 세밀하게 전달합니다.
              const [tupleMessage, tupleMetadata] = (
                chunk as LangChainMessageTupleEvent
              ).data;
              const normalizedTupleMessage =
                normalizeLangGraphTupleMessage(tupleMessage);
              if (!normalizedTupleMessage) {
                console.warn(
                  "Received invalid messages tuple format:",
                  tupleMessage,
                );
                break;
              }

              const tupleMetadataWithNamespace:
                | LangGraphTupleMetadata
                | undefined =
                tupleMetadata || eventNamespace
                  ? {
                      ...(tupleMetadata ?? {}),
                      ...(eventNamespace ? { namespace: eventNamespace } : {}),
                    }
                  : undefined;

              if (normalizedTupleMessage.kind === "chunk") {
                onMessageChunk?.(
                  normalizedTupleMessage.message,
                  tupleMetadataWithNamespace ?? {},
                );
              }

              const normalizedMessage =
                normalizedTupleMessage.message as unknown as TMessage;
              const updatedMessages = tupleMetadataWithNamespace
                ? accumulator.addMessageWithMetadata(
                    normalizedMessage,
                    tupleMetadataWithNamespace,
                  )
                : accumulator.addMessages([normalizedMessage]);

              setMessagesImmediate(updatedMessages);
              setMessageMetadata(new Map(accumulator.getMetadataMap()));
              break;
            }
            case LangGraphKnownEventTypes.Metadata:
              onMetadata?.(chunk.data);
              break;
            case LangGraphKnownEventTypes.Info:
              onInfo?.(chunk.data);
              break;
            case LangGraphKnownEventTypes.Error: {
              onError?.(chunk.data);
              // namespaced error는 subgraph에서 온 것이므로 parent graph가 복구할 수 있습니다.
              if (!eventNamespace) {
                const messages = accumulator.getMessages();
                const lastAiMessage = messages.findLast(
                  (m): m is TMessage & { type: string; id: string } =>
                    m != null && "type" in m && m.type === "ai" && m.id != null,
                );
                if (lastAiMessage) {
                  const errorMessage = {
                    ...lastAiMessage,
                    status: {
                      type: "incomplete" as const,
                      reason: "error" as const,
                      error: chunk.data,
                    },
                  };
                  setMessagesImmediate(accumulator.addMessages([errorMessage]));
                }
              } else {
                onSubgraphError?.(eventNamespace, chunk.data);
              }
              break;
            }
            default: {
              // push_ui_message는 custom 채널에서 ui/remove-ui 이벤트를 내보냅니다.
              if (eventType === "custom" && isUIUpdate(chunk.data)) {
                setUIMessagesImmediate(accumulator.applyUIUpdate(chunk.data));
                break;
              }
              if (onCustomEvent) {
                onCustomEvent(eventType, chunk.data);
              } else {
                console.warn(
                  "Unhandled event received:",
                  chunk.event,
                  chunk.data,
                );
              }
              break;
            }
          }
        }

        // 마지막 values snapshot으로 최종 보정합니다. 취소된 run은 중간 상태를 덮어쓰지 않습니다.
        if (lastValuesMessages && !abortController.signal.aborted) {
          setMessagesImmediate(
            hasTupleMessageEvents
              ? accumulator.reconcileMessages(lastValuesMessages)
              : accumulator.replaceMessages(lastValuesMessages),
          );
          setMessageMetadata(new Map(accumulator.getMetadataMap()));
        }
        if (lastValuesUIMessages && !abortController.signal.aborted) {
          setUIMessagesImmediate(
            accumulator.replaceUIMessages(lastValuesUIMessages),
          );
        }
      } catch (error) {
        if (
          !abortController.signal.aborted &&
          !(error instanceof Error && error.name === "AbortError")
        ) {
          throw error;
        }
      } finally {
        if (abortControllerRef.current === abortController) {
          abortControllerRef.current = null;
        }
        onComplete?.();
      }
    },
    [
      aui,
      setMessagesImmediate,
      setUIMessagesImmediate,
      appendMessage,
      stream,
      uiStateKey,
      onMessageChunk,
      onValues,
      onUpdates,
      onSubgraphValues,
      onSubgraphUpdates,
      onMetadata,
      onInfo,
      onError,
      onSubgraphError,
      onCustomEvent,
    ],
  );

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  return {
    interrupt,
    messages,
    messageMetadata,
    uiMessages,
    sendMessage,
    cancel,
    setInterrupt,
    setMessages: setMessagesImmediate,
    setUIMessages: setUIMessagesImmediate,
  };
};
