/**
 * flow.ts
 * -------
 * Tipos base para los datos de flujo.
 * Define la estructura de nodos, conexiones y procesos.
 */

import type { Node, Edge } from '@xyflow/react';

/**
 * Datos de un flujo
 * @property nodes - Lista de nodos en el flujo
 * @property edges - Lista de conexiones entre nodos
 * @property processes - Mapa de subprocesos anidados
 */
export interface FlowData {
  nodes: Node[];                                  // Nodos del flujo
  edges: Edge[];                                  // Conexiones entre nodos
  processes: { [processId: string]: ProcessFlow };// Subprocesos por ID
}

/**
 * Proceso anidado
 * Extiende FlowData agregando metadatos del proceso.
 * 
 * @property id - ID único del proceso
 * @property name - Nombre para mostrar
 * @property description - Descripción opcional
 * @extends FlowData - Hereda nodos y conexiones
 */
export interface ProcessFlow extends FlowData {
  id: string;           // ID único
  name: string;         // Nombre del proceso
  description?: string; // Descripción opcional
}