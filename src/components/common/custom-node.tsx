'use client'
/**
 * CustomNode (simplified)
 * ----------------------
 * Nodo personalizable con 2 sources y 2 targets por defecto.
 * - Data flow: targets (left, top) | sources (right, bottom)
 * - Execution flow: target (left) | source (right) visibles según toggle
 * - Doble click dispara evento para modal de edición
 */

import { Handle, Position } from '@xyflow/react';
import { useProjectStore } from '@/context/project-store';
import styles from '@/components/styles/custom-node.module.css';

// Evento personalizado que escuchan otros componentes para abrir el modal
declare global {
  interface WindowEventMap {
    'customnode:dblclick': CustomEvent<{ nodeName: string }>;
  }
}

interface CustomNodeProps {
  data: {
    label: string;
    customName?: string;
    dir?: 'in' | 'out';
  };
  selected?: boolean;
}

export function CustomNode({ data, selected }: CustomNodeProps) {
  const { state } = useProjectStore();

  const handleDoubleClick = () => {
    const name = data.customName ?? data.label;
    window.dispatchEvent(
      new CustomEvent('customnode:dblclick', { detail: { nodeName: name } }),
    );
  };

  return (
    <div
      className={`${styles.node} ${selected ? styles.nodeSelected : ''}`}
      onDoubleClick={handleDoubleClick}
    >
      {/* Sección principal */}
      <div className={styles.mainContent}>
        {/* Data targets */}
        <Handle
          type="target"
          position={Position.Left}
          id="data-left-target"
          className={`${styles.handle} ${styles.handleTarget}`}
          data-handlepos="left"
          style={{ top: '50%' }}
        />
        <Handle
          type="target"
          position={Position.Top}
          id="data-top-target"
          className={`${styles.handle} ${styles.handleTarget}`}
          data-handlepos="top"
        />

        {/* Data sources */}
        <Handle
          type="source"
          position={Position.Right}
          id="data-right"
          className={`${styles.handle} ${styles.handleSource}`}
          data-handlepos="right"
          style={{ top: '50%' }}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          id="data-bottom"
          className={`${styles.handle} ${styles.handleSource}`}
          data-handlepos="bottom"
        />

        {/* Etiqueta */}
        <div className={styles.label}>{data.label}</div>
      </div>

      {/* Execution flow handles (visibles si el toggle está activo) */}
      <div
        className={styles.executionSection}
        style={{
          opacity: state.showExecutionFlow ? 1 : 0,
          pointerEvents: state.showExecutionFlow ? 'auto' : 'none',
        }}
      >
        <Handle
          type="target"
          position={Position.Left}
          id="exec-in"
          className={`${styles.handle} ${styles.executionHandle}`}
          data-handlepos="left"
        />
        <Handle
          type="source"
          position={Position.Right}
          id="exec-out"
          className={`${styles.handle} ${styles.executionHandle}`}
          data-handlepos="right"
        />
      </div>
    </div>
  );
}

export default CustomNode;
