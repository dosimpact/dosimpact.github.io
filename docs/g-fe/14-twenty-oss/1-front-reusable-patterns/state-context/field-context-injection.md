# Field Context Injection

Record field 하위 컴포넌트가 record id, field metadata, update hook을 props drilling 없이 가져가게 하는 패턴이다.

핵심은 `FieldContextProvider`가 metadata를 column definition으로 바꾸고, field input/display hook들이 `FieldContext`에서 필요한 값만 꺼내는 것이다.

## 1. 모듈 코드

- `src/modules/object-record/record-field/ui/contexts/FieldContext.ts`: field 렌더링에 필요한 record id, field definition, update hook, UI 옵션을 담는다.
- `src/modules/object-record/record-field/ui/components/FieldContextProvider.tsx`: object/field 이름으로 metadata를 찾고 field context value를 만든다.
- `src/modules/object-record/record-field/ui/meta-types/hooks/useTextField.ts`: 개별 field type hook이 context와 record store를 조합해 input에 필요한 값을 반환한다.

```tsx
// filepath: src/modules/object-record/record-field/ui/contexts/FieldContext.ts
import { createContext, type MouseEvent } from 'react';

import { type TriggerEventType } from 'twenty-ui/utilities';
import { type FieldDefinition } from '@/object-record/record-field/ui/types/FieldDefinition';
import { type FieldMetadata } from '@/object-record/record-field/ui/types/FieldMetadata';

export type RecordUpdateHookParams = {
  variables: {
    where: Record<string, unknown>;
    updateOneRecordInput: Record<string, unknown>;
  };
};

export type RecordUpdateHookReturn = {
  loading?: boolean;
};

export type RecordUpdateHook = () => [
  (params: RecordUpdateHookParams) => void,
  RecordUpdateHookReturn,
];

export type GenericFieldContextType = {
  fieldMetadataItemId?: string;
  recordId: string;
  fieldDefinition: FieldDefinition<FieldMetadata>;
  useUpdateRecord?: RecordUpdateHook;
  isLabelIdentifier: boolean;
  clearable?: boolean;
  maxWidth?: number;
  isCentered?: boolean;
  overridenIsFieldEmpty?: boolean;
  displayedMaxRows?: number;
  isDisplayModeFixHeight?: boolean;
  isRecordFieldReadOnly: boolean;
  disableChipClick?: boolean;
  onRecordChipClick?: (event: MouseEvent) => void;
  onOpenEditMode?: () => void;
  onCloseEditMode?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  triggerEvent?: TriggerEventType;
  isForbidden?: boolean;
  anchorId?: string;
};

export const FieldContext = createContext<GenericFieldContextType>(
  {} as GenericFieldContextType,
);

// filepath: src/modules/object-record/record-field/ui/components/FieldContextProvider.tsx
import { useObjectMetadataItem } from '@/object-metadata/hooks/useObjectMetadataItem';
import { formatFieldMetadataItemAsColumnDefinition } from '@/object-metadata/utils/formatFieldMetadataItemAsColumnDefinition';
import { useUpdateOneRecord } from '@/object-record/hooks/useUpdateOneRecord';
import { useIsRecordFieldReadOnly } from '@/object-record/read-only/hooks/useIsRecordFieldReadOnly';
import {
  FieldContext,
  type RecordUpdateHook,
  type RecordUpdateHookParams,
} from '@/object-record/record-field/ui/contexts/FieldContext';
import { type ReactNode } from 'react';

export const FieldContextProvider = ({
  fieldMetadataName,
  fieldPosition,
  isLabelIdentifier = false,
  objectNameSingular,
  objectRecordId,
  customUseUpdateOneObjectHook,
  showLabel = true,
  children,
}: {
  fieldMetadataName: string;
  fieldPosition: number;
  isLabelIdentifier?: boolean;
  objectNameSingular: string;
  objectRecordId: string;
  customUseUpdateOneObjectHook?: RecordUpdateHook;
  showLabel?: boolean;
  children: ReactNode;
}) => {
  const { objectMetadataItem } = useObjectMetadataItem({
    objectNameSingular,
  });

  const fieldMetadataItem = objectMetadataItem?.fields.find(
    (field) => field.name === fieldMetadataName,
  );

  const { updateOneRecord } = useUpdateOneRecord();

  const useUpdateOneObjectMutation: RecordUpdateHook = () => {
    const updateEntity = ({ variables }: RecordUpdateHookParams) => {
      updateOneRecord({
        objectNameSingular,
        idToUpdate: variables.where.id as string,
        updateOneRecordInput: variables.updateOneRecordInput,
      });
    };

    return [updateEntity, { loading: false }];
  };

  const isRecordFieldReadOnly = useIsRecordFieldReadOnly({
    recordId: objectRecordId,
    fieldMetadataId: fieldMetadataItem?.id ?? '',
    objectMetadataId: objectMetadataItem.id,
  });

  if (!fieldMetadataItem) {
    return null;
  }

  return (
    <FieldContext.Provider
      key={objectRecordId + fieldMetadataItem.id}
      value={{
        recordId: objectRecordId,
        isLabelIdentifier,
        fieldDefinition: formatFieldMetadataItemAsColumnDefinition({
          field: fieldMetadataItem,
          showLabel,
          position: fieldPosition,
          objectMetadataItem,
          labelWidth: 90,
        }),
        useUpdateRecord:
          customUseUpdateOneObjectHook ?? useUpdateOneObjectMutation,
        isRecordFieldReadOnly,
      }}
    >
      {children}
    </FieldContext.Provider>
  );
};

// filepath: src/modules/object-record/record-field/ui/meta-types/hooks/useTextField.ts
import { useContext } from 'react';

import { FieldContext } from '@/object-record/record-field/ui/contexts/FieldContext';
import { useRecordFieldInput } from '@/object-record/record-field/ui/hooks/useRecordFieldInput';
import { recordFieldInputDraftValueComponentState } from '@/object-record/record-field/ui/states/recordFieldInputDraftValueComponentState';
import { type FieldTextValue } from '@/object-record/record-field/ui/types/FieldMetadata';
import { assertFieldMetadata } from '@/object-record/record-field/ui/types/guards/assertFieldMetadata';
import { isFieldText } from '@/object-record/record-field/ui/types/guards/isFieldText';
import { isFieldTextValue } from '@/object-record/record-field/ui/types/guards/isFieldTextValue';
import { recordStoreFamilySelector } from '@/object-record/record-store/states/selectors/recordStoreFamilySelector';
import { useAtomFamilySelectorState } from '@/ui/utilities/state/jotai/hooks/useAtomFamilySelectorState';
import { useAtomComponentStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomComponentStateValue';
import { FieldMetadataType } from '~/generated-metadata/graphql';

export const useTextField = () => {
  const { recordId, fieldDefinition, maxWidth } = useContext(FieldContext);

  assertFieldMetadata(FieldMetadataType.TEXT, isFieldText, fieldDefinition);

  const fieldName = fieldDefinition.metadata.fieldName;

  const [fieldValue, setFieldValue] = useAtomFamilySelectorState(
    recordStoreFamilySelector,
    { recordId, fieldName },
  );
  const fieldTextValue = isFieldTextValue(fieldValue) ? fieldValue : '';

  const { setDraftValue } = useRecordFieldInput<FieldTextValue>();

  const recordFieldInputDraftValue = useAtomComponentStateValue(
    recordFieldInputDraftValueComponentState,
  );

  return {
    draftValue: recordFieldInputDraftValue,
    setDraftValue,
    maxWidth,
    fieldDefinition,
    fieldValue: fieldTextValue,
    setFieldValue,
  };
};
```

## 2. 사용 예제

```tsx
// Provider 사용
<FieldContextProvider
  objectNameSingular="company"
  objectRecordId={recordId}
  fieldMetadataName="name"
  fieldPosition={0}
>
  <TextFieldInput />
</FieldContextProvider>;

// Consumer 사용
import { useTextField } from '@/object-record/record-field/ui/meta-types/hooks/useTextField';

export const TextFieldInput = () => {
  const { draftValue, setDraftValue, fieldDefinition } = useTextField();

  return (
    <TextInput
      value={draftValue}
      placeholder={fieldDefinition.label}
      onChange={setDraftValue}
    />
  );
};
```
