# Calendar Event Composer Date Transitions

Calendar event composer에서 start/end와 all-day mode 전환을 항상 valid range로 유지하는 패턴이다.

핵심은 `date inputs call transition helpers instead of patching dates inline`이다.

## 1. 모듈 코드

- `src/modules/activities/calendar/utils/getCalendarEventComposerDefaultDates.ts`: 현재 시간에서 다음 30분 단위 시작/1시간 종료 기본값을 만든다.
- `src/modules/activities/calendar/utils/getCalendarEventDatesAfterStartChange.ts`: start 변경 후 end가 start 이후에 남도록 보정한다.
- `src/modules/activities/calendar/utils/getCalendarEventDatesAfterModeChange.ts`: timed event와 all-day event 사이의 date shape를 변환한다.
- `src/modules/activities/calendar/hooks/useCalendarEventComposer.ts`: date transition helper를 composer state handler로 노출한다.

```tsx
// 큰 흐름: Calendar event composer에서 start/end와 all-day mode 전환을 항상 valid range로 유지하는 패턴이다.
// 핵심 기준: `date inputs call transition helpers instead of patching dates inline`이다.

// filepath: src/modules/activities/calendar/utils/getCalendarEventComposerDefaultDates.ts
import type { Temporal } from 'temporal-polyfill';

const CALENDAR_EVENT_DEFAULT_DURATION_MINUTES = 60;
const CALENDAR_EVENT_START_INTERVAL_MINUTES = 30;

export const getCalendarEventComposerDefaultDates = ({
  now,
  timeZone,
}: {
  now: Temporal.Instant;
  timeZone: string;
}) => {
  const zonedNow = now.toZonedDateTimeISO(timeZone);
  const minutesUntilNextInterval =
    CALENDAR_EVENT_START_INTERVAL_MINUTES -
    (zonedNow.minute % CALENDAR_EVENT_START_INTERVAL_MINUTES);

  const startsAt = zonedNow
    .add({ minutes: minutesUntilNextInterval })
    .with({ second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 });

  return {
    startsAt: startsAt.toInstant().toString(),
    endsAt: startsAt
      .add({ minutes: CALENDAR_EVENT_DEFAULT_DURATION_MINUTES })
      .toInstant()
      .toString(),
  };
};

// filepath: src/modules/activities/calendar/utils/getCalendarEventDatesAfterStartChange.ts
import { Temporal } from 'temporal-polyfill';

export const getCalendarEventDatesAfterStartChange = ({
  dates,
  startsAt,
  isFullDay,
}: {
  dates: { startsAt: string; endsAt: string };
  startsAt: string;
  isFullDay: boolean;
}) => {
  if (isFullDay) {
    return {
      startsAt,
      endsAt:
        dates.endsAt > startsAt
          ? dates.endsAt
          : Temporal.PlainDate.from(startsAt).add({ days: 1 }).toString(),
    };
  }

  return {
    startsAt,
    endsAt:
      Date.parse(dates.endsAt) > Date.parse(startsAt)
        ? dates.endsAt
        : Temporal.Instant.from(startsAt).add({ hours: 1 }).toString(),
  };
};

// filepath: src/modules/activities/calendar/utils/getCalendarEventDatesAfterModeChange.ts
import { Temporal } from 'temporal-polyfill';

export const getCalendarEventDatesAfterModeChange = ({
  dates,
  isFullDay,
  timeZone,
}: {
  dates: { startsAt: string; endsAt: string };
  isFullDay: boolean;
  timeZone: string;
}) => {
  if (isFullDay) {
    const startDate = Temporal.Instant.from(dates.startsAt)
      .toZonedDateTimeISO(timeZone)
      .toPlainDate();

    return {
      startsAt: startDate.toString(),
      endsAt: startDate.add({ days: 1 }).toString(),
    };
  }

  const startDate = Temporal.PlainDate.from(dates.startsAt.slice(0, 10));
  const startsAt = startDate.toZonedDateTime({
    timeZone,
    plainTime: Temporal.PlainTime.from('09:00'),
  });

  return {
    startsAt: startsAt.toInstant().toString(),
    endsAt: startsAt.add({ hours: 1 }).toInstant().toString(),
  };
};

// filepath: src/modules/activities/calendar/hooks/useCalendarEventComposer.ts
export const useCalendarEventComposer = ({ initialValues, onCreated }) => {
  const [timeZone, setTimeZone] = useState(initialValues?.timeZone ?? 'UTC');
  const [isFullDay, setIsFullDay] = useState(false);
  const [dates, setDates] = useState(() =>
    getCalendarEventComposerDefaultDates({
      now: Temporal.Now.instant(),
      timeZone: initialValues?.timeZone ?? 'UTC',
    }),
  );

  const hasValidDateRange = isFullDay
    ? dates.endsAt.slice(0, 10) > dates.startsAt.slice(0, 10)
    : Date.parse(dates.endsAt) > Date.parse(dates.startsAt);

  const handleIsFullDayChange = (nextIsFullDay: boolean) => {
    setDates(
      getCalendarEventDatesAfterModeChange({
        dates,
        isFullDay: nextIsFullDay,
        timeZone,
      }),
    );

    setIsFullDay(nextIsFullDay);
  };

  const handleStartsAtChange = (value: string | null) => {
    if (!isDefined(value)) {
      return;
    }

    setDates((currentDates) =>
      getCalendarEventDatesAfterStartChange({
        dates: currentDates,
        startsAt: value,
        isFullDay,
      }),
    );
  };

  const setEndsAt = (value: string | null) => {
    if (isDefined(value)) {
      setDates((currentDates) => ({
        ...currentDates,
        endsAt:
          isFullDay && value.slice(0, 10) <= currentDates.startsAt.slice(0, 10)
            ? Temporal.PlainDate.from(currentDates.startsAt.slice(0, 10))
                .add({ days: 1 })
                .toString()
            : value,
      }));
    }
  };

  return {
    dates,
    hasValidDateRange,
    isFullDay,
    timeZone,
    handleIsFullDayChange,
    handleStartsAtChange,
    setEndsAt,
    setTimeZone,
  };
};
```

