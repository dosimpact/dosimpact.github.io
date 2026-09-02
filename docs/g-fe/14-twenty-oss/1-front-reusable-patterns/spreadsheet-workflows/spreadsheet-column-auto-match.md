# Spreadsheet Column Auto-Match

Imported header labels를 target fields에 fuzzy match하고, 자동 매칭 결과와 후보 목록을 Jotai state에 저장하는 패턴이다.

## 1. 모듈 코드

- `src/modules/spreadsheet-import/hooks/useComputeColumnSuggestionsAndAutoMatch.ts`: import context의 fields와 auto-map 설정을 읽고 match state를 계산한다.
- `src/modules/spreadsheet-import/utils/getMatchedColumnsWithFuse.ts`: Fuse.js로 header label과 field label을 비교하고 중복 매칭을 막는다.
- `src/modules/spreadsheet-import/steps/components/MatchColumnsStep/components/states/initialComputedColumnsState.ts`: header row에서 column state를 만들고 사용자가 수정한 mapping을 보존한다.
- `src/modules/spreadsheet-import/steps/components/UploadStep/UploadStep.tsx`: 단일 sheet 업로드 후 header row를 바로 auto-match한다.
- `src/modules/spreadsheet-import/steps/components/SelectHeaderStep/SelectHeaderStep.tsx`: 사용자가 header row를 고른 뒤 auto-match를 실행한다.

```tsx
// 큰 흐름: Imported header labels를 target fields에 fuzzy match하고, 자동 매칭 결과와 후보 목록을 Jotai state에 저장하는 패턴이다.

// filepath: src/modules/spreadsheet-import/steps/components/MatchColumnsStep/components/states/initialComputedColumnsState.ts
export const matchColumnsState = createAtomState<SpreadsheetColumns>({
  key: 'MatchColumnsState',
  defaultValue: [],
});

export const initialComputedColumnsSelector = createAtomWritableFamilySelector<
  SpreadsheetColumns,
  ImportedRow
>({
  key: 'initialComputedColumnsSelector',
  get:
    (headerValues) =>
    ({ get }) => {
      const currentState = get(matchColumnsState);

      if (currentState.length > 0) {
        return currentState;
      }

      return [...headerValues].map((value, index) => ({
        type: SpreadsheetColumnType.empty,
        index,
        header: value ?? '',
      }));
    },
  set:
    () =>
    ({ set }, newValue) => {
      set(matchColumnsState, newValue);
    },
});

// filepath: src/modules/spreadsheet-import/utils/getMatchedColumnsWithFuse.ts
export const getMatchedColumnsWithFuse = ({ columns, fields, data }: Args) => {
  const matchedColumns: SpreadsheetColumn[] = [];
  const fieldsToSearch = new Fuse(fields, {
    keys: ['label'],
    includeScore: true,
    ignoreLocation: true,
    threshold: 0.3,
  });

  const suggestedFieldsByColumnHeader: Record<string, SpreadsheetImportField[]> = {};

  for (const column of columns) {
    const fieldsThatMatch = fieldsToSearch.search(column.header);
    const firstMatch = fieldsThatMatch[0] ?? null;
    const secondMatch = fieldsThatMatch[1] ?? null;

    const isFirstMatchValid =
      isDefined(firstMatch?.item) &&
      isDefined(firstMatch?.score) &&
      firstMatch.score < 0.4 &&
      (!isDefined(secondMatch?.score) || secondMatch.score !== firstMatch.score);

    const isFieldStillUnmatched = !matchedColumns.some(
      (matchedColumn) =>
        'value' in matchedColumn && matchedColumn.value === firstMatch?.item?.key,
    );

    suggestedFieldsByColumnHeader[column.header] = fieldsThatMatch.map(
      (match) => match.item,
    );

    if (isFirstMatchValid && isFieldStillUnmatched) {
      matchedColumns.push(setColumn(column, firstMatch.item, data));
    } else {
      matchedColumns.push(column);
    }
  }

  return { matchedColumns, suggestedFieldsByColumnHeader };
};

// filepath: src/modules/spreadsheet-import/hooks/useComputeColumnSuggestionsAndAutoMatch.ts
export const useComputeColumnSuggestionsAndAutoMatch = () => {
  const store = useStore();
  const { spreadsheetImportFields: fields, autoMapHeaders } =
    useSpreadsheetImportInternal();

  const computeColumnSuggestionsAndAutoMatch = useCallback(
    async ({ headerValues, data }: { headerValues: ImportedRow; data: ImportedRow[] }) => {
      if (!autoMapHeaders) {
        return;
      }

      const columns = store.get(
        initialComputedColumnsSelector.selectorFamily(headerValues),
      );

      const { matchedColumns, suggestedFieldsByColumnHeader } =
        getMatchedColumnsWithFuse({ columns, fields, data });

      store.set(matchColumnsState.atom, matchedColumns);
      store.set(
        suggestedFieldsByColumnHeaderState.atom,
        suggestedFieldsByColumnHeader,
      );
    },
    [autoMapHeaders, fields, store],
  );

  return computeColumnSuggestionsAndAutoMatch;
};
```

## 2. 사용 예제

```tsx
// 사용 흐름: Spreadsheet Column Auto-Match 패턴을 실제 호출부에서 조합한다.

// filepath: src/modules/spreadsheet-import/steps/components/UploadStep/UploadStep.tsx
const computeColumnSuggestionsAndAutoMatch =
  useComputeColumnSuggestionsAndAutoMatch();

const mappedWorkbook = await uploadStepHook(mapWorkbook(workbook));
const trimmedData = mappedWorkbook.slice(1);

const { importedRows: data, headerRow: headerValues } =
  await selectHeaderStepHook(mappedWorkbook[0], trimmedData);

await computeColumnSuggestionsAndAutoMatch({
  headerValues,
  data,
});

setCurrentStepState({
  type: SpreadsheetImportStepType.matchColumns,
  data,
  headerValues,
});

// filepath: src/modules/spreadsheet-import/steps/components/SelectHeaderStep/SelectHeaderStep.tsx
const [selectedRowIndex] = Array.from(new Set(selectedRowIndexes));
const trimmedData = importedRows.slice(selectedRowIndex + 1);

const { importedRows: data, headerRow: headerValues } =
  await selectHeaderStepHook(importedRows[selectedRowIndex], trimmedData);

await computeColumnSuggestionsAndAutoMatch({
  headerValues,
  data,
});
```
