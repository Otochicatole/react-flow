
/**
 * id-generator.ts
 * -------------
 * Utilidades para generar IDs únicos.
 * Combina timestamp y random para unicidad.
 */

/**
 * Genera un ID único con prefijo.
 * Formato: prefix_timestamp_random
 * 
 * @param prefix - Prefijo para el ID
 * @returns ID único con prefijo
 * 
 * @example
 * const id = generateId('custom');
 * // custom_1234567890_abc123def
 */
export const generateId = (prefix: string): string => {
  // Timestamp actual en ms
  const timestamp = Date.now();
  
  // String random base36 (0-9a-z)
  const random = Math.random().toString(36).substr(2, 9);
  
  // Combinar componentes
  return `${prefix}_${timestamp}_${random}`;
};

/**
 * Genera ID para proyecto.
 * @returns ID con prefijo 'project'
 * 
 * @example
 * const projectId = generateProjectId();
 * // project_1234567890_abc123def
 */
export const generateProjectId = (): string => generateId('project');

/**
 * Genera ID para nodo.
 * @returns ID con prefijo 'node'
 * 
 * @example
 * const nodeId = generateNodeId();
 * // node_1234567890_abc123def
 */
export const generateNodeId = (): string => generateId('node');

/**
 * Genera ID para proceso.
 * @returns ID con prefijo 'process'
 * 
 * @example
 * const processId = generateProcessId();
 * // process_1234567890_abc123def
 */
export const generateProcessId = (): string => generateId('process');

/**
 * Genera ID para conexión.
 * @returns ID con prefijo 'edge'
 * 
 * @example
 * const edgeId = generateEdgeId();
 * // edge_1234567890_abc123def
 */
export const generateEdgeId = (): string => generateId('edge');