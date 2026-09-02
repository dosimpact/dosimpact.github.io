# Object Metadata Selector Formatter Hooks

object metadata와 field metadata를 select option, field definition, filterable field list로 바꾸는 selector/formatter hook 패턴이다.

핵심은 `metadata stays raw in stores, hooks format it at the UI boundary`이다.

## 1. 모듈 코드

- `src/modules/object-metadata/hooks/useObjectMetadataSelectHelpers.ts`: object metadata icon/color를 select item 렌더링 props로 변환한다.
- `src/modules/object-metadata/hooks/useObjectLabel.ts`: object label fallback을 한 곳에 둔다.
- `src/modules/object-metadata/utils/formatFieldMetadataItemInput.ts`: field metadata mutation input의 trim/null normalization을 담당한다.
- `src/modules/object-metadata/utils/formatFieldMetadataItemAsFieldDefinition.ts`: raw field metadata를 record field UI가 쓰는 `FieldDefinition`으로 변환한다.
- `src/modules/object-metadata/utils/formatFieldMetadataItemsAsFilterDefinitions.ts`: relation field에서 target object name을 꺼내 filter definition용 metadata를 보강한다.
- `src/modules/object-record/record-filter/hooks/useFilterableFieldMetadataItems.ts`: object id별 filterable field selector를 hook으로 감싼다.
- `src/modules/object-metadata/hooks/useAvailableFieldMetadataItems.ts`: active/readable/non-hidden field 목록을 UI용으로 필터링한다.

