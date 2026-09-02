# Front Component Runtime Bridge

database-backed front component를 fetch하고, signed runtime URLs, application tokens, host communication API를 외부 renderer에 주입하는 패턴이다.

핵심은 `host owns permissions and side effects, embedded runtime receives a narrow API`다.

## 1. 모듈 코드

- `src/modules/front-components/components/FrontComponentRenderer.tsx`: front component metadata, token pair, SDK client checksums, URLs를 준비한 뒤 shared renderer를 호출한다.
- `src/modules/front-components/components/FrontComponentRendererProvider.tsx`: front component instance id와 input focus bridge를 React context로 제공한다.
- `src/modules/front-components/components/FrontComponentApplicationTokenPairEffect.tsx`: renderer가 받은 application token pair를 instance-scoped atom에 저장한다.
- `src/modules/front-components/hooks/useRequestApplicationTokenRefresh.ts`: embedded runtime의 token refresh 요청을 renew mutation과 network refetch fallback으로 처리한다.
- `src/modules/front-components/hooks/useFrontComponentExecutionContext.ts`: navigation, side panel, snackbar, upload, clipboard, storage 같은 host capabilities를 renderer API로 변환한다.

```tsx
// 큰 흐름: database-backed front component를 fetch하고, signed runtime URLs, application tokens, host communication API를 외부 renderer에 주입하는 패턴이다.
// 핵심 기준: `host owns permissions and side effects, embedded runtime receives a narrow API`다.

// filepath: src/modules/front-components/components/FrontComponentRenderer.tsx
export const FrontComponentRenderer = ({
  frontComponentId,
  commandMenuItemId,
  selectedRecordIds,
  timelineActivityId,
  loadingFallback,
  unavailableFallback,
}: FrontComponentRendererProps) => {
  const { data, loading, error } = useQuery(FindOneFrontComponentDocument, {
    variables: { id: frontComponentId },
  });

  useOnFrontComponentUpdated({ frontComponentId });

  const frontComponent = data?.frontComponent;

  return (
    <>
      <FrontComponentLoadErrorSnackBarEffect errorMessage={error?.message} />
      {loading && loadingFallback}
      {!loading &&
        (!isDefined(frontComponent) || isDefined(error)) &&
        unavailableFallback}
      {!loading && isDefined(frontComponent) && !isDefined(error) && (
        <FrontComponentRendererContent
          frontComponent={frontComponent}
          commandMenuItemId={commandMenuItemId}
          selectedRecordIds={selectedRecordIds}
          timelineActivityId={timelineActivityId}
          loadingFallback={loadingFallback}
        />
      )}
    </>
  );
};

const FrontComponentRendererContent = ({
  frontComponent,
  commandMenuItemId,
  selectedRecordIds,
  timelineActivityId,
  loadingFallback,
}: FrontComponentRendererContentProps) => {
  const { colorScheme } = useContext(ThemeContext);
  const { functionsBaseUrl } = useGetLogicFunctionHttpUrl();
  const { id: frontComponentId, applicationId, usesSdkClient } = frontComponent;

  const {
    executionContext,
    frontComponentHostCommunicationApi,
    storageNamespace,
  } = useFrontComponentExecutionContext({
    frontComponentId,
    applicationId,
    commandMenuItemId,
    selectedRecordIds,
    timelineActivityId,
    colorScheme,
  });

  const applicationTokenPair = frontComponent.applicationTokenPair ?? null;
  const { data: sdkClientChecksumsData, loading: sdkClientChecksumsLoading } =
    useQuery(GetApplicationSdkClientChecksumsDocument, {
      variables: { applicationId },
      skip: !usesSdkClient,
    });

  const sdkClientUrls = useMemo(
    () =>
      getSdkClientUrls(
        applicationId,
        sdkClientChecksumsData?.applicationSdkClientChecksums,
      ),
    [applicationId, sdkClientChecksumsData?.applicationSdkClientChecksums],
  );

  const componentUrl = getFingerprintedRestUrl({
    resource: 'front-components',
    id: frontComponentId,
    checksum: frontComponent.builtComponentChecksum,
  });

  const isReadyToRender =
    isDefined(applicationTokenPair) &&
    (!usesSdkClient || !sdkClientChecksumsLoading);

  return (
    <>
      <FrontComponentApplicationTokenPairEffect
        frontComponentId={frontComponentId}
        applicationTokenPair={applicationTokenPair}
      />
      {!isReadyToRender && loadingFallback}
      {isReadyToRender && (
        <FrontComponentRendererProvider frontComponentId={frontComponentId}>
          <SharedFrontComponentRenderer
            colorScheme={colorScheme}
            componentUrl={componentUrl}
            applicationAccessToken={
              applicationTokenPair.applicationAccessToken.token
            }
            apiUrl={REACT_APP_SERVER_BASE_URL}
            functionsBaseUrl={functionsBaseUrl}
            sdkClientUrls={sdkClientUrls}
            executionContext={executionContext}
            frontComponentHostCommunicationApi={
              frontComponentHostCommunicationApi
            }
            storageNamespace={storageNamespace}
            loadingFallback={loadingFallback}
          />
        </FrontComponentRendererProvider>
      )}
    </>
  );
};

// filepath: src/modules/front-components/components/FrontComponentRendererProvider.tsx
export const FrontComponentRendererProvider = ({
  frontComponentId,
  children,
}: FrontComponentRendererProviderProps) => {
  const focusId = `front-component-input-focus-${frontComponentId}`;
  const { pushFocusItemToFocusStack } = usePushFocusItemToFocusStack();
  const { removeFocusItemFromFocusStackById } =
    useRemoveFocusItemFromFocusStackById();

  const setEditableFocused = useCallback(
    (focused: boolean) => {
      if (focused) {
        pushFocusItemToFocusStack({
          focusId,
          component: {
            type: FocusComponentType.TEXT_INPUT,
            instanceId: focusId,
          },
          globalHotkeysConfig: {
            enableGlobalHotkeysConflictingWithKeyboard: false,
          },
        });
      } else {
        removeFocusItemFromFocusStackById({ focusId });
      }
    },
    [focusId, pushFocusItemToFocusStack, removeFocusItemFromFocusStackById],
  );

  return (
    <FrontComponentInstanceContext.Provider
      value={{ instanceId: frontComponentId }}
    >
      <FrontComponentInputFocusContext.Provider value={setEditableFocused}>
        <FrontComponentInputFocusCleanupEffect focusId={focusId} />
        {children}
      </FrontComponentInputFocusContext.Provider>
    </FrontComponentInstanceContext.Provider>
  );
};

// filepath: src/modules/front-components/components/FrontComponentApplicationTokenPairEffect.tsx
export const FrontComponentApplicationTokenPairEffect = ({
  frontComponentId,
  applicationTokenPair,
}: FrontComponentApplicationTokenPairEffectProps) => {
  const setFrontComponentApplicationTokenPair = useSetAtomComponentState(
    frontComponentApplicationTokenPairComponentState,
    frontComponentId,
  );

  useEffect(() => {
    setFrontComponentApplicationTokenPair(applicationTokenPair);
  }, [applicationTokenPair, setFrontComponentApplicationTokenPair]);

  return null;
};

// filepath: src/modules/front-components/hooks/useRequestApplicationTokenRefresh.ts
export const useRequestApplicationTokenRefresh = ({
  frontComponentId,
}: UseRequestApplicationTokenRefreshArgs) => {
  const apolloClient = useApolloClient();
  const store = useStore();
  const applicationTokenPairAtom = useAtomComponentStateCallbackState(
    frontComponentApplicationTokenPairComponentState,
    frontComponentId,
  );

  const requestAccessTokenRefresh = useCallback(async (): Promise<string> => {
    const refetchFrontComponentForNewTokenPair = async (): Promise<string> => {
      const result = await apolloClient.query({
        query: FindOneFrontComponentDocument,
        variables: { id: frontComponentId },
        fetchPolicy: 'network-only',
      });

      const newTokenPair = result.data?.frontComponent?.applicationTokenPair;

      if (!isDefined(newTokenPair)) {
        throw new Error('Failed to refetch application token pair');
      }

      store.set(applicationTokenPairAtom, newTokenPair);

      return newTokenPair.applicationAccessToken.token;
    };

    const applicationTokenPair = store.get(applicationTokenPairAtom);

    if (!isDefined(applicationTokenPair)) {
      throw new Error('Application token pair must be initialized');
    }

    try {
      const renewResult = await apolloClient.mutate({
        mutation: RenewApplicationTokenDocument,
        variables: {
          applicationRefreshToken:
            applicationTokenPair.applicationRefreshToken.token,
        },
      });

      const renewedTokenPair = renewResult.data?.renewApplicationToken;

      if (!isDefined(renewedTokenPair)) {
        throw new Error('Failed to renew application token');
      }

      store.set(applicationTokenPairAtom, renewedTokenPair);

      return renewedTokenPair.applicationAccessToken.token;
    } catch (error) {
      if (
        CombinedGraphQLErrors.is(error) &&
        hasApplicationRefreshTokenInvalidOrExpiredSubCode(error.errors)
      ) {
        return await refetchFrontComponentForNewTokenPair();
      }

      throw error;
    }
  }, [apolloClient, applicationTokenPairAtom, frontComponentId, store]);

  return { requestAccessTokenRefresh };
};

// filepath: src/modules/front-components/hooks/useFrontComponentExecutionContext.ts
export const useFrontComponentExecutionContext = ({
  frontComponentId,
  applicationId,
  commandMenuItemId,
  selectedRecordIds,
  timelineActivityId,
  colorScheme,
}: {
  frontComponentId: string;
  applicationId: string;
  commandMenuItemId?: string;
  selectedRecordIds?: string[];
  timelineActivityId?: string;
  colorScheme: 'light' | 'dark';
}) => {
  const currentUser = useAtomStateValue(currentUserState);
  const navigateApp = useNavigateApp();
  const { requestAccessTokenRefresh } = useRequestApplicationTokenRefresh({
    frontComponentId,
  });
  const { enqueueSuccessSnackBar, enqueueErrorSnackBar } = useSnackBar();
  const { uploadFile: uploadFileToFilesField } = useDirectFileUpload();

  const executionContext: FrontComponentExecutionContext = {
    frontComponentId,
    userId: currentUser?.id ?? null,
    recordId: selectedRecordIds?.length === 1 ? selectedRecordIds[0] : null,
    selectedRecordIds: selectedRecordIds ?? [],
    timelineActivityId: timelineActivityId ?? null,
    colorScheme,
    locale: i18n.locale as AppLocale,
  };

  const navigate: FrontComponentHostCommunicationApi['navigate'] = async (
    to,
    params,
    queryParams,
    options,
  ) => {
    navigateApp(
      to as AppPath,
      params as Parameters<typeof navigateApp>[1],
      queryParams,
      options,
    );
  };

  const enqueueSnackbar: FrontComponentHostCommunicationApi['enqueueSnackbar'] =
    async ({ message, variant, duration, detailedMessage, dedupeKey }) => {
      const snackBarOptions = { duration, detailedMessage, dedupeKey };

      switch (variant) {
        case 'error':
          enqueueErrorSnackBar({ message, options: snackBarOptions });
          break;
        case 'success':
          enqueueSuccessSnackBar({ message, options: snackBarOptions });
          break;
        default:
          assertUnreachable(variant);
      }
    };

  const uploadFile: FrontComponentHostCommunicationApi['uploadFile'] = async (
    file,
    params,
  ) => {
    if (!(file instanceof Blob) || !isDefined(params?.fieldMetadataId)) {
      return { status: 'failed', reason: 'invalid-params' };
    }

    const uploadedFile = await uploadFileToFilesField(
      new File([file], params.fileName ?? 'upload', { type: file.type }),
      {
        fileFolder: FileFolder.FilesField,
        fieldMetadataId: params.fieldMetadataId,
      },
    );

    return {
      status: 'uploaded',
      file: {
        fileId: uploadedFile.id,
        path: uploadedFile.path,
        url: uploadedFile.url,
        size: uploadedFile.size,
        mimeType: file.type.split(';')[0],
      },
    };
  };

  const storageNamespace = isDefined(currentUser?.id)
    ? buildFrontComponentStorageNamespace({
        applicationId,
        userId: currentUser.id,
      })
    : undefined;

  const frontComponentHostCommunicationApi: FrontComponentHostCommunicationApi =
    {
      navigate,
      requestAccessTokenRefresh,
      enqueueSnackbar,
      uploadFile,
      openSidePanelPage,
      openCommandConfirmationModal,
      unmountFrontComponent,
      closeSidePanel,
      updateProgress,
      copyToClipboard,
      storageSet,
      storageDelete,
      storageClear,
    };

  return {
    executionContext,
    frontComponentHostCommunicationApi,
    storageNamespace,
  };
};
```

