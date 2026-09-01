# Timeline Events Month Grouping

정렬된 timeline event list를 렌더링 직전에 월 단위 그룹으로 바꾸는 패턴이다.

핵심은 `data stays flat, view groups at the edge`다.

## 1. 모듈 코드

- `src/modules/activities/timeline-activities/utils/groupEventsByMonth.ts`: `happensAt` 기준으로 year/month bucket을 만들고 최신 월부터 정렬한다.
- `src/modules/activities/timeline-activities/components/EventList.tsx`: 필터링된 flat event list를 month group으로 변환한다.
- `src/modules/activities/timeline-activities/components/EventsGroup.tsx`: month separator, vertical bar, row list를 group 단위로 렌더링한다.

```tsx
// filepath: src/modules/activities/timeline-activities/utils/groupEventsByMonth.ts
export type EventGroup = {
  month: number;
  year: number;
  items: TimelineActivity[];
};

export const groupEventsByMonth = (events: TimelineActivity[]) => {
  const activityGroups: EventGroup[] = [];

  for (const event of events) {
    const date = new Date(event.happensAt);
    const month = date.getMonth();
    const year = date.getFullYear();

    const matchingGroup = activityGroups.find(
      (group) => group.year === year && group.month === month,
    );
    if (isDefined(matchingGroup)) {
      matchingGroup.items.push(event);
    } else {
      activityGroups.push({
        year,
        month,
        items: [event],
      });
    }
  }

  return activityGroups.sort((a, b) => b.year - a.year || b.month - a.month);
};

// filepath: src/modules/activities/timeline-activities/components/EventList.tsx
export const EventList = ({ events, targetableObject }: EventListProps) => {
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

  if (groupedEvents.length === 0) {
    return <EmptyTimelinePlaceholder />;
  }

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

// filepath: src/modules/activities/timeline-activities/components/EventsGroup.tsx
export const EventsGroup = ({
  group,
  month,
  year,
  mainObjectMetadataItem,
}: EventsGroupProps) => {
  return (
    <StyledActivityGroup>
      <StyledMonthSeperator>
        {month} {year}
        <StyledMonthSeperatorLine />
      </StyledMonthSeperator>
      <StyledActivityGroupContainer>
        <StyledActivityGroupBar />
        {group.items.map((event, index) => (
          <EventRow
            mainObjectMetadataItem={mainObjectMetadataItem}
            key={index}
            event={event}
            isLastEvent={index === group.items.length - 1}
          />
        ))}
      </StyledActivityGroupContainer>
    </StyledActivityGroup>
  );
};
```

## 2. 사용 예제

```tsx
// filepath: src/modules/activities/timeline-activities/components/EventList.tsx
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
```
