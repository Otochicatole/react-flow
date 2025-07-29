'use client'
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Node,
  type Edge,
  type NodeChange,
  type EdgeChange,
  type Connection,
  type XYPosition
} from '@xyflow/react';
import { createContext, useContext, useCallback, useState, ReactNode, useEffect } from 'react';
import { CustomNode } from '@/components/common/custom-node';
import { 
  EventNode, 
  CommandNode, 
  QueryNode, 
  AggregateNode, 
  ServiceNode, 
  MessageBusNode 
} from '@/components/common/node-types';
import { useProject } from './project-context';

// Node types configuration
export const nodeTypes = {
  custom: CustomNode,
  event: EventNode,
  command: CommandNode,
  query: QueryNode,
  aggregate: AggregateNode,
  service: ServiceNode,
  messageBus: MessageBusNode,
};

// Helper function to generate unique IDs
const generateNodeId = () => `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Helper function to get default node label
const getDefaultNodeLabel = (type: string): string => {
  const labels = {
    event: 'New Event',
    command: 'New Command',
    query: 'New Query',
    aggregate: 'New Aggregate',
    service: 'New Service',
    messageBus: 'New Message Bus',
    custom: 'New Node'
  };
  return labels[type as keyof typeof labels] || 'New Node';
};

// Context interface
interface NodesContextType {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (params: Connection) => void;
  nodeTypes: typeof nodeTypes;
  addNode: (type: string, position: XYPosition) => void;
  deleteNode: (nodeId: string) => void;
  deleteEdge: (edgeId: string) => void;
  updateNodeLabel: (nodeId: string, newLabel: string) => void;
}

// Create context
const NodesContext = createContext<NodesContextType | undefined>(undefined);

// Provider component
interface NodesProviderProps {
  children: ReactNode;
}

export function NodesProvider({ children }: NodesProviderProps) {
  const { 
    currentProject, 
    updateCurrentProjectNodes, 
    updateCurrentProjectEdges 
  } = useProject();

  // Use project data or fallback to empty arrays
  const nodes = currentProject?.nodes || [];
  const edges = currentProject?.edges || [];

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      const updatedNodes = applyNodeChanges(changes, nodes);
      updateCurrentProjectNodes(updatedNodes);
    },
    [nodes, updateCurrentProjectNodes],
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      const updatedEdges = applyEdgeChanges(changes, edges);
      updateCurrentProjectEdges(updatedEdges);
    },
    [edges, updateCurrentProjectEdges],
  );

  const onConnect = useCallback(
    (params: Connection) => {
      const updatedEdges = addEdge(params, edges);
      updateCurrentProjectEdges(updatedEdges);
    },
    [edges, updateCurrentProjectEdges],
  );

  const addNode = useCallback((type: string, position: XYPosition) => {
    const newNode: Node = {
      id: generateNodeId(),
      type,
      position,
      data: { label: getDefaultNodeLabel(type) },
    };

    const updatedNodes = [...nodes, newNode];
    updateCurrentProjectNodes(updatedNodes);
  }, [nodes, updateCurrentProjectNodes]);

  const deleteNode = useCallback((nodeId: string) => {
    const updatedNodes = nodes.filter(node => node.id !== nodeId);
    const updatedEdges = edges.filter(edge => edge.source !== nodeId && edge.target !== nodeId);
    
    updateCurrentProjectNodes(updatedNodes);
    updateCurrentProjectEdges(updatedEdges);
  }, [nodes, edges, updateCurrentProjectNodes, updateCurrentProjectEdges]);

  const deleteEdge = useCallback((edgeId: string) => {
    const updatedEdges = edges.filter(edge => edge.id !== edgeId);
    updateCurrentProjectEdges(updatedEdges);
  }, [edges, updateCurrentProjectEdges]);

  const updateNodeLabel = useCallback((nodeId: string, newLabel: string) => {
    const updatedNodes = nodes.map(node => 
      node.id === nodeId 
        ? { ...node, data: { ...node.data, label: newLabel } }
        : node
    );
    updateCurrentProjectNodes(updatedNodes);
  }, [nodes, updateCurrentProjectNodes]);

  return (
    <NodesContext.Provider value={{
      nodes,
      edges,
      onNodesChange,
      onEdgesChange,
      onConnect,
      nodeTypes,
      addNode,
      deleteNode,
      deleteEdge,
      updateNodeLabel
    }}>
      {children}
    </NodesContext.Provider>
  );
}

// Custom hook to use the context
export function useNodes() {
  const context = useContext(NodesContext);
  if (context === undefined) {
    throw new Error('useNodes must be used within a NodesProvider');
  }
  return context;
} 