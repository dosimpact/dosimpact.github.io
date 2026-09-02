# Junction Relation Resolver

many-to-many relation metadata를 picker/display/update가 사용할 수 있는 junction config로 바꾸는 패턴이다.

핵심은 `metadata resolution happens once, UI consumes target records`다.

## 1. 모듈 코드

- `src/modules/object-record/record-field/ui/utils/junction/getJunctionConfig.ts`: 현재 field settings와 relation metadata에서 junction object, source field, target field를 찾는다.
- `src/modules/object-record/record-field/ui/utils/junction/resolveJunctionConfig.ts`: forward 설정과 reverse 추론을 합쳐 valid/invalid/null config로 정규화한다.
- `src/modules/object-record/record-field/ui/utils/junction/getJunctionRelationPickerData.ts`: junction records를 picker의 selected morph items와 searchable objects로 변환한다.
- `src/modules/object-record/record-field/ui/hooks/useOpenJunctionRelationFieldInput.ts`: resolved config를 multiple record picker state에 주입하고 picker를 연다.
- `src/modules/object-record/record-field/ui/hooks/useUpdateJunctionRelationFromCell.ts`: picker change를 junction record create/delete와 local store update로 변환한다.

```tsx
// 큰 흐름: many-to-many relation metadata를 picker/display/update가 사용할 수 있는 junction config로 바꾸는 패턴이다.
// 핵심 기준: `metadata resolution happens once, UI consumes target records`다.

// filepath: src/modules/object-record/record-field/ui/utils/junction/getJunctionConfig.ts
export const getJunctionConfig = ({
  settings,
  relationObjectMetadataId,
  relationTargetFieldMetadataId,
  sourceObjectMetadataId,
  objectMetadataItems,
}: GetJunctionConfigArgs): JunctionConfig | null => {
  const junctionObjectMetadata = objectMetadataItems.find(
    (item) => item.id === relationObjectMetadataId,
  );

  if (!isDefined(junctionObjectMetadata)) {
    return null;
  }

  const configuredTargetField = hasJunctionTargetFieldId(settings)
    ? findFieldMetadataItemByFieldMetadataId({
        fieldMetadataItems: junctionObjectMetadata.fields,
        fieldMetadataId: settings.junctionTargetFieldId,
      })
    : undefined;

  const relationSourceField = isDefined(relationTargetFieldMetadataId)
    ? findFieldMetadataItemByFieldMetadataId({
        fieldMetadataItems: junctionObjectMetadata.fields,
        fieldMetadataId: relationTargetFieldMetadataId,
      })
    : undefined;

  const sourceField =
    relationSourceField ?? findSourceField(configuredTargetField?.id);

  const targetField = configuredTargetField ?? inferredMorphTargetField;

  if (!isDefined(targetField)) {
    return hasJunctionTargetFieldId(settings) ? invalidConfiguredJunction : null;
  }

  if (!isValidJunctionTargetField({ fieldMetadataItem: targetField })) {
    return hasJunctionTargetFieldId(settings) ? invalidConfiguredJunction : null;
  }

  return {
    junctionObjectMetadata,
    targetFields: [targetField],
    sourceField,
    isMorphRelation: targetField.type === FieldMetadataType.MORPH_RELATION,
    isValid: true,
  };
};

// filepath: src/modules/object-record/record-field/ui/utils/junction/resolveJunctionConfig.ts
export const resolveJunctionConfig = ({
  settings,
  relationObjectMetadataId,
  relationTargetFieldMetadataId,
  sourceObjectMetadataId,
  objectMetadataItems,
}: ResolveJunctionConfigArgs): ResolvedJunctionConfig | null => {
  const forwardJunctionConfig = getJunctionConfig({
    settings,
    relationObjectMetadataId,
    relationTargetFieldMetadataId,
    sourceObjectMetadataId,
    objectMetadataItems,
  });

  if (hasJunctionTargetFieldId(settings)) {
    return forwardJunctionConfig?.isValid
      ? toValidResolvedJunctionConfig(forwardJunctionConfig, 'forward')
      : getInvalidResolvedJunctionConfig({ direction: 'forward' });
  }

  const reverseJunctionResolution = resolveReverseJunctionConfig({
    junctionObjectMetadataId: relationObjectMetadataId,
    relationTargetFieldMetadataId,
    sourceObjectMetadataId,
    objectMetadataItems,
  });

  if (reverseJunctionResolution.status === 'resolved') {
    return toValidResolvedJunctionConfig(
      reverseJunctionResolution.junctionConfig,
      'reverse',
    );
  }

  return isDefined(forwardJunctionConfig)
    ? toValidResolvedJunctionConfig(forwardJunctionConfig, 'forward')
    : null;
};

// filepath: src/modules/object-record/record-field/ui/utils/junction/getJunctionRelationPickerData.ts
export const getJunctionRelationPickerData = ({
  junctionRecords,
  targetFields,
  objectMetadataItems,
}: {
  junctionRecords: ObjectRecord[] | undefined | null;
  targetFields: FieldMetadataItem[];
  objectMetadataItems: EnrichedObjectMetadataItem[];
}) => ({
  pickableMorphItems: extractTargetRecordsFromJunction({
    junctionRecords,
    targetFields,
    objectMetadataItems,
  }).map(({ recordId, objectMetadataId }) => ({
    recordId,
    objectMetadataId,
    isSelected: true,
    isMatchingSearchFilter: true,
  })),
  searchableObjectMetadataItems: getSearchableObjectMetadataItems(
    targetFields,
    objectMetadataItems,
  ),
});

// filepath: src/modules/object-record/record-field/ui/hooks/useOpenJunctionRelationFieldInput.ts
export const useOpenJunctionRelationFieldInput = () => {
  const openJunctionRelationFieldInput = ({ fieldDefinition, recordId, prefix }) => {
    const junctionConfig = resolveJunctionConfig({
      settings: fieldDefinition.metadata.settings,
      relationObjectMetadataId: fieldDefinition.metadata.relationObjectMetadataId,
      relationTargetFieldMetadataId: fieldDefinition.metadata.relationFieldMetadataId,
      sourceObjectMetadataId,
      objectMetadataItems,
    });

    if (!isUsableJunctionConfig(junctionConfig)) {
      return;
    }

    const recordPickerInstanceId = getRecordFieldInputInstanceId({
      recordId,
      fieldName: fieldDefinition.metadata.fieldName,
      prefix,
    });

    const { pickableMorphItems, searchableObjectMetadataItems } =
      getJunctionRelationPickerData({
        junctionRecords,
        targetFields: junctionConfig.targetFields,
        objectMetadataItems,
      });

    store.set(pickableMorphItemsState(recordPickerInstanceId), pickableMorphItems);
    store.set(searchableObjectMetadataItemsState(recordPickerInstanceId), searchableObjectMetadataItems);
    openMultipleRecordPicker(recordPickerInstanceId);
    performSearch({ multipleRecordPickerInstanceId: recordPickerInstanceId });
  };

  return { openJunctionRelationFieldInput };
};
```

