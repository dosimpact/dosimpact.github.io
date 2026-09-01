# Aggregate Records Query

field-level aggregate 요청을 metadata에서 허용되는 GraphQL aggregate fields로 변환하고, raw query result를 `{ fieldName: { operation: value } }` 형태로 되돌리는 패턴이다.

핵심은 `UI asks for field operations, hook maps them to generated aggregate fields`다.

## 1. 모듈 코드

- `src/modules/object-record/hooks/useAggregateRecords.ts`: aggregate query를 실행하고 generated field name을 원래 field/operation map으로 복원한다.
- `src/modules/object-record/hooks/useAggregateRecordsQuery.ts`: requested aggregate operations를 readable fields의 available aggregation map에 맞춰 GraphQL fields로 변환한다.
- `src/modules/object-record/utils/generateAggregateQuery.ts`: selected aggregate fields로 object-specific aggregate GraphQL query를 만든다.
- `src/modules/object-record/record-index/hooks/useRecordIndexGroupsAggregatesGroupBy.ts`: grouped records의 aggregate query를 filter/groupBy와 함께 실행한다.
- `src/modules/object-record/record-index/components/RecordIndexGroupAggregateQueryEffect.tsx`: groupBy aggregate 결과를 record group display state에 저장한다.

```tsx
// filepath: src/modules/object-record/hooks/useAggregateRecords.ts
export const useAggregateRecords = <T extends AggregateRecordsData>({
  objectNameSingular,
  filter,
  recordGqlFieldsAggregate,
  skip,
}: {
  objectNameSingular: string;
  recordGqlFieldsAggregate: RecordGqlFieldsAggregate;
  filter?: RecordGqlOperationFilter;
  skip?: boolean;
}) => {
  const { objectMetadataItem } = useObjectMetadataItem({ objectNameSingular });
  const apolloCoreClient = useApolloCoreClient();

  const { aggregateQuery, gqlFieldToFieldMap } = useAggregateRecordsQuery({
    objectNameSingular,
    recordGqlFieldsAggregate,
  });

  const objectPermissions = useObjectPermissionsForObject(objectMetadataItem.id);

  const { data, loading, error } = useQuery<RecordGqlOperationFindManyResult>(
    aggregateQuery,
    {
      skip:
        skip ||
        !isDefined(objectMetadataItem) ||
        !objectPermissions.canReadObjectRecords,
      variables: { filter },
      client: apolloCoreClient,
    },
  );

  const formattedData: AggregateRecordsData = {};

  if (!isEmpty(data)) {
    Object.entries(data?.[objectMetadataItem.namePlural] ?? {}).forEach(
      ([gqlField, result]) => {
        if (isDefined(gqlFieldToFieldMap[gqlField])) {
          const [fieldName, aggregateOperation] = gqlFieldToFieldMap[gqlField];

          formattedData[fieldName] = {
            ...(formattedData[fieldName] ?? {}),
            [aggregateOperation]: result,
          };
        }
      },
    );
  }

  return {
    objectMetadataItem,
    data: formattedData as T,
    loading,
    error,
  };
};

// filepath: src/modules/object-record/hooks/useAggregateRecordsQuery.ts
export const useAggregateRecordsQuery = ({
  objectNameSingular,
  recordGqlFieldsAggregate = {},
}: {
  objectNameSingular: string;
  recordGqlFieldsAggregate: RecordGqlFieldsAggregate;
}) => {
  const { objectMetadataItem } = useObjectMetadataItem({ objectNameSingular });

  const availableAggregations = useMemo(
    () => getAvailableAggregationsFromObjectFields(objectMetadataItem.readableFields),
    [objectMetadataItem.readableFields],
  );

  const { recordGqlFields, gqlFieldToFieldMap } = useMemo(() => {
    const fields: RecordGqlFields = {};
    const fieldMap: GqlFieldToFieldMap = {};

    Object.entries(recordGqlFieldsAggregate).forEach(
      ([fieldName, aggregateOperations]) => {
        aggregateOperations.forEach((aggregateOperation) => {
          const fieldToQuery =
            availableAggregations[fieldName]?.[aggregateOperation];

          if (!isDefined(fieldToQuery)) {
            return;
          }

          fieldMap[fieldToQuery] = [fieldName, aggregateOperation];
          fields[fieldToQuery] = true;
        });
      },
    );

    return { recordGqlFields: fields, gqlFieldToFieldMap: fieldMap };
  }, [availableAggregations, recordGqlFieldsAggregate]);

  const aggregateQuery = useMemo(
    () =>
      generateAggregateQuery({
        objectMetadataItem,
        recordGqlFields,
      }),
    [objectMetadataItem, recordGqlFields],
  );

  return { aggregateQuery, gqlFieldToFieldMap };
};

// filepath: src/modules/object-record/utils/generateAggregateQuery.ts
export const generateAggregateQuery = ({
  objectMetadataItem,
  recordGqlFields,
}: {
  objectMetadataItem: EnrichedObjectMetadataItem;
  recordGqlFields: RecordGqlFields;
}) => {
  const selectedFields = Object.entries(recordGqlFields)
    .filter(([_, shouldBeQueried]) => Boolean(shouldBeQueried))
    .map(([fieldName]) => fieldName)
    .join('\n      ');

  return gql`
    query ${getAggregateQueryName(objectMetadataItem.namePlural)}($filter: ${capitalize(
      objectMetadataItem.nameSingular,
    )}FilterInput) {
      ${objectMetadataItem.namePlural}(filter: $filter) {
        ${selectedFields ? '' : '__typename'}
        ${selectedFields}
      }
    }
  `;
};

// filepath: src/modules/object-record/record-index/hooks/useRecordIndexGroupsAggregatesGroupBy.ts
export const useRecordIndexGroupsAggregatesGroupBy = ({
  objectMetadataItem,
  skip,
  groupByFieldMetadataItem,
  recordIndexGroupAggregateFieldMetadataItem,
  recordIndexGroupAggregateOperation,
}: {
  skip?: boolean;
  objectMetadataItem: EnrichedObjectMetadataItem;
  groupByFieldMetadataItem: FieldMetadataItem;
  recordIndexGroupAggregateFieldMetadataItem: Nullable<FieldMetadataItem>;
  recordIndexGroupAggregateOperation: ExtendedAggregateOperations;
}) => {
  const { recordAggregateGqlField } =
    useAggregateGqlFieldsFromRecordIndexGroupAggregates({
      objectMetadataItem,
      recordIndexGroupAggregateFieldMetadataItem,
      recordIndexGroupAggregateOperation,
    });

  const groupByAggregateQuery = useMemo(
    () =>
      isDefined(recordAggregateGqlField)
        ? generateGroupByAggregateQuery({
            aggregateOperationGqlFields: [recordAggregateGqlField],
            objectMetadataItem,
          })
        : EMPTY_QUERY,
    [recordAggregateGqlField, objectMetadataItem],
  );

  const { data, loading, error } = useQuery(groupByAggregateQuery, {
    skip: skip || !isDefined(recordAggregateGqlField) || !hasReadPermission,
    variables: {
      filter: combineFilters([anyFieldFilter, requestFilters, recordGroupOptionsFilter]),
      groupBy: buildGroupByFieldObject({ field: groupByFieldMetadataItem }),
    },
    client: apolloCoreClient,
  });

  return { data, loading, error };
};

// filepath: src/modules/object-record/record-index/components/RecordIndexGroupAggregateQueryEffect.tsx
export const RecordIndexGroupAggregateQueryEffect = ({
  recordIndexGroupFieldMetadataItem,
  recordIndexGroupAggregateOperation,
  recordIndexGroupAggregateFieldMetadataItem,
}: {
  recordIndexGroupFieldMetadataItem: FieldMetadataItem;
  recordIndexGroupAggregateFieldMetadataItem: Nullable<FieldMetadataItem>;
  recordIndexGroupAggregateOperation: ExtendedAggregateOperations;
}) => {
  const { objectMetadataItem } = useRecordIndexContextOrThrow();

  const { data, loading, error } = useRecordIndexGroupsAggregatesGroupBy({
    objectMetadataItem,
    groupByFieldMetadataItem: recordIndexGroupFieldMetadataItem,
    recordIndexGroupAggregateFieldMetadataItem,
    recordIndexGroupAggregateOperation,
  });

  useEffect(() => {
    if (!loading && !isDefined(error) && isDefined(data)) {
      const { recordAggregateValueByGroupValueArray } =
        turnRecordIndexGroupByAggregateQueryResultIntoRecordAggregateValueByGroupValue({
          objectMetadataItem,
          queryResult: data,
          recordAggregateGqlField,
        });

      for (const recordGroupDefinition of recordGroupDefinitions) {
        const foundAggregateValueForGroup =
          recordAggregateValueByGroupValueArray.find(
            (aggregateValue) =>
              aggregateValue.recordGroupValue === recordGroupDefinition.value,
          );

        setRecordIndexAggregateDisplayValueForRecordGroupValue(
          recordIndexGroupAggregateOperation,
          recordIndexGroupAggregateFieldMetadataItem,
          recordGroupDefinition.value ?? '',
          foundAggregateValueForGroup?.recordAggregateValue ?? 0,
        );
      }
    }
  }, [data, loading, error, recordGroupDefinitions]);

  return null;
};
```

