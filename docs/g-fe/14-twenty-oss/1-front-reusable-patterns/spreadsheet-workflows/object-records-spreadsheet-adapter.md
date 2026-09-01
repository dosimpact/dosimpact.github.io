# Object Records Spreadsheet Adapter

Generic spreadsheet importer를 object metadata, field metadata, relation mapping, batch create mutation에 연결하는 domain adapter 패턴이다.

## 1. 모듈 코드

- `src/modules/object-record/spreadsheet-import/hooks/useOpenObjectRecordsSpreadsheetImportDialog.ts`: object name을 받아 spreadsheet import dialog options와 batch create submit handler를 조립한다.
- `src/modules/object-record/spreadsheet-import/hooks/useBuildSpreadSheetImportFields.ts`: field metadata를 importer가 이해하는 flat field config로 변환한다.
- `src/modules/object-record/spreadsheet-import/utils/buildRecordFromImportedStructuredRow.ts`: validated structured row를 record create input으로 변환한다.
- `src/modules/object-record/spreadsheet-import/utils/spreadsheetImportFilterAvailableFieldMetadataItems.ts`: import 가능한 field metadata만 남긴다.
- `src/modules/object-record/spreadsheet-import/utils/spreadsheetImportGetUnicityTableHook.ts`: object unique constraint 기반으로 import row 중복 검사를 붙인다.

