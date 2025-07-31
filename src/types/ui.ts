/**
 * ui.ts
 * -----
 * Tipos relacionados con la interfaz de usuario.
 * Define estructuras para UI interactiva.
 */

/**
 * Posición del menú contextual
 * Coordenadas x,y en el viewport.
 * 
 * @property x - Posición horizontal
 * @property y - Posición vertical
 */
export interface ContextMenuPosition {
  x: number; // Coordenada X
  y: number; // Coordenada Y
}

/**
 * Props base para modales
 * Props comunes a todos los modales.
 * 
 * @property isOpen - Si el modal está visible
 * @property onClose - Función para cerrar
 */
export interface ModalProps {
  isOpen: boolean;        // Visibilidad
  onClose: () => void;   // Cerrar modal
}

/**
 * Estado de importación
 * Tracking del proceso de importar.
 * 
 * @property loading - Si está cargando
 * @property message - Mensaje de estado
 * @property success - Resultado (null = no iniciado)
 */
export interface ImportStatus {
  loading: boolean;       // En proceso
  message: string;        // Mensaje
  success: boolean | null;// Resultado
}

/**
 * Estado de categorías
 * Mapa de IDs a estado expandido.
 * 
 * @property [categoryId] - Si la categoría está expandida
 */
export interface CategoryState {
  [categoryId: string]: boolean; // Expandida
}

/**
 * Item arrastrable
 * Datos para drag & drop.
 * 
 * @property type - Tipo de drag (siempre 'node')
 * @property nodeType - Tipo de nodo a crear
 */
export interface DragItem {
  type: string;     // Tipo de drag
  nodeType: string; // Tipo de nodo
}