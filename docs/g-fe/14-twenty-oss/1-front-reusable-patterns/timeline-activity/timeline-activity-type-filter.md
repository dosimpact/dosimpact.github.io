# Timeline Activity Type Filter

활성화된 timeline activity type과 record별 선택 필터를 합쳐 실제 list query/display에 쓸 필터로 바꾸는 패턴이다.

핵심은 `active type is the allowed set, selected type is the requested set`이다.

## 1. 모듈 코드

- `src/modules/activities/timeline-activities/hooks/useTimelineActivityTypes.ts`: 서버 type 목록을 가져와 id/universalIdentifier map과 active 목록으로 정규화한다.
- `src/modules/activities/timeline-activities/hooks/useTimelineActivityTypeFilter.ts`: active type과 record별 selected type state를 합쳐 effective filter를 만든다.
- `src/modules/activities/timeline-activities/utils/getActiveTimelineActivityTypeUniversalIdentifiersFilter.ts`: 선택값이 없으면 전체 허용, 있으면 active type 안에 남아있는 값만 반환한다.
- `src/modules/activities/timeline-activities/utils/keepTimelineActivitiesOfSelectedTypes.ts`: effective filter를 activity list에 적용한다.

```tsx
// filepath: src/modules/activities/timeline-activities/hooks/useTimelineActivityTypes.ts
export const useTimelineActivityTypes = () => {
  const { data } = useQuery(FindManyTimelineActivityTypesDocument);

  const timelineActivityTypeMaps = useMemo<TimelineActivityTypeMaps>(() => {
    const timelineActivityTypes: TimelineActivityType[] = (
      data?.timelineActivityTypes ?? []
    ).map(({ emit, ...timelineActivityType }) => ({
      ...timelineActivityType,
      action: isTimelineActivityAction(emit?.on) ? emit.on : null,
      icon: timelineActivityType.icon ?? null,
      objectUniversalIdentifier: emit?.objectUniversalIdentifier ?? null,
      frontComponentUniversalIdentifier:
        timelineActivityType.frontComponentUniversalIdentifier ?? null,
    }));

    return {
      byId: new Map(
        timelineActivityTypes.map((timelineActivityType) => [
          timelineActivityType.id,
          timelineActivityType,
        ]),
      ),
      byUniversalIdentifier: new Map(
        timelineActivityTypes.map((timelineActivityType) => [
          timelineActivityType.universalIdentifier,
          timelineActivityType,
        ]),
      ),
    };
  }, [data?.timelineActivityTypes]);

  const activeTimelineActivityTypes = useMemo(
    () =>
      [...timelineActivityTypeMaps.byId.values()].filter(
        ({ isActive }) => isActive,
      ),
    [timelineActivityTypeMaps],
  );

  return { timelineActivityTypeMaps, activeTimelineActivityTypes };
};

// filepath: src/modules/activities/timeline-activities/hooks/useTimelineActivityTypeFilter.ts
export const useTimelineActivityTypeFilter = (recordId: string) => {
  const { activeTimelineActivityTypes, timelineActivityTypeMaps } =
    useTimelineActivityTypes();
  const timelineActivityTypeUniversalIdentifiersFilter =
    useAtomFamilyStateValue(
      timelineActivityTypeUniversalIdentifiersFilterFamilyState,
      recordId,
    );

  return {
    activeTimelineActivityTypes,
    effectiveTimelineActivityTypeUniversalIdentifiersFilter:
      getActiveTimelineActivityTypeUniversalIdentifiersFilter({
        activeUniversalIdentifiers: activeTimelineActivityTypes.map(
          ({ universalIdentifier }) => universalIdentifier,
        ),
        selectedUniversalIdentifiers:
          timelineActivityTypeUniversalIdentifiersFilter,
      }),
    selectedTimelineActivityTypeUniversalIdentifiers:
      timelineActivityTypeUniversalIdentifiersFilter,
    timelineActivityTypeMaps,
  };
};

// filepath: src/modules/activities/timeline-activities/utils/getActiveTimelineActivityTypeUniversalIdentifiersFilter.ts
export const getActiveTimelineActivityTypeUniversalIdentifiersFilter = ({
  activeUniversalIdentifiers,
  selectedUniversalIdentifiers,
}: {
  activeUniversalIdentifiers: string[];
  selectedUniversalIdentifiers: string[];
}): string[] | null => {
  if (!isNonEmptyArray(selectedUniversalIdentifiers)) {
    return null;
  }

  const activeUniversalIdentifierSet = new Set(activeUniversalIdentifiers);

  return selectedUniversalIdentifiers.filter((universalIdentifier) =>
    activeUniversalIdentifierSet.has(universalIdentifier),
  );
};

// filepath: src/modules/activities/timeline-activities/utils/keepTimelineActivitiesOfSelectedTypes.ts
export const keepTimelineActivitiesOfSelectedTypes = <
  TTimelineActivity extends FilterableTimelineActivity,
>(
  timelineActivities: TTimelineActivity[],
  selectedTimelineActivityTypeUniversalIdentifiers: string[] | null,
  timelineActivityTypeMaps: TimelineActivityTypeMaps,
): TTimelineActivity[] =>
  !isDefined(selectedTimelineActivityTypeUniversalIdentifiers)
    ? timelineActivities
    : timelineActivities.filter((timelineActivity) => {
        const timelineActivityTypeUniversalIdentifier = getTimelineActivityType(
          timelineActivity,
          timelineActivityTypeMaps,
        )?.universalIdentifier;

        return (
          isDefined(timelineActivityTypeUniversalIdentifier) &&
          selectedTimelineActivityTypeUniversalIdentifiers.includes(
            timelineActivityTypeUniversalIdentifier,
          )
        );
      });
```

## 2. 사용 예제

```tsx
// filepath: src/modules/activities/timeline-activities/components/EventList.tsx
export const EventList = ({ events, targetableObject }: EventListProps) => {
  const {
    effectiveTimelineActivityTypeUniversalIdentifiersFilter,
    timelineActivityTypeMaps,
  } = useTimelineActivityTypeFilter(targetableObject.id);

  const filteredEvents = filterOutInvalidTimelineActivities(
    keepTimelineActivitiesOfSelectedTypes(
      events,
      effectiveTimelineActivityTypeUniversalIdentifiersFilter,
      timelineActivityTypeMaps,
    ),
    targetableObject.targetObjectNameSingular,
    objectMetadataItems,
    timelineActivityTypeMaps,
  );

  const groupedEvents = groupEventsByMonth(filteredEvents);

  return (
    <StyledTimelineContainer>
      {groupedEvents.map((group, index) => (
        <EventsGroup
          mainObjectMetadataItem={mainObjectMetadataItem}
          key={group.year.toString() + group.month}
          group={group}
          month={new Date(group.items[0].happensAt).toLocaleString('default', {
            month: 'long',
          })}
          year={
            index === 0 || group.year !== groupedEvents[index - 1].year
              ? group.year
              : undefined
          }
        />
      ))}
    </StyledTimelineContainer>
  );
};
```
