# Metadata Store Bootstrap Refresh

persisted metadata store를 먼저 읽고, 서버 collection hash와 비교해 stale entity만 다시 가져온 뒤 ready gate를 여는 패턴이다.

핵심은 `version bump triggers minimal hash check, stale keys fetch full data`다.

## 1. 모듈 코드

- `src/modules/metadata-store/states/metadataStoreState.ts`: metadata entity key별 current/draft/status/hash를 localStorage-backed atom family로 저장한다.
- `src/modules/metadata-store/hooks/useResyncMetadataStore.ts`: metadata load version을 증가시켜 refresh effect를 다시 실행시킨다.
- `src/modules/metadata-store/effect-components/MinimalMetadataLoadEffect.tsx`: 로그인/워크스페이스/버전 조건을 보고 minimal metadata load를 시작한다.
- `src/modules/metadata-store/hooks/useLoadMinimalMetadata.ts`: 서버 collection hash와 local hash를 비교해 stale entity key를 계산한다.
- `src/modules/metadata-store/hooks/useLoadStaleMetadataEntities.ts`: stale key group별 full query를 실행하고 draft를 교체한 뒤 apply한다.
- `src/modules/metadata-store/effect-components/IsMinimalMetadataReadyEffect.tsx`: object/view 필수 metadata가 up-to-date가 되면 gate를 연다.