## 2. 사용 예제

```tsx
// 사용 흐름: Front Component Runtime Bridge 패턴을 실제 호출부에서 조합한다.

// filepath: src/modules/page-layout/widgets/front-component/components/FrontComponentWidgetRenderer.tsx
const FrontComponentRenderer = lazy(() =>
  import('@/front-components/components/FrontComponentRenderer').then(
    (module) => ({ default: module.FrontComponentRenderer }),
  ),
);

export const FrontComponentWidgetRenderer = ({ widget }) => {
  return (
    <Suspense fallback={<FrontComponentSkeletonLoader />}>
      <FrontComponentRenderer
        frontComponentId={widget.configuration.frontComponentId}
        selectedRecordIds={widget.recordId ? [widget.recordId] : []}
        loadingFallback={<FrontComponentSkeletonLoader />}
        unavailableFallback={null}
      />
    </Suspense>
  );
};

// filepath: src/modules/command-menu-item/engine-command/components/HeadlessFrontComponentRendererEngineCommand.tsx
export const HeadlessFrontComponentRendererEngineCommand = () => {
  return (
    <FrontComponentRenderer
      frontComponentId={frontComponentId}
      commandMenuItemId={commandMenuItemId}
      selectedRecordIds={selectedRecordIds}
      loadingFallback={null}
      unavailableFallback={null}
    />
  );
};
```
