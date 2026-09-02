# Anchored Portal Field Editor

record cell의 DOM anchor를 찾아 edit UI를 원래 셀 위치에 portal로 꽂는 패턴이다.

핵심은 `anchor stays in layout, editor renders through portal`이다.

## 1. 모듈 코드

- `src/modules/object-record/record-inline-cell/components/RecordInlineCellAnchoredPortal.tsx`: record/field metadata로 anchor id를 계산하고 portal 대상 DOM을 찾는다.
- `src/modules/object-record/record-inline-cell/components/RecordInlineCellAnchoredPortalContext.tsx`: `FieldContext`를 `RecordInlineCellContext` 값으로 변환한다.
- `src/modules/object-record/record-inline-cell/components/RecordInlineCellEditMode.tsx`: floating-ui로 edit overlay 위치와 방향 state를 계산하고 `document.body`에 렌더링한다.
- `src/modules/object-record/record-field-list/anchored-portal/components/RecordFieldListCellEditModePortal.tsx`: field list cell edit portal의 실제 사용처다.

```tsx
// 큰 흐름: record cell의 DOM anchor를 찾아 edit UI를 원래 셀 위치에 portal로 꽂는 패턴이다.
// 핵심 기준: `anchor stays in layout, editor renders through portal`이다.

// filepath: src/modules/object-record/record-inline-cell/components/RecordInlineCellAnchoredPortal.tsx
import { createPortal } from 'react-dom';
import { isDefined } from 'twenty-shared/utils';

export const RecordInlineCellAnchoredPortal = ({
  fieldMetadataItem,
  objectMetadataItem,
  recordId,
  instanceIdPrefix,
  children,
  onCloseEditMode,
}: RecordInlineCellAnchoredPortalProps) => {
  const fieldInstanceId = getRecordFieldInputInstanceId({
    recordId,
    fieldName: fieldMetadataItem.name,
    prefix: instanceIdPrefix,
  });

  const anchorElement = document.getElementById(fieldInstanceId);
  const isRecordFieldReadOnly = useIsRecordFieldReadOnly({
    fieldMetadataId: fieldMetadataItem.id,
    objectMetadataId: objectMetadataItem.id,
    recordId,
  });

  const { updateOneRecord } = useUpdateOneRecord();

  const useUpdateOneObjectRecordMutation: RecordUpdateHook = () => [
    ({ variables }) => {
      updateOneRecord({
        objectNameSingular: objectMetadataItem.nameSingular,
        idToUpdate: variables.where.id as string,
        updateOneRecordInput: variables.updateOneRecordInput,
      });
    },
    { loading: false },
  ];

  if (!isDefined(anchorElement) || !isDefined(recordId)) {
    return null;
  }

  return (
    <FieldFocusStaticFocusedProvider>
      <FieldContext.Provider
        key={recordId + fieldMetadataItem.id}
        value={{
          recordId,
          fieldDefinition: formatFieldMetadataItemAsColumnDefinition({
            field: fieldMetadataItem,
            position: 0,
            objectMetadataItem,
            showLabel: true,
            labelWidth: 90,
          }),
          useUpdateRecord: useUpdateOneObjectRecordMutation,
          isLabelIdentifier: false,
          isDisplayModeFixHeight: true,
          isRecordFieldReadOnly,
          isForbidden,
          onCloseEditMode,
        }}
      >
        {createPortal(
          <RecordFieldComponentInstanceContext.Provider
            value={{ instanceId: fieldInstanceId }}
          >
            <RecordInlineCellAnchoredPortalContext>
              {children}
              <RecordInlineCellCloseOnSidePanelOpeningEffect />
            </RecordInlineCellAnchoredPortalContext>
          </RecordFieldComponentInstanceContext.Provider>,
          anchorElement,
        )}
      </FieldContext.Provider>
    </FieldFocusStaticFocusedProvider>
  );
};

// filepath: src/modules/object-record/record-inline-cell/components/RecordInlineCellAnchoredPortalContext.tsx
export const RecordInlineCellAnchoredPortalContext = ({ children }: Props) => {
  const { isRecordFieldReadOnly, fieldDefinition, onOpenEditMode, onCloseEditMode } =
    useContext(FieldContext);

  return (
    <RecordInlineCellContext.Provider
      value={{
        readonly: isRecordFieldReadOnly,
        label: fieldDefinition.label,
        labelWidth: fieldDefinition.labelWidth,
        showLabel: fieldDefinition.showLabel,
        editModeContent: <FieldInput />,
        displayModeContent: <FieldDisplay />,
        onOpenEditMode,
        onCloseEditMode,
      }}
    >
      {children}
    </RecordInlineCellContext.Provider>
  );
};

// filepath: src/modules/object-record/record-inline-cell/components/RecordInlineCellEditMode.tsx
export const RecordInlineCellEditMode = ({ children }: Props) => {
  const { refs, floatingStyles } = useFloating({
    placement: 'bottom-start',
    middleware: [
      flip(),
      offset({ mainAxis: -29, crossAxis: -5 }),
      shift({ padding: 8 }),
      setFieldInputLayoutDirectionMiddleware,
    ],
    whileElementsMounted: autoUpdate,
  });

  return (
    <StyledInlineCellEditModeContainer ref={refs.setReference}>
      {createPortal(
        <OverlayContainer ref={refs.setFloating} style={floatingStyles}>
          {children}
        </OverlayContainer>,
        document.body,
      )}
    </StyledInlineCellEditModeContainer>
  );
};
```

## 2. 사용 예제

```tsx
// 사용 흐름: Anchored Portal Field Editor 패턴을 실제 호출부에서 조합한다.

// filepath: src/modules/object-record/record-field-list/anchored-portal/components/RecordFieldListCellEditModePortal.tsx
if (!isDefined(recordFieldListCellEditModePosition) || !isDefined(editedFieldMetadataItem)) {
  return null;
}

return (
  <RecordInlineCellAnchoredPortal
    fieldMetadataItem={editedFieldMetadataItem}
    objectMetadataItem={objectMetadataItem}
    recordId={recordId}
    instanceIdPrefix={instanceId}
  >
    <RecordFieldListInputContextProvider
      fieldMetadataItem={editedFieldMetadataItem}
      objectMetadataItem={objectMetadataItem}
      recordId={recordId}
      instanceIdPrefix={instanceId}
    >
      <RecordInlineCellEditMode>
        <FieldInput />
      </RecordInlineCellEditMode>
    </RecordFieldListInputContextProvider>
  </RecordInlineCellAnchoredPortal>
);
```
