# Column Definition From Metadata

object metadata readable fields를 table이 쓰는 column definition 배열로 변환하고 filter/sort 가능 여부를 붙이는 패턴이다.

핵심은 `field metadata becomes column state through one formatter and one availability pass`이다.

## 1. 모듈 코드

- `src/modules/object-metadata/hooks/useColumnDefinitionsFromObjectMetadata.ts`: readable active fields를 column definitions로 만들고 filter/sort capability를 붙인다.
- `src/modules/object-metadata/utils/formatFieldMetadataItemAsColumnDefinition.ts`: field definition에 table용 position/size/visibility 속성을 추가한다.
- `src/modules/object-record/utils/filterAvailableTableColumns.ts`: 테이블에 노출하지 않을 system column을 제거한다.
- `src/modules/object-record/record-table/types/ColumnDefinition.ts`: field definition과 table layout metadata를 합친 column type이다.
- `src/modules/object-record/record-index/hooks/useRecordIndexFieldMetadataDerivedStates.ts`: view field state와 metadata를 합쳐 id별 column definition map을 만든다.

```tsx
// filepath: src/modules/object-record/record-table/types/ColumnDefinition.ts
export type ColumnDefinition<TFieldMetadata extends FieldMetadata> =
  FieldDefinition<TFieldMetadata> & {
    size: number;
    position: number;
    isLabelIdentifier?: boolean;
    isVisible?: boolean;
    viewFieldId?: string;
    isFilterable?: boolean;
    isSortable?: boolean;
  };

// filepath: src/modules/object-metadata/utils/formatFieldMetadataItemAsColumnDefinition.ts
export const formatFieldMetadataItemAsColumnDefinition = ({
  position,
  field,
  objectMetadataItem,
  showLabel,
  labelWidth,
}: FieldMetadataItemAsColumnDefinitionProps): ColumnDefinition<FieldMetadata> => {
  const isLabelIdentifier = isLabelIdentifierField({
    fieldMetadataItem: field,
    objectMetadataItem,
  });

  return {
    ...formatFieldMetadataItemAsFieldDefinition({
      field,
      objectMetadataItem,
      showLabel,
      labelWidth,
    }),
    position: isLabelIdentifier ? 0 : position,
    size: 100,
    isLabelIdentifier,
    isVisible: true,
  };
};

// filepath: src/modules/object-record/utils/filterAvailableTableColumns.ts
export const filterAvailableTableColumns = (
  columnDefinition: ColumnDefinition<FieldMetadata>,
): boolean => {
  if (TABLE_COLUMNS_DENY_LIST.includes(columnDefinition.metadata.fieldName)) {
    return false;
  }

  return true;
};

// filepath: src/modules/object-metadata/hooks/useColumnDefinitionsFromObjectMetadata.ts
export const useColumnDefinitionsFromObjectMetadata = (
  objectMetadataItem: EnrichedObjectMetadataItem,
) => {
  const filterableFieldMetadataItems = useAtomFamilySelectorValue(
    availableFieldMetadataItemsForFilterFamilySelector,
    { objectMetadataItemId: objectMetadataItem.id },
  );
  const sortableFieldMetadataItems = useAtomFamilySelectorValue(
    availableFieldMetadataItemsForSortFamilySelector,
    { objectMetadataItemId: objectMetadataItem.id },
  );

  const columnDefinitions: ColumnDefinition<FieldMetadata>[] = useMemo(() => {
    const activeFieldMetadataItems = objectMetadataItem.readableFields.filter(
      (field) =>
        field.isActive &&
        (!isHiddenSystemField(field) ||
          field.id === objectMetadataItem.labelIdentifierFieldMetadataId),
    );

    return activeFieldMetadataItems
      .map((field, index) =>
        formatFieldMetadataItemAsColumnDefinition({
          position: index,
          field,
          objectMetadataItem,
        }),
      )
      .filter(filterAvailableTableColumns)
      .map((column) => {
        const isFilterable = filterableFieldMetadataItems.some(
          (fieldMetadataItem) =>
            fieldMetadataItem.id === column.fieldMetadataId,
        );
        const isSortable = sortableFieldMetadataItems.some(
          (fieldMetadataItem) =>
            fieldMetadataItem.id === column.fieldMetadataId,
        );

        return {
          ...column,
          isFilterable,
          isSortable,
        };
      });
  }, [
    filterableFieldMetadataItems,
    sortableFieldMetadataItems,
    objectMetadataItem,
  ]);

  return { columnDefinitions };
};

// filepath: src/modules/object-record/record-index/hooks/useRecordIndexFieldMetadataDerivedStates.ts
export const useRecordIndexFieldMetadataDerivedStates = (
  objectMetadataItem: EnrichedObjectMetadataItem | undefined,
  recordIndexId?: string,
) => {
  const currentRecordFields = useAtomComponentStateValue(
    currentRecordFieldsComponentState,
    recordIndexId,
  );

  const recordFieldByFieldMetadataItemId = Object.fromEntries(
    currentRecordFields.map((recordField) => [
      recordField.fieldMetadataItemId,
      recordField,
    ]),
  );

  const fieldDefinitionByFieldMetadataItemId = isDefined(objectMetadataItem)
    ? Object.fromEntries(
        objectMetadataItem.fields.map((fieldMetadataItem) => [
          fieldMetadataItem.id,
          formatFieldMetadataItemAsColumnDefinition({
            field: fieldMetadataItem,
            objectMetadataItem,
            position:
              recordFieldByFieldMetadataItemId[fieldMetadataItem.id]
                ?.position ?? 0,
            labelWidth:
              recordFieldByFieldMetadataItemId[fieldMetadataItem.id]?.size ?? 0,
          }),
        ]),
      )
    : {};

  return {
    recordFieldByFieldMetadataItemId,
    fieldDefinitionByFieldMetadataItemId,
  };
};
```

## 2. 사용 예제

```tsx
// filepath: src/modules/object-record/record-index/components/RecordIndexContainer.tsx
const { columnDefinitions } =
  useColumnDefinitionsFromObjectMetadata(objectMetadataItem);

return (
  <RecordTable
    objectMetadataItem={objectMetadataItem}
    columnDefinitions={columnDefinitions}
  />
);

// filepath: src/modules/object-record/record-table/record-table-header/components/RecordTableColumnHead.tsx
const correspondingFieldMetadataItem = useAtomFamilySelectorValue(
  fieldMetadataItemByIdSelector,
  { fieldMetadataItemId: recordField.fieldMetadataItemId },
);

const { getIcon } = useIcons();
const Icon = getIcon(
  correspondingFieldMetadataItem.foundFieldMetadataItem?.icon,
);

return (
  <StyledTitle className={RECORD_TABLE_CELL_CONTENT_CLASS_NAME}>
    <StyledIcon>
      <Icon size={theme.icon.size.md} />
    </StyledIcon>
    <StyledText>
      {correspondingFieldMetadataItem.foundFieldMetadataItem?.label}
    </StyledText>
  </StyledTitle>
);
```
