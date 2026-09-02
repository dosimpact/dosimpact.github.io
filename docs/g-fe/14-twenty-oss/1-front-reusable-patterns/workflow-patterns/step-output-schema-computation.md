# Step Output Schema Computation

workflow step 설정과 object metadata를 variable picker가 읽을 수 있는 output schema로 변환하는 패턴이다.

핵심은 `frontend-computable schemas are generated locally, persisted schemas are reused`다.

## 1. 모듈 코드

- `src/modules/workflow/workflow-variables/utils/generate/computeStepOutputSchema.ts`: step type별로 output schema 생성기를 선택한다.
- `src/modules/workflow/workflow-variables/hooks/useStepsOutputSchema.ts`: workflow version의 trigger/steps schema를 atom family에 populate하고 recompute flag를 관리한다.
- `src/modules/workflow/hooks/useComputeStepOutputSchema.ts`: server 계산이 필요한 schema를 GraphQL mutation으로 요청하는 얇은 hook이다.
- `src/modules/workflow/graphql/mutations/computeStepOutputSchema.ts`: compute mutation document를 정의한다.

```tsx
// 큰 흐름: workflow step 설정과 object metadata를 variable picker가 읽을 수 있는 output schema로 변환하는 패턴이다.
// 핵심 기준: `frontend-computable schemas are generated locally, persisted schemas are reused`다.

// filepath: src/modules/workflow/workflow-variables/utils/generate/computeStepOutputSchema.ts
const PERSISTED_OUTPUT_SCHEMA_TYPES = [
  'AI_AGENT',
  'CODE',
  'HTTP_REQUEST',
  'LOGIC_FUNCTION',
  'WEBHOOK',
  'ITERATOR',
];

export const computeStepOutputSchema = ({
  step,
  objectMetadataItems,
}: {
  step: WorkflowTrigger | WorkflowAction;
  objectMetadataItems: EnrichedObjectMetadataItem[];
}): OutputSchemaV2 | undefined => {
  const stepType = step.type;

  if (PERSISTED_OUTPUT_SCHEMA_TYPES.includes(stepType)) {
    return undefined;
  }

  switch (stepType) {
    case 'DATABASE_EVENT': {
      const parsed = parseEventName(step.settings?.eventName);
      const objectMetadataItem = findObjectMetadataItemByName(
        objectMetadataItems,
        parsed.objectName,
      );

      return generateRecordEventOutputSchema(objectMetadataItem, parsed.action);
    }

    case 'MANUAL': {
      const availability = step.settings?.availability;

      if (availability.type === 'GLOBAL') {
        return {
          [WORKFLOW_TRIGGER_METADATA_KEY]: buildManualTriggerMetadataNode(),
        };
      }

      const objectMetadataItem = findObjectMetadataItemByName(
        objectMetadataItems,
        availability.objectNameSingular,
      );

      if (availability.type === 'SINGLE_RECORD') {
        return {
          [WORKFLOW_TRIGGER_PAYLOAD_KEY]: {
            isLeaf: false,
            icon: objectMetadataItem.icon ?? undefined,
            label: WORKFLOW_TRIGGER_RECORD_LABEL,
            value: generateRecordOutputSchema(objectMetadataItem),
          },
          [WORKFLOW_TRIGGER_METADATA_KEY]: buildManualTriggerMetadataNode(),
        };
      }

      return {
        [WORKFLOW_TRIGGER_PAYLOAD_KEY]: {
          isLeaf: false,
          type: 'object',
          label: WORKFLOW_TRIGGER_RECORDS_LABEL,
          value: {
            [objectMetadataItem.namePlural]: {
              isLeaf: true,
              label: objectMetadataItem.labelPlural,
              type: 'array',
              value: `Array of ${objectMetadataItem.labelPlural}`,
            },
          },
        },
        [WORKFLOW_TRIGGER_METADATA_KEY]: buildManualTriggerMetadataNode(),
      };
    }

    case 'CREATE_RECORD':
    case 'UPDATE_RECORD':
    case 'DELETE_RECORD':
    case 'UPSERT_RECORD':
    case 'PICK_RECORD': {
      const objectMetadataItem = findObjectMetadataItemByName(
        objectMetadataItems,
        step.settings?.input?.objectName,
      );

      return generateRecordOutputSchema(objectMetadataItem);
    }

    case 'FIND_RECORDS': {
      const objectMetadataItem = findObjectMetadataItemByName(
        objectMetadataItems,
        step.settings?.input?.objectName,
      );

      return generateFindRecordsOutputSchema(objectMetadataItem);
    }

    case 'FORM': {
      return generateFormOutputSchema(
        step.settings?.input as WorkflowFormActionField[],
        objectMetadataItems,
      );
    }

    case 'SEND_EMAIL':
      return {
        success: { isLeaf: true, type: FieldMetadataType.BOOLEAN, label: 'Success', value: true },
        headerMessageId: { isLeaf: true, type: FieldMetadataType.TEXT, label: 'Message-ID header', value: '' },
        messageId: { isLeaf: true, type: FieldMetadataType.TEXT, label: 'Message record ID', value: '' },
        messageThreadId: { isLeaf: true, type: FieldMetadataType.TEXT, label: 'Message thread ID', value: '' },
      };

    case 'DRAFT_EMAIL':
    case 'CREATE_CALENDAR_EVENT':
    case 'CRON':
    case 'FILTER':
    case 'DELAY':
    case 'EMPTY':
    default:
      return {};
  }
};

export const shouldComputeOutputSchemaOnFrontend = (
  stepType: string,
): boolean => {
  return !PERSISTED_OUTPUT_SCHEMA_TYPES.includes(stepType);
};

// filepath: src/modules/workflow/workflow-variables/hooks/useStepsOutputSchema.ts
export const useStepsOutputSchema = () => {
  const store = useStore();

  const populateStepsOutputSchema = useCallback(
    (workflowVersion: WorkflowVersion) => {
      const objectMetadataItems = store.get(objectMetadataItemsSelector.atom);

      workflowVersion.steps?.forEach((step) => {
        const stepKey = getStepOutputSchemaFamilyStateKey(
          workflowVersion.id,
          step.id,
        );

        if (!store.get(shouldRecomputeOutputSchemaFamilyState.atomFamily(stepKey))) {
          return;
        }

        const outputSchema = shouldComputeOutputSchemaOnFrontend(step.type)
          ? computeStepOutputSchema({ step, objectMetadataItems })
          : resolvePersistedStepOutputSchema({
              stepType: step.type,
              settings: step.settings,
            });

        store.set(stepsOutputSchemaFamilyState.atomFamily(stepKey), {
          id: step.id,
          name: step.name,
          type: step.type,
          icon: getActionIcon(step.type),
          outputSchema: (outputSchema ?? {}) as OutputSchemaV2,
          objectName: (step.settings?.input as { objectName?: string })?.objectName,
        });
        store.set(shouldRecomputeOutputSchemaFamilyState.atomFamily(stepKey), false);
      });
    },
    [store],
  );

  const markStepForRecomputation = useCallback(
    ({ stepId, workflowVersionId }: { stepId: string; workflowVersionId: string }) => {
      const stepKey = getStepOutputSchemaFamilyStateKey(workflowVersionId, stepId);
      store.set(shouldRecomputeOutputSchemaFamilyState.atomFamily(stepKey), true);
    },
    [store],
  );

  const deleteStepsOutputSchema = useCallback(
    ({ stepIds, workflowVersionId }: { stepIds: string[]; workflowVersionId: string }) => {
      stepIds.forEach((stepId) => {
        const stepKey = getStepOutputSchemaFamilyStateKey(workflowVersionId, stepId);
        store.set(stepsOutputSchemaFamilyState.atomFamily(stepKey), null);
        store.set(shouldRecomputeOutputSchemaFamilyState.atomFamily(stepKey), true);
      });
    },
    [store],
  );

  return {
    populateStepsOutputSchema,
    markStepForRecomputation,
    deleteStepsOutputSchema,
  };
};

// filepath: src/modules/workflow/hooks/useComputeStepOutputSchema.ts
export const useComputeStepOutputSchema = () => {
  const apolloCoreClient = useApolloCoreClient();
  const [mutate] = useMutation(COMPUTE_STEP_OUTPUT_SCHEMA, {
    client: apolloCoreClient,
  });

  const computeStepOutputSchema = async (
    input: ComputeStepOutputSchemaInput,
  ) => {
    return await mutate({ variables: { input } });
  };

  return { computeStepOutputSchema };
};

// filepath: src/modules/workflow/graphql/mutations/computeStepOutputSchema.ts
export const COMPUTE_STEP_OUTPUT_SCHEMA = gql`
  mutation ComputeStepOutputSchema($input: ComputeStepOutputSchemaInput!) {
    computeStepOutputSchema(input: $input)
  }
