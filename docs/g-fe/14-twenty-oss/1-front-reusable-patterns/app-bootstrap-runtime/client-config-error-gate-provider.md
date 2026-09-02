# Client Config Error Gate Provider

앱 부팅에 필요한 client config fetch를 renderless effect가 시작하고, provider가 실패 상태만 full-screen fallback으로 차단하는 패턴이다.

핵심은 `bootstrap effect fetches, gate provider decides whether children render`다.

## 1. 모듈 코드

- `src/modules/client-config/states/clientConfigApiStatusState.ts`: client config 요청의 loading, loaded, error 상태를 전역 atom으로 보관한다.
- `src/modules/client-config/components/ClientConfigProviderEffect.tsx`: 최초 1회 client config fetch를 시작하고 error를 status atom에 반영한다.
- `src/modules/client-config/components/ClientConfigProvider.tsx`: status atom이 error면 full-screen error fallback을 렌더링하고, 아니면 children을 통과시킨다.
- `src/modules/app/components/SharedAppProviders.tsx`: Apollo와 theme 준비 후 config effect와 gate provider를 앱 공통 부트스트랩 계층에 배치한다.

```tsx
// 큰 흐름: 앱 부팅에 필요한 client config fetch를 renderless effect가 시작하고, provider가 실패 상태만 full-screen fallback으로 차단하는 패턴이다.
// 핵심 기준: `bootstrap effect fetches, gate provider decides whether children render`다.

// filepath: src/modules/client-config/states/clientConfigApiStatusState.ts
type ClientConfigApiStatus = {
  isLoadedOnce: boolean;
  isLoading: boolean;
  isErrored: boolean;
  isSaved: boolean;
  error?: Error;
  data?: { clientConfig: ClientConfig };
};

export const clientConfigApiStatusState =
  createAtomState<ClientConfigApiStatus>({
    key: 'clientConfigApiStatus',
    defaultValue: {
      isLoadedOnce: false,
      isLoading: false,
      isErrored: false,
      isSaved: false,
      error: undefined,
      data: undefined,
    },
  });

// filepath: src/modules/client-config/components/ClientConfigProviderEffect.tsx
export const ClientConfigProviderEffect = () => {
  const [clientConfigApiStatus, setClientConfigApiStatus] = useAtomState(
    clientConfigApiStatusState,
  );

  const { data, loading, error, fetchClientConfig } = useClientConfig();

  useEffect(() => {
    if (
      !clientConfigApiStatus.isLoadedOnce &&
      !clientConfigApiStatus.isLoading
    ) {
      fetchClientConfig();
    }
  }, [
    clientConfigApiStatus.isLoadedOnce,
    clientConfigApiStatus.isLoading,
    fetchClientConfig,
  ]);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (error instanceof Error) {
      setClientConfigApiStatus((currentStatus) => ({
        ...currentStatus,
        isErrored: true,
        error,
      }));
      return;
    }

    if (!isDefined(data?.clientConfig)) {
      return;
    }
  }, [data?.clientConfig, error, loading, setClientConfigApiStatus]);

  return <></>;
};

// filepath: src/modules/client-config/components/ClientConfigProvider.tsx
export const ClientConfigProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { isErrored, error } = useAtomStateValue(clientConfigApiStatusState);
  const { t } = useLingui();

  return isErrored && error instanceof Error ? (
    <AppFullScreenErrorFallback
      error={error}
      resetErrorBoundary={() => {
        window.location.reload();
      }}
      title={t`Unable to Reach Back-end`}
    />
  ) : (
    children
  );
};

// filepath: src/modules/app/components/SharedAppProviders.tsx
export const SharedAppProviders = ({ children }: PropsWithChildren) => {
  return (
    <ApolloProvider>
      <BaseThemeProvider>
        <ClientConfigProviderEffect />
        <PendingServerSignOutEffect />
        <ClientConfigProvider>{children}</ClientConfigProvider>
      </BaseThemeProvider>
    </ApolloProvider>
  );
};
```

## 2. 사용 예제

```tsx
// 사용 흐름: Client Config Error Gate Provider 패턴을 실제 호출부에서 조합한다.

// filepath: src/modules/app/components/RootAppProviders.tsx
export const RootAppProviders = () => {
  return (
    <SharedAppProviders>
      <CaptchaProvider>
        <AuthProvider>
          <Outlet />
        </AuthProvider>
      </CaptchaProvider>
    </SharedAppProviders>
  );
};
```
