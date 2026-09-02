# Advanced Filter Builder Pipeline

advanced filter row가 field 선택, composite sub-field 선택, relation target field 선택을 같은 `RecordFilter` draft/upsert pipeline으로 정규화하는 패턴이다.

핵심은 `row owns an instance id, apply hooks normalize every selection into a RecordFilter`이다.

## 1. 모듈 코드

- `src/modules/object-record/advanced-filter/components/AdvancedFilterRecordFilterRow.tsx`: row별 dropdown instance id를 만들고 field, operand, value, options cell을 조합한다.
- `src/modules/object-record/advanced-filter/hooks/useSetRecordFilterUsedInAdvancedFilterDropdownRow.ts`: 저장된 `RecordFilter`를 object filter dropdown state들로 hydrate한다.
- `src/modules/object-record/advanced-filter/hooks/useApplyAdvancedFilterSourceField.ts`: source field 선택을 기본 operand/value가 있는 `RecordFilter`로 변환한다.
- `src/modules/object-record/advanced-filter/hooks/useApplyAdvancedFilterCompositeSubField.ts`: composite source field와 sub-field 선택을 `RecordFilter.subFieldName`으로 반영한다.
- `src/modules/object-record/advanced-filter/hooks/useApplyAdvancedFilterRelationTargetField.ts`: relation source field와 target field 선택을 relation traversal filter로 반영한다.
- `src/modules/object-record/advanced-filter/components/AdvancedFilterValueInput.tsx`: operand가 value를 요구할 때 text input 또는 typed dropdown input을 선택한다.

