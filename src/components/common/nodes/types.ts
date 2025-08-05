import type { Position } from '@xyflow/react';

/**
 * BaseNodeProps
 * -------------
 * Propiedades comunes para todos los nodos del diagrama.
 */
export interface BaseNodeProps {
  data: {
    label: string;
  };
  selected?: boolean;
}
