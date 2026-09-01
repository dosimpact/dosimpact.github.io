# Workflow Step Mutation Facade

workflow step과 edge 변경을 `createStep`, `updateStep`, `deleteStep`, `createEdge`, `deleteEdge` 같은 UI용 API로 감싸는 패턴이다.

핵심은 `UI calls intent, facade resolves mutable draft and cache updates`다.

## 1. 모듈 코드

- `src/modules/workflow/workflow-steps/hooks/useCreateStep.ts`: updatable workflow version을 확보하고 step 생성 mutation 결과 diff에서 생성 step을 찾는다.
- `src/modules/workflow/workflow-steps/hooks/useUpdateStep.ts`: caller가 완성한 step payload를 현재 draft version에 update한다.
- `src/modules/workflow/workflow-steps/hooks/useDeleteStep.ts`: step 삭제 후 side panel, output schema, AI agent permission state를 정리한다.
- `src/modules/workflow/workflow-steps/hooks/useCreateWorkflowVersionStep.ts`: GraphQL create mutation을 실행하고 server diff를 local flow/cache에 적용한다.
- `src/modules/workflow/workflow-steps/hooks/useApplyWorkflowVersionStepChanges.ts`: trigger/steps diff를 component state와 Apollo workflow version cache에 반영한다.

```tsx
// filepath: src/modules/workflow/workflow-steps/hooks/useCreateStep.ts
export const useCreateStep = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { createWorkflowVersionStep } = useCreateWorkflowVersionStep();
  const setWorkflowSelectedNode = useSetAtomComponentState(
    workflowSelectedNodeComponentState,
  );
  const setWorkflowLastCreatedStepId = useSetAtomComponentState(
    workflowLastCreatedStepIdComponentState,
  );
  const { getUpdatableWorkflowVersion } =
    useGetUpdatableWorkflowVersionOrThrow();

  const createStep = async ({
    newStepType,
    parentStepId,
    nextStepId,
    position,
    connectionOptions,
    shouldSelectNode = true,
    workflowVersionId: providedWorkflowVersionId,
    defaultSettings,
  }: CreateStepParams) => {
    if (isLoading === true) {
      return;
    }

    setIsLoading(true);

    try {
      const workflowVersionId =
        providedWorkflowVersionId ?? (await getUpdatableWorkflowVersion());
      const id = v4();

      const workflowVersionStepChanges = (
        await createWorkflowVersionStep({
          id,
          workflowVersionId,
          stepType: newStepType,
          parentStepId,
          nextStepId,
          position,
          parentStepConnectionOptions: connectionOptions,
          defaultSettings,
        })
      )?.data?.createWorkflowVersionStep;

      const addedStepDiff = workflowVersionStepChanges?.stepsDiff?.find(
        (diff) => diff.type === 'CREATE' && diff.value.id === id,
      );

      if (!isDefined(addedStepDiff)) {
        throw new Error("Couldn't create step");
      }

      if (shouldSelectNode) {
        setWorkflowSelectedNode(id);
      }
      setWorkflowLastCreatedStepId(id);

      return addedStepDiff.value;
    } finally {
      setIsLoading(false);
    }
  };

  return { createStep };
};

// filepath: src/modules/workflow/workflow-steps/hooks/useUpdateStep.ts
export const useUpdateStep = () => {
  const { getUpdatableWorkflowVersion } =
    useGetUpdatableWorkflowVersionOrThrow();
  const { updateWorkflowVersionStep } = useUpdateWorkflowVersionStep();

  const updateStep = async (updatedStep: WorkflowAction) => {
    const workflowVersionId = await getUpdatableWorkflowVersion();

    const result = await updateWorkflowVersionStep({
      workflowVersionId,
      step: updatedStep,
    });

    return { updatedStep: result?.data?.updateWorkflowVersionStep };
  };

  return { updateStep };
};

// filepath: src/modules/workflow/workflow-steps/hooks/useDeleteStep.ts
export const useDeleteStep = () => {
  const { deleteWorkflowVersionStep } = useDeleteWorkflowVersionStep();
  const { deleteStepsOutputSchema } = useStepsOutputSchema();
  const { getUpdatableWorkflowVersion } =
    useGetUpdatableWorkflowVersionOrThrow();
  const { closeSidePanelMenu } = useSidePanelMenu();
  const flow = useAtomComponentStateValue(flowComponentState);

  const deleteStep = async (stepId: string) => {
    const workflowVersionId = await getUpdatableWorkflowVersion();
    const stepToDelete = flow?.steps?.find((step) => step.id === stepId);

    await deleteWorkflowVersionStep({ workflowVersionId, stepId });
    closeSidePanelMenu();
    deleteStepsOutputSchema({ stepIds: [stepId], workflowVersionId });

    if (isDefined(stepToDelete) && stepToDelete.type === 'AI_AGENT') {
      resetPermissionState();
    }
  };

  return { deleteStep };
};

// filepath: src/modules/workflow/workflow-steps/hooks/useCreateWorkflowVersionStep.ts
export const useCreateWorkflowVersionStep = () => {
  const apolloCoreClient = useApolloCoreClient();
  const { applyWorkflowVersionStepChanges } =
    useApplyWorkflowVersionStepChanges();
  const { enqueueErrorSnackBar } = useSnackBar();

  const [mutate] = useMutation(CREATE_WORKFLOW_VERSION_STEP, {
    client: apolloCoreClient,
  });

  const createWorkflowVersionStep = async (
    input: CreateWorkflowVersionStepInput,
  ) => {
    const result = await mutate({
      variables: { input },
      onError: (error) => enqueueErrorSnackBar({ apolloError: error }),
    });

    applyWorkflowVersionStepChanges({
      workflowVersionStepChanges: result?.data?.createWorkflowVersionStep,
      workflowVersionId: input.workflowVersionId,
    });

    return result;
  };

  return { createWorkflowVersionStep };
};

// filepath: src/modules/workflow/workflow-steps/hooks/useApplyWorkflowVersionStepChanges.ts
export const useApplyWorkflowVersionStepChanges = (instanceId?: string) => {
  const setFlow = useSetAtomComponentState(flowComponentState, instanceId);
  const getRecordFromCache = useGetRecordFromCache({
    objectNameSingular: CoreObjectNameSingular.WorkflowVersion,
  });

  const applyWorkflowVersionStepChanges = ({
    workflowVersionStepChanges,
    workflowVersionId,
  }: {
    workflowVersionStepChanges: WorkflowVersionStepChanges | undefined;
    workflowVersionId: string;
  }) => {
    if (!isDefined(workflowVersionStepChanges)) {
      return;
    }

    const { triggerDiff, stepsDiff } = workflowVersionStepChanges;

    setFlow((currentFlow) =>
      isDefined(currentFlow)
        ? {
            workflowVersionId,
            trigger: applyDiff({ trigger: currentFlow.trigger }, triggerDiff)
              .trigger,
            steps: applyDiff({ steps: currentFlow.steps }, stepsDiff).steps,
          }
        : currentFlow,
    );

    const cachedRecord = getRecordFromCache<WorkflowVersion>(workflowVersionId);

    if (!isDefined(cachedRecord)) {
      return;
    }

    updateRecordFromCache({
      objectMetadataItems,
      objectMetadataItem,
      cache: apolloCoreClient.cache,
      record: {
        ...cachedRecord,
        steps: applyDiff({ steps: cachedRecord.steps }, stepsDiff).steps,
        trigger: applyDiff({ trigger: cachedRecord.trigger }, triggerDiff)
          .trigger,
      },
      recordGqlFields: { steps: true, trigger: true },
      objectPermissionsByObjectMetadataId,
    });
  };

  return { applyWorkflowVersionStepChanges };
};
```

