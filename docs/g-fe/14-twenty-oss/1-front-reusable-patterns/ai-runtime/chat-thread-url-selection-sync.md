# Chat Thread URL/Selection Sync

AI chat thread 선택을 Jotai state, per-thread draft, full-page URL, side-panel navigation에 동시에 반영하는 패턴이다.

핵심은 `Thread selection is state first, URL projection second`다.

## 1. 모듈 코드

- `src/modules/ai/hooks/useSelectAiChatThread.ts`: thread state 전환과 URL projection을 하나의 선택 API로 묶는다.
- `src/modules/ai/hooks/useSwitchAgentChatThreadWithDraft.ts`: 현재 thread를 바꾸고 destination draft를 editor input에 복원한다.
- `src/modules/ai/hooks/useProjectAiChatThreadToUrl.ts`: 현재 화면이 full-page AI chat일 때만 selected thread를 URL query로 투영한다.
- `src/modules/ai/hooks/useOpenAskAiThread.ts`: nav drawer에 보이는 thread는 click flow로 열고, 보이지 않는 UUID는 state/URL을 직접 맞춘다.
- `src/modules/ai/hooks/useOpenAiChatPage.ts`: side panel을 닫고 full-page chat으로 이동하며 return location을 history state에 저장한다.
- `src/modules/ai/hooks/useSwitchToNewAiChat.ts`: 새 draft thread key로 전환하고 full-page 또는 side-panel chat을 연다.

```tsx
// filepath: src/modules/ai/hooks/useSelectAiChatThread.ts
export const useSelectAiChatThread = () => {
  const { switchThreadWithDraft } = useSwitchAgentChatThreadWithDraft();
  const { projectAiChatThreadToUrl } = useProjectAiChatThreadToUrl();

  const selectAiChatThread = (toThreadId: string) => {
    switchThreadWithDraft(toThreadId);
    projectAiChatThreadToUrl(toThreadId);
  };

  return { selectAiChatThread };
};

// filepath: src/modules/ai/hooks/useSwitchAgentChatThreadWithDraft.ts
export const useSwitchAgentChatThreadWithDraft = () => {
  const [currentAiChatThread, setCurrentAiChatThread] = useAtomState(
    currentAiChatThreadState,
  );
  const setAgentChatInput = useSetAtomState(agentChatInputState);
  const store = useStore();

  const switchThreadWithDraft = useCallback(
    (toThreadId: string) => {
      const isSameThread = toThreadId === currentAiChatThread;

      setCurrentAiChatThread(toThreadId);

      if (!isSameThread) {
        const destinationDraft =
          store.get(agentChatDraftsByThreadIdState.atom)[toThreadId] ?? '';

        setAgentChatInput(tipTapDocumentToMarkdown(destinationDraft));
      }
    },
    [currentAiChatThread, setCurrentAiChatThread, setAgentChatInput, store],
  );

  return { switchThreadWithDraft };
};

// filepath: src/modules/ai/hooks/useProjectAiChatThreadToUrl.ts
export const useProjectAiChatThreadToUrl = () => {
  const navigateApp = useNavigateApp();

  const projectAiChatThreadToUrl = (threadId: string) => {
    if (!isCurrentPathAiChatPage()) {
      return;
    }

    navigateApp(
      AppPath.AiChat,
      { threadId: isValidUuid(threadId) ? threadId : null },
      undefined,
      { replace: true, state: getCurrentHistoryEntryState() },
    );
  };

  return { projectAiChatThreadToUrl };
};

// filepath: src/modules/ai/hooks/useOpenAskAiThread.ts
export const useOpenAskAiThread = () => {
  const agentChatVisibleThreads = useAtomStateValue(
    agentChatVisibleThreadsSelector,
  );
  const { selectAiChatThread } = useSelectAiChatThread();
  const { handleThreadClick } = useAiChatThreadClick({
    resetNavigationStack: true,
  });
  const { openAskAiPage } = useOpenAskAiPageInSidePanel();

  const openAskAiThread = (threadId: string) => {
    const thread = agentChatVisibleThreads.find(
      (visibleThread) => visibleThread.id === threadId,
    );

    if (isDefined(thread)) {
      handleThreadClick(thread);
      return;
    }

    if (isValidUuid(threadId)) {
      selectAiChatThread(threadId);
    }

    openAskAiPage({ resetNavigationStack: true });
  };

  return { openAskAiThread };
};

// filepath: src/modules/ai/hooks/useOpenAiChatPage.ts
export const useOpenAiChatPage = () => {
  const navigate = useNavigateApp();
  const { closeSidePanelMenu } = useSidePanelMenu();

  const openAiChatPage = ({ threadId }: { threadId?: string | null } = {}) => {
    if (isCurrentPathAiChatPage()) {
      return;
    }

    void closeSidePanelMenu();

    navigate(
      AppPath.AiChat,
      { threadId: isDefined(threadId) && isValidUuid(threadId) ? threadId : null },
      undefined,
      {
        state: {
          returnLocation: `${window.location.pathname}${window.location.search}${window.location.hash}`,
        },
      },
    );
  };

  return { openAiChatPage };
};
```

## 2. 사용 예제

```tsx
// filepath: src/modules/ai/components/NavigationDrawerAiChatContent.tsx
export const NavigationDrawerAiChatContent = () => {
  const currentAiChatThread = useAtomStateValue(currentAiChatThreadState);
  const { handleThreadClick } = useAiChatThreadClick({
    resetNavigationStack: true,
  });
  const { threads } = useChatThreads();

  return (
    <NavigationDrawerAiChatThreadSection
      title={t`Recents`}
      threads={threads}
      currentThreadId={currentAiChatThread}
      onThreadClick={handleThreadClick}
    />
  );
};

// filepath: src/modules/ai/hooks/useSwitchToNewAiChat.ts
export const useSwitchToNewAiChat = ({ shouldOpenInFullPage = false } = {}) => {
  const { selectAiChatThread } = useSelectAiChatThread();
  const { openAskAiPage } = useOpenAskAiPageInSidePanel();
  const { openAiChatPage } = useOpenAiChatPage();

  const switchToNewChat = () => {
    store.set(hasTriggeredCreateForDraftState.atom, false);
    selectAiChatThread(AGENT_CHAT_NEW_THREAD_DRAFT_KEY);

    shouldOpenInFullPage ? openAiChatPage() : openAskAiPage();

    store.set(shouldFocusChatEditorState.atom, true);
  };

  return { switchToNewChat };
};
```
