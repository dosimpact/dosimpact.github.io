# Field Diff Value Renderer

timeline diff 값을 임시 record store에 넣고 기존 `FieldDisplay` router로 표시하는 패턴이다.

핵심은 `forge a read-only record, reuse the field display system`이다.

## 1. 모듈 코드

- `src/modules/activities/timeline-activities/rows/main-object/components/EventFieldDiff.tsx`: relation diff와 일반 field diff를 분기하고 empty 상태를 처리한다.
- `src/modules/activities/timeline-activities/rows/main-object/components/EventFieldDiffValueEffect.tsx`: diff 값을 artificial record id의 record store에 주입한다.
- `src/modules/activities/timeline-activities/rows/main-object/components/EventFieldDiffValue.tsx`: artificial record id와 field metadata로 `FieldContext`를 만들고 `FieldDisplay`를 재사용한다.
- `src/modules/activities/timeline-activities/rows/main-object/components/EventRelationFieldDiffValues.tsx`: relation id diff는 target record를 조회해 label identifier로 표시한다.
- `src/modules/activities/timeline-activities/utils/relationFieldChangeValue.ts`: relation diff value shape을 판별한다.

```tsx
// 큰 흐름: timeline diff 값을 임시 record store에 넣고 기존 `FieldDisplay` router로 표시하는 패턴이다.
// 핵심 기준: `forge a read-only record, reuse the field display system`이다.

// filepath: src/modules/activities/timeline-activities/rows/main-object/components/EventFieldDiff.tsx
export const EventFieldDiff = ({
  fieldDiff,
  mainObjectMetadataItem,
  fieldMetadataItem,
  diffArtificialRecordStoreId,
}: EventFieldDiffProps) => {
  if (!fieldMetadataItem) {
    throw new Error('fieldMetadataItem is required');
  }

  const isRelationFieldDiff =
    fieldMetadataItem.type === FieldMetadataType.RELATION &&
    (isRelationFieldChangeValue(fieldDiff.before) ||
      isRelationFieldChangeValue(fieldDiff.after));

  if (isRelationFieldDiff) {
    return (
      <StyledEventFieldDiffContainer>
        <EventFieldDiffLabel fieldMetadataItem={fieldMetadataItem} />
        <StyledArrowContainer>→</StyledArrowContainer>
        <EventRelationFieldDiffValues
          fieldDiff={fieldDiff}
          fieldMetadataItem={fieldMetadataItem}
        />
      </StyledEventFieldDiffContainer>
    );
  }

  const diffRecord = fieldDiff.after as Record<string, unknown> | undefined;
  const isUpdatedToEmpty =
    isValueEmpty(diffRecord) ||
    (typeof diffRecord === 'object' &&
      diffRecord !== null &&
      isObjectEmpty(diffRecord));

  return (
    <StyledEventFieldDiffContainer>
      <EventFieldDiffLabel fieldMetadataItem={fieldMetadataItem} />
      <StyledArrowContainer>→</StyledArrowContainer>
      {isUpdatedToEmpty ? (
        <StyledEmptyValue>
          <Trans>Empty</Trans>
        </StyledEmptyValue>
      ) : (
        <>
          <EventFieldDiffValueEffect
            diffArtificialRecordStoreId={diffArtificialRecordStoreId}
            mainObjectMetadataItem={mainObjectMetadataItem}
            fieldMetadataItem={fieldMetadataItem}
            diffRecord={diffRecord}
          />
          <EventFieldDiffValue
            diffArtificialRecordStoreId={diffArtificialRecordStoreId}
            mainObjectMetadataItem={mainObjectMetadataItem}
            fieldMetadataItem={fieldMetadataItem}
          />
        </>
      )}
    </StyledEventFieldDiffContainer>
  );
};

// filepath: src/modules/activities/timeline-activities/rows/main-object/components/EventFieldDiffValueEffect.tsx
export const EventFieldDiffValueEffect = ({
  diffArtificialRecordStoreId,
  diffRecord,
  mainObjectMetadataItem,
  fieldMetadataItem,
}: {
  diffArtificialRecordStoreId: string;
  diffRecord: Record<string, unknown> | undefined;
  mainObjectMetadataItem: EnrichedObjectMetadataItem;
  fieldMetadataItem: FieldMetadataItem;
}) => {
  const setRecordStore = useSetAtomFamilyState(
    recordStoreFamilyState,
    diffArtificialRecordStoreId,
  );

  const { recordId } = useContext(TimelineActivityContext);
  const recordStore = useAtomFamilyStateValue(recordStoreFamilyState, recordId);

  useEffect(() => {
    if (!isDefined(diffRecord)) return;

    let fieldValue = diffRecord;

    if (
      fieldMetadataItem.type === FieldMetadataType.FILES &&
      isDefined(recordStore) &&
      Array.isArray(diffRecord)
    ) {
      const currentFiles = Array.isArray(recordStore[fieldMetadataItem.name])
        ? (recordStore[fieldMetadataItem.name] as FieldFilesValue[])
        : [];
      const currentFileMap = new Map(
        currentFiles.map((file) => [file.fileId, file]),
      );

      fieldValue = (diffRecord as FieldFilesValue[]).map((file) => {
        const currentFile = currentFileMap.get(file.fileId);
        if (isDefined(currentFile)) {
          return { ...file, url: currentFile.url };
        }
        return { ...file, isDeleted: true, url: undefined };
      });
    }

    setRecordStore({
      __typename: mainObjectMetadataItem.nameSingular,
      id: diffArtificialRecordStoreId,
      [fieldMetadataItem.name]: fieldValue,
    });
  }, [diffRecord, diffArtificialRecordStoreId, fieldMetadataItem]);

  return <></>;
};

// filepath: src/modules/activities/timeline-activities/rows/main-object/components/EventFieldDiffValue.tsx
export const EventFieldDiffValue = ({
  diffArtificialRecordStoreId,
  mainObjectMetadataItem,
  fieldMetadataItem,
}: EventFieldDiffValueProps) => {
  return (
    <StyledEventFieldDiffValue>
      <RecordFieldComponentInstanceContext.Provider
        value={{
          instanceId: `${diffArtificialRecordStoreId}-${fieldMetadataItem.name}`,
        }}
      >
        <FieldContext.Provider
          value={{
            recordId: diffArtificialRecordStoreId,
            isLabelIdentifier: false,
            fieldDefinition: {
              type: fieldMetadataItem.type,
              iconName: fieldMetadataItem?.icon || 'FieldIcon',
              fieldMetadataId: fieldMetadataItem.id || '',
              label: fieldMetadataItem.label,
              metadata: {
                fieldName: fieldMetadataItem.name,
                objectMetadataNameSingular: mainObjectMetadataItem.nameSingular,
                options: fieldMetadataItem.options ?? [],
              },
              defaultValue: fieldMetadataItem.defaultValue,
            },
            isRecordFieldReadOnly: false,
          }}
        >
          <FieldDisplay />
        </FieldContext.Provider>
      </RecordFieldComponentInstanceContext.Provider>
    </StyledEventFieldDiffValue>
  );
};

// filepath: src/modules/activities/timeline-activities/rows/main-object/components/EventRelationFieldDiffValues.tsx
export const EventRelationFieldDiffValues = ({
  fieldDiff,
  fieldMetadataItem,
}: EventRelationFieldDiffValuesProps) => {
  const relationTargetObjectMetadataNameSingular =
    fieldMetadataItem.relation?.targetObjectMetadata.nameSingular;

  if (!isDefined(relationTargetObjectMetadataNameSingular)) {
    return (
      <RelationFieldDiffValue
        beforeDisplayName={getRelationRecordId(fieldDiff.before)}
        afterDisplayName={getRelationRecordId(fieldDiff.after)}
      />
    );
  }

  return (
    <EventRelationFieldDiffValuesWithFetch
      fieldDiff={fieldDiff}
      relationTargetObjectMetadataNameSingular={
        relationTargetObjectMetadataNameSingular
      }
    />
  );
};

// filepath: src/modules/activities/timeline-activities/utils/relationFieldChangeValue.ts
export type RelationFieldChangeValue = {
  id: string | null;
};

export const isRelationFieldChangeValue = (
  value: unknown,
): value is RelationFieldChangeValue => {
  return (
    isDefined(value) &&
    typeof value === 'object' &&
    value !== null &&
    'id' in value
  );
};
```

