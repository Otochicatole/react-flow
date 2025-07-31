/**
 * react-flow-config.ts
 * -----------------
 * Configuración por defecto de React Flow.
 * Define comportamiento y estilos base.
 */

import type { ReactFlowProps } from '@xyflow/react';

/**
 * Configuración principal
 * Props por defecto para ReactFlow.
 * 
 * @property fitView - Auto-ajustar vista
 * @property nodesDraggable - Permitir arrastrar nodos
 * @property nodesConnectable - Permitir conectar nodos
 * @property elementsSelectable - Permitir selección
 * @property deleteKeyCode - Teclas para eliminar
 * @property minZoom/maxZoom - Límites de zoom
 * @property snapToGrid - Ajuste a grilla
 */
export const DEFAULT_REACT_FLOW_CONFIG: Partial<ReactFlowProps> = {
  // Vista
  fitView: true,
  fitViewOptions: {
    padding: 0.2, // Padding al ajustar
  },

  // Interacción
  nodesDraggable: true,    // Drag & drop
  nodesConnectable: true,  // Conexiones
  elementsSelectable: true,// Selección
  selectNodesOnDrag: false,// No seleccionar al arrastrar

  // Teclas
  deleteKeyCode: ['Backspace', 'Delete'],

  // Zoom
  minZoom: 0.1, // Min 10%
  maxZoom: 2,   // Max 200%

  // Grilla
  snapToGrid: false,    // Sin snap
  snapGrid: [15, 15],   // Tamaño 15x15

  // UI
  attributionPosition: 'bottom-left' as const,
};

/**
 * Viewport por defecto
 * Posición y zoom inicial.
 */
export const DEFAULT_VIEWPORT = {
  x: 0,     // Centro X
  y: 0,     // Centro Y
  zoom: 1,  // 100%
};

/**
 * Configuración de conexiones
 * Estilo por defecto para edges.
 * 
 * @property type - Tipo de línea
 * @property animated - Animación
 * @property style - Estilos CSS
 */
export const DEFAULT_EDGE_CONFIG = {
  type: 'smoothstep',  // Líneas cuadradas simétricas
  animated: false,     // Sin animación
  style: {
    strokeWidth: 2,    // Grosor 2px
    stroke: '#64748b', // Color slate-500
    // Ajustes para conexiones cuadradas
    transition: 'all 0.2s ease',
    radius: 10,        // Radio de curvas
  },
};

/**
 * Posición inicial de nodos
 * Coordenadas por defecto.
 */
export const DEFAULT_NODE_POSITION = {
  x: 0,  // Centro X
  y: 0,  // Centro Y
};