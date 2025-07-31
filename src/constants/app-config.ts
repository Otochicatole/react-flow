/**
 * app-config.ts
 * ------------
 * Configuración global de la aplicación.
 * Todas las constantes son readonly (as const).
 */

/**
 * Metadatos de la aplicación
 * @property NAME - Nombre de la app
 * @property VERSION - Versión actual
 * @property DESCRIPTION - Descripción corta
 */
export const APP_METADATA = {
  NAME: 'React Flow Diagrammer',
  VERSION: '1.0.0',
  DESCRIPTION: 'A flow and process diagrammer supporting complex projects with nested subflows',
} as const;

/**
 * Configuración de performance
 * @property API_DELAY - Delay simulado para APIs (ms)
 * @property DEBOUNCE_DELAY - Delay para debounce de inputs (ms)
 * @property AUTO_SAVE_INTERVAL - Intervalo de auto-guardado (ms)
 */
export const PERFORMANCE_CONFIG = {
  API_DELAY: 500,        // 500ms de delay simulado
  DEBOUNCE_DELAY: 300,   // 300ms para debounce
  AUTO_SAVE_INTERVAL: 5000, // Auto-save cada 5s
} as const;

/**
 * Configuración de UI
 * @property SIDEBAR_WIDTH - Ancho del sidebar por breakpoint
 * @property CANVAS_PADDING - Padding del canvas (px)
 * @property NODE_SPACING - Espaciado entre nodos (px)
 */
export const UI_CONFIG = {
  // Ancho del sidebar por breakpoint
  SIDEBAR_WIDTH: {
    DEFAULT: 320, // Desktop
    MOBILE: 280,  // Mobile (<768px)
    TABLET: 300,  // Tablet (768-1024px)
  },
  
  // Padding del canvas
  CANVAS_PADDING: 20,
  
  // Espaciado entre nodos
  NODE_SPACING: {
    HORIZONTAL: 200, // Espacio horizontal
    VERTICAL: 100,   // Espacio vertical
  },
} as const;