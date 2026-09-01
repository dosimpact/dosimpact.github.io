# Generated GraphQL Fields

runtime object metadata를 GraphQL selection set과 operation document로 변환하는 패턴이다.

핵심은 `metadata in, typed GraphQL document out`이다.

## 1. 모듈 코드

- `src/modules/object-record/graphql/record-gql-fields/utils/generateDepthRecordGqlFieldsFromObject.ts`: object metadata와 depth로 record gql fields map을 만든다.
- `src/modules/object-metadata/utils/mapObjectMetadataToGraphQLQuery.ts`: fields map을 GraphQL selection set 문자열로 변환한다.
- `src/modules/object-metadata/utils/generateCreateOneRecordMutation.ts`: metadata와 selection set으로 create mutation document를 만든다.

```tsx
// filepath: src/modules/object-record/graphql/record-gql-fields/utils/generateDepthRecordGqlFieldsFromObject.ts
export const generateDepthRecordGqlFieldsFromObject = ({
  objectMetadataItem,
  objectMetadataItems,
  depth,
}: {
  objectMetadataItem: ObjectMetadataItem;
  objectMetadataItems: ObjectMetadataItem[];
  depth: number;
}) => {
  return generateDepthRecordGqlFieldsFromFields({
    fields: objectMetadataItem.fields,
    objectMetadataItem,
    objectMetadataItems,
    depth,
  });
};

// filepath: src/modules/object-metadata/utils/mapObjectMetadataToGraphQLQuery.ts
export const mapObjectMetadataToGraphQLQuery = ({
  objectMetadataItem,
  objectMetadataItems,
  recordGqlFields,
  objectPermissionsByObjectMetadataId,
}: {
  objectMetadataItem: ObjectMetadataItem;
  objectMetadataItems: ObjectMetadataItem[];
  recordGqlFields: RecordGqlFields;
  objectPermissionsByObjectMetadataId: ObjectPermissionsByObjectMetadataId;
}) => {
  return `{
    ${mapRecordGqlFieldsToGraphQLFields({
      objectMetadataItem,
      objectMetadataItems,
      recordGqlFields,
      objectPermissionsByObjectMetadataId,
    })}
  }`;
};

// filepath: src/modules/object-metadata/utils/generateCreateOneRecordMutation.ts
import { gql } from '@apollo/client';

export const generateCreateOneRecordMutation = ({
  objectMetadataItem,
  objectMetadataItems,
  recordGqlFields,
  objectPermissionsByObjectMetadataId,
}: {
  objectMetadataItem: ObjectMetadataItem;
  objectMetadataItems: ObjectMetadataItem[];
  recordGqlFields?: RecordGqlFields;
  objectPermissionsByObjectMetadataId: ObjectPermissionsByObjectMetadataId;
}) => {
  const appliedRecordGqlFields =
    recordGqlFields ??
    generateDepthRecordGqlFieldsFromObject({
      depth: 1,
      objectMetadataItems,
      objectMetadataItem,
    });

  const capitalizedObjectName = capitalize(objectMetadataItem.nameSingular);
  const mutationResponseField = getCreateOneRecordMutationResponseField(
    objectMetadataItem.nameSingular,
  );

  return gql`
    mutation CreateOne${capitalizedObjectName}($input: ${capitalizedObjectName}CreateInput!) {
      ${mutationResponseField}(data: $input) ${mapObjectMetadataToGraphQLQuery({
        objectMetadataItems,
        objectMetadataItem,
        recordGqlFields: appliedRecordGqlFields,
        objectPermissionsByObjectMetadataId,
      })}
    }
  `;
};
```

## 2. 사용 예제

```tsx
const recordGqlFields = generateDepthRecordGqlFieldsFromObject({
  objectMetadataItem,
  objectMetadataItems,
  depth: 1,
});

const createOneRecordMutation = generateCreateOneRecordMutation({
  objectMetadataItem,
  objectMetadataItems,
  recordGqlFields,
  objectPermissionsByObjectMetadataId,
});

await apolloClient.mutate({
  mutation: createOneRecordMutation,
  variables: {
    input: recordInput,
  },
});
```
