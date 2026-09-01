# Workflow Diagram Generation

workflow trigger와 step 배열을 React Flow가 렌더링할 `nodes` / `edges`로 변환하는 패턴이다.

핵심은 `domain flow data in, visual graph out`이다.

## 1. 모듈 코드

- `src/modules/workflow/workflow-diagram/utils/generateWorkflowDiagram.ts`: trigger와 steps를 순회하며 node/edge 생성을 step type별 generator에 위임한다.
- `src/modules/workflow/workflow-diagram/utils/generateNodesAndEdgesForDefaultNode.ts`: 일반 action step을 action node와 default outgoing edges로 변환한다.
- `src/modules/workflow/workflow-diagram/utils/generateNodesAndEdgesForIfElseNode.ts`: branch별 label과 edge policy를 가진 IF/ELSE edges를 만든다.
- `src/modules/workflow/workflow-diagram/utils/generateNodesAndEdgesForIteratorNode.ts`: iterator의 completed edge와 loop handle edge를 분리해서 만든다.
- `src/modules/workflow/workflow-diagram/utils/generateWorkflowRunDiagram.ts`: workflow diagram에 run status를 합성하고 열어야 할 pending/running step을 찾는다.

```tsx
// filepath: src/modules/workflow/workflow-diagram/utils/generateWorkflowDiagram.ts
export const generateWorkflowDiagram = ({
  trigger,
  steps,
  workflowContext,
}: {
  trigger: WorkflowTrigger | undefined;
  steps: Array<WorkflowStep>;
  workflowContext: WorkflowContext;
}): WorkflowDiagram => {
  let nodes: Array<WorkflowDiagramNode> = [];
  let edges: Array<WorkflowDiagramEdge> = [];

  const edgeTypeBetweenTwoNodes = getEdgeTypeBetweenTwoNodes({
    workflowContext,
  });

  if (isDefined(trigger)) {
    nodes.push(getWorkflowDiagramTriggerNode({ trigger }));
  } else {
    nodes.push(WORKFLOW_DIAGRAM_EMPTY_TRIGGER_NODE_DEFINITION);
  }

  for (const stepLinkToTriggerId of trigger?.nextStepIds ?? []) {
    edges.push({
      ...WORKFLOW_VISUALIZER_EDGE_DEFAULT_CONFIGURATION,
      type: edgeTypeBetweenTwoNodes,
      id: v4(),
      source: TRIGGER_STEP_ID,
      sourceHandle: WORKFLOW_DIAGRAM_NODE_DEFAULT_SOURCE_HANDLE_ID,
      target: stepLinkToTriggerId,
      ...(workflowContext === 'workflow'
        ? { deletable: true, selectable: true, reconnectable: 'target' }
        : {}),
      targetHandle: WORKFLOW_DIAGRAM_NODE_DEFAULT_TARGET_HANDLE_ID,
    });
  }

  const xPos = FIRST_NODE_POSITION.x;
  let levelYPos = FIRST_NODE_POSITION.y;

  for (const step of steps) {
    levelYPos += VERTICAL_DISTANCE_BETWEEN_TWO_NODES;

    switch (step.type) {
      case 'ITERATOR':
        ({ nodes, edges } = generateNodesAndEdgesForIteratorNode({
          step,
          steps,
          xPos,
          yPos: levelYPos,
          nodes,
          edges,
          workflowContext,
        }));
        break;
      case 'IF_ELSE':
        ({ nodes, edges } = generateNodesAndEdgesForIfElseNode({
          step,
          steps,
          xPos,
          yPos: levelYPos,
          nodes,
          edges,
          workflowContext,
        }));
        break;
      default:
        ({ nodes, edges } = generateNodesAndEdgesForDefaultNode({
          step,
          steps,
          xPos,
          yPos: levelYPos,
          nodes,
          edges,
          workflowContext,
        }));
        break;
    }
  }

  return { nodes, edges };
};

// filepath: src/modules/workflow/workflow-diagram/utils/generateNodesAndEdgesForDefaultNode.ts
export const generateNodesAndEdgesForDefaultNode = ({
  step,
  steps,
  xPos,
  yPos,
  nodes,
  edges,
  workflowContext,
}: GenerateNodeParams): WorkflowDiagram => {
  const updatedNodes = [...nodes];
  const updatedEdges = [...edges];

  updatedNodes.push({
    id: step.id,
    data: {
      nodeType: 'action',
      actionType: step.type,
      name: step.name,
      hasNextStepIds: isDefined(step.nextStepIds) && step.nextStepIds.length > 0,
      stepId: step.id,
      position: step.position ?? { x: xPos, y: yPos },
    } satisfies WorkflowDiagramStepNodeData,
    position: step.position ?? { x: xPos, y: yPos },
  });

  for (const nextStepId of step.nextStepIds ?? []) {
    updatedEdges.push({
      ...WORKFLOW_VISUALIZER_EDGE_DEFAULT_CONFIGURATION,
      type: getEdgeTypeBetweenTwoNodes({ workflowContext }),
      id: v4(),
      source: step.id,
      sourceHandle: WORKFLOW_DIAGRAM_NODE_DEFAULT_SOURCE_HANDLE_ID,
      target: nextStepId,
      targetHandle: WORKFLOW_DIAGRAM_NODE_DEFAULT_TARGET_HANDLE_ID,
      data: {
        ...WORKFLOW_VISUALIZER_EDGE_DEFAULT_CONFIGURATION.data,
        edgePathStrategy: getEdgePathStrategy({ step, steps, nextStepId }),
      },
    });
  }

  return { nodes: updatedNodes, edges: updatedEdges };
};

// filepath: src/modules/workflow/workflow-diagram/utils/generateNodesAndEdgesForIfElseNode.ts
export const generateNodesAndEdgesForIfElseNode = ({
  step,
  steps,
  xPos,
  yPos,
  nodes,
  edges,
  workflowContext,
}: GenerateIfElseNodeParams): WorkflowDiagram => {
  const updatedNodes = [...nodes];
  const updatedEdges = [...edges];

  updatedNodes.push({
    id: step.id,
    data: {
      nodeType: 'action',
      actionType: step.type,
      name: step.name,
      hasNextStepIds: true,
      stepId: step.id,
      position: step.position ?? { x: xPos, y: yPos },
    } satisfies WorkflowDiagramStepNodeData,
    position: step.position ?? { x: xPos, y: yPos },
  });

  const branches = step.settings?.input?.branches ?? [];
  const totalBranches = branches.length;

  branches.forEach((branch, branchIndex) => {
    const label = getBranchLabel({ branchIndex, totalBranches, branch });

    for (const nextStepId of branch.nextStepIds) {
      updatedEdges.push({
        ...WORKFLOW_VISUALIZER_EDGE_DEFAULT_CONFIGURATION,
        type: getEdgeTypeBetweenTwoNodes({ workflowContext }),
        id: v4(),
        source: step.id,
        target: nextStepId,
        deletable: false,
        selectable: false,
        reconnectable: false,
        data: {
          ...WORKFLOW_VISUALIZER_EDGE_DEFAULT_CONFIGURATION.data,
          labelOptions: { position: Position.Bottom, label },
          edgePathStrategy: getEdgePathStrategy({ step, steps, nextStepId }),
        },
      });
    }
  });

  return { nodes: updatedNodes, edges: updatedEdges };
};

// filepath: src/modules/workflow/workflow-diagram/utils/generateNodesAndEdgesForIteratorNode.ts
export const generateNodesAndEdgesForIteratorNode = ({
  step,
  steps,
  xPos,
  yPos,
  nodes,
  edges,
  workflowContext,
}: GenerateIteratorNodeParams): WorkflowDiagram => {
  const updatedNodes = [...nodes];
  const updatedEdges = [...edges];

  updatedNodes.push({
    id: step.id,
    data: {
      nodeType: 'action',
      actionType: step.type,
      name: step.name,
      hasNextStepIds: isDefined(step.nextStepIds) && step.nextStepIds.length > 0,
      stepId: step.id,
      position: step.position ?? { x: xPos, y: yPos },
      defaultHandleOptions: { label: msg`completed` },
      rightHandleOptions: { id: WORKFLOW_DIAGRAM_ITERATOR_NODE_LOOP_HANDLE_ID },
    } satisfies WorkflowDiagramStepNodeData,
    position: step.position ?? { x: xPos, y: yPos },
  });

  for (const initialLoopStepId of initialLoopStepIds) {
    updatedEdges.push({
      ...WORKFLOW_VISUALIZER_EDGE_DEFAULT_CONFIGURATION,
      type: getEdgeTypeBetweenTwoNodes({ workflowContext }),
      id: v4(),
      source: step.id,
      sourceHandle: WORKFLOW_DIAGRAM_ITERATOR_NODE_LOOP_HANDLE_ID,
      target: initialLoopStepId,
      data: {
        ...WORKFLOW_VISUALIZER_EDGE_DEFAULT_CONFIGURATION.data,
        labelOptions: { position: Position.Right, label: msg`loop` },
        edgePathStrategy: 'smooth-step-path-to-target',
      },
    });
  }

  for (const nextStepId of step.nextStepIds ?? []) {
    updatedEdges.push({
      ...WORKFLOW_VISUALIZER_EDGE_DEFAULT_CONFIGURATION,
      type: getEdgeTypeBetweenTwoNodes({ workflowContext }),
      id: v4(),
      source: step.id,
      target: nextStepId,
      data: {
        ...WORKFLOW_VISUALIZER_EDGE_DEFAULT_CONFIGURATION.data,
        labelOptions: { position: Position.Bottom, label: msg`completed` },
        edgePathStrategy: getEdgePathStrategy({ step, steps, nextStepId }),
      },
    });
  }

  return { nodes: updatedNodes, edges: updatedEdges };
};

// filepath: src/modules/workflow/workflow-diagram/utils/generateWorkflowRunDiagram.ts
export const generateWorkflowRunDiagram = ({
  trigger,
  steps,
  stepInfos,
}: {
  trigger: WorkflowTrigger;
  steps: Array<WorkflowStep>;
  stepInfos: WorkflowRunStepInfos | undefined;
}) => {
  let stepToOpenByDefault: { id: string; data: WorkflowRunDiagramStepNodeData } | undefined;

  const workflowDiagram = generateWorkflowDiagram({
    trigger,
    steps,
    workflowContext: 'workflow-run',
  });

  const nodes = workflowDiagram.nodes.filter(isStepNode).map((node) => {
    const stepInfo = stepInfos?.[node.id];
    const nodeData = {
      ...node.data,
      runStatus: stepInfo?.status ?? StepStatus.NOT_STARTED,
    };

    if (!isDefined(stepToOpenByDefault) && shouldOpenStep({ nodeId: node.id, steps, stepInfos })) {
      stepToOpenByDefault = { id: node.id, data: nodeData };
    }

    return { ...node, data: nodeData };
  });

  const edges = workflowDiagram.edges.map((edge) => ({
    ...edge,
    type: 'readonly' satisfies WorkflowDiagramEdgeType,
    data: {
      ...edge.data,
      edgeType: 'default',
      edgeExecutionStatus:
        stepInfos?.[edge.source]?.status ?? StepStatus.NOT_STARTED,
    } satisfies WorkflowDiagramEdgeData,
  }));

  return { diagram: { nodes, edges }, stepToOpenByDefault };
};
```

## 2. 사용 예제

```tsx
// filepath: src/modules/workflow/workflow-diagram/components/WorkflowRunVisualizerEffect.tsx
const { diagram: generatedWorkflowRunDiagram, stepToOpenByDefault } =
  generateWorkflowRunDiagram({
    trigger: workflowRunState.flow.trigger,
    steps: workflowRunState.flow.steps,
    stepInfos: workflowRunState.stepInfos,
  });

const previousNodesById = new Map(
  (store.get(workflowDiagram)?.nodes ?? []).map((node) => [node.id, node]),
);

const baseWorkflowRunDiagram = {
  ...generatedWorkflowRunDiagram,
  nodes: generatedWorkflowRunDiagram.nodes.map((node) => {
    const previousNode = previousNodesById.get(node.id);

    if (!isDefined(previousNode?.measured)) {
      return node;
    }

    return {
      ...node,
      measured: previousNode.measured,
      width: previousNode.width,
      height: previousNode.height,
    };
  }),
};

if (!isDefined(stepToOpenByDefault)) {
  store.set(workflowDiagram, baseWorkflowRunDiagram);
  return;
}
```
