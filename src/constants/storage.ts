/**
 * storage.ts
 * ---------
 * Constantes para persistencia en localStorage.
 * Todas las constantes son readonly (as const).
 */

/**
 * Claves de localStorage
 * @property PROJECTS - Proyectos guardados
 * @property CUSTOM_NODES - Nodos personalizados
 */
export const STORAGE_KEYS = {
  PROJECTS: 'react-flow-projects',       // Lista de proyectos
  CUSTOM_NODES: 'react-flow-custom-nodes',// Nodos personalizados
} as const;

/**
 * Configuración de la app
 * @property VERSION - Versión para migración de datos
 * @property API_DELAY - Delay simulado (ms)
 */
export const APP_CONFIG = {
  VERSION: '1.0.0',  // Para migración de datos
  API_DELAY: 500,    // 500ms de delay simulado
} as const;