```tsx
// filepath: src/modules/object-record/spreadsheet-import/hooks/useOpenObjectRecordsSpreadsheetImportDialog.ts
export const useOpenObjectRecordsSpreadsheetImportDialog = (
  objectNameSingular: string,
) => {
  const apolloCoreClient = useApolloCoreClient();
  const { openSpreadsheetImportDialog } = useOpenSpreadsheetImportDialog();
  const { buildSpreadsheetImportFields } = useBuildSpreadsheetImportFields();
  const { objectMetadataItem } = useObjectMetadataItem({ objectNameSingular });
  const abortController = new AbortController();

  const { batchCreateManyRecords } = useBatchCreateManyRecords({
    objectNameSingular,
    recordGqlFields,
    mutationBatchSize: SPREADSHEET_IMPORT_CREATE_RECORDS_BATCH_SIZE,
    setBatchedRecordsCount: setSpreadsheetImportCreatedRecordsProgress,
    abortController,
  });

  const openObjectRecordsSpreadsheetImportDialog = (options?: Options) => {
    const availableFieldMetadataItems =
      spreadsheetImportFilterAvailableFieldMetadataItems(
        objectMetadataItem.updatableFields,
      );

    const spreadsheetImportFields =
      buildSpreadsheetImportFields(availableFieldMetadataItems);

    openSpreadsheetImportDialog({
      ...options,
      spreadsheetImportFields,
      availableFieldMetadataItems,
      tableHook: spreadsheetImportGetUnicityTableHook(objectMetadataItem),
      onAbortSubmit: () => {
        abortController.abort();
      },
      onSubmit: async (data) => {
        const createInputs = data.validStructuredRows.map((row) =>
          buildRecordFromImportedStructuredRow({
            importedStructuredRow: row,
            fieldMetadataItems: availableFieldMetadataItems,
            spreadsheetImportFields,
          }),
        );

        await batchCreateManyRecords({
          recordsToCreate: createInputs,
          upsert: true,
        });

        await apolloCoreClient.refetchQueries({
          updateCache: (cache) => {
            cache.evict({ fieldName: objectMetadataItem.namePlural });
          },
        });
      },
    });
  };

  return { openObjectRecordsSpreadsheetImportDialog };
};

// filepath: src/modules/object-record/spreadsheet-import/hooks/useBuildSpreadSheetImportFields.ts
export const useBuildSpreadsheetImportFields = () => {
  const { getIcon } = useIcons();
  const objectMetadataItems = useAtomStateValue(objectMetadataItemsSelector);

  const createBaseField = (
    fieldMetadataItem: FieldMetadataItem,
    overrides: Partial<SpreadsheetImportField> = {},
  ): SpreadsheetImportField => ({
    Icon: getIcon(fieldMetadataItem.icon),
    label: fieldMetadataItem.label,
    key: fieldMetadataItem.name,
    fieldMetadataItemId: fieldMetadataItem.id,
    fieldType: { type: 'input' },
    fieldMetadataType: fieldMetadataItem.type,
    fieldValidationDefinitions: getSpreadSheetFieldValidationDefinitions(
      fieldMetadataItem.type,
      fieldMetadataItem.label,
    ),
    isNestedField: false,
    ...overrides,
  });

  const buildSpreadsheetImportField = (fieldMetadataItem: FieldMetadataItem) => {
    switch (fieldMetadataItem.type) {
      case FieldMetadataType.ADDRESS:
      case FieldMetadataType.CURRENCY:
      case FieldMetadataType.EMAILS:
      case FieldMetadataType.FULL_NAME:
      case FieldMetadataType.LINKS:
      case FieldMetadataType.PHONES:
      case FieldMetadataType.RICH_TEXT:
        return handleCompositeFields(fieldMetadataItem);
      case FieldMetadataType.RELATION:
        return handleRelationField(fieldMetadataItem, objectMetadataItems);
      case FieldMetadataType.SELECT:
      case FieldMetadataType.MULTI_SELECT:
        return [createBaseField(fieldMetadataItem, { fieldType: buildSelectType(fieldMetadataItem) })];
      case FieldMetadataType.BOOLEAN:
        return [createBaseField(fieldMetadataItem, { fieldType: { type: 'checkbox' } })];
      case FieldMetadataType.DATE:
      case FieldMetadataType.DATE_TIME:
      case FieldMetadataType.NUMBER:
      case FieldMetadataType.TEXT:
      case FieldMetadataType.UUID:
        return [createBaseField(fieldMetadataItem)];
      default:
        return [];
    }
  };

  const buildSpreadsheetImportFields = (fieldMetadataItems: FieldMetadataItem[]) =>
    fieldMetadataItems
      .filter((field) => field.type !== FieldMetadataType.ACTOR)
      .flatMap((fieldMetadataItem) => buildSpreadsheetImportField(fieldMetadataItem));

  return { buildSpreadsheetImportFields };
};

// filepath: src/modules/object-record/spreadsheet-import/utils/buildRecordFromImportedStructuredRow.ts
export const buildRecordFromImportedStructuredRow = ({
  fieldMetadataItems,
  importedStructuredRow,
  spreadsheetImportFields,
}: Args) => {
  const recordToBuild: Record<string, unknown> = {};

  for (const field of fieldMetadataItems) {
    const importedFieldValue = importedStructuredRow[field.name];

    switch (field.type) {
      case FieldMetadataType.CURRENCY:
      case FieldMetadataType.ADDRESS:
      case FieldMetadataType.EMAILS:
      case FieldMetadataType.FULL_NAME:
      case FieldMetadataType.LINKS:
      case FieldMetadataType.PHONES:
        recordToBuild[field.name] = buildCompositeFieldRecord(
          field,
          importedStructuredRow,
          COMPOSITE_FIELD_TRANSFORM_CONFIGS[field.type],
        );
        break;
      case FieldMetadataType.BOOLEAN:
        if (isDefined(importedFieldValue)) {
          recordToBuild[field.name] =
            importedFieldValue === 'true' || importedFieldValue === true;
        }
        break;
      case FieldMetadataType.NUMBER:
      case FieldMetadataType.NUMERIC:
        if (isDefined(importedFieldValue)) {
          recordToBuild[field.name] = Number(importedFieldValue);
        }
        break;
      case FieldMetadataType.RELATION:
        recordToBuild[field.name] = buildRelationConnectFieldRecord(
          field,
          importedStructuredRow,
          spreadsheetImportFields,
          COMPOSITE_FIELD_TRANSFORM_CONFIGS,
        );
        break;
      case FieldMetadataType.ARRAY:
      case FieldMetadataType.MULTI_SELECT:
        if (isDefined(importedFieldValue)) {
          recordToBuild[field.name] = stringArrayJSONSchema.parse(importedFieldValue);
        }
        break;
      case FieldMetadataType.DATE:
      case FieldMetadataType.DATE_TIME:
        if (isNonEmptyString(importedFieldValue)) {
          recordToBuild[field.name] = new Date(importedFieldValue).toISOString();
        }
        break;
      case FieldMetadataType.SELECT:
      case FieldMetadataType.RATING:
      case FieldMetadataType.TEXT:
      case FieldMetadataType.UUID:
        if (isDefined(importedFieldValue)) {
          recordToBuild[field.name] = importedFieldValue;
        }
        break;
    }
  }

  return recordToBuild;
};
```

## 2. 사용 예제

```tsx
// Any object index action component
export const ImportPeopleButton = () => {
  const { openObjectRecordsSpreadsheetImportDialog } =
    useOpenObjectRecordsSpreadsheetImportDialog('person');

  return (
    <Button
      title="Import"
      onClick={() => {
        openObjectRecordsSpreadsheetImportDialog({
          initialStepState: {
            type: SpreadsheetImportStepType.upload,
          },
        });
      }}
    />
  );
};

// The adapter will submit validated rows as object record create inputs.
const createInputs = data.validStructuredRows.map((row) =>
  buildRecordFromImportedStructuredRow({
    importedStructuredRow: row,
    fieldMetadataItems: availableFieldMetadataItems,
    spreadsheetImportFields,
  }),
);

await batchCreateManyRecords({
  recordsToCreate: createInputs,
  upsert: true,
});
```
