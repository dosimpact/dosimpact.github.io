# Dynamic Timeline Activity Renderer

timeline activity row는 기본 문장을 먼저 렌더링하고, type 설정에 따라 standard renderer 또는 front component renderer를 접어서 추가하는 패턴이다.

핵심은 `native row is the fallback, renderer is optional detail`이다.

## 1. 모듈 코드

- `src/modules/activities/timeline-activities/rows/components/TimelineActivityRenderer.ts`: standard renderer와 front component renderer의 discriminated union을 정의한다.
- `src/modules/activities/timeline-activities/rows/components/StandardTimelineActivityRenderer.tsx`: 알려진 renderer universalIdentifier를 lazy React component로 매핑한다.
- `src/modules/activities/timeline-activities/components/EventRow.tsx`: timeline type metadata와 front component registry를 읽어 renderer config를 계산한다.
- `src/modules/activities/timeline-activities/rows/components/EventRowDynamicComponent.tsx`: native row를 항상 렌더링하고 renderer가 있으면 toggle 가능한 card로 추가 렌더링한다.

```tsx
// filepath: src/modules/activities/timeline-activities/rows/components/TimelineActivityRenderer.ts
export type StandardTimelineActivityRendererProps = {
  event: TimelineActivity;
  authorFullName: string;
};

export type TimelineActivityRenderer =
  | {
      type: 'standard';
      Component: ComponentType<StandardTimelineActivityRendererProps>;
    }
  | {
      type: 'frontComponent';
      frontComponentId: string;
    };

// filepath: src/modules/activities/timeline-activities/rows/components/StandardTimelineActivityRenderer.tsx
const STANDARD_TIMELINE_ACTIVITY_RENDERERS: Record<
  StandardTimelineActivityRendererUniversalIdentifier,
  ComponentType<StandardTimelineActivityRendererProps>
> = {
  [STANDARD_TIMELINE_ACTIVITY_RENDERER_UNIVERSAL_IDENTIFIERS.message]:
    MessageTimelineActivityRenderer,
  [STANDARD_TIMELINE_ACTIVITY_RENDERER_UNIVERSAL_IDENTIFIERS.calendarEvent]:
    CalendarEventTimelineActivityRenderer,
};

export const getStandardTimelineActivityRenderer = (
  universalIdentifier: string | null | undefined,
): ComponentType<StandardTimelineActivityRendererProps> | null => {
  if (
    !isDefined(universalIdentifier) ||
    !isStandardTimelineActivityRendererUniversalIdentifier(universalIdentifier)
  ) {
    return null;
  }

  return STANDARD_TIMELINE_ACTIVITY_RENDERERS[universalIdentifier];
};

// filepath: src/modules/activities/timeline-activities/components/EventRow.tsx
const getTimelineActivityRenderer = ({
  standardRenderer,
  frontComponentId,
}: {
  standardRenderer: ReturnType<typeof getStandardTimelineActivityRenderer>;
  frontComponentId: string | null;
}): TimelineActivityRenderer | null => {
  if (isDefined(standardRenderer)) {
    return { type: 'standard', Component: standardRenderer };
  }

  if (isDefined(frontComponentId)) {
    return { type: 'frontComponent', frontComponentId };
  }

  return null;
};

export const EventRow = ({ event, mainObjectMetadataItem }: EventRowProps) => {
  const { timelineActivityTypeMaps } = useTimelineActivityTypes();
  const frontComponents = useAtomStateValue(frontComponentsSelector);
  const timelineActivityType = getTimelineActivityType(
    event,
    timelineActivityTypeMaps,
  );

  const rendererUniversalIdentifier =
    timelineActivityType?.frontComponentUniversalIdentifier;
  const standardRenderer = getStandardTimelineActivityRenderer(
    rendererUniversalIdentifier,
  );
  const frontComponentId = isDefined(rendererUniversalIdentifier)
    ? (frontComponents.find(
        (frontComponent) =>
          frontComponent.universalIdentifier === rendererUniversalIdentifier,
      )?.id ?? null)
    : null;
  const renderer = getTimelineActivityRenderer({
    standardRenderer,
    frontComponentId,
  });

  return (
    <EventRowDynamicComponent
      event={event}
      renderer={renderer}
      mainObjectMetadataItem={mainObjectMetadataItem}
      authorFullName={authorFullName}
      labelIdentifierValue={labelIdentifier.name}
      eventAction={timelineActivityAction}
      eventTypeLabel={timelineActivityType?.label}
      linkedObjectMetadataItem={linkedObjectMetadataItem}
      happensAt={event.happensAt}
    />
  );
};

// filepath: src/modules/activities/timeline-activities/rows/components/EventRowDynamicComponent.tsx
export const EventRowDynamicComponent = ({
  event,
  renderer,
  authorFullName,
  ...nativeRowProps
}: EventRowDynamicComponentProps) => {
  const [isRendererOpen, setIsRendererOpen] = useState(false);
  const EventRowComponent = isDefined(event.linkedRecordId)
    ? EventRowGenericLinked
    : EventRowMainObject;

  const nativeRenderer = (
    <EventRowComponent
      event={event}
      hasRenderer={isDefined(renderer)}
      authorFullName={authorFullName}
      {...nativeRowProps}
    />
  );

  if (!isDefined(renderer)) {
    return nativeRenderer;
  }

  return (
    <StyledContainer>
      <StyledNativeRowContainer>
        <StyledNativeRow>{nativeRenderer}</StyledNativeRow>
        <EventCardToggleButton
          isOpen={isRendererOpen}
          setIsOpen={setIsRendererOpen}
        />
      </StyledNativeRowContainer>
      {isRendererOpen && (
        <EventCard isOpen>
          <Suspense fallback={null}>
            {renderer.type === 'standard' ? (
              <renderer.Component
                event={event}
                authorFullName={authorFullName}
              />
            ) : (
              <FrontComponentRenderer
                frontComponentId={renderer.frontComponentId}
                timelineActivityId={event.id}
              />
            )}
          </Suspense>
        </EventCard>
      )}
    </StyledContainer>
  );
};
```

## 2. 사용 예제

```tsx
// filepath: src/modules/activities/timeline-activities/components/EventRow.tsx
const rendererUniversalIdentifier =
  timelineActivityType?.frontComponentUniversalIdentifier;

const standardRenderer = getStandardTimelineActivityRenderer(
  rendererUniversalIdentifier,
);

const frontComponentId = isDefined(rendererUniversalIdentifier)
  ? (frontComponents.find(
      (frontComponent) =>
        frontComponent.universalIdentifier === rendererUniversalIdentifier,
    )?.id ?? null)
  : null;

const renderer = getTimelineActivityRenderer({
  standardRenderer,
  frontComponentId,
});

return (
  <EventRowDynamicComponent
    authorFullName={authorFullName}
    labelIdentifierValue={labelIdentifier.name}
    event={event}
    eventAction={timelineActivityAction}
    eventTypeLabel={timelineActivityType?.label}
    renderer={renderer}
    mainObjectMetadataItem={mainObjectMetadataItem}
    linkedObjectMetadataItem={linkedObjectMetadataItem}
    happensAt={event.happensAt}
  />
);
```
