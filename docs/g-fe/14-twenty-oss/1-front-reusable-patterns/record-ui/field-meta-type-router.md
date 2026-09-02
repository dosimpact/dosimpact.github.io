# Field Meta-Type Router

`FieldContext`에 들어온 metadata를 기준으로 display/input 컴포넌트를 고르는 패턴이다.

핵심은 `caller provides field metadata, router owns component selection`이다.

## 1. 모듈 코드

- `src/modules/object-record/record-field/ui/contexts/FieldContext.ts`: record id, field definition, update hook, display flags를 field subtree에 주입한다.
- `src/modules/object-record/record-field/ui/components/FieldInput.tsx`: `fieldDefinition` type guard로 입력 컴포넌트를 선택한다.
- `src/modules/object-record/record-field/ui/components/FieldDisplay.tsx`: 권한/identifier 상태와 field type에 따라 표시 컴포넌트를 선택한다.
- `src/modules/object-record/record-field-list/components/RecordFieldList.tsx`: object metadata field를 `FieldContext.Provider` 값으로 변환해 router에 전달한다.

```tsx
// 큰 흐름: `FieldContext`에 들어온 metadata를 기준으로 display/input 컴포넌트를 고르는 패턴이다.
// 핵심 기준: `caller provides field metadata, router owns component selection`이다.

// filepath: src/modules/object-record/record-field/ui/contexts/FieldContext.ts
import { createContext, type MouseEvent } from 'react';

export type RecordUpdateHookParams = {
  variables: {
    where: Record<string, unknown>;
    updateOneRecordInput: Record<string, unknown>;
  };
};

export type RecordUpdateHook = () => [
  (params: RecordUpdateHookParams) => void,
  { loading?: boolean },
];

export type GenericFieldContextType = {
  recordId: string;
  fieldDefinition: FieldDefinition<FieldMetadata>;
  useUpdateRecord?: RecordUpdateHook;
  isLabelIdentifier: boolean;
  isRecordFieldReadOnly: boolean;
  isForbidden?: boolean;
  isDisplayModeFixHeight?: boolean;
  onOpenEditMode?: () => void;
  onCloseEditMode?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onRecordChipClick?: (event: MouseEvent) => void;
  anchorId?: string;
};

export const FieldContext = createContext<GenericFieldContextType>(
  {} as GenericFieldContextType,
);

// filepath: src/modules/object-record/record-field/ui/components/FieldInput.tsx
import { useContext } from 'react';

export const FieldInput = () => {
  const { fieldDefinition } = useContext(FieldContext);

  return isFieldRelationManyToOne(fieldDefinition) ? (
    <RelationManyToOneFieldInput />
  ) : isFieldRelationOneToMany(fieldDefinition) ? (
    <RelationOneToManyFieldInput />
  ) : isFieldMorphRelationManyToOne(fieldDefinition) ? (
    <MorphRelationManyToOneFieldInput />
  ) : isFieldMorphRelationOneToMany(fieldDefinition) ? (
    <MorphRelationOneToManyFieldInput />
  ) : isFieldText(fieldDefinition) ? (
    <TextFieldInput />
  ) : isFieldEmails(fieldDefinition) ? (
    <EmailsFieldInput />
  ) : isFieldFiles(fieldDefinition) ? (
    <FilesFieldInput />
  ) : isFieldDateTime(fieldDefinition) ? (
    <DateTimeFieldInput />
  ) : isFieldNumber(fieldDefinition) ? (
    <NumberFieldInput />
  ) : isFieldSelect(fieldDefinition) ? (
    <SelectFieldInput />
  ) : isFieldMultiSelect(fieldDefinition) ? (
    <MultiSelectFieldInput />
  ) : isFieldRichText(fieldDefinition) ? (
    <RichTextFieldInput />
  ) : (
    <></>
  );
};

// filepath: src/modules/object-record/record-field/ui/components/FieldDisplay.tsx
import { useContext } from 'react';
import { isDefined } from 'twenty-shared/utils';

export const FieldDisplay = () => {
  const {
    fieldDefinition,
    isLabelIdentifier,
    isForbidden,
    isRecordFieldReadOnly,
  } = useContext(FieldContext);

  const isChipDisplay = isFieldIdentifierDisplay(
    fieldDefinition,
    isLabelIdentifier,
  );

  if (isDefined(isForbidden) && isForbidden) {
    return <ForbiddenFieldDisplay />;
  }

  return isChipDisplay ? (
    <ChipFieldDisplay />
  ) : isFieldRelationManyToOne(fieldDefinition) ? (
    <RelationToOneFieldDisplay />
  ) : isFieldRelationOneToMany(fieldDefinition) ? (
    <RelationFromManyFieldDisplay />
  ) : isFieldText(fieldDefinition) ? (
    <TextFieldDisplay />
  ) : isFieldNumber(fieldDefinition) ? (
    <NumberFieldDisplay />
  ) : isFieldSelect(fieldDefinition) ? (
    <SelectFieldDisplay />
  ) : isFieldRating(fieldDefinition) ? (
    <RatingFieldDisplay readonly={isRecordFieldReadOnly} />
  ) : isFieldFiles(fieldDefinition) ? (
    <FilesFieldDisplay />
  ) : null;
};
```

## 2. 사용 예제

```tsx
// 사용 흐름: Field Meta-Type Router 패턴을 실제 호출부에서 조합한다.

// filepath: src/modules/object-record/record-field-list/components/RecordFieldList.tsx
inlineFieldMetadataItems.map((fieldMetadataItem, index) => {
  const fieldDefinition = formatFieldMetadataItemAsColumnDefinition({
    field: fieldMetadataItem,
    position: index,
    objectMetadataItem,
    showLabel: true,
    labelWidth: 90,
  });

  return (
    <FieldContext.Provider
      key={objectRecordId + fieldMetadataItem.id}
      value={{
        recordId: objectRecordId,
        fieldDefinition,
        useUpdateRecord: useUpdateOneObjectRecordMutation,
        isLabelIdentifier: false,
        isDisplayModeFixHeight: true,
        isRecordFieldReadOnly,
        isForbidden,
        anchorId: getRecordFieldInputInstanceId({
          recordId: objectRecordId,
          fieldName: fieldMetadataItem.name,
          prefix: instanceId,
        }),
      }}
    >
      <RecordInlineCell loading={recordLoading} instanceIdPrefix={instanceId} />
    </FieldContext.Provider>
  );
});
```
