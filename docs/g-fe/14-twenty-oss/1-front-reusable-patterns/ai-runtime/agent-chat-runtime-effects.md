# Agent Chat Runtime Effects

AI chat 화면이 실제로 열린 뒤에만 fetch, stream subscription, preprompt, keepalive, session clock 같은 renderless effects를 붙이는 패턴이다.

핵심은 `UI renders the chat surface, runtime effects own the side effects`다.

## 1. 모듈 코드

- `src/modules/ai/components/AgentChatRuntimeEffects.tsx`: chat을 한 번이라도 연 뒤에만 runtime effect 묶음을 렌더링한다.
- `src/modules/ai/components/AgentChatStreamSubscriptionEffect.tsx`: thread 생성 이벤트, send/stop 이벤트, SSE subscription, fetched/live message merge를 연결한다.
- `src/modules/ai/components/AgentChatMessagesFetchEffect.tsx`: persisted messages를 fetch하고 refetch/reconnect event를 query refetch로 연결한다.
- `src/modules/ai/components/AgentChatStreamKeepAliveEffect.tsx`: stream liveness를 감시하고 silent connection을 resubscribe/refetch로 복구한다.
- `src/modules/ai/components/AgentChatPrepromptEffect.tsx`: staged preprompt를 editor restore event 또는 send event로 변환한다.
- `src/modules/ai/components/AgentChatSessionStartTimeEffect.tsx`: UI session 시작 시각을 한 번 기록해 이전 stream side effect를 무시할 기준을 만든다.

