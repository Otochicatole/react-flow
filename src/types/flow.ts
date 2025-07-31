import type { Node, Edge } from '@xyflow/react';

export interface FlowData {
  nodes: Node[];
  edges: Edge[];
  processes: { [processId: string]: ProcessFlow };
}

export interface ProcessFlow extends FlowData {
  id: string;
  name: string;
  description?: string;
}