## 2. 사용 예제

```tsx
// filepath: src/modules/object-record/record-table/record-table-footer/hooks/useAggregateRecordsForRecordTableColumnFooter.tsx
export const useAggregateRecordsForRecordTableColumnFooter = (
  aggregateFieldMetadataId: string,
) => {
  const { objectMetadataItem } = useRecordTableContextOrThrow();
  const fieldMetadataItem = objectMetadataItem.fields.find(
    (field) => field.id === aggregateFieldMetadataId,
  );

  const fieldName = fieldMetadataItem?.name;
  const recordGqlFieldsAggregate =
    isDefined(aggregateOperationForViewField) && isDefined(fieldName)
      ? { [fieldName]: [aggregateOperationForViewField] }
      : {};

  const { data, loading } = useAggregateRecords({
    objectNameSingular: objectMetadataItem.nameSingular,
    recordGqlFieldsAggregate,
    filter: {
      ...requestFilters,
      ...recordGroupFilter,
      ...anyFieldFilter,
    },
    skip: !isDefined(aggregateOperationForViewField),
  });

  const aggregateRawValue =
    data[fieldMetadataItem.name]?.[aggregateOperationForViewField];

  return {
    aggregateValue: transformAggregateRawValueIntoAggregateDisplayValue({
      aggregateFieldMetadataItem: fieldMetadataItem,
      aggregateOperation: aggregateOperationForViewField,
      aggregateRawValue,
    }),
    isLoading: loading,
  };
};

// filepath: src/modules/object-record/record-index/components/RecordIndexGroupAggregatesDataLoader.tsx
export const RecordIndexGroupAggregatesDataLoader = () => {
  const recordIndexGroupFieldMetadataItem = useAtomComponentStateValue(
    recordIndexGroupFieldMetadataItemComponentState,
  );
  const recordIndexGroupAggregateFieldMetadataItem = useAtomComponentStateValue(
    recordIndexGroupAggregateFieldMetadataItemComponentState,
  );
  const recordIndexGroupAggregateOperation = useAtomComponentStateValue(
    recordIndexGroupAggregateOperationComponentState,
  );

  if (
    !isDefined(recordIndexGroupFieldMetadataItem) ||
    !isDefined(recordIndexGroupAggregateOperation)
  ) {
    return null;
  }

  return (
    <RecordIndexGroupAggregateQueryEffect
      recordIndexGroupFieldMetadataItem={recordIndexGroupFieldMetadataItem}
      recordIndexGroupAggregateFieldMetadataItem={
        recordIndexGroupAggregateFieldMetadataItem
      }
      recordIndexGroupAggregateOperation={recordIndexGroupAggregateOperation}
    />
  );
};
```
