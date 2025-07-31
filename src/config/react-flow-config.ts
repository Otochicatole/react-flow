import type { ReactFlowProps } from '@xyflow/react';

/**
 * Default React Flow configuration
 */
export const DEFAULT_REACT_FLOW_CONFIG: Partial<ReactFlowProps> = {
  // Canvas settings
  fitView: true,
  fitViewOptions: {
    padding: 0.2,
  },
  
  // Interaction settings
  nodesDraggable: true,
  nodesConnectable: true,
  elementsSelectable: true,
  selectNodesOnDrag: false,
  
  // Connection settings
  // connectionMode: 'loose', // Commented out due to type issues
  deleteKeyCode: ['Backspace', 'Delete'],
  
  // Zoom settings
  minZoom: 0.1,
  maxZoom: 2,
  
  // Grid settings
  snapToGrid: false,
  snapGrid: [15, 15],
  
  // Controls
  attributionPosition: 'bottom-left' as const,
};

/**
 * Default viewport configuration
 */
export const DEFAULT_VIEWPORT = {
  x: 0,
  y: 0,
  zoom: 1,
};

/**
 * Default edge configuration
 */
export const DEFAULT_EDGE_CONFIG = {
  type: 'smoothstep',
  animated: false,
  style: {
    strokeWidth: 2,
    stroke: '#64748b',
  },
};

/**
 * Default node position for new nodes
 */
export const DEFAULT_NODE_POSITION = {
  x: 0,
  y: 0,
};