`;
```

## 2. 사용 예제

```tsx
// 사용 흐름: Step Output Schema Computation 패턴을 실제 호출부에서 조합한다.

// filepath: src/modules/workflow/workflow-diagram/components/WorkflowRunVisualizerEffect.tsx
const { populateStepsOutputSchema } = useStepsOutputSchema();

useEffect(() => {
  if (!isDefined(workflowVersion) || !isDefined(workflowRun?.state)) {
    return;
  }

  populateStepsOutputSchema({
    ...workflowVersion,
    trigger: workflowRun.state.flow.trigger,
    steps: workflowRun.state.flow.steps,
  });
}, [populateStepsOutputSchema, workflowRun?.state, workflowVersion]);

// filepath: src/modules/workflow/workflow-steps/hooks/useUpdateWorkflowVersionStep.ts
const { markStepForRecomputation } = useStepsOutputSchema();

const updateWorkflowVersionStep = async (
  input: UpdateWorkflowVersionStepInput,
) => {
  const result = await mutate({ variables: { input } });
  const updatedStep = result?.data?.updateWorkflowVersionStep;

  if (!isDefined(updatedStep)) {
    return;
  }

  markStepForRecomputation({
    stepId: updatedStep.id,
    workflowVersionId: input.workflowVersionId,
  });
};
```
