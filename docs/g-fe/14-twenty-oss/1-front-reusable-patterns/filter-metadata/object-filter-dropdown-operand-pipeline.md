# Object Filter Dropdown Operand Pipeline

object filter dropdown이 선택된 field metadata, operand, typed value input을 하나의 `RecordFilter`로 upsert하는 패턴이다.

핵심은 `operand changes own value shape, value changes lazily create the filter`이다.

## 1. 모듈 코드

- `src/modules/object-record/object-filter-dropdown/components/ObjectFilterDropdownFilterInput.tsx`: field filter type과 operand를 보고 value input 컴포넌트를 고른다.
- `src/modules/object-record/object-filter-dropdown/components/ObjectFilterDropdownInnerSelectOperandDropdown.tsx`: effective field에서 operand options를 만들고 selected operand를 변경한다.
- `src/modules/object-record/object-filter-dropdown/hooks/useApplyObjectFilterDropdownOperand.ts`: operand 변경 시 valueless/date/relative-date value shape를 보정한다.
- `src/modules/object-record/object-filter-dropdown/hooks/useApplyObjectFilterDropdownFilterValue.ts`: value 입력 시 아직 filter가 없으면 현재 dropdown state에서 filter를 생성한다.
- `src/modules/object-record/record-filter/hooks/useCreateRecordFilterFromObjectFilterDropdownCurrentStates.ts`: field, operand, sub-field state를 `RecordFilter` 초깃값으로 변환한다.
- `src/modules/object-record/record-filter/utils/getRecordFilterOperands.ts`: shared filter type/sub-field 규칙에서 허용 operand 목록을 가져온다.

