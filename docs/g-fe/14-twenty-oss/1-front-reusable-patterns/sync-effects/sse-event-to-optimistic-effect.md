# SSE Event To Optimistic Effect

SSE subscription payload를 metadata event, optimistic cache update, browser event broadcast로 나눠 처리하는 패턴이다.

핵심은 `remote event becomes local cache effect plus local browser event`다.

## 1. 모듈 코드

- `src/modules/sse-db-event/hooks/useTriggerEventStreamCreation.ts`: SSE subscription을 열고 수신 payload를 metadata dispatch, optimistic effect, object record browser event로 분기한다.
- `src/modules/sse-db-event/hooks/useTriggerOptimisticEffectFromSseEvents.ts`: object record SSE event를 object metadata와 event type별로 그룹화한다.
- `src/modules/sse-db-event/hooks/useTriggerOptimisticEffectFromSseCreateEvents.ts`: create SSE event를 Apollo connection cache와 record store에 반영한다.
- `src/modules/sse-db-event/hooks/useTriggerOptimisticEffectFromSseUpdateEvents.ts`: update SSE event를 optimistic record로 변환하고 stale event를 무시한 뒤 cache/store를 갱신한다.
- `src/modules/sse-db-event/hooks/useDispatchObjectRecordEventsFromSseToBrowserEvents.ts`: SSE record event를 feature들이 구독할 browser event로 재방송한다.

