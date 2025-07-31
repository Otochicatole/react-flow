
/**
 * node.ts
 * -------
 * Tipos relacionados con nodos y sus categorías.
 * Define la estructura de nodos y sus metadatos.
 */

/**
 * Props base para componentes de nodo
 * @property data - Datos del nodo (tipado genérico)
 * @property selected - Si el nodo está seleccionado
 */
export interface BaseNodeProps {
  data: Record<string, unknown>; // Datos genéricos
  selected?: boolean;           // Estado de selección
}

/**
 * Item de tipo de nodo
 * @property type - Tipo interno del nodo
 * @property label - Nombre para mostrar
 * @property icon - Ícono de React
 * @property description - Descripción corta
 * @property color - Color de acento
 */
export interface NodeTypeItem {
  type: string;          // Tipo interno
  label: string;         // Nombre visible
  icon: React.ReactNode; // Ícono del nodo
  description: string;   // Descripción
  color: string;         // Color (#hex)
}

/**
 * Categoría de nodos
 * @property id - ID único de categoría
 * @property label - Nombre para mostrar
 * @property icon - Ícono de React
 * @property description - Descripción corta
 * @property nodes - Lista de nodos
 */
export interface NodeCategory {
  id: string;            // ID único
  label: string;         // Nombre visible
  icon: React.ReactNode; // Ícono de categoría
  description: string;   // Descripción
  nodes: NodeTypeItem[]; // Nodos incluidos
}

/**
 * Datos de nodo personalizado
 * @property label - Nombre para mostrar
 * @property type - Tipo del nodo
 * @property subType - Subtipo opcional
 */
export interface CustomNodeData {
  label: string;     // Nombre visible
  type: string;      // Tipo de nodo
  subType?: string;  // Subtipo opcional
}

/**
 * Datos de nodo de proceso
 * Extiende CustomNodeData con datos específicos de proceso.
 * 
 * @property processId - ID del proceso anidado
 * @property expanded - Si está expandido
 * @extends CustomNodeData - Hereda label y type
 */
export interface ProcessNodeData extends CustomNodeData {
  processId?: string; // ID del proceso
  expanded?: boolean; // Estado expandido
}

/**
 * Tipos de nodo disponibles
 * Union type con todos los tipos posibles.
 * 
 * Agrupados por categoría:
 * - Nodos base (custom, process)
 * - Event-driven (event, command, etc)
 * - Flowchart (start, end, etc)
 * - Logic gates (and, or, etc)
 * - Project (task, milestone)
 */
export type NodeType = 
  // Nodos base
  | 'custom'     // Nodo personalizado
  | 'process'    // Proceso anidado
  
  // Event-driven
  | 'event'      // Evento
  | 'command'    // Comando
  | 'query'      // Consulta
  | 'aggregate'  // Agregado
  | 'service'    // Servicio
  | 'messageBus' // Bus de mensajes
  
  // Flowchart
  | 'start'      // Inicio
  | 'end'        // Fin
  | 'decision'   // Decisión
  | 'inputOutput'// Input/Output
  | 'textInput'  // Input de texto
  | 'document'   // Documento
  | 'database'   // Base de datos
  | 'connector'  // Conector
  
  // Logic gates
  | 'andGate'    // AND
  | 'orGate'     // OR
  | 'xorGate'    // XOR
  | 'notGate'    // NOT
  
  // Project
  | 'task'       // Tarea
  | 'milestone'; // Hito