```tsx
// filepath: src/modules/object-record/object-filter-dropdown/components/ObjectFilterDropdownFilterInput.tsx
export const ObjectFilterDropdownFilterInput = ({
  filterDropdownId,
  recordFilterId,
}: ObjectFilterDropdownFilterInputProps) => {
  const fieldMetadataItemUsedInDropdown = useAtomComponentSelectorValue(
    fieldMetadataItemUsedInDropdownComponentSelector,
  );
  const selectedOperandInDropdown = useAtomComponentStateValue(
    selectedOperandInDropdownComponentState,
  );

  const isOperandWithFilterValue =
    selectedOperandInDropdown &&
    [
      ViewFilterOperand.IS,
      ViewFilterOperand.IS_NOT,
      ViewFilterOperand.LESS_THAN_OR_EQUAL,
      ViewFilterOperand.GREATER_THAN_OR_EQUAL,
      ViewFilterOperand.IS_BEFORE,
      ViewFilterOperand.IS_AFTER,
      ViewFilterOperand.CONTAINS,
      ViewFilterOperand.DOES_NOT_CONTAIN,
      ViewFilterOperand.IS_RELATIVE,
    ].includes(selectedOperandInDropdown);

  if (!isDefined(fieldMetadataItemUsedInDropdown)) {
    return null;
  }

  const filterType = getFilterTypeFromFieldType(
    fieldMetadataItemUsedInDropdown.type,
  );

  if (!isOperandWithFilterValue) {
    return <ObjectFilterDropdownInnerSelectOperandDropdown />;
  }

  return (
    <>
      <ObjectFilterDropdownInnerSelectOperandDropdown />
      <DropdownMenuSeparator />
      {filterType === 'DATE' && <ObjectFilterDropdownDateInput />}
      {filterType === 'DATE_TIME' &&
        (selectedOperandInDropdown === ViewFilterOperand.IS ? (
          <ObjectFilterDropdownDateInput />
        ) : (
          <ObjectFilterDropdownDateTimeInput />
        ))}
      {TEXT_FILTER_TYPES.includes(filterType) && (
        <ObjectFilterDropdownTextInput filterDropdownId={filterDropdownId} />
      )}
      {NUMBER_FILTER_TYPES.includes(filterType) && (
        <ObjectFilterDropdownNumberInput filterDropdownId={filterDropdownId} />
      )}
      {filterType === 'RELATION' && (
        <>
          <ObjectFilterDropdownSearchInput />
          <DropdownMenuSeparator />
          <ObjectFilterDropdownRecordSelect
            recordFilterId={recordFilterId}
            dropdownId={filterDropdownId}
          />
        </>
      )}
      {['SELECT', 'MULTI_SELECT'].includes(filterType) && (
        <>
          <ObjectFilterDropdownSearchInput />
          <DropdownMenuSeparator />
          <ObjectFilterDropdownOptionSelect focusId={filterDropdownId} />
        </>
      )}
      {filterType === 'BOOLEAN' && <ObjectFilterDropdownBooleanSelect />}
    </>
  );
};

// filepath: src/modules/object-record/object-filter-dropdown/components/ObjectFilterDropdownInnerSelectOperandDropdown.tsx
export const ObjectFilterDropdownInnerSelectOperandDropdown = () => {
  const selectedOperandInDropdown = useAtomComponentStateValue(
    selectedOperandInDropdownComponentState,
  );
  const fieldMetadataItemUsedInDropdown = useAtomComponentSelectorValue(
    fieldMetadataItemUsedInDropdownComponentSelector,
  );
  const relationTargetFieldMetadataIdUsedInDropdown =
    useAtomComponentStateValue(
      relationTargetFieldMetadataIdUsedInDropdownComponentState,
    );

  const effectiveFieldMetadataItem = isDefined(
    relationTargetFieldMetadataIdUsedInDropdown,
  )
    ? relationTargetFieldMetadataItem
    : fieldMetadataItemUsedInDropdown;

  const operandsForFilterType = isDefined(effectiveFieldMetadataItem)
    ? getRecordFilterOperands({
        filterType: getFilterTypeFromFieldType(effectiveFieldMetadataItem.type),
        subFieldName: subFieldNameUsedInDropdown,
      })
    : [];

  const options = operandsForFilterType.map((operand) => ({
    label: getOperandLabel(operand, timeZoneAbbreviation),
    value: operand,
  })) as SelectOption[];

  const { applyObjectFilterDropdownOperand } =
    useApplyObjectFilterDropdownOperand();

  return (
    <DropdownMenuInnerSelect
      dropdownId="object-filter-dropdown-inner-select-operand-dropdown"
      selectedOption={
        options.find((option) => option.value === selectedOperandInDropdown) ??
        options[0]
      }
      onChange={(newOperandOption) =>
        applyObjectFilterDropdownOperand(
          newOperandOption.value as RecordFilterOperand,
        )
      }
      options={options}
      widthInPixels={widthInPixels}
    />
  );
};

// filepath: src/modules/object-record/object-filter-dropdown/hooks/useApplyObjectFilterDropdownOperand.ts
export const useApplyObjectFilterDropdownOperand = () => {
  const objectFilterDropdownCurrentRecordFilter = useAtomComponentStateValue(
    objectFilterDropdownCurrentRecordFilterComponentState,
  );
  const fieldMetadataItemUsedInDropdown = useAtomComponentSelectorValue(
    fieldMetadataItemUsedInDropdownComponentSelector,
  );
  const { upsertObjectFilterDropdownCurrentFilter } =
    useUpsertObjectFilterDropdownCurrentFilter();
  const { createEmptyRecordFilterFromFieldMetadataItem } =
    useCreateEmptyRecordFilterFromFieldMetadataItem();

  const applyObjectFilterDropdownOperand = (
    newOperand: RecordFilterOperand,
  ) => {
    const isValuelessOperand = [
      RecordFilterOperand.IS_EMPTY,
      RecordFilterOperand.IS_NOT_EMPTY,
      RecordFilterOperand.IS_IN_PAST,
      RecordFilterOperand.IS_IN_FUTURE,
      RecordFilterOperand.IS_TODAY,
    ].includes(newOperand);

    let recordFilterToUpsert: RecordFilter | null | undefined = null;

    if (isDefined(objectFilterDropdownCurrentRecordFilter)) {
      recordFilterToUpsert = {
        ...objectFilterDropdownCurrentRecordFilter,
        operand: newOperand,
      };
    } else if (isValuelessOperand && isDefined(fieldMetadataItemUsedInDropdown)) {
      const { newRecordFilter } = createEmptyRecordFilterFromFieldMetadataItem(
        fieldMetadataItemUsedInDropdown,
      );
      recordFilterToUpsert = { ...newRecordFilter, operand: newOperand };
    }

    if (
      isDefined(recordFilterToUpsert) &&
      (recordFilterToUpsert.type === 'DATE' ||
        recordFilterToUpsert.type === 'DATE_TIME')
    ) {
      recordFilterToUpsert.value = computeDateValueForOperand({
        recordFilter: recordFilterToUpsert,
        newOperand,
      });
    }

    if (isDefined(recordFilterToUpsert)) {
      upsertObjectFilterDropdownCurrentFilter(recordFilterToUpsert);
    }

    setSelectedOperandInDropdown(newOperand);
  };

  return { applyObjectFilterDropdownOperand };
};

// filepath: src/modules/object-record/object-filter-dropdown/hooks/useApplyObjectFilterDropdownFilterValue.ts
export const useApplyObjectFilterDropdownFilterValue = () => {
  const store = useStore();
  const { createRecordFilterFromObjectFilterDropdownCurrentStates } =
    useCreateRecordFilterFromObjectFilterDropdownCurrentStates();
  const { upsertObjectFilterDropdownCurrentFilter } =
    useUpsertObjectFilterDropdownCurrentFilter();

  const applyObjectFilterDropdownFilterValue = useCallback(
    (newFilterValue: string, newDisplayValue?: string) => {
      const existingRecordFilter = store.get(
        objectFilterDropdownCurrentRecordFilter,
      ) as RecordFilter | undefined | null;

      if (!isDefined(existingRecordFilter)) {
        const { newRecordFilterFromObjectFilterDropdownStates } =
          createRecordFilterFromObjectFilterDropdownCurrentStates();

        upsertObjectFilterDropdownCurrentFilter({
          ...newRecordFilterFromObjectFilterDropdownStates,
          value: newFilterValue,
          displayValue: newDisplayValue ?? newFilterValue,
        });
      } else {
        upsertObjectFilterDropdownCurrentFilter({
          ...existingRecordFilter,
          value: newFilterValue,
          displayValue: newDisplayValue ?? newFilterValue,
        });
      }
    },
    [createRecordFilterFromObjectFilterDropdownCurrentStates, store],
  );

  return { applyObjectFilterDropdownFilterValue };
};

// filepath: src/modules/object-record/record-filter/hooks/useCreateRecordFilterFromObjectFilterDropdownCurrentStates.ts
export const useCreateRecordFilterFromObjectFilterDropdownCurrentStates = () => {
  const store = useStore();

  const createRecordFilterFromObjectFilterDropdownCurrentStates =
    useCallback(() => {
      const fieldMetadataItemUsedInDropdown = store.get(
        fieldMetadataItemUsedInDropdownCallbackState,
      );
      const selectedOperandInDropdown = store.get(
        selectedOperandInDropdownCallbackState,
      );
      const subFieldNameUsedInDropdown = store.get(
        subFieldNameUsedInDropdownCallbackState,
      );

      if (!isDefined(fieldMetadataItemUsedInDropdown)) {
        throw new Error('Field metadata item is required');
      }

      if (!isDefined(selectedOperandInDropdown)) {
        throw new Error('Selected operand is required');
      }

      const filterType = getFilterTypeFromFieldType(
        fieldMetadataItemUsedInDropdown.type,
      );

      const newRecordFilterFromObjectFilterDropdownStates: RecordFilter = {
        id: v4(),
        fieldMetadataId: fieldMetadataItemUsedInDropdown.id,
        operand: selectedOperandInDropdown,
        displayValue: '',
        label: fieldMetadataItemUsedInDropdown.label,
        type: filterType,
        value: '',
        subFieldName: subFieldNameUsedInDropdown,
      };

      return { newRecordFilterFromObjectFilterDropdownStates };
    }, [store]);

  return { createRecordFilterFromObjectFilterDropdownCurrentStates };
};

// filepath: src/modules/object-record/record-filter/utils/getRecordFilterOperands.ts
export const getRecordFilterOperands = ({
  filterType,
  subFieldName,
}: {
  filterType: FilterableAndTSVectorFieldType;
  subFieldName?: string | null;
}): readonly RecordFilterOperand[] => {
  return getFilterOperandsForFilterableFieldType({
    filterType,
    subFieldName,
  });
};
```

## 2. 사용 예제

```tsx
// filepath: src/modules/object-record/object-filter-dropdown/components/ObjectFilterDropdownTextInput.tsx
const { applyObjectFilterDropdownFilterValue } =
  useApplyObjectFilterDropdownFilterValue();

const handleChange = (newValue: string) => {
  applyObjectFilterDropdownFilterValue(newValue);
};

return (
  <TextInput
    value={currentFilterValue}
    onChange={handleChange}
    autoFocus
  />
);

// filepath: src/modules/object-record/object-filter-dropdown/components/ObjectFilterDropdownOptionSelect.tsx
const { applyObjectFilterDropdownFilterValue } =
  useApplyObjectFilterDropdownFilterValue();

const handleOptionSelect = (selectedOption: SelectableItem) => {
  applyObjectFilterDropdownFilterValue(
    selectedOption.value,
    selectedOption.label,
  );
};
```
