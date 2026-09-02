# Streaming Parts Diff Sync

Incoming AI stream messages를 message id별 atom에 저장하되, 이전 값과 다른 경우에만 downstream side effect를 실행하는 패턴이다.

핵심은 `Diff the stream snapshot before processing expensive live side effects`다.

## 1. 모듈 코드

- `src/modules/ai/hooks/useUpdateStreamingPartsWithDiff.ts`: incoming message를 기존 atom 값과 비교하고 변경된 message만 저장/처리한다.
- `src/modules/ai/hooks/useProcessStreamingMessageUpdate.ts`: 변경된 streaming message에서 UI tool call과 workspace setup completion만 골라 실행한다.
- `src/modules/ai/states/agentChatMessageComponentFamilyState.ts`: message id 단위로 최신 streaming snapshot을 저장한다.
- `src/modules/ai/states/agentChatUISessionStartTimeState.ts`: 현재 UI session보다 오래된 persisted/live message side effect를 차단한다.

```tsx
// 큰 흐름: Incoming AI stream messages를 message id별 atom에 저장하되, 이전 값과 다른 경우에만 downstream side effect를 실행하는 패턴이다.
// 핵심 기준: `Diff the stream snapshot before processing expensive live side effects`다.

// filepath: src/modules/ai/hooks/useUpdateStreamingPartsWithDiff.ts
export const useUpdateStreamingPartsWithDiff = () => {
  const agentChatMessageFamilyCallbackState =
    useAtomComponentFamilyStateCallbackState(
      agentChatMessageComponentFamilyState,
    );

  const { processStreamingMessageUpdate } = useProcessStreamingMessageUpdate();

  const updateStreamingPartsWithDiff = useCallback(
    (incomingMessages: ExtendedUIMessage[]) => {
      for (const incomingMessage of incomingMessages) {
        const alreadyExistingMessage = jotaiStore.get(
          agentChatMessageFamilyCallbackState(incomingMessage.id),
        );

        const messageContentHasChanged = !isDeeplyEqual(
          alreadyExistingMessage,
          incomingMessage,
        );

        const shouldProcessMessage =
          !isDefined(alreadyExistingMessage) || messageContentHasChanged;

        if (!shouldProcessMessage) {
          continue;
        }

        const clonedMessage = structuredClone(incomingMessage);

        jotaiStore.set(
          agentChatMessageFamilyCallbackState(incomingMessage.id),
          clonedMessage,
        );

        processStreamingMessageUpdate(incomingMessage);
      }
    },
    [agentChatMessageFamilyCallbackState, processStreamingMessageUpdate],
  );

  return { updateStreamingPartsWithDiff };
};

// filepath: src/modules/ai/hooks/useProcessStreamingMessageUpdate.ts
export const useProcessStreamingMessageUpdate = () => {
  const agentChatUISessionStartTime = useAtomStateValue(
    agentChatUISessionStartTimeState,
  );
  const { processUIToolCallMessage } = useProcessUIToolCallMessage();
  const { processWorkspaceSetupCompletion } =
    useProcessWorkspaceSetupCompletion();

  const processStreamingMessageUpdate = (
    streamingMessage: ExtendedUIMessage,
  ) => {
    if (agentChatUISessionStartTime === null) {
      return false;
    }

    const messageCreatedAt = streamingMessage.metadata?.createdAt;

    if (isNonEmptyString(messageCreatedAt)) {
      const messageCreatedAtInstant = Temporal.Instant.from(messageCreatedAt);

      if (
        messageCreatedAtInstant.epochNanoseconds <
        agentChatUISessionStartTime.epochNanoseconds
      ) {
        return false;
      }
    }

    if (isUIToolCallMessage(streamingMessage)) {
      processUIToolCallMessage(streamingMessage);
    }

    if (streamingMessage.parts.some(isSucceededCompleteWorkspaceSetupToolPart)) {
      processWorkspaceSetupCompletion(streamingMessage);
    }
  };

  return { processStreamingMessageUpdate };
};

// filepath: src/modules/ai/states/agentChatMessageComponentFamilyState.ts
export const agentChatMessageComponentFamilyState =
  createComponentFamilyState<ExtendedUIMessage | undefined, string>({
    key: 'ai/agentChatMessageComponentFamilyState',
    defaultValue: undefined,
  });
```

## 2. 사용 예제

```tsx
// 사용 흐름: Streaming Parts Diff Sync 패턴을 실제 호출부에서 조합한다.

// filepath: src/modules/ai/components/AiChatLastMessageWithStreamingState.tsx
export const AiChatLastMessageWithStreamingState = ({ message }) => {
  const { updateStreamingPartsWithDiff } = useUpdateStreamingPartsWithDiff();

  useEffect(() => {
    updateStreamingPartsWithDiff([message]);
  }, [message, updateStreamingPartsWithDiff]);

  return <AiChatMessage message={message} />;
};

// filepath: src/modules/ai/hooks/useAgentChatSubscription.ts
const startReadLoop = async (readable: ReadableStream<UIMessageChunk>) => {
  const messageStream = readUIMessageStream({ stream: readable });

  for await (const message of messageStream) {
    scheduleAtomUpdate(message as ExtendedUIMessage);
  }
};
```