```tsx
// filepath: src/modules/ai/components/AgentChatRuntimeEffects.tsx
export const AgentChatRuntimeEffects = () => {
  const hasAgentChatBeenOpened = useAtomStateValue(hasAgentChatBeenOpenedState);

  if (!hasAgentChatBeenOpened) {
    return null;
  }

  return (
    <>
      <AgentChatMessagesFetchEffect />
      <AgentChatStreamSubscriptionEffect />
      <AgentChatPrepromptEffect />
      <AgentChatStreamKeepAliveEffect />
      <AgentChatSessionStartTimeEffect />
    </>
  );
};

// filepath: src/modules/ai/components/AgentChatStreamSubscriptionEffect.tsx
export const AgentChatStreamSubscriptionEffect = () => {
  const currentAiChatThread = useAtomStateValue(currentAiChatThreadState);
  const { createChatThread } = useCreateAgentChatThread();
  const { ensureThreadExistsForDraft } =
    useEnsureAgentChatThreadExistsForDraft(createChatThread);
  const { ensureThreadIdForSend } =
    useEnsureAgentChatThreadIdForSend(createChatThread);

  useListenToBrowserEvent({
    eventName: AGENT_CHAT_ENSURE_THREAD_FOR_DRAFT_EVENT_NAME,
    onBrowserEvent: ensureThreadExistsForDraft,
  });

  useAgentChat(ensureThreadIdForSend);

  const subscriptionThreadId =
    currentAiChatThread !== null && isValidUuid(currentAiChatThread)
      ? currentAiChatThread
      : null;

  useAgentChatSubscription(subscriptionThreadId);

  useEffect(() => {
    if (agentChatIsStreaming) {
      return;
    }

    const isThreadSwitch = currentAiChatThread !== agentChatDisplayedThread;

    if (
      !isThreadSwitch &&
      (agentChatIsAwaitingPersistedRefetch || agentChatIsAwaitingFirstChunk)
    ) {
      return;
    }

    setAgentChatMessages(agentChatFetchedMessages);

    if (isThreadSwitch) {
      if (agentChatFetchedMessages.length > 0) {
        setAgentChatIsInitialScrollPendingOnThreadChange(true);
      }
      setAgentChatDisplayedThread(currentAiChatThread);
    }
  }, [agentChatFetchedMessages, agentChatIsStreaming, currentAiChatThread]);

  return null;
};

// filepath: src/modules/ai/components/AgentChatMessagesFetchEffect.tsx
export const AgentChatMessagesFetchEffect = () => {
  const currentAiChatThread = useAtomStateValue(currentAiChatThreadState);

  const handleDataLoaded = useCallback((data: GetChatMessagesQuery) => {
    const uiMessages = mapDBMessagesToUIMessages(data.chatMessages ?? []);

    setAgentChatFetchedMessages(
      uiMessages.filter((message) => message.status !== 'queued'),
    );
    setAgentChatQueuedMessages(
      uiMessages.filter((message) => message.status === 'queued'),
    );
    setAgentChatIsAwaitingPersistedRefetch(false);

    for (const [index, chunk] of catchup.chunks.entries()) {
      handleEvent({
        type: 'stream-chunk',
        chunk,
        seq: index + 1,
      } as AgentChatSubscriptionEvent);
    }
  }, []);

  const { refetch } = useQueryWithCallbacks(GetChatMessagesDocument, {
    variables: { threadId: currentAiChatThread ?? '' },
    skip: !isDefined(currentAiChatThread) || isNewThread,
    onDataLoaded: handleDataLoaded,
    onLoadingChange: setAgentChatMessagesLoading,
  });

  useListenToBrowserEvent({
    eventName: AGENT_CHAT_REFETCH_MESSAGES_EVENT_NAME,
    onBrowserEvent: () => !isNewThread && refetch(),
  });

  useListenToBrowserEvent({
    eventName: SSE_CLIENT_RECONNECTED_EVENT_NAME,
    onBrowserEvent: () => !isNewThread && refetch(),
  });

  return null;
};

// filepath: src/modules/ai/components/AgentChatStreamKeepAliveEffect.tsx
export const AgentChatStreamKeepAliveEffect = () => {
  const recoverStreamIfStalled = useCallback(() => {
    if (!isStreaming && !isAwaitingFirstChunk) {
      store.set(agentChatStreamRecoveryAttemptsState.atom, 0);
      return;
    }

    if (recoveryAttempts >= MAX_SILENT_RECOVERY_ATTEMPTS) {
      store.set(errorAtom, createAiChatCodedError(message, 'CONNECTION_LOST'));
      store.set(isStreamingAtom, false);
      store.set(isAwaitingFirstChunkAtom, false);
      return;
    }

    store.set(agentChatStreamRecoveryAttemptsState.atom, (attempts) => attempts + 1);
    store.set(agentChatStreamResubscribeNonceState.atom, (nonce) => nonce + 1);
    dispatchBrowserEvent(AGENT_CHAT_REFETCH_MESSAGES_EVENT_NAME);
  }, [currentAiChatThread]);

  useEffect(() => {
    if (!hasActiveSubscription) {
      return;
    }

    const interval = setInterval(() => {
      const timeSinceLastEventInMs =
        Date.now() - store.get(agentChatStreamLastEventTimestampState.atom);

      if (timeSinceLastEventInMs > AGENT_CHAT_STREAM_LIVENESS_TIMEOUT_IN_MS) {
        recoverStreamIfStalled();
      }
    }, AGENT_CHAT_STREAM_LIVENESS_CHECK_INTERVAL_IN_MS);

    return () => clearInterval(interval);
  }, [hasActiveSubscription, recoverStreamIfStalled]);

  return null;
};
```

## 2. 사용 예제

```tsx
// filepath: src/modules/app/components/App.tsx
export const App = () => {
  return (
    <>
      <AppRouter />
      <AgentChatRuntimeEffects />
    </>
  );
};

// filepath: src/modules/ai/hooks/useAiChatEditor.ts
export const useAiChatEditor = () => {
  const handleSendAndClear = () => {
    dispatchAgentChatSendMessageEvent();
  };

  const handleEditorChange = () => {
    dispatchAgentChatEnsureThreadForDraftEvent();
  };

  return { editor, handleSendAndClear };
};
```
