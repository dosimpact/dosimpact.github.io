# Spreadsheet Import Workflow

업로드, 시트 선택, 헤더 선택, 컬럼 매칭, 검증, 제출을 step state로 연결하는 wizard workflow 패턴이다.

## 1. 모듈 코드

- `src/modules/spreadsheet-import/provider/components/SpreadsheetImportProvider.tsx`: dialog atom이 열리면 lazy-loaded import modal을 렌더링하고 close 시 abort/reset을 처리한다.
- `src/modules/spreadsheet-import/hooks/useOpenSpreadsheetImportDialog.ts`: caller가 options만 넘겨 import workflow를 시작하는 명령형 API를 제공한다.
- `src/modules/spreadsheet-import/provider/components/SpreadsheetImport.tsx`: 기본 options를 병합하고 step bar와 close confirmation을 import modal에 연결한다.
- `src/modules/spreadsheet-import/steps/components/SpreadsheetImportStepper.tsx`: 현재 step state의 `type`에 따라 실제 step component를 라우팅한다.
- `src/modules/spreadsheet-import/hooks/useSpreadsheetImportInitialStep.ts`: 재진입이나 초기 state가 있을 때 step bar의 시작 index를 계산한다.

```tsx
// filepath: src/modules/spreadsheet-import/hooks/useOpenSpreadsheetImportDialog.ts
export const useOpenSpreadsheetImportDialog = () => {
  const setSpreadsheetImportDialog = useSetAtomState(
    spreadsheetImportDialogState,
  );
  const { openModal } = useModal();

  const openSpreadsheetImportDialog = (
    options: Omit<SpreadsheetImportDialogOptions, 'isOpen' | 'onClose'>,
  ) => {
    openModal(SPREADSHEET_IMPORT_MODAL_ID);
    setSpreadsheetImportDialog({
      isOpen: true,
      isStepBarVisible: true,
      options,
    });
  };

  return { openSpreadsheetImportDialog };
};

// filepath: src/modules/spreadsheet-import/provider/components/SpreadsheetImportProvider.tsx
const SpreadsheetImport = React.lazy(() =>
  import('./SpreadsheetImport').then((module) => ({
    default: module.SpreadsheetImport,
  })),
);

export const SpreadsheetImportProvider = ({ children }: React.PropsWithChildren) => {
  const [spreadsheetImportDialog, setSpreadsheetImportDialog] = useAtomState(
    spreadsheetImportDialogState,
  );
  const setMatchColumns = useSetAtomState(matchColumnsState);
  const { closeModal } = useModal();

  const handleClose = () => {
    spreadsheetImportDialog.options?.onAbortSubmit?.();
    setSpreadsheetImportDialog({
      isOpen: false,
      isStepBarVisible: true,
      options: null,
    });
    closeModal(SPREADSHEET_IMPORT_MODAL_ID);
    setMatchColumns([]);
  };

  return (
    <>
      {children}
      {spreadsheetImportDialog.isOpen && spreadsheetImportDialog.options && (
        <React.Suspense fallback={<LoadingSkeleton />}>
          <SpreadsheetImport
            onClose={handleClose}
            {...spreadsheetImportDialog.options}
          />
        </React.Suspense>
      )}
    </>
  );
};

// filepath: src/modules/spreadsheet-import/provider/components/SpreadsheetImport.tsx
export const defaultSpreadsheetImportProps = {
  autoMapHeaders: true,
  allowInvalidSubmit: true,
  autoMapDistance: 2,
  uploadStepHook: async (value) => value,
  selectHeaderStepHook: async (headerValues, data) => ({
    headerRow: headerValues,
    importedRows: data,
  }),
  matchColumnsStepHook: async (table) => table,
  dateFormat: 'yyyy-mm-dd',
  parseRaw: true,
  selectHeader: false,
  maxRecords: SPREADSHEET_MAX_RECORD_IMPORT_CAPACITY,
} as const;

export const SpreadsheetImport = (props: SpreadsheetImportDialogOptions) => {
  const mergedProps = { ...defaultSpreadsheetImportProps, ...props };
  const { enqueueDialog } = useDialogManager();
  const { initialStepState } = useSpreadsheetImportInternal();
  const { initialStep } = useSpreadsheetImportInitialStep(initialStepState?.type);
  const { activeStep } = useStepBar({ initialStep });

  const confirmOnClose = () => {
    if (activeStep < 1) {
      mergedProps.onClose();
      return;
    }

    enqueueDialog({
      title: 'Exit import flow',
      message: 'Are you sure? Your current information will not be saved.',
      buttons: [{ title: 'Cancel' }, { title: 'Exit', onClick: mergedProps.onClose }],
    });
  };

  return (
    <ReactSpreadsheetImportContextProvider values={mergedProps}>
      <SpreadSheetImportModalWrapper onClose={confirmOnClose}>
        <SpreadsheetImportStepperContainer />
      </SpreadSheetImportModalWrapper>
    </ReactSpreadsheetImportContextProvider>
  );
};

// filepath: src/modules/spreadsheet-import/steps/components/SpreadsheetImportStepper.tsx
export const SpreadsheetImportStepper = ({ nextStep, prevStep }: Props) => {
  const { initialStepState } = useSpreadsheetImportInternal();
  const [currentStepState, setCurrentStepState] = useState(
    initialStepState ?? { type: SpreadsheetImportStepType.upload },
  );
  const [previousStepState, setPreviousStepState] = useState(currentStepState);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleBack = () => {
    setCurrentStepState(previousStepState);
    prevStep();
  };

  switch (currentStepState.type) {
    case SpreadsheetImportStepType.upload:
      return (
        <UploadStep
          setUploadedFile={setUploadedFile}
          setCurrentStepState={setCurrentStepState}
          setPreviousStepState={setPreviousStepState}
          currentStepState={currentStepState}
          nextStep={nextStep}
        />
      );
    case SpreadsheetImportStepType.selectSheet:
      return <SelectSheetStep currentStepState={currentStepState} />;
    case SpreadsheetImportStepType.selectHeader:
      return <SelectHeaderStep currentStepState={currentStepState} />;
    case SpreadsheetImportStepType.matchColumns:
      return <MatchColumnsStep currentStepState={currentStepState} />;
    case SpreadsheetImportStepType.validateData:
      return (
        <ValidationStep
          initialData={currentStepState.data}
          importedColumns={currentStepState.importedColumns}
          file={uploadedFile}
          setCurrentStepState={setCurrentStepState}
          onBack={handleBack}
        />
      );
    case SpreadsheetImportStepType.importData:
      return <ImportDataStep recordsToImportCount={currentStepState.recordsToImportCount} />;
    default:
      return <CircularProgressBar />;
  }
};

// filepath: src/modules/spreadsheet-import/hooks/useSpreadsheetImportInitialStep.ts
export const useSpreadsheetImportInitialStep = (initialStep?: SpreadsheetImportStepType) => {
  const steps = ['uploadStep', 'matchColumnsStep', 'validationStep'] as const;

  const initialStepNumber = useMemo(() => {
    switch (initialStep) {
      case SpreadsheetImportStepType.matchColumns:
        return 2;
      case SpreadsheetImportStepType.validateData:
        return 3;
      default:
        return 0;
    }
  }, [initialStep]);

  return { steps, initialStep: initialStepNumber };
};
```

## 2. 사용 예제

```tsx
// filepath: src/modules/object-record/spreadsheet-import/hooks/useOpenObjectRecordsSpreadsheetImportDialog.ts
const { openSpreadsheetImportDialog } = useOpenSpreadsheetImportDialog();

const openObjectRecordsSpreadsheetImportDialog = (options?: Options) => {
  openSpreadsheetImportDialog({
    ...options,
    spreadsheetImportFields,
    availableFieldMetadataItems,
    tableHook,
    onAbortSubmit: () => {
      abortController.abort();
    },
    onSubmit: async (data, file) => {
      const createInputs = data.validStructuredRows.map((row) =>
        buildRecordFromImportedStructuredRow({
          importedStructuredRow: row,
          fieldMetadataItems: availableFieldMetadataItems,
          spreadsheetImportFields,
        }),
      );

      await batchCreateManyRecords({
        recordsToCreate: createInputs,
        upsert: true,
      });
    },
  });
};
```
