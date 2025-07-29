'use client'
import { useCallback } from 'react';
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type NodeChange,
  type EdgeChange,
  type Connection,
  type XYPosition,
  type Node,
  type Edge,
} from '@xyflow/react';
import { useProjectStore } from '@/context/project-store';
import type { Project, FlowData } from '@/context/project-store';
import { CustomNode } from '@/components/common/custom-node';
import { ProcessNode } from '@/components/common/process-node';
import {
  EventNode,
  CommandNode,
  QueryNode,
  AggregateNode,
  ServiceNode,
  MessageBusNode,
} from '@/components/common/node-types';

// Helper to generate IDs
const generateId = (prefix: string) => `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const getDefaultNodeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    event: 'New Event',
    command: 'New Command',
    query: 'New Query',
    aggregate: 'New Aggregate',
    service: 'New Service',
    messageBus: 'New Message Bus',
    process: 'New Process',
    custom: 'New Node',
  };
  return labels[type] ?? 'New Node';
};

// compute flow helper (similar to old getCurrentFlow)
function getCurrentFlow(project: Project, processPath: string[]): FlowData {
  if (processPath.length === 0) return project;
  let current: FlowData = project;
  for (const pid of processPath) {
    current = current.processes[pid];
  }
  return current;
}

// Node types configuration (re-used)
export const nodeTypes = {
  custom: CustomNode,
  process: ProcessNode,
  event: EventNode,
  command: CommandNode,
  query: QueryNode,
  aggregate: AggregateNode,
  service: ServiceNode,
  messageBus: MessageBusNode,
};

export function useCanvas() {
  const { state, dispatch } = useProjectStore();
  const { currentProject, currentProcessPath } = state;

  const currentFlow = currentProject ? getCurrentFlow(currentProject, currentProcessPath) : null;
  const nodes: Node[] = currentFlow?.nodes || [];
  const edges: Edge[] = currentFlow?.edges || [];

  // --- callbacks ---
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      const updated = applyNodeChanges(changes, nodes);
      dispatch({ type: 'UPDATE_NODES', nodes: updated });
    },
    [nodes, dispatch],
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      const updated = applyEdgeChanges(changes, edges);
      dispatch({ type: 'UPDATE_EDGES', edges: updated });
    },
    [edges, dispatch],
  );

  const onConnect = useCallback(
    (params: Connection) => {
      const updated = addEdge(params, edges);
      dispatch({ type: 'UPDATE_EDGES', edges: updated });
    },
    [edges, dispatch],
  );

  const addNode = useCallback(
    (type: string, position: XYPosition) => {
      if (!currentProject) return;
      if (type === 'process') {
        const count = nodes.filter(n => n.type === 'process').length + 1;
        dispatch({ type: 'CREATE_PROCESS', name: `Process ${count}`, description: 'New process description', position });
      } else {
        const newNode = {
          id: generateId('node'),
          type,
          position,
          data: { label: getDefaultNodeLabel(type) },
        } as Node;
        dispatch({ type: 'UPDATE_NODES', nodes: [...nodes, newNode] });
      }
    },
    [nodes, dispatch, currentProject],
  );

  const deleteNode = useCallback(
    (nodeId: string) => {
      const updatedNodes = nodes.filter(n => n.id !== nodeId);
      const updatedEdges = edges.filter(e => e.source !== nodeId && e.target !== nodeId);
      dispatch({ type: 'UPDATE_NODES', nodes: updatedNodes });
      dispatch({ type: 'UPDATE_EDGES', edges: updatedEdges });
    },
    [nodes, edges, dispatch],
  );

  const deleteEdge = useCallback(
    (edgeId: string) => {
      const updatedEdges = edges.filter(e => e.id !== edgeId);
      dispatch({ type: 'UPDATE_EDGES', edges: updatedEdges });
    },
    [edges, dispatch],
  );

  const updateNodeLabel = useCallback(
    (nodeId: string, newLabel: string) => {
      const updatedNodes = nodes.map(n =>
        n.id === nodeId ? { ...n, data: { ...n.data, label: newLabel, _forceUpdate: Date.now() } } : n,
      );
      dispatch({ type: 'UPDATE_NODES', nodes: updatedNodes });

      const target = nodes.find(n => n.id === nodeId);
      if (target?.type === 'process') {
        const procId = (target.data as { processId?: string }).processId;
        if (procId) {
          dispatch({ type: 'UPDATE_PROCESS_NAME', processId: procId, newName: newLabel });
        }
      }
    },
    [nodes, dispatch],
  );

  return {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    deleteNode,
    deleteEdge,
    updateNodeLabel,
    nodeTypes,
  } as const;
} 