```tsx
// 큰 흐름: object metadata와 field metadata를 select option, field definition, filterable field list로 바꾸는 selector/formatter hook 패턴이다.
// 핵심 기준: `metadata stays raw in stores, hooks format it at the UI boundary`이다.

// filepath: src/modules/object-metadata/hooks/useObjectMetadataSelectHelpers.ts
export const useObjectMetadataSelectHelpers = () => {
  const { getIcon } = useIcons();

  const getSelectIconPropsFromObjectMetadataItem = (
    objectMetadataItem: ObjectMetadataItemForSelectIcon,
  ): { Icon: IconComponent; iconThemeColor: ThemeColor } => ({
    Icon: getIcon(objectMetadataItem.icon),
    iconThemeColor: getObjectColorWithFallback(objectMetadataItem),
  });

  return { getSelectIconPropsFromObjectMetadataItem };
};

// filepath: src/modules/object-metadata/hooks/useObjectLabel.ts
export const useObjectLabel = (
  objectMetadataItem: EnrichedObjectMetadataItem,
) => {
  return objectMetadataItem?.labelSingular ?? '';
};

// filepath: src/modules/object-metadata/utils/formatFieldMetadataItemInput.ts
export const formatFieldMetadataItemInput = (
  input: Partial<
    Pick<
      FieldMetadataItem,
      | 'name'
      | 'label'
      | 'icon'
      | 'description'
      | 'defaultValue'
      | 'type'
      | 'options'
      | 'settings'
      | 'isLabelSyncedWithName'
      | 'isUnique'
    >
  >,
) => {
  return {
    defaultValue: input.defaultValue,
    description: input.description?.trim() ?? null,
    icon: input.icon,
    label: input.label?.trim(),
    name: input.name?.trim(),
    options: input.options,
    settings: input.settings,
    isLabelSyncedWithName: input.isLabelSyncedWithName,
    isUnique: input.isUnique,
  };
};

// filepath: src/modules/object-metadata/utils/formatFieldMetadataItemAsFieldDefinition.ts
export const formatFieldMetadataItemAsFieldDefinition = ({
  field,
  objectMetadataItem,
  showLabel,
  labelWidth,
}: FieldMetadataItemAsFieldDefinitionProps): FieldDefinition<FieldMetadata> => {
  const relationObjectMetadataItem = field.relation?.targetObjectMetadata;
  const isRelation = field.type === FieldMetadataType.RELATION;
  const isMorphRelation = field.type === FieldMetadataType.MORPH_RELATION;

  const relationType = isRelation
    ? field.relation?.type
    : isMorphRelation
      ? field.morphRelations?.[0]?.type
      : undefined;

  const metadata = {
    fieldName: field.name,
    placeHolder: field.label,
    relationType,
    morphRelations: isMorphRelation ? field.morphRelations : [],
    relationFieldMetadataId: field.relation?.targetFieldMetadata.id,
    relationObjectMetadataNameSingular:
      relationObjectMetadataItem?.nameSingular ?? '',
    relationObjectMetadataNamePlural:
      relationObjectMetadataItem?.namePlural ?? '',
    relationObjectMetadataId: relationObjectMetadataItem?.id ?? '',
    objectMetadataNameSingular: objectMetadataItem.nameSingular ?? '',
    targetFieldMetadataName: field.relation?.targetFieldMetadata?.name ?? '',
    options: field.options,
    settings: field.settings,
    isNullable: field.isNullable,
    applicationId: field.applicationId,
    isUIEditable: field.isUIEditable ?? true,
  };

  return {
    fieldMetadataId: field.id,
    label: field.label,
    showLabel,
    labelWidth,
    type: field.type,
    metadata,
    iconName: field.icon ?? 'Icon123',
    defaultValue: field.defaultValue,
    editButtonIcon: getFieldButtonIcon({
      metadata,
      type: field.type,
    }),
  };
};

// filepath: src/modules/object-metadata/utils/formatFieldMetadataItemsAsFilterDefinitions.ts
export const getRelationObjectMetadataNameSingular = ({
  field,
}: {
  field: EnrichedObjectMetadataItem['fields'][0];
}): string | undefined => {
  return field.relation?.targetObjectMetadata.nameSingular;
};

// filepath: src/modules/object-record/record-filter/hooks/useFilterableFieldMetadataItems.ts
export const useFilterableFieldMetadataItems = (
  objectMetadataItemId: string,
) => {
  const filterableFieldMetadataItems = useAtomFamilySelectorValue(
    availableFieldMetadataItemsForFilterFamilySelector,
    { objectMetadataItemId },
  );

  return { filterableFieldMetadataItems };
};

// filepath: src/modules/object-metadata/hooks/useAvailableFieldMetadataItems.ts
export const useAvailableFieldMetadataItems = ({
  objectMetadataItemId,
}: {
  objectMetadataItemId: string;
}) => {
  const { objectMetadataItem } = useObjectMetadataItemById({
    objectId: objectMetadataItemId,
  });

  const availableFieldMetadataItems = useMemo(
    () =>
      objectMetadataItem.readableFields.filter((fieldMetadataItem) => {
        return (
          fieldMetadataItem.isActive &&
          !isHiddenSystemField(fieldMetadataItem) &&
          !TABLE_COLUMNS_DENY_LIST.includes(fieldMetadataItem.name)
        );
      }),
    [objectMetadataItem],
  );

  return { availableFieldMetadataItems };
};
```

## 2. 사용 예제

```tsx
// 사용 흐름: Object Metadata Selector Formatter Hooks 패턴을 실제 호출부에서 조합한다.

// filepath: src/modules/object-record/record-filter/hooks/useCreateEmptyRecordFilterFromFieldMetadataItem.ts
const createEmptyRecordFilterFromFieldMetadataItem = (
  fieldMetadataItem: FieldMetadataItem,
) => {
  const filterType = getFilterTypeFromFieldType(fieldMetadataItem.type);
  const operand = getRecordFilterOperands({
    filterType,
    subFieldName: null,
  })[0];

  const newRecordFilter: RecordFilter = {
    id: v4(),
    fieldMetadataId: fieldMetadataItem.id,
    operand,
    displayValue: '',
    label: fieldMetadataItem.label,
    type: filterType,
    value: '',
    subFieldName: null,
  };

  return { newRecordFilter };
};

// filepath: src/modules/object-record/record-field-list/components/RecordFieldList.tsx
const fieldDefinition = formatFieldMetadataItemAsFieldDefinition({
  field: fieldMetadataItem,
  objectMetadataItem,
  showLabel: true,
});

return (
  <FieldContext.Provider
    value={{
      recordId,
      fieldDefinition,
      isLabelIdentifier,
      isRecordFieldReadOnly,
    }}
  >
    <FieldDisplay />
  </FieldContext.Provider>
);
```