```tsx
// filepath: src/modules/sse-db-event/hooks/useTriggerEventStreamCreation.ts
export const useTriggerEventStreamCreation = () => {
  const store = useStore();
  const { dispatchMetadataEventsFromSseToBrowserEvents } =
    useDispatchMetadataEventsFromSseToBrowserEvents();
  const { dispatchObjectRecordEventsFromSseToBrowserEvents } =
    useDispatchObjectRecordEventsFromSseToBrowserEvents();
  const { triggerOptimisticEffectFromSseEvents } =
    useTriggerOptimisticEffectFromSseEvents();

  const triggerEventStreamCreation = useCallback(() => {
    const sseClient = store.get(sseClientState.atom);
    const newSseEventStreamId = v4();

    store.set(sseEventStreamIdState.atom, newSseEventStreamId);
    store.set(sseEventStreamReadyState.atom, false);

    const dispose = sseClient.subscribe(
      {
        query: print(ON_EVENT_SUBSCRIPTION),
        variables: { eventStreamId: newSseEventStreamId },
      },
      {
        next: (value) => {
          store.set(lastSseEventReceivedTimestampState.atom, Date.now());

          const eventSubscription = value?.data?.onEventSubscription;
          const objectRecordEventsWithQueryIds =
            eventSubscription?.objectRecordEventsWithQueryIds ?? [];
          const objectRecordEvents = objectRecordEventsWithQueryIds.map(
            (item) => item.objectRecordEvent,
          );
          const metadataEvents = eventSubscription?.metadataEvents ?? [];

          dispatchMetadataEventsFromSseToBrowserEvents(metadataEvents);

          triggerOptimisticEffectFromSseEvents({
            objectRecordEvents,
          });

          dispatchObjectRecordEventsFromSseToBrowserEvents(
            objectRecordEventsWithQueryIds,
          );
        },
      },
    );

    store.set(disposeFunctionForEventStreamState.atom, { dispose });
  }, [
    dispatchMetadataEventsFromSseToBrowserEvents,
    dispatchObjectRecordEventsFromSseToBrowserEvents,
    triggerOptimisticEffectFromSseEvents,
    store,
  ]);

  return { triggerEventStreamCreation };
};

// filepath: src/modules/sse-db-event/hooks/useTriggerOptimisticEffectFromSseEvents.ts
export const useTriggerOptimisticEffectFromSseEvents = () => {
  const { objectMetadataItems } = useObjectMetadataItems();
  const { triggerOptimisticEffectFromSseUpdateEvents } =
    useTriggerOptimisticEffectFromSseUpdateEvents();
  const { triggerOptimisticEffectFromSseCreateEvents } =
    useTriggerOptimisticEffectFromSseCreateEvents();

  const triggerOptimisticEffectFromSseEvents = useCallback(
    ({ objectRecordEvents }: { objectRecordEvents: ObjectRecordEvent[] }) => {
      const eventsByObject =
        groupObjectRecordSseEventsByObjectMetadataItemNameSingular({
          objectRecordEvents,
        });

      for (const [objectNameSingular, events] of eventsByObject) {
        const objectMetadataItem = objectMetadataItems.find(
          (metadataItem) => metadataItem.nameSingular === objectNameSingular,
        );

        if (!isDefined(objectMetadataItem)) {
          continue;
        }

        const { objectRecordEventsByEventType } =
          groupObjectRecordSseEventsByEventType({
            objectRecordEvents: events,
          });

        for (const [eventType, eventsForType] of objectRecordEventsByEventType) {
          switch (eventType) {
            case DatabaseEventAction.UPDATED:
              triggerOptimisticEffectFromSseUpdateEvents({
                objectRecordEvents: eventsForType,
                objectMetadataItem,
              });
              break;
            case DatabaseEventAction.CREATED:
              triggerOptimisticEffectFromSseCreateEvents({
                objectRecordEvents: eventsForType,
                objectMetadataItem,
              });
              break;
          }
        }
      }
    },
    [
      objectMetadataItems,
      triggerOptimisticEffectFromSseUpdateEvents,
      triggerOptimisticEffectFromSseCreateEvents,
    ],
  );

  return { triggerOptimisticEffectFromSseEvents };
};

// filepath: src/modules/sse-db-event/hooks/useTriggerOptimisticEffectFromSseCreateEvents.ts
export const useTriggerOptimisticEffectFromSseCreateEvents = () => {
  const apolloCoreClient = useApolloCoreClient();
  const { objectMetadataItems } = useObjectMetadataItems();
  const { objectPermissionsByObjectMetadataId } = useObjectPermissions();
  const { upsertRecordsInStore } = useUpsertRecordsInStore();

  const triggerOptimisticEffectFromSseCreateEvents = useCallback(
    ({ objectRecordEvents, objectMetadataItem }) => {
      const recordsToCreate = objectRecordEvents
        .filter((event) => event.action === DatabaseEventAction.CREATED)
        .map((event) => ({
          ...event.properties.after,
          __typename: getObjectTypename(objectMetadataItem.nameSingular),
        }));

      triggerCreateRecordsOptimisticEffect({
        cache: apolloCoreClient.cache,
        objectMetadataItem,
        recordsToCreate,
        objectMetadataItems,
        shouldMatchRootQueryFilter: true,
        checkForRecordInCache: true,
        objectPermissionsByObjectMetadataId,
        upsertRecordsInStore,
      });
    },
    [
      apolloCoreClient.cache,
      objectMetadataItems,
      objectPermissionsByObjectMetadataId,
      upsertRecordsInStore,
    ],
  );

  return { triggerOptimisticEffectFromSseCreateEvents };
};

// filepath: src/modules/sse-db-event/hooks/useTriggerOptimisticEffectFromSseUpdateEvents.ts
export const useTriggerOptimisticEffectFromSseUpdateEvents = () => {
  const store = useStore();
  const apolloCoreClient = useApolloCoreClient();
  const { objectPermissionsByObjectMetadataId } = useObjectPermissions();
  const { upsertRecordsInStore } = useUpsertRecordsInStore();

  const triggerOptimisticEffectFromSseUpdateEvents = useCallback(
    ({ objectRecordEvents, objectMetadataItem: objectMetadataItemFromCaller }) => {
      const objectMetadataItems = store.get(
        objectMetadataItemsWithFieldsSelector.atom,
      );
      const objectMetadataItem =
        objectMetadataItems.find(
          (item) => item.id === objectMetadataItemFromCaller.id,
        ) ?? objectMetadataItemFromCaller;

      const updateEvents = objectRecordEvents.filter(
        (event) => event.action === DatabaseEventAction.UPDATED,
      );

      for (const updateEvent of updateEvents) {
        const updatedRecord = updateEvent.properties.after;

        const computedOptimisticRecord = {
          ...computeOptimisticRecordFromInput({
            cache: apolloCoreClient.cache,
            objectMetadataItem,
            objectMetadataItems,
            recordInput: updatedRecord,
            objectPermissionsByObjectMetadataId,
            currentWorkspaceMember: null,
          }),
          id: updatedRecord.id,
          __typename: getObjectTypename(objectMetadataItem.nameSingular),
        };

        const cachedRecord = getRecordFromCache({
          cache: apolloCoreClient.cache,
          objectMetadataItem,
          objectMetadataItems,
          recordId: updatedRecord.id,
          recordGqlFields: generateDepthRecordGqlFieldsFromRecord({
            objectMetadataItem,
            objectMetadataItems,
            record: computedOptimisticRecord,
            depth: 0,
          }),
          objectPermissionsByObjectMetadataId,
        });

        if (
          isDefined(cachedRecord?.updatedAt) &&
          isDefined(updatedRecord.updatedAt) &&
          new Date(updatedRecord.updatedAt as string).getTime() <
            new Date(cachedRecord.updatedAt as string).getTime()
        ) {
          continue;
        }

        upsertRecordsInStore({ partialRecords: [updatedRecord] });
        updateRecordFromCache({
          objectMetadataItems,
          objectMetadataItem,
          cache: apolloCoreClient.cache,
          record: computedOptimisticRecord,
          recordGqlFields,
          objectPermissionsByObjectMetadataId,
        });

        triggerUpdateRecordOptimisticEffect({
          cache: apolloCoreClient.cache,
          objectMetadataItem,
          currentRecord: cachedRecordWithConnection,
          updatedRecord: computedOptimisticRecordWithConnection,
          objectMetadataItems,
          objectPermissionsByObjectMetadataId,
          upsertRecordsInStore,
        });
      }
    },
    [store, apolloCoreClient.cache, objectPermissionsByObjectMetadataId],
  );

  return { triggerOptimisticEffectFromSseUpdateEvents };
};

// filepath: src/modules/sse-db-event/hooks/useDispatchObjectRecordEventsFromSseToBrowserEvents.ts
export const useDispatchObjectRecordEventsFromSseToBrowserEvents = () => {
  const store = useStore();

  const dispatchObjectRecordEventsFromSseToBrowserEvents = useCallback(
    (objectRecordEventsWithQueryIds: ObjectRecordEventWithQueryIds[]) => {
      const objectRecordEvents = objectRecordEventsWithQueryIds.map(
        (item) => item.objectRecordEvent,
      );
      const eventsByObject =
        groupObjectRecordSseEventsByObjectMetadataItemNameSingular({
          objectRecordEvents,
        });
      const objectMetadataItems = store.get(objectMetadataItemsSelector.atom);

      for (const [objectNameSingular, events] of eventsByObject) {
        const objectMetadataItem = objectMetadataItems.find(
          (metadataItem) => metadataItem.nameSingular === objectNameSingular,
        );

        if (!isDefined(objectMetadataItem)) {
          continue;
        }

        const browserEvents =
          turnSseObjectRecordEventsToObjectRecordOperationBrowserEvents({
            objectMetadataItem,
            objectRecordEvents: events,
          });

        for (const browserEvent of browserEvents) {
          dispatchObjectRecordOperationBrowserEvent(browserEvent);
        }
      }
    },
    [store],
  );

  return { dispatchObjectRecordEventsFromSseToBrowserEvents };
};
```

## 2. 사용 예제

```tsx
// filepath: src/modules/sse-db-event/components/SSEEventStreamEffect.tsx
export const SSEEventStreamEffect = () => {
  const objectMetadataItems = useAtomStateValue(objectMetadataItemsSelector);
  const sseEventStreamId = useAtomStateValue(sseEventStreamIdState);
  const isLogged = useIsLogged();
  const currentUser = useAtomStateValue(currentUserState);
  const { triggerEventStreamCreation } = useTriggerEventStreamCreation();
  const { triggerEventStreamDestroy } = useTriggerEventStreamDestroy();

  useEffect(() => {
    const willCreateEventStream =
      isLogged &&
      currentUser?.onboardingStatus === OnboardingStatus.COMPLETED &&
      !isNonEmptyString(sseEventStreamId) &&
      isNonEmptyArray(objectMetadataItems);

    if (willCreateEventStream) {
      triggerEventStreamCreation();
    }
  }, [
    isLogged,
    currentUser,
    sseEventStreamId,
    objectMetadataItems,
    triggerEventStreamCreation,
    triggerEventStreamDestroy,
  ]);

  return null;
};
```
