/**
 * project.ts
 * ---------
 * Tipos relacionados con proyectos y su estado.
 * Define la estructura de proyectos y su gestión.
 */

import type { FlowData } from './flow';

/**
 * Proyecto
 * Extiende FlowData agregando metadatos del proyecto.
 * 
 * @property id - ID único del proyecto
 * @property name - Nombre para mostrar
 * @property description - Descripción opcional
 * @property createdAt - Fecha de creación
 * @property updatedAt - Fecha de última modificación
 * @extends FlowData - Hereda nodos y conexiones
 */
export interface Project extends FlowData {
  id: string;           // ID único
  name: string;         // Nombre del proyecto
  description?: string; // Descripción opcional
  createdAt: Date;      // Fecha de creación
  updatedAt: Date;      // Última modificación
}

/**
 * Estado global del proyecto
 * Mantiene el estado actual y el historial.
 * 
 * @property projects - Lista de proyectos
 * @property currentProject - Proyecto activo
 * @property currentProcessPath - Ruta al proceso actual
 * @property past - Historial para deshacer
 * @property future - Historial para rehacer
 * @property customNodeTypes - Nodos personalizados
 * @property showExecutionFlow - Toggle de flujo de ejecución
 */
export interface ProjectState {
  projects: Project[];           // Lista de proyectos
  currentProject: Project | null;// Proyecto activo
  currentProcessPath: string[]; // Ruta de proceso
  past: Project[];             // Para deshacer
  future: Project[];           // Para rehacer
  customNodeTypes: CustomNodeType[]; // Nodos custom
  showExecutionFlow: boolean;  // Toggle ejecución
}

/**
 * Tipo de nodo personalizado
 * Define un nodo custom con dirección.
 * 
 * @property name - Nombre único del nodo
 * @property dir - Dirección del flujo
 */
export interface CustomNodeType {
  name: string;        // Nombre único
}

/**
 * Datos de exportación
 * Estructura para exportar/importar proyectos.
 * 
 * @property projects - Lista de proyectos
 * @property customNodeTypes - Nodos personalizados
 * @property exportedAt - Fecha de exportación
 * @property version - Versión del formato
 */
export interface ProjectExportData {
  projects: Project[];           // Proyectos
  customNodeTypes: CustomNodeType[]; // Nodos custom
  exportedAt: Date;             // Fecha export
  version: string;              // Versión
}

/**
 * Opciones de importación
 * Configura cómo importar proyectos.
 * 
 * @property merge - Combinar con existentes
 * @property replaceExisting - Reemplazar si existe
 */
export interface ImportOptions {
  merge?: boolean;           // Combinar
  replaceExisting?: boolean; // Reemplazar
}