## 2. 사용 예제

```tsx
// 사용 흐름: Field Diff Value Renderer 패턴을 실제 호출부에서 조합한다.

// filepath: src/modules/activities/timeline-activities/rows/main-object/components/EventRowMainObjectUpdated.tsx
export const EventRowMainObjectUpdated = ({
  event,
  mainObjectMetadataItem,
  authorFullName,
  labelIdentifierValue,
  eventTypeLabel,
  hasRenderer,
}: EventRowMainObjectUpdatedProps) => {
  const diff = event.properties.diff ?? {};
  const diffEntries = Object.entries(diff);

  if (diffEntries.length === 1) {
    return (
      <EventFieldDiffContainer
        mainObjectMetadataItem={mainObjectMetadataItem}
        diffKey={diffEntries[0][0]}
        fieldDiff={diffEntries[0][1]}
        eventId={event.id}
      />
    );
  }

  return (
    <>
      <span>{t`${diffEntries.length} fields on ${labelIdentifierValue}`}</span>
      {!hasRenderer && (
        <EventCardToggleButton isOpen={isOpen} setIsOpen={setIsOpen} />
      )}
      {diffEntries.length > 1 && !hasRenderer && (
        <EventCard isOpen={isOpen}>
          {diffEntries.map(([diffKey, diffValue]) => (
            <EventFieldDiffContainer
              key={diffKey}
              mainObjectMetadataItem={mainObjectMetadataItem}
              diffKey={diffKey}
              fieldDiff={diffValue}
              eventId={event.id}
            />
          ))}
        </EventCard>
      )}
    </>
  );
};
```
