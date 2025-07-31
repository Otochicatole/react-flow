// Node types and interfaces for the application

export interface BaseNodeProps {
  data: Record<string, unknown>;
  selected?: boolean;
}

export interface NodeTypeItem {
  type: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  color: string;
}

export interface NodeCategory {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  nodes: NodeTypeItem[];
}

export interface CustomNodeData {
  label: string;
  type: string;
  subType?: string;
}

export interface ProcessNodeData extends CustomNodeData {
  processId?: string;
  expanded?: boolean;
}

export type NodeType = 
  | 'custom'
  | 'process'
  | 'event'
  | 'command'
  | 'query'
  | 'aggregate'
  | 'service'
  | 'messageBus'
  | 'start'
  | 'end'
  | 'decision'
  | 'inputOutput'
  | 'textInput'
  | 'document'
  | 'database'
  | 'connector'
  | 'andGate'
  | 'orGate'
  | 'xorGate'
  | 'notGate'
  | 'task'
  | 'milestone';