## 2. 사용 예제

```tsx
// 사용 흐름: Junction Relation Resolver 패턴을 실제 호출부에서 조합한다.

// filepath: src/modules/object-record/record-field/ui/meta-types/input/components/RelationOneToManyFieldInput.tsx
const { updateJunctionRelationFromCell, junctionConfig } =
  useUpdateJunctionRelationFromCell({
    fieldMetadataItem,
    fieldDefinition: relationFieldDefinition,
    recordId,
  });

const isJunctionRelation = junctionConfig?.isValid === true;
const isInvalidJunctionRelation = junctionConfig?.isValid === false;

if (isInvalidJunctionRelation) {
  return null;
}

return (
  <MultipleRecordPicker
    focusId={instanceId}
    componentInstanceId={instanceId}
    onSubmit={handleSubmit}
    onChange={(morphItem) => {
      if (isJunctionRelation) {
        updateJunctionRelationFromCell({ morphItem });
      } else {
        updateRelation(morphItem);
      }
    }}
    onCreate={canCreateNew ? handleCreateNew : undefined}
    objectMetadataItemIdForCreate={objectMetadataItemIdForCreate}
    onClickOutside={handleSubmit}
  />
);

// filepath: src/modules/object-record/record-field/ui/meta-types/display/components/RelationFromManyFieldDisplay.tsx
const junctionConfig = resolveJunctionConfig({
  settings: fieldDefinition.metadata.settings,
  relationObjectMetadataId: fieldDefinition.metadata.relationObjectMetadataId,
  relationTargetFieldMetadataId: fieldDefinition.metadata.relationFieldMetadataId,
  sourceObjectMetadataId,
  objectMetadataItems,
});

if (isUsableJunctionConfig(junctionConfig)) {
  const targetRecordsWithMetadata = extractTargetRecordsFromJunction({
    junctionRecords: fieldValue,
    targetFields: junctionConfig.targetFields,
    objectMetadataItems,
    includeRecord: true,
  });

  return (
    <ExpandableList maxInlineCount={MAX_RELATION_CHIPS_DISPLAYED_INLINE}>
      {targetRecordsWithMetadata.map(({ record, objectMetadata }) => (
        <RecordChip
          key={record.id}
          objectNameSingular={objectMetadata.nameSingular}
          record={record}
        />
      ))}
    </ExpandableList>
  );
}
```
