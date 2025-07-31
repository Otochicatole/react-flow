import type { NodeType } from '@/types';

export const NODE_LABELS: Record<NodeType, string> = {

  event: 'New Event',
  command: 'New Command',
  query: 'New Query',
  aggregate: 'New Aggregate',
  service: 'New Service',
  messageBus: 'New Message Bus',
  process: 'New Process',
  custom: 'New Node',

  start: 'Start',
  end: 'End',
  decision: 'Decision',
  inputOutput: 'Input/Output',
  textInput: 'Text Input',
  document: 'Document',
  database: 'Database',
  connector: 'Connector',

  andGate: 'AND Gate',
  orGate: 'OR Gate',
  xorGate: 'XOR Gate',
  notGate: 'NOT Gate',

  task: 'Task',
  milestone: 'Milestone',
} as const;

export const NODE_DESCRIPTIONS: Record<NodeType, string> = {

  event: 'Domain events that represent something that happened',
  command: 'Actions that should be performed in the system',
  query: 'Read operations to retrieve data from the system',
  aggregate: 'Business logic containers that ensure consistency',
  service: 'Application services that orchestrate business logic',
  messageBus: 'Communication infrastructure for events and commands',
  process: 'Nested process container for complex workflows',
  custom: 'Custom user-defined node type',

  start: 'Beginning point of process flow',
  end: 'Termination point of process flow',
  decision: 'Conditional branching point',
  inputOutput: 'Data input or output operation',
  textInput: 'Generic text input field',
  document: 'Document or report generation',
  database: 'Data storage or retrieval',
  connector: 'Junction point for multiple flows',

  andGate: 'Logical AND operation',
  orGate: 'Logical OR operation',
  xorGate: 'Logical exclusive OR operation',
  notGate: 'Logical NOT operation (inversion)',

  task: 'Project task or work item',
  milestone: 'Project milestone or checkpoint',
} as const;