```tsx
// 큰 흐름: advanced filter row가 field 선택, composite sub-field 선택, relation target field 선택을 같은 `RecordFilter` draft/upsert pipeline으로 정규화하는 패턴이다.
// 핵심 기준: `row owns an instance id, apply hooks normalize every selection into a RecordFilter`이다.

// filepath: src/modules/object-record/advanced-filter/components/AdvancedFilterRecordFilterRow.tsx
export const AdvancedFilterRecordFilterRow = ({
  recordFilterGroup,
  recordFilter,
  recordFilterIndex,
}: AdvancedFilterRecordFilterRowProps) => {
  return (
    <ObjectFilterDropdownComponentInstanceContext.Provider
      value={{
        instanceId: getAdvancedFilterObjectFilterDropdownComponentInstanceId(
          recordFilter.id,
        ),
      }}
    >
      <AdvancedFilterDropdownRow>
        <AdvancedFilterLogicalOperatorCell
          index={recordFilterIndex}
          recordFilterGroup={recordFilterGroup}
        />
        <AdvancedFilterFieldSelectDropdownButton
          recordFilterId={recordFilter.id}
        />
        <AdvancedFilterRecordFilterOperandSelect
          recordFilterId={recordFilter.id}
        />
        <AdvancedFilterValueInput recordFilterId={recordFilter.id} />
        <AdvancedFilterRecordFilterOptionsDropdown
          recordFilterId={recordFilter.id}
        />
      </AdvancedFilterDropdownRow>
    </ObjectFilterDropdownComponentInstanceContext.Provider>
  );
};

// filepath: src/modules/object-record/advanced-filter/hooks/useSetRecordFilterUsedInAdvancedFilterDropdownRow.ts
export const useSetRecordFilterUsedInAdvancedFilterDropdownRow = () => {
  const store = useStore();

  const setRecordFilterUsedInAdvancedFilterDropdownRow = useCallback(
    (recordFilter: RecordFilter) => {
      const instanceId = getAdvancedFilterObjectFilterDropdownComponentInstanceId(
        recordFilter.id,
      );

      store.set(
        fieldMetadataItemIdUsedInDropdownComponentState.atomFamily({
          instanceId,
        }),
        recordFilter.fieldMetadataId,
      );
      store.set(
        selectedOperandInDropdownComponentState.atomFamily({ instanceId }),
        recordFilter.operand,
      );
      store.set(
        objectFilterDropdownCurrentRecordFilterComponentState.atomFamily({
          instanceId,
        }),
        recordFilter,
      );
      store.set(
        subFieldNameUsedInDropdownComponentState.atomFamily({ instanceId }),
        recordFilter.subFieldName,
      );
      store.set(
        relationTargetFieldMetadataIdUsedInDropdownComponentState.atomFamily({
          instanceId,
        }),
        recordFilter.relationTargetFieldMetadataId ?? null,
      );
    },
    [store],
  );

  return { setRecordFilterUsedInAdvancedFilterDropdownRow };
};

// filepath: src/modules/object-record/advanced-filter/hooks/useApplyAdvancedFilterSourceField.ts
export const useApplyAdvancedFilterSourceField = () => {
  const { upsertRecordFilter } = useUpsertRecordFilter();
  const { getInitialFilterValue } = useGetInitialFilterValue();
  const currentRecordFilters = useAtomComponentStateValue(
    currentRecordFiltersComponentState,
  );

  const applyAdvancedFilterSourceField = ({
    sourceFieldMetadataItem,
    recordFilterId,
  }: ApplyAdvancedFilterSourceFieldParams) => {
    const filterType = getFilterTypeFromFieldType(sourceFieldMetadataItem.type);
    const defaultOperand = getDefaultAdvancedFilterOperand({
      filterType,
      subFieldName: null,
    });

    if (!isDefined(defaultOperand)) {
      throw new Error(`No valid operand found for filter type: ${filterType}`);
    }

    const { value, displayValue } = getInitialFilterValue(
      filterType,
      defaultOperand,
    );

    const existingRecordFilter = currentRecordFilters.find(
      (recordFilter) => recordFilter.id === recordFilterId,
    );

    const newAdvancedFilter = {
      id: recordFilterId,
      fieldMetadataId: sourceFieldMetadataItem.id,
      displayValue,
      operand: defaultOperand,
      value,
      recordFilterGroupId: existingRecordFilter?.recordFilterGroupId,
      positionInRecordFilterGroup:
        existingRecordFilter?.positionInRecordFilterGroup,
      type: filterType,
      label: sourceFieldMetadataItem.label,
      subFieldName: null,
      relationTargetFieldMetadataId: null,
    } satisfies RecordFilter;

    upsertRecordFilter(newAdvancedFilter);
  };

  return { applyAdvancedFilterSourceField };
};

// filepath: src/modules/object-record/advanced-filter/hooks/useApplyAdvancedFilterCompositeSubField.ts
export const useApplyAdvancedFilterCompositeSubField = () => {
  const { upsertRecordFilter } = useUpsertRecordFilter();
  const { getInitialFilterValue } = useGetInitialFilterValue();

  const applyAdvancedFilterCompositeSubField = ({
    sourceFieldMetadataItem,
    subFieldName,
    recordFilterId,
  }: ApplyAdvancedFilterCompositeSubFieldParams) => {
    const filterType = getFilterTypeFromFieldType(sourceFieldMetadataItem.type);
    const firstOperand = getRecordFilterOperands({
      filterType,
      subFieldName,
    })?.[0];

    if (!isDefined(firstOperand)) {
      throw new Error(`No valid operand found for filter type: ${filterType}`);
    }

    const { value, displayValue } = getInitialFilterValue(
      filterType,
      firstOperand,
    );

    const newAdvancedFilter = {
      id: recordFilterId,
      fieldMetadataId: sourceFieldMetadataItem.id,
      displayValue,
      operand: firstOperand,
      value,
      type: filterType,
      label: sourceFieldMetadataItem.label,
      subFieldName,
      relationTargetFieldMetadataId: null,
    } satisfies RecordFilter;

    upsertRecordFilter(newAdvancedFilter);
  };

  return { applyAdvancedFilterCompositeSubField };
};

// filepath: src/modules/object-record/advanced-filter/hooks/useApplyAdvancedFilterRelationTargetField.ts
export const useApplyAdvancedFilterRelationTargetField = () => {
  const { upsertRecordFilter } = useUpsertRecordFilter();
  const { getInitialFilterValue } = useGetInitialFilterValue();

  const applyAdvancedFilterRelationTargetField = ({
    sourceFieldMetadataItem,
    relationTargetFieldMetadataItem,
    recordFilterId,
  }: ApplyAdvancedFilterRelationTargetFieldParams) => {
    const filterType = getFilterTypeFromFieldType(
      relationTargetFieldMetadataItem.type,
    );
    const firstOperand = getRecordFilterOperands({
      filterType,
      subFieldName: null,
    })?.[0];

    if (!isDefined(firstOperand)) {
      throw new Error(`No valid operand found for filter type: ${filterType}`);
    }

    const { value, displayValue } = getInitialFilterValue(
      filterType,
      firstOperand,
    );

    const newAdvancedFilter = {
      id: recordFilterId,
      fieldMetadataId: sourceFieldMetadataItem.id,
      displayValue,
      operand: firstOperand,
      value,
      type: filterType,
      label: `${sourceFieldMetadataItem.label} → ${relationTargetFieldMetadataItem.label}`,
      subFieldName: null,
      relationTargetFieldMetadataId: relationTargetFieldMetadataItem.id,
    } satisfies RecordFilter;

    upsertRecordFilter(newAdvancedFilter);
  };

  return { applyAdvancedFilterRelationTargetField };
};

// filepath: src/modules/object-record/advanced-filter/components/AdvancedFilterValueInput.tsx
export const AdvancedFilterValueInput = ({ recordFilterId }: Props) => {
  const dropdownId = `advanced-filter-view-filter-value-input-${recordFilterId}`;
  const currentRecordFilters = useAtomComponentStateValue(
    currentRecordFiltersComponentState,
  );
  const recordFilter = currentRecordFilters.find(
    (recordFilter) => recordFilter.id === recordFilterId,
  );

  if (!isDefined(recordFilter)) {
    return null;
  }

  const operandHasNoInput = !configurableViewFilterOperands.has(
    recordFilter.operand,
  );

  const showTextInput = shouldShowFilterTextInput({
    recordFilter,
    subFieldNameUsedInDropdown: recordFilter.subFieldName,
  });

  return operandHasNoInput ? (
    <></>
  ) : showTextInput ? (
    <AdvancedFilterDropdownTextInput recordFilter={recordFilter} />
  ) : (
    <Dropdown
      dropdownId={dropdownId}
      clickableComponent={
        <AdvancedFilterValueInputDropdownButtonClickableSelect
          recordFilterId={recordFilterId}
        />
      }
      dropdownComponents={
        <AdvancedFilterDropdownFilterInput
          recordFilter={recordFilter}
          filterDropdownId={dropdownId}
        />
      }
      dropdownPlacement="bottom-start"
    />
  );
};
```

