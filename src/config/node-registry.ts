/**
 * node-registry.ts
 * --------------
 * Registro central de tipos de nodo.
 * Mapea tipos a componentes React.
 */

import { CustomNode } from '@/components/common/custom-node';
import { ProcessNode } from '@/components/common/process-node';
import {
  // Event-driven
  EventNode,
  CommandNode,
  QueryNode,
  AggregateNode,
  ServiceNode,
  MessageBusNode,
  
  // Flowchart
  StartNode,
  EndNode,
  DecisionNode,
  InputOutputNode,
  TextInputNode,
  DocumentNode,
  DatabaseNode,
  ConnectorNode,
  
  // Logic gates
  AndGateNode,
  OrGateNode,
  XorGateNode,
  NotGateNode,
  
  // Project
  TaskNode,
  MilestoneNode,
} from '@/components/common/node-types';

/**
 * Registro de tipos de nodo
 * Mapea cada tipo a su componente.
 * 
 * Agrupados por categoría:
 * - Base: custom, process
 * - Event-driven: event, command, etc
 * - Flowchart: start, end, etc
 * - Logic gates: and, or, etc
 * - Project: task, milestone
 */
export const NODE_TYPE_REGISTRY = {
  // Nodos base
  custom: CustomNode,     // Nodo personalizado
  process: ProcessNode,   // Proceso anidado

  // Event-driven
  event: EventNode,       // Evento del dominio
  command: CommandNode,   // Comando
  query: QueryNode,       // Consulta
  aggregate: AggregateNode, // Agregado
  service: ServiceNode,   // Servicio
  messageBus: MessageBusNode, // Bus de mensajes

  // Flowchart
  start: StartNode,       // Inicio de flujo
  end: EndNode,          // Fin de flujo
  decision: DecisionNode, // Decisión/condición
  inputOutput: InputOutputNode, // Input/Output
  textInput: TextInputNode, // Input de texto
  document: DocumentNode, // Documento
  database: DatabaseNode, // Base de datos
  connector: ConnectorNode, // Conector

  // Logic gates
  andGate: AndGateNode,  // AND
  orGate: OrGateNode,    // OR
  xorGate: XorGateNode,  // XOR
  notGate: NotGateNode,  // NOT

  // Project
  task: TaskNode,        // Tarea
  milestone: MilestoneNode, // Hito
} as const;

/**
 * Tipo para nodos registrados
 * Union type de todas las keys del registro.
 */
export type RegisteredNodeType = keyof typeof NODE_TYPE_REGISTRY;