import { CustomNode } from '@/components/common/custom-node';
import { ProcessNode } from '@/components/common/process-node';
import {
  EventNode,
  CommandNode,
  QueryNode,
  AggregateNode,
  ServiceNode,
  MessageBusNode,
  StartNode,
  EndNode,
  DecisionNode,
  InputOutputNode,
  TextInputNode,
  DocumentNode,
  DatabaseNode,
  ConnectorNode,
  AndGateNode,
  OrGateNode,
  XorGateNode,
  NotGateNode,
  TaskNode,
  MilestoneNode,
} from '@/components/common/node-types';

/**
 * Registry of all available node types with their React components
 * This is used by React Flow to render the appropriate component for each node type
 */
export const NODE_TYPE_REGISTRY = {
  // Core system nodes
  custom: CustomNode,
  process: ProcessNode,
  
  // Event-driven architecture nodes
  event: EventNode,
  command: CommandNode,
  query: QueryNode,
  aggregate: AggregateNode,
  service: ServiceNode,
  messageBus: MessageBusNode,
  
  // Flowchart nodes
  start: StartNode,
  end: EndNode,
  decision: DecisionNode,
  inputOutput: InputOutputNode,
  textInput: TextInputNode,
  document: DocumentNode,
  database: DatabaseNode,
  connector: ConnectorNode,
  
  // Logic gates
  andGate: AndGateNode,
  orGate: OrGateNode,
  xorGate: XorGateNode,
  notGate: NotGateNode,
  
  // Project management nodes
  task: TaskNode,
  milestone: MilestoneNode,
} as const;

export type RegisteredNodeType = keyof typeof NODE_TYPE_REGISTRY;