## 2. 사용 예제

```tsx
// 사용 흐름: Advanced Filter Builder Pipeline 패턴을 실제 호출부에서 조합한다.

// filepath: src/modules/object-record/advanced-filter/components/AdvancedFilterFieldSelectMenu.tsx
const { applyAdvancedFilterSourceField } =
  useApplyAdvancedFilterSourceField();
const { applyAdvancedFilterCompositeSubField } =
  useApplyAdvancedFilterCompositeSubField();
const { applyAdvancedFilterRelationTargetField } =
  useApplyAdvancedFilterRelationTargetField();

const handleSourceFieldSelect = (sourceFieldMetadataItem: FieldMetadataItem) => {
  applyAdvancedFilterSourceField({
    sourceFieldMetadataItem,
    recordFilterId,
  });
};

const handleCompositeSubFieldSelect = ({
  sourceFieldMetadataItem,
  subFieldName,
}: {
  sourceFieldMetadataItem: FieldMetadataItem;
  subFieldName: CompositeFieldSubFieldName | null;
}) => {
  applyAdvancedFilterCompositeSubField({
    sourceFieldMetadataItem,
    subFieldName,
    recordFilterId,
  });
};

const handleRelationTargetFieldSelect = ({
  sourceFieldMetadataItem,
  relationTargetFieldMetadataItem,
}: {
  sourceFieldMetadataItem: FieldMetadataItem;
  relationTargetFieldMetadataItem: FieldMetadataItem;
}) => {
  applyAdvancedFilterRelationTargetField({
    sourceFieldMetadataItem,
    relationTargetFieldMetadataItem,
    recordFilterId,
  });
};
```
