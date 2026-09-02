# Auth Session Cross-tab Effects

sign-out를 BroadcastChannel로 다른 탭에 전파하고, 서버 sign-out 실패는 다음 부팅에서 한 번 재시도하는 패턴이다.

핵심은 `browser tabs share intent, boot effects reconcile server state`다.

## 1. 모듈 코드

- `src/modules/auth/utils/crossTabSignOut.ts`: `BroadcastChannel`을 lazy singleton으로 만들고 sign-out message를 publish/subscribe한다.
- `src/modules/auth/effect-components/SignOutOnOtherTabSignOutEffect.tsx`: 다른 탭의 sign-out message를 받으면 현재 탭 session을 clear한다.
- `src/modules/auth/effect-components/PendingServerSignOutEffect.tsx`: 이전 sign-out이 서버에 도달하지 못한 상태면 client config 로드 후 server sign-out mutation을 재시도한다.
- `src/modules/auth/hooks/useMarkSessionActive.ts`: sign-in flow가 httpOnly cookie session의 존재를 client atom에 기록하고 pending sign-out을 해제한다.
- `src/modules/app/components/SharedAppProviders.tsx`: pending server sign-out retry를 앱 공통 부트스트랩 effect로 배치한다.

```tsx
// 큰 흐름: sign-out를 BroadcastChannel로 다른 탭에 전파하고, 서버 sign-out 실패는 다음 부팅에서 한 번 재시도하는 패턴이다.
// 핵심 기준: `browser tabs share intent, boot effects reconcile server state`다.

// filepath: src/modules/auth/utils/crossTabSignOut.ts
const SIGN_OUT_CHANNEL_NAME = 'twenty-sign-out';

let sharedChannel: BroadcastChannel | null = null;

const getSharedSignOutChannel = (): BroadcastChannel | null => {
  if (sharedChannel) {
    return sharedChannel;
  }

  try {
    sharedChannel = new BroadcastChannel(SIGN_OUT_CHANNEL_NAME);
  } catch {
    return null;
  }

  return sharedChannel;
};

export const broadcastSignOutToOtherTabs = () => {
  getSharedSignOutChannel()?.postMessage({ type: 'sign-out' });
};

export const subscribeToSignOutFromOtherTabs = (
  callback: () => void,
): (() => void) => {
  const channel = getSharedSignOutChannel();

  if (!channel) {
    return () => {};
  }

  channel.onmessage = (event: MessageEvent) => {
    if (event.data?.type === 'sign-out') {
      callback();
    }
  };

  return () => {
    channel.onmessage = null;
  };
};

// filepath: src/modules/auth/effect-components/SignOutOnOtherTabSignOutEffect.tsx
export const SignOutOnOtherTabSignOutEffect = () => {
  const { clearSession } = useAuth();

  useEffect(() => {
    const unsubscribe = subscribeToSignOutFromOtherTabs(() => {
      clearSession();
    });

    return unsubscribe;
  }, [clearSession]);

  return null;
};

// filepath: src/modules/auth/effect-components/PendingServerSignOutEffect.tsx
export const PendingServerSignOutEffect = () => {
  const apolloClient = useApolloClient();
  const store = useStore();
  const { isLoadedOnce } = useAtomStateValue(clientConfigApiStatusState);

  useEffect(() => {
    const retryPendingServerSignOut = async () => {
      if (!isLoadedOnce || !store.get(isPendingServerSignOutState.atom)) {
        return;
      }

      if (store.get(isCookieAuthActiveState.atom)) {
        store.set(isPendingServerSignOutState.atom, false);

        return;
      }

      try {
        await apolloClient.mutate({
          mutation: SignOutDocument,
          context: { skipRetry: true },
        });
        store.set(isPendingServerSignOutState.atom, false);
      } catch {}
    };

    void retryPendingServerSignOut();
  }, [apolloClient, isLoadedOnce, store]);

  return null;
};

// filepath: src/modules/auth/hooks/useMarkSessionActive.ts
export const useMarkSessionActive = () => {
  const store = useStore();

  return useCallback(() => {
    store.set(isCookieAuthActiveState.atom, true);
    store.set(isPendingServerSignOutState.atom, false);
  }, [store]);
};
```

## 2. 사용 예제

```tsx
// 사용 흐름: Auth Session Cross-tab Effects 패턴을 실제 호출부에서 조합한다.

// filepath: src/modules/app/components/SharedAppProviders.tsx
export const SharedAppProviders = ({ children }: React.PropsWithChildren) => {
  return (
    <ApolloProvider>
      <ClientConfigProviderEffect />
      <PendingServerSignOutEffect />
      <ClientConfigProvider>{children}</ClientConfigProvider>
    </ApolloProvider>
  );
};

// filepath: src/modules/app/components/WorkspaceAppProviders.tsx
export const WorkspaceAppProviders = () => {
  return (
    <SharedAppProviders>
      <AuthProvider>
        <Outlet />
        <SignOutOnOtherTabSignOutEffect />
      </AuthProvider>
    </SharedAppProviders>
  );
};
```
