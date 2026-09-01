# Inline Cell Edit Lifecycle

display mode, edit mode, persist, close, focus 복귀를 하나의 cell shell로 표준화하는 패턴이다.

핵심은 `cell owns lifecycle, field input only reports events`다.

## 1. 모듈 코드

- `src/modules/object-record/record-field/ui/contexts/FieldInputEventContext.ts`: field input이 Enter/Escape/Tab/click-outside 같은 lifecycle event를 보고하는 계약을 정의한다.
- `src/modules/object-record/record-inline-cell/components/RecordInlineCell.tsx`: display/input router를 연결하고 event별 persist/close 정책을 소유한다.
- `src/modules/object-record/record-inline-cell/components/RecordInlineCellContext.tsx`: cell shell이 필요한 display/edit content와 open/close handler를 전달한다.
- `src/modules/object-record/record-inline-cell/components/RecordInlineCellValue.tsx`: loading/display 상태를 렌더링하고 click을 edit open으로 연결한다.
- `src/modules/object-record/record-inline-cell/hooks/useInlineCell.ts`: 외부 컴포넌트가 inline cell을 열고 닫을 때 draft value와 focus stack을 함께 처리한다.

```tsx
// filepath: src/modules/object-record/record-field/ui/contexts/FieldInputEventContext.ts
import { createContext } from 'react';

export type FieldInputEventArgs = {
  newValue?: unknown;
  skipPersist?: boolean;
  skipClose?: boolean;
};

export type FieldInputEvent = (args: FieldInputEventArgs) => void;

export type FieldInputClickOutsideEvent = (args: {
  newValue?: unknown;
  skipPersist?: boolean;
  event?: MouseEvent | TouchEvent;
}) => void;

export type FieldInputEventContextType = {
  onEnter?: FieldInputEvent;
  onCancel?: () => void;
  onEscape?: FieldInputEvent;
  onSubmit?: FieldInputEvent;
  onTab?: FieldInputEvent;
  onShiftTab?: FieldInputEvent;
  onClickOutside?: FieldInputClickOutsideEvent;
};

export const FieldInputEventContext = createContext<FieldInputEventContextType>(
  {} as FieldInputEventContextType,
);

// filepath: src/modules/object-record/record-inline-cell/components/RecordInlineCell.tsx
export const RecordInlineCell = ({ loading, instanceIdPrefix }: Props) => {
  const { fieldDefinition, recordId, isRecordFieldReadOnly } =
    useContext(FieldContext);
  const { openFieldInput, closeFieldInput } = useOpenFieldInputEditMode();
  const { persistFieldFromFieldInputContext } =
    usePersistFieldFromFieldInputContext();
  const { goBackToPreviousDropdownFocusId } =
    useGoBackToPreviousDropdownFocusId();

  const onOpenEditMode = () =>
    openFieldInput({ fieldDefinition, recordId, prefix: instanceIdPrefix });

  const closeInlineCell = () => {
    closeFieldInput({ fieldDefinition, recordId, prefix: instanceIdPrefix });
    goBackToPreviousDropdownFocusId();
  };

  const persistAndClose: FieldInputEvent = ({ newValue, skipPersist }) => {
    if (skipPersist !== true) {
      persistFieldFromFieldInputContext(newValue);
    }

    closeInlineCell();
  };

  const handleSubmit: FieldInputEvent = ({
    newValue,
    skipPersist,
    skipClose,
  }) => {
    if (skipPersist !== true) {
      persistFieldFromFieldInputContext(newValue);
    }

    if (skipClose !== true) {
      closeInlineCell();
    }
  };

  return (
    <FieldInputEventContext.Provider
      value={{
        onCancel: closeInlineCell,
        onEnter: persistAndClose,
        onEscape: persistAndClose,
        onTab: persistAndClose,
        onShiftTab: persistAndClose,
        onSubmit: handleSubmit,
      }}
    >
      <FieldFocusContextProvider>
        <RecordInlineCellContext.Provider
          value={{
            readonly: isRecordFieldReadOnly,
            editModeContent: <FieldInput />,
            displayModeContent: <FieldDisplay />,
            loading,
            onOpenEditMode,
            onCloseEditMode: closeInlineCell,
          }}
        >
          <RecordInlineCellContainer />
        </RecordInlineCellContext.Provider>
      </FieldFocusContextProvider>
    </FieldInputEventContext.Provider>
  );
};

// filepath: src/modules/object-record/record-inline-cell/components/RecordInlineCellValue.tsx
export const RecordInlineCellValue = () => {
  const { readonly, loading, isCentered, onOpenEditMode } =
    useRecordInlineCellContext();
  const { isFocused } = useFieldFocus();

  if (loading === true) {
    return <RecordInlineCellSkeletonLoader />;
  }

  return (
    <StyledClickableContainer readonly={readonly} isCentered={isCentered}>
      <RecordInlineCellDisplayMode
        isHovered={isFocused}
        onClick={onOpenEditMode}
      >
        <FieldDisplay />
      </RecordInlineCellDisplayMode>
    </StyledClickableContainer>
  );
};

// filepath: src/modules/object-record/record-inline-cell/hooks/useInlineCell.ts
export const useInlineCell = (recordFieldComponentInstanceIdFromProps?: string) => {
  const { recordId, fieldDefinition } = useContext(FieldContext);
  const recordFieldComponentInstanceId = useAvailableComponentInstanceIdOrThrow(
    RecordFieldComponentInstanceContext,
    recordFieldComponentInstanceIdFromProps,
  );
  const { onOpenEditMode, onCloseEditMode } = useRecordInlineCellContext();
  const { scopeInstanceId } = useRecordFieldsScopeContextOrThrow();
  const initFieldInputDraftValue = useInitDraftValue();

  const openInlineCell = () => {
    onOpenEditMode?.();
    initFieldInputDraftValue({
      recordId,
      fieldDefinition,
      fieldComponentInstanceId: recordFieldComponentInstanceId,
    });
    setActiveDropdownFocusIdAndMemorizePrevious(
      getDropdownFocusIdForRecordField({
        recordId,
        fieldMetadataId: fieldDefinition.fieldMetadataId,
        componentType: 'inline-cell',
        instanceId: scopeInstanceId,
      }),
    );
  };

  const closeInlineCell = () => {
    onCloseEditMode?.();
    goBackToPreviousDropdownFocusId();
  };

  return { openInlineCell, closeInlineCell };
};
```

## 2. 사용 예제

```tsx
// filepath: src/modules/object-record/record-field/ui/meta-types/input/components/TextFieldInput.tsx
export const TextFieldInput = () => {
  const { onEnter, onEscape, onClickOutside } = useContext(FieldInputEventContext);
  const [draftValue, setDraftValue] = useState(initialValue);

  return (
    <TextInput
      value={draftValue}
      onChange={setDraftValue}
      onEnter={() => onEnter?.({ newValue: draftValue })}
      onEscape={() => onEscape?.({ newValue: initialValue, skipPersist: true })}
      onClickOutside={(event) =>
        onClickOutside?.({ event, newValue: draftValue })
      }
    />
  );
};
```