## 2. 사용 예제

```tsx
// 사용 흐름: Calendar Event Composer Date Transitions 패턴을 실제 호출부에서 조합한다.

// filepath: src/modules/activities/calendar/components/CalendarEventComposerFields.tsx
<ComposerFieldRow
  label={t`All day`}
  onClick={() =>
    composerState.handleIsFullDayChange(!composerState.isFullDay)
  }
  trailing={
    <Toggle
      aria-label={t`All day`}
      value={composerState.isFullDay}
      onChange={composerState.handleIsFullDayChange}
    />
  }
/>

{composerState.isFullDay ? (
  <>
    <FormDateFieldInput
      defaultValue={composerState.dates.startsAt}
      onChange={composerState.handleStartsAtChange}
    />
    <FormDateFieldInput
      key={composerState.dates.endsAt}
      defaultValue={composerState.dates.endsAt}
      onChange={composerState.setEndsAt}
    />
  </>
) : (
  <>
    <FormDateTimeFieldInput
      key={`starts-at-${composerState.timeZone}`}
      defaultValue={composerState.dates.startsAt}
      onChange={composerState.handleStartsAtChange}
      timeZone={composerState.timeZone}
    />
    <FormDateTimeFieldInput
      key={`ends-at-${composerState.dates.endsAt}-${composerState.timeZone}`}
      defaultValue={composerState.dates.endsAt}
      onChange={composerState.setEndsAt}
      timeZone={composerState.timeZone}
    />
  </>
)}

{!composerState.hasValidDateRange && (
  <Callout
    variant="warning"
    title={t`Check the event dates`}
    description={
      composerState.isFullDay
        ? t`The end date must be later than the start date.`
        : t`The end time must be after the start time.`
    }
  />
)}
```
