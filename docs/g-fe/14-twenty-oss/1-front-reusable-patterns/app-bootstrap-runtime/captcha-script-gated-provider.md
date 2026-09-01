# Captcha Script Gated Provider

라우트와 client config를 보고 captcha가 필요한 화면에서만 provider가 외부 script, widget, token refresh를 붙이는 패턴이다.

핵심은 `load external runtime only when the current path needs it`다.

## 1. 모듈 코드

- `src/modules/captcha/components/CaptchaProvider.tsx`: 현재 pathname이 captcha 보호 대상이면 invisible widget과 script loader effect를 렌더링한다.
- `src/modules/captcha/components/CaptchaProviderScriptLoaderEffect.tsx`: provider별 script URL을 만들고, script load 이후 token refresh interval을 설정한다.
- `src/modules/captcha/components/RequestFreshCaptchaTokenEffect.tsx`: script가 준비되고 보호 라우트에 들어오면 즉시 새 captcha token을 요청한다.
- `src/modules/captcha/hooks/useRequestFreshCaptchaToken.ts`: provider별 browser API로 token을 발급받아 atom state에 저장한다.
- `src/modules/client-config/hooks/useCaptcha.ts`: client config, site key, token state를 합쳐 captcha readiness를 계산한다.

```tsx
// filepath: src/modules/captcha/components/CaptchaProvider.tsx
export const CaptchaProvider = React.memo(
  ({ children }: React.PropsWithChildren) => {
    const location = useLocation();

    const isCaptchaRequired = useMemo(
      () => isCaptchaRequiredForPath(location.pathname),
      [location.pathname],
    );

    return (
      <>
        {isCaptchaRequired && (
          <>
            <div id="captcha-widget" data-size="invisible"></div>
            <CaptchaProviderScriptLoaderEffect />
          </>
        )}
        {children}
      </>
    );
  },
);

// filepath: src/modules/captcha/components/CaptchaProviderScriptLoaderEffect.tsx
export const CaptchaProviderScriptLoaderEffect = () => {
  const captcha = useAtomStateValue(captchaState);
  const setIsCaptchaScriptLoaded = useSetAtomState(isCaptchaScriptLoadedState);
  const { isCaptchaScriptLoaded, isCaptchaConfigured } = useCaptcha();
  const { requestFreshCaptchaToken } = useRequestFreshCaptchaToken();
  const location = useLocation();

  useEffect(() => {
    if (
      !captcha?.provider ||
      !captcha.siteKey ||
      !isCaptchaRequiredForPath(location.pathname)
    ) {
      return;
    }

    const scriptUrl = getCaptchaUrlByProvider(
      captcha.provider,
      captcha.siteKey,
    );
    if (!scriptUrl) {
      return;
    }

    let scriptElement: HTMLScriptElement | null = document.querySelector(
      `script[src="${scriptUrl}"]`,
    );

    if (!scriptElement) {
      scriptElement = document.createElement('script');
      scriptElement.src = scriptUrl;
      scriptElement.onload = () => {
        if (captcha.provider === CaptchaDriverType.GOOGLE_RECAPTCHA) {
          window.grecaptcha?.ready(() => setIsCaptchaScriptLoaded(true));
        } else {
          setIsCaptchaScriptLoaded(true);
        }
      };
      document.body.appendChild(scriptElement);
    }
  }, [
    captcha?.provider,
    captcha?.siteKey,
    setIsCaptchaScriptLoaded,
    location.pathname,
  ]);

  useEffect(() => {
    if (!isCaptchaConfigured || !isCaptchaScriptLoaded) {
      return;
    }

    assertIsDefinedOrThrow(captcha);

    let refreshInterval: NodeJS.Timeout;

    switch (captcha.provider) {
      case CaptchaDriverType.GOOGLE_RECAPTCHA:
        refreshInterval = setInterval(requestFreshCaptchaToken, 110 * 1000);
        break;
      case CaptchaDriverType.TURNSTILE:
        refreshInterval = setInterval(requestFreshCaptchaToken, 480 * 1000);
        break;
      default:
        return;
    }

    return () => clearInterval(refreshInterval);
  }, [
    captcha,
    captcha?.provider,
    isCaptchaConfigured,
    isCaptchaScriptLoaded,
    requestFreshCaptchaToken,
  ]);

  return <></>;
};

// filepath: src/modules/captcha/components/RequestFreshCaptchaTokenEffect.tsx
export const RequestFreshCaptchaTokenEffect = () => {
  const location = useLocation();
  const { requestFreshCaptchaToken } = useRequestFreshCaptchaToken();
  const isCaptchaScriptLoaded = useAtomStateValue(isCaptchaScriptLoadedState);

  useEffect(() => {
    if (isCaptchaScriptLoaded && isCaptchaRequiredForPath(location.pathname)) {
      requestFreshCaptchaToken();
    }
  }, [isCaptchaScriptLoaded, location.pathname, requestFreshCaptchaToken]);

  return null;
};

// filepath: src/modules/captcha/hooks/useRequestFreshCaptchaToken.ts
export const useRequestFreshCaptchaToken = () => {
  const store = useStore();
  const setCaptchaToken = useSetAtomState(captchaTokenState);
  const setIsRequestingCaptchaToken = useSetAtomState(
    isRequestingCaptchaTokenState,
  );

  const requestFreshCaptchaToken = useCallback(async () => {
    if (!isCaptchaRequiredForPath(window.location.pathname)) {
      return;
    }

    const captcha = store.get(captchaState.atom);

    if (!isDefined(captcha)) {
      return;
    }

    assertIsDefinedOrThrow(captcha);
    setIsRequestingCaptchaToken(true);

    switch (captcha.provider) {
      case CaptchaDriverType.GOOGLE_RECAPTCHA:
        window.grecaptcha
          .execute(captcha.siteKey, { action: 'submit' })
          .then((token: string) => {
            setCaptchaToken(token);
            setIsRequestingCaptchaToken(false);
          });
        break;
      case CaptchaDriverType.TURNSTILE: {
        const captchaWidget = window.turnstile.render('#captcha-widget', {
          sitekey: captcha.siteKey,
        });
        window.turnstile.execute(captchaWidget, {
          callback: (token: string) => {
            setCaptchaToken(token);
            setIsRequestingCaptchaToken(false);
          },
        });
      }
    }
  }, [setCaptchaToken, setIsRequestingCaptchaToken, store]);

  return { requestFreshCaptchaToken };
};

// filepath: src/modules/client-config/hooks/useCaptcha.ts
export const useCaptcha = () => {
  const captcha = useAtomStateValue(captchaState);
  const captchaToken = useAtomStateValue(captchaTokenState);
  const clientConfigApiStatus = useAtomStateValue(clientConfigApiStatusState);
  const isCaptchaScriptLoaded = useAtomStateValue(isCaptchaScriptLoadedState);

  const isClientConfigLoaded = clientConfigApiStatus.isLoadedOnce;
  const isSiteKeyDefined = isDefined(captcha?.siteKey);
  const isTokenAvailable = isDefined(captchaToken);
  const isCaptchaReady =
    isClientConfigLoaded && (!isSiteKeyDefined || isTokenAvailable);

  return {
    isCaptchaScriptLoaded,
    isCaptchaConfigured: !isUndefinedOrNull(captcha),
    isCaptchaReady,
  };
};
```

## 2. 사용 예제

```tsx
// filepath: src/modules/app/components/WorkspaceAppProviders.tsx
export const WorkspaceAppProviders = () => {
  return (
    <SharedAppProviders>
      <CaptchaProvider>
        <UserContextProvider>
          <AuthProvider>
            <Outlet />
          </AuthProvider>
        </UserContextProvider>
        <RequestFreshCaptchaTokenEffect />
      </CaptchaProvider>
    </SharedAppProviders>
  );
};
```