## 2. 사용 예제

```tsx
// filepath: src/modules/workflow/workflow-diagram/components/WorkflowDiagramCanvasEditable.tsx
const { createEdge } = useCreateEdge();
const { deleteEdge } = useDeleteEdge();
const { updateStep } = useUpdateStep();

const onConnect = async (edgeConnect: WorkflowConnection) => {
  const sourceStep = flow?.steps?.find((step) => step.id === edgeConnect.source);

  if (sourceStep?.type === 'IF_ELSE') {
    const updatedStep = prepareIfElseStepWithNewBranch({
      parentStep: sourceStep,
      targetStepId: edgeConnect.target,
    });

    await updateStep(updatedStep);
    return;
  }

  createEdge({
    source: edgeConnect.source,
    target: edgeConnect.target,
    connectionOptions: getConnectionOptionsForSourceHandle({
      sourceHandleId: edgeConnect.sourceHandle,
    }),
  });
};

const handleReconnect = async (oldEdge: Edge, connection: Connection) => {
  await deleteEdge({
    source: oldEdge.source,
    target: oldEdge.target,
    sourceConnectionOptions: getConnectionOptionsForSourceHandle({
      sourceHandleId: oldEdge.sourceHandle,
    }),
  });

  await createEdge({
    source: connection.source,
    target: connection.target,
    connectionOptions: getConnectionOptionsForSourceHandle({
      sourceHandleId: connection.sourceHandle,
    }),
  });
};

const onNodeDragStop: OnNodeDrag<WorkflowDiagramNode> = async (_, node) => {
  const stepToUpdate = flow?.steps?.find((step) => step.id === node.id);

  if (isDefined(stepToUpdate)) {
    await updateStep({ ...stepToUpdate, position: node.position });
  }
};
```
