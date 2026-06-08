import type { Client, StreamMode } from "@langchain/langgraph-sdk";
import type { LangGraphStreamCallback } from "./useLangGraphMessages";
import type { LangChainMessage } from "./types";

// LangGraph SDK의 runs.stream API를 useLangGraphRuntime이 기대하는 stream 콜백 형태로 감싸는 어댑터입니다.
/**
 * Subset of the `@langchain/langgraph-sdk` `Client` required by
 * {@link unstable_createLangGraphStream}.
 */
export type LangGraphStreamClient = {
  runs: Pick<Client["runs"], "stream">;
};

type StreamPayload = NonNullable<
  Parameters<LangGraphStreamClient["runs"]["stream"]>[2]
>;

export type CreateLangGraphStreamOptions = {
  client: LangGraphStreamClient;
  assistantId: string;
  streamMode?: StreamMode | StreamMode[];
  onDisconnect?: StreamPayload["onDisconnect"];
};

/**
 * Build a `stream` callback for `useLangGraphRuntime` from a LangGraph
 * SDK client and assistant id. Forwards `config.abortSignal` as `signal`
 * and defaults `onDisconnect` to `"cancel"`.
 */
export const unstable_createLangGraphStream = ({
  client,
  assistantId,
  streamMode = ["messages", "updates", "custom"],
  onDisconnect = "cancel",
}: CreateLangGraphStreamOptions): LangGraphStreamCallback<LangChainMessage> => {
  return async (messages, config) => {
    // assistant-ui 스레드를 LangGraph thread id(externalId)와 먼저 연결해야 run을 시작할 수 있습니다.
    const { externalId } = await config.initialize();
    if (!externalId) {
      throw new Error("Thread has not been initialized.");
    }

    // 사용자 입력, 취소 신호, resume command, checkpoint fork 정보를 LangGraph SDK payload로 변환합니다.
    const payload = {
      input: messages.length ? { messages } : null,
      streamMode,
      signal: config.abortSignal,
      onDisconnect,
      ...(config.command != null && { command: config.command }),
      ...(config.checkpointId != null && {
        checkpoint: { checkpoint_id: config.checkpointId },
      }),
      ...(config.runConfig !== undefined && { config: config.runConfig }),
    } as StreamPayload;

    return client.runs.stream(externalId, assistantId, payload);
  };
};
