# Spreadsheet Validation Pipeline

Imported rows에 table hook, row hook, field validation을 순서대로 적용하고 UI에서 수정, 필터, 제출 분기를 처리하는 패턴이다.

## 1. 모듈 코드

- `src/modules/spreadsheet-import/utils/dataMutations.ts`: hook validation과 built-in validation을 실행해 row별 `__errors` metadata를 붙인다.
- `src/modules/spreadsheet-import/utils/findUnmatchedRequiredFields.ts`: match columns 단계에서 required field가 매칭되지 않은 경우를 찾아낸다.
- `src/modules/spreadsheet-import/steps/components/MatchColumnsStep/MatchColumnsStep.tsx`: unmatched required fields를 dialog로 확인한 뒤 validation step으로 넘긴다.
- `src/modules/spreadsheet-import/steps/components/ValidationStep/ValidationStep.tsx`: editable table에서 rows를 재검증하고 valid/invalid rows로 나누어 submit한다.

```tsx
// 큰 흐름: Imported rows에 table hook, row hook, field validation을 순서대로 적용하고 UI에서 수정, 필터, 제출 분기를 처리하는 패턴이다.

// filepath: src/modules/spreadsheet-import/utils/dataMutations.ts
export const addErrorsAndRunHooks = (
  data: (ImportedStructuredRow & Partial<ImportedStructuredRowMetadata>)[],
  fields: SpreadsheetImportFields,
  rowHook?: SpreadsheetImportRowHook,
  tableHook?: SpreadsheetImportTableHook,
) => {
  const errors: Errors = {};

  const addHookError = (rowIndex: number, fieldKey: string, error: SpreadsheetImportInfo) => {
    errors[rowIndex] = {
      ...errors[rowIndex],
      [fieldKey]: error,
    };
  };

  if (isDefined(tableHook)) {
    data = tableHook(data, addHookError);
  }

  if (isDefined(rowHook)) {
    data = data.map((row, index) =>
      rowHook(row, (...props) => addHookError(index, ...props), data),
    );
  }

  fields.forEach((field) => {
    field.fieldValidationDefinitions?.forEach((validation) => {
      switch (validation.rule) {
        case 'unique': {
          const values = data.map((row) => row[field.key]);
          const taken = new Set();
          const duplicates = new Set();

          values.forEach((value) => {
            if (validation.allowEmpty === true && !value) {
              return;
            }
            taken.has(value) ? duplicates.add(value) : taken.add(value);
          });

          values.forEach((value, index) => {
            if (duplicates.has(value)) {
              errors[index] = {
                ...errors[index],
                [field.key]: {
                  level: validation.level || 'error',
                  message: validation.errorMessage || 'Field must be unique',
                },
              };
            }
          });
          break;
        }
        case 'required':
          data.forEach((row, index) => {
            if (row[field.key] === null || row[field.key] === undefined || row[field.key] === '') {
              errors[index] = {
                ...errors[index],
                [field.key]: {
                  level: validation.level || 'error',
                  message: validation.errorMessage || 'Field is required',
                },
              };
            }
          });
          break;
        case 'regex':
        case 'function':
          data.forEach((row, index) => {
            const value = row[field.key]?.toString();
            const isInvalid =
              validation.rule === 'regex'
                ? isNonEmptyString(value) &&
                  !value.match(new RegExp(validation.value, validation.flags))
                : isNonEmptyString(value) && !validation.isValid(value);

            if (isInvalid) {
              errors[index] = {
                ...errors[index],
                [field.key]: {
                  level: validation.level || 'error',
                  message: validation.errorMessage || 'Field is invalid',
                },
              };
            }
          });
          break;
      }
    });
  });

  return data.map((row, index) => {
    if (!('__index' in row)) {
      row.__index = v4();
    }

    if (isDefined(errors[index])) {
      return { ...row, __errors: errors[index] };
    }

    if (isDefined(row.__errors)) {
      return { ...row, __errors: null };
    }

    return row;
  });
};

// filepath: src/modules/spreadsheet-import/utils/findUnmatchedRequiredFields.ts
export const findUnmatchedRequiredFields = (
  fields: SpreadsheetImportFields,
  columns: SpreadsheetColumns,
) =>
  fields
    .filter((field) =>
      field.fieldValidationDefinitions?.some(
        (validation) => validation.rule === 'required',
      ),
    )
    .filter(
      (field) =>
        columns.findIndex(
          (column) => 'value' in column && column.value === field.key,
        ) === -1,
    )
    .map((field) => field.label);

// filepath: src/modules/spreadsheet-import/steps/components/ValidationStep/ValidationStep.tsx
export const ValidationStep = ({ initialData, importedColumns, file, onBack }: Props) => {
  const { spreadsheetImportFields: fields, onSubmit, onClose, rowHook, tableHook } =
    useSpreadsheetImportInternal();

  const [data, setData] = useState(
    addErrorsAndRunHooks(initialData, fields, rowHook, tableHook),
  );
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [filterByErrors, setFilterByErrors] = useState(false);

  const updateData = (rows: typeof data) => {
    setData(addErrorsAndRunHooks(rows, fields, rowHook, tableHook));
  };

  const tableData = filterByErrors
    ? data.filter((row) =>
        Object.values(row.__errors ?? {}).some((error) => error.level === 'error'),
      )
    : data;

  const submitData = async () => {
    const calculatedData = data.reduce(
      (acc, row) => {
        const { __index, __errors, ...values } = row;
        const hasError = Object.values(__errors ?? {}).some(
          (error) => error.level === 'error',
        );

        if (hasError) {
          acc.invalidStructuredRows.push(values);
        } else {
          acc.validStructuredRows.push(values);
        }

        return acc;
      },
      { validStructuredRows: [], invalidStructuredRows: [], allStructuredRows: data },
    );

    await onSubmit(calculatedData, file);
    onClose();
  };

  return (
    <>
      <SpreadsheetImportTable
        rows={tableData}
        onRowsChange={updateData}
        columns={generateColumns(fields).filter((column) =>
          importedColumns.some(
            (importedColumn) => 'value' in importedColumn && importedColumn.value === column.key,
          ),
        )}
        selectedRows={selectedRows}
        onSelectedRowsChange={setSelectedRows}
      />
      <Toggle value={filterByErrors} onChange={() => setFilterByErrors(!filterByErrors)} />
      <StepNavigationButton onContinue={submitData} onBack={onBack} />
    </>
  );
};
```