```tsx
// filepath: src/modules/metadata-store/states/metadataStoreState.ts
export type MetadataEntityStoreStatus =
  | 'empty'
  | 'draft-pending'
  | 'up-to-date';

export const ALL_METADATA_ENTITY_KEYS = [
  'objectMetadataItems',
  'fieldMetadataItems',
  'indexMetadataItems',
  'views',
  'viewFields',
  'viewFilters',
  'viewSorts',
  'viewGroups',
] as const;

export type MetadataEntityKey = (typeof ALL_METADATA_ENTITY_KEYS)[number];

export type MetadataStoreItem = {
  current: object[];
  draft: object[];
  status: MetadataEntityStoreStatus;
  currentCollectionHash?: string;
  draftCollectionHash?: string;
};

export const metadataStoreState = createAtomFamilyState<
  MetadataStoreItem,
  MetadataEntityKey
>({
  key: 'metadataStoreState',
  defaultValue: {
    current: [],
    draft: [],
    status: 'empty',
  },
  storage: metadataStoreStorage,
  localStorageOptions: { getOnInit: true },
});

// filepath: src/modules/metadata-store/hooks/useResyncMetadataStore.ts
export const useResyncMetadataStore = () => {
  const store = useStore();

  const resyncMetadataStore = useCallback(() => {
    store.set(metadataLoadedVersionState.atom, (prev) => prev + 1);
  }, [store]);

  return { resyncMetadataStore };
};

// filepath: src/modules/metadata-store/effect-components/MinimalMetadataLoadEffect.tsx
export const MinimalMetadataLoadEffect = () => {
  const isLogged = useIsLogged();
  const currentWorkspace = useAtomStateValue(currentWorkspaceState);
  const metadataLoadedVersion = useAtomStateValue(metadataLoadedVersionState);
  const [lastLoadedVersion, setLastLoadedVersion] = useState<number>(-1);

  const { loadMinimalMetadata } = useLoadMinimalMetadata();
  const { loadStaleMetadataEntities } = useLoadStaleMetadataEntities();

  const shouldLoadRealMetadata =
    isLogged &&
    isWorkspaceProvisioned(currentWorkspace) &&
    !isOnAuthOrOnboardingPage;

  useEffect(() => {
    if (!shouldLoadRealMetadata) {
      return;
    }

    if (metadataLoadedVersion === lastLoadedVersion) {
      return;
    }

    setLastLoadedVersion(metadataLoadedVersion);

    const performLoad = async () => {
      const result = await loadMinimalMetadata();

      if (result?.staleEntityKeys && result.staleEntityKeys.length > 0) {
        await loadStaleMetadataEntities(result.staleEntityKeys);
      }
    };

    performLoad();
  }, [
    shouldLoadRealMetadata,
    lastLoadedVersion,
    metadataLoadedVersion,
    loadMinimalMetadata,
    loadStaleMetadataEntities,
  ]);

  return null;
};

// filepath: src/modules/metadata-store/hooks/useLoadMinimalMetadata.ts
export const useLoadMinimalMetadata = () => {
  const client = useApolloClient();
  const store = useStore();

  const loadMinimalMetadata = useCallback(async () => {
    const result = await client.query<FindMinimalMetadataQuery>({
      query: FIND_MINIMAL_METADATA,
      fetchPolicy: 'network-only',
    });

    const { objectMetadataItems, views, collectionHashes } =
      result.data.minimalMetadata;

    const staleEntityKeys: MetadataEntityKey[] = [];
    const entityKeysWithServerHash = new Set<MetadataEntityKey>();

    for (const { collectionName, hash } of collectionHashes ?? []) {
      const entityKey = mapAllMetadataNameToEntityKey(collectionName);

      if (!isDefined(entityKey)) {
        continue;
      }

      entityKeysWithServerHash.add(entityKey);

      const entry = store.get(metadataStoreState.atomFamily(entityKey));

      if (entry.currentCollectionHash !== hash) {
        staleEntityKeys.push(entityKey);
      }

      store.set(metadataStoreState.atomFamily(entityKey), (prev) => ({
        ...prev,
        draftCollectionHash: hash,
      }));
    }

    for (const entityKey of ALL_METADATA_ENTITY_KEYS) {
      if (!entityKeysWithServerHash.has(entityKey)) {
        staleEntityKeys.push(entityKey);
      }
    }

    if (
      store.get(metadataStoreState.atomFamily('objectMetadataItems')).status ===
      'empty'
    ) {
      store.set(metadataStoreState.atomFamily('objectMetadataItems'), (prev) => ({
        ...prev,
        current: objectMetadataItems,
        status: 'up-to-date',
        currentCollectionHash: prev.draftCollectionHash,
        draftCollectionHash: undefined,
      }));
    }

    if (store.get(metadataStoreState.atomFamily('views')).status === 'empty') {
      store.set(metadataStoreState.atomFamily('views'), (prev) => ({
        ...prev,
        current: views,
        status: 'up-to-date',
        currentCollectionHash: prev.draftCollectionHash,
        draftCollectionHash: undefined,
      }));
    }

    return { staleEntityKeys };
  }, [client, store]);

  return { loadMinimalMetadata };
};

// filepath: src/modules/metadata-store/hooks/useLoadStaleMetadataEntities.ts
export const useLoadStaleMetadataEntities = () => {
  const client = useApolloClient();
  const { replaceDraft, applyChanges } = useUpdateMetadataStoreDraft();

  const loadStaleMetadataEntities = useCallback(
    async (staleEntityKeys: MetadataEntityKey[]) => {
      const fetchPromises: Promise<void>[] = [];

      if (hasOverlap(staleEntityKeys, OBJECTS_GROUP_KEYS)) {
        fetchPromises.push(
          client
            .query({
              query: FIND_MANY_OBJECT_METADATA_ITEMS,
              fetchPolicy: 'network-only',
            })
            .then((result) => {
              const { flatObjects, flatFields, flatIndexes } =
                splitObjectMetadataGqlResponse(result.data);

              replaceDraft('objectMetadataItems', flatObjects);
              replaceDraft('fieldMetadataItems', flatFields);
              replaceDraft('indexMetadataItems', flatIndexes);
            }),
        );
      }

      if (hasOverlap(staleEntityKeys, VIEWS_GROUP_KEYS)) {
        fetchPromises.push(
          Promise.all([
            client.query({ query: FindAllViewsDocument, fetchPolicy: 'network-only' }),
            client.query({ query: FindFieldsWidgetViewsDocument, fetchPolicy: 'network-only' }),
            client.query({ query: FindTableWidgetViewsDocument, fetchPolicy: 'network-only' }),
          ]).then((results) => {
            const allViews = results.flatMap(
              (result) => result.data?.getViews ?? [],
            );
            const {
              flatViews,
              flatViewFields,
              flatViewFilters,
              flatViewSorts,
            } = splitViewWithRelated(allViews);

            replaceDraft('views', flatViews);
            replaceDraft('viewFields', flatViewFields);
            replaceDraft('viewFilters', flatViewFilters);
            replaceDraft('viewSorts', flatViewSorts);
          }),
        );
      }

      await Promise.all(fetchPromises);
      applyChanges();
    },
    [client, replaceDraft, applyChanges],
  );

  return { loadStaleMetadataEntities };
};

// filepath: src/modules/metadata-store/effect-components/IsMinimalMetadataReadyEffect.tsx
export const IsMinimalMetadataReadyEffect = () => {
  const isLogged = useIsLogged();
  const currentUser = useAtomStateValue(currentUserState);
  const currentWorkspace = useAtomStateValue(currentWorkspaceState);
  const objects = useAtomFamilyStateValue(
    metadataStoreState,
    'objectMetadataItems',
  );
  const fields = useAtomFamilyStateValue(metadataStoreState, 'fieldMetadataItems');
  const views = useAtomFamilyStateValue(metadataStoreState, 'views');
  const viewFields = useAtomFamilyStateValue(metadataStoreState, 'viewFields');
  const setIsMinimalMetadataReady = useSetAtomState(isMinimalMetadataReadyState);

  useEffect(() => {
    if (!isLogged) {
      setIsMinimalMetadataReady(true);
      return;
    }

    const areObjectsLoaded =
      objects.status === 'up-to-date' && fields.status === 'up-to-date';
    const areViewsLoaded =
      views.status === 'up-to-date' && viewFields.status === 'up-to-date';

    if (!areObjectsLoaded) {
      setIsMinimalMetadataReady(false);
      return;
    }

    const hasProvisionedWorkspace = isWorkspaceProvisioned(currentWorkspace);
    const isReady =
      isDefined(currentUser) && (!hasProvisionedWorkspace || areViewsLoaded);

    if (isReady) {
      setIsMinimalMetadataReady(true);
    }
  }, [isLogged, currentUser, currentWorkspace, objects.status, fields.status]);

  return null;
};
```

## 2. 사용 예제

```tsx
// filepath: src/modules/sse-db-event/components/SSEClientEffect.tsx
export const SSEClientEffect = () => {
  const { resyncMetadataStore } = useResyncMetadataStore();
  const debouncedResyncMetadataStore = useDebouncedCallback(
    resyncMetadataStore,
    SSE_RESYNC_DEBOUNCE_TIME_IN_MS,
  );

  useListenToBrowserEvent({
    eventName: SSE_CLIENT_RECONNECTED_EVENT_NAME,
    onBrowserEvent: debouncedResyncMetadataStore,
  });

  return null;
};

// filepath: src/modules/metadata-store/components/MinimalMetadataGate.tsx
export const MinimalMetadataGate = () => {
  const isMinimalMetadataReady = useAtomStateValue(isMinimalMetadataReadyState);

  if (!isMinimalMetadataReady) {
    return <UserOrMetadataLoader />;
  }

  return (
    <PreComputedChipGeneratorsProvider>
      <Outlet />
    </PreComputedChipGeneratorsProvider>
  );
};
```
