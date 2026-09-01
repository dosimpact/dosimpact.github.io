# Workflow Run Action Hooks

workflow run 생성, 중지, 재시도를 UI가 직접 mutation 세부사항 없이 호출하게 만드는 hook facade 패턴이다.

핵심은 `run action hook owns side effects around the mutation`이다.

## 1. 모듈 코드

- `src/modules/workflow/hooks/useRunWorkflowVersion.tsx`: optimistic workflow run record를 만들고 SSE 구독을 켠 뒤 run mutation을 실행하고 side panel을 연다.
- `src/modules/workflow/hooks/useStopWorkflowRun.ts`: stop mutation 후 record update browser event를 broadcast한다.
- `src/modules/workflow/hooks/useRetryWorkflowRun.ts`: retry mutation 후 record update browser event를 broadcast한다.
- `src/modules/workflow/hooks/useRunWorkflowRunOpeningInSidePanelEffects.ts`: workflow run cache를 읽고 pending/running form step을 side panel에 자동으로 연다.

```tsx
// filepath: src/modules/workflow/hooks/useRunWorkflowVersion.tsx
export const useRunWorkflowVersion = () => {
  const apolloCoreClient = useApolloCoreClient();
  const { upsertRecordsInStore } = useUpsertRecordsInStore();
  const createOneRecordInCache = useCreateOneRecordInCache<WorkflowRun>({
    objectMetadataItem,
  });
  const { upsertFindOneRecordQueryInCache } =
    useUpsertFindOneRecordQueryInCache({ objectMetadataItem, recordGqlFields });
  const { openRecordInSidePanel } = useOpenRecordInSidePanel();
  const { changeQueryIdListenState } = useChangeQueryListenState();

  const [mutate] = useMutation(RUN_WORKFLOW_VERSION, {
    client: apolloCoreClient,
  });

  const runWorkflowVersion = async ({
    workflowId,
    workflowVersionId,
    payload,
  }: {
    workflowId: string;
    workflowVersionId: string;
    payload?: Record<string, unknown>;
  }) => {
    const workflowRunId = v4();

    const optimisticRecordInput = computeOptimisticRecordFromInput({
      cache: apolloCoreClient.cache,
      currentWorkspaceMember,
      objectMetadataItem,
      objectMetadataItems,
      recordInput: {
        ...computeOptimisticCreateRecordBaseRecordInput(objectMetadataItem),
        id: workflowRunId,
        name: '#0',
        status: 'NOT_STARTED',
        workflowVersionId,
        workflowId,
        createdAt: new Date().toISOString(),
      },
      objectPermissionsByObjectMetadataId,
    });

    const recordCreatedInCache = createOneRecordInCache({
      ...optimisticRecordInput,
      id: workflowRunId,
      __typename: getObjectTypename(objectMetadataItem.nameSingular),
    });

    upsertFindOneRecordQueryInCache({
      objectRecordToOverwrite: recordCreatedInCache,
      objectRecordId: workflowRunId,
    });

    triggerCreateRecordsOptimisticEffect({
      cache: apolloCoreClient.cache,
      objectMetadataItem,
      recordsToCreate: [getRecordNodeFromRecord({ record: recordCreatedInCache })],
      objectMetadataItems,
      shouldMatchRootQueryFilter: true,
      objectPermissionsByObjectMetadataId,
      upsertRecordsInStore,
    });

    const sseQueryId = getWorkflowRunSseQueryId(workflowRunId);
    const sseOperationSignature = {
      objectNameSingular: CoreObjectNameSingular.WorkflowRun,
      variables: { filter: { id: { eq: workflowRunId } } },
    };

    changeQueryIdListenState(true, sseQueryId, sseOperationSignature);

    try {
      await mutate({
        variables: { input: { workflowVersionId, workflowRunId, payload } },
      });
    } catch (error) {
      changeQueryIdListenState(false, sseQueryId, sseOperationSignature);
      throw error;
    }

    openRecordInSidePanel({
      objectNameSingular: CoreObjectNameSingular.WorkflowRun,
      recordId: workflowRunId,
    });
  };

  return { runWorkflowVersion };
};

// filepath: src/modules/workflow/hooks/useStopWorkflowRun.ts
export const useStopWorkflowRun = () => {
  const [mutate] = useMutation(StopWorkflowRunDocument, {
    client: apolloCoreClient,
  });

  const stopWorkflowRun = async (workflowRunId: string) => {
    await mutate({ variables: { workflowRunId } });

    dispatchObjectRecordOperationBrowserEvent({
      objectMetadataItem,
      operation: {
        type: 'update-one',
        result: {
          updateInput: { recordId: workflowRunId, updatedFields: [] },
        },
      },
    });
  };

  return { stopWorkflowRun };
};

// filepath: src/modules/workflow/hooks/useRetryWorkflowRun.ts
export const useRetryWorkflowRun = () => {
  const [mutate] = useMutation(RetryWorkflowRunDocument, {
    client: apolloCoreClient,
  });

  const retryWorkflowRun = async (workflowRunId: string) => {
    await mutate({ variables: { workflowRunId } });

    dispatchObjectRecordOperationBrowserEvent({
      objectMetadataItem,
      operation: {
        type: 'update-one',
        result: {
          updateInput: { recordId: workflowRunId, updatedFields: [] },
        },
      },
    });
  };

  return { retryWorkflowRun };
};

// filepath: src/modules/workflow/hooks/useRunWorkflowRunOpeningInSidePanelEffects.ts
export const useRunWorkflowRunOpeningInSidePanelEffects = () => {
  const runWorkflowRunOpeningInSidePanelEffects = useCallback(
    ({ objectMetadataItem, recordId }: OpenWorkflowRunParams) => {
      const workflowRunRecord = getRecordFromCache<WorkflowRun>({
        objectMetadataItem,
        cache: apolloCoreClient.cache,
        recordId,
        objectMetadataItems,
        objectPermissionsByObjectMetadataId,
      });

      if (!(isDefined(workflowRunRecord) && isDefined(workflowRunRecord.state))) {
        return;
      }

      const { stepToOpenByDefault } = generateWorkflowRunDiagram({
        steps: workflowRunRecord.state.flow.steps,
        stepInfos: workflowRunRecord.state.stepInfos,
        trigger: workflowRunRecord.state.flow.trigger,
      });

      if (!isDefined(stepToOpenByDefault)) {
        return;
      }

      store.set(workflowSelectedNodeComponentState.atomFamily({ instanceId }), stepToOpenByDefault.id);
      store.set(workflowRunDiagramAutomaticallyOpenedStepsComponentState.atomFamily({ instanceId }), (steps) => [
        ...steps,
        { stepId: stepToOpenByDefault.id, isInSidePanel: true },
      ]);

      openWorkflowRunViewStepInSidePanel({
        workflowId: workflowRunRecord.workflowId,
        workflowRunId: workflowRunRecord.id,
        title: stepToOpenByDefault.data.name,
        icon: getIcon(getWorkflowNodeIconKey(stepToOpenByDefault.data)),
        workflowSelectedNode: stepToOpenByDefault.id,
        stepExecutionStatus: stepToOpenByDefault.data.runStatus,
      });
    },
    [apolloCoreClient.cache, objectPermissionsByObjectMetadataId, openWorkflowRunViewStepInSidePanel, getIcon, store],
  );

  return { runWorkflowRunOpeningInSidePanelEffects };
};
```

## 2. 사용 예제

```tsx
// filepath: src/modules/command-menu-item/engine-command/record/components/TriggerWorkflowVersionEngineCommand.tsx
const { runWorkflowVersion } = useRunWorkflowVersion();

await runWorkflowVersion({
  workflowId: mountedCommandState.workflowId,
  workflowVersionId: mountedCommandState.workflowVersionId,
  payload: {
    recordId,
    objectNameSingular,
  },
});

// filepath: src/modules/command-menu-item/engine-command/record/single-record/workflow-runs/components/StopWorkflowRunSingleRecordCommand.tsx
const { stopWorkflowRun } = useStopWorkflowRun();
const { execute } = useExecuteWorkflowRunBulkCommand(stopWorkflowRun);

// filepath: src/modules/command-menu-item/engine-command/record/single-record/workflow-runs/components/RetryWorkflowRunSingleRecordCommand.tsx
const { retryWorkflowRun } = useRetryWorkflowRun();
const { execute } = useExecuteWorkflowRunBulkCommand(retryWorkflowRun);
```