## 2. 사용 예제

```tsx
// 사용 흐름: Spreadsheet Validation Pipeline 패턴을 실제 호출부에서 조합한다.

// filepath: src/modules/spreadsheet-import/steps/components/MatchColumnsStep/MatchColumnsStep.tsx
const unmatchedRequiredFields = useMemo(
  () => findUnmatchedRequiredFields(fields, columns),
  [fields, columns],
);

const handleOnContinue = async () => {
  if (unmatchedRequiredFields.length > 0) {
    enqueueDialog({
      title: 'Not all columns matched',
      message: 'There are required columns that are not matched or ignored.',
      buttons: [
        { title: 'Cancel' },
        { title: 'Continue', onClick: handleAlertOnContinue },
      ],
    });
    return;
  }

  await handleContinue(normalizeTableData(columns, data, fields), data, columns);
};

// filepath: src/modules/spreadsheet-import/steps/components/ValidationStep/ValidationStep.tsx
const onContinue = () => {
  const invalidData = data.find((row) =>
    Object.values(row.__errors ?? {}).some((error) => error.level === 'error'),
  );

  if (!invalidData) {
    submitData();
    return;
  }

  enqueueDialog({
    title: 'Finish flow with errors',
    message: 'Rows with errors will be ignored when submitting.',
    buttons: [{ title: 'Cancel' }, { title: 'Submit', onClick: submitData }],
  });
};
```
