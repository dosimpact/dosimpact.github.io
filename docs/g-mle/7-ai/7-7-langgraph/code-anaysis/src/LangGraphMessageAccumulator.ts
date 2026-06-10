import { v4 as uuidv4 } from "uuid";
import type {
  LangGraphTupleMetadata,
  RemoveUIMessage,
  UIMessage,
} from "./types";

// LangGraph 스트림은 같은 메시지를 여러 조각/스냅샷으로 반복해서 보낼 수 있습니다.
// 이 누적기는 메시지 id 기준으로 병합하고, Generative UI 상태도 같은 흐름에서 관리합니다.
export type LangGraphStateAccumulatorConfig<TMessage> = {
  initialMessages?: TMessage[];
  initialUIMessages?: UIMessage[];
  appendMessage?: (prev: TMessage | undefined, curr: TMessage) => TMessage;
};

export class LangGraphMessageAccumulator<TMessage extends { id?: string }> {
  private messagesMap = new Map<string, TMessage>();
  private metadataMap = new Map<string, LangGraphTupleMetadata>();
  private uiMessages: UIMessage[] = [];
  private appendMessage: (
    prev: TMessage | undefined,
    curr: TMessage,
  ) => TMessage;

  constructor({
    initialMessages = [],
    initialUIMessages = [],
    appendMessage = ((_: TMessage | undefined, curr: TMessage) => curr) as (
      prev: TMessage | undefined,
      curr: TMessage,
    ) => TMessage,
  }: LangGraphStateAccumulatorConfig<TMessage> = {}) {
    this.appendMessage = appendMessage;
    this.addMessages(initialMessages);
    this.uiMessages = [...initialUIMessages];
  }

  private ensureMessageId(message: TMessage): TMessage {
    return message.id ? message : { ...message, id: uuidv4() };
  }

  public addMessages(newMessages: TMessage[]) {
    if (newMessages.length === 0) return this.getMessages();

    for (const message of newMessages.map(this.ensureMessageId)) {
      const messageId = message.id!; // ensureMessageId guarantees id exists
      const previous = this.messagesMap.get(messageId);
      this.messagesMap.set(messageId, this.appendMessage(previous, message));
    }
    return this.getMessages();
  }

  public addMessageWithMetadata(
    message: TMessage,
    metadata: LangGraphTupleMetadata,
  ) {
    // messages-tuple 이벤트의 metadata는 메시지 id에 묶어서 별도 Map으로 보관합니다.
    const messageWithId = this.ensureMessageId(message);
    const messageId = messageWithId.id!;

    const previous = this.messagesMap.get(messageId);
    this.messagesMap.set(
      messageId,
      this.appendMessage(previous, messageWithId),
    );

    const existingMetadata = this.metadataMap.get(messageId);
    this.metadataMap.set(messageId, { ...existingMetadata, ...metadata });

    return this.getMessages();
  }

  public getMessages(): TMessage[] {
    return [...this.messagesMap.values()];
  }

  public getMetadataMap(): Map<string, LangGraphTupleMetadata> {
    return this.metadataMap;
  }

  public replaceMessages(newMessages: TMessage[]): TMessage[] {
    // values 이벤트처럼 서버가 전체 상태 스냅샷을 보낸 경우에는 기존 메시지 상태를 교체합니다.
    this.messagesMap.clear();
    this.metadataMap.clear();

    for (const message of newMessages.map(this.ensureMessageId)) {
      this.messagesMap.set(message.id!, message);
    }
    return this.getMessages();
  }

  // values 최종 스냅샷으로 보정하되, tuple 이벤트로만 들어온 subgraph 내부 메시지는 보존합니다.
  public reconcileMessages(serverMessages: TMessage[]): TMessage[] {
    for (const message of serverMessages.map(this.ensureMessageId)) {
      this.messagesMap.set(message.id!, message);
    }
    return this.getMessages();
  }

  public applyUIUpdate(
    update:
      | UIMessage
      | RemoveUIMessage
      | readonly (UIMessage | RemoveUIMessage)[],
  ): UIMessage[] {
    // custom 채널의 push_ui_message/remove-ui 이벤트를 현재 UI 메시지 목록에 반영합니다.
    const events = Array.isArray(update)
      ? update
      : [update as UIMessage | RemoveUIMessage];
    let newState = this.uiMessages.slice();
    for (const event of events) {
      if (event.type === "remove-ui") {
        newState = newState.filter((ui) => ui.id !== event.id);
        continue;
      }
      // newState.findIndex (not state): forward semantics avoids upstream batch aliasing
      const index = newState.findIndex((ui) => ui.id === event.id);
      if (index !== -1) {
        const shouldMerge =
          typeof event.metadata === "object" &&
          event.metadata != null &&
          event.metadata.merge === true;
        newState[index] = shouldMerge
          ? { ...event, props: { ...newState[index]!.props, ...event.props } }
          : event;
      } else {
        newState.push(event);
      }
    }
    this.uiMessages = newState;
    return this.getUIMessages();
  }

  public replaceUIMessages(newUIMessages: UIMessage[]): UIMessage[] {
    this.uiMessages = [...newUIMessages];
    return this.getUIMessages();
  }

  public getUIMessages(): UIMessage[] {
    return [...this.uiMessages];
  }

  public clear() {
    this.messagesMap.clear();
    this.metadataMap.clear();
    this.uiMessages = [];
  }
}
