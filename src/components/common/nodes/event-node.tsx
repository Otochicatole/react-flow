import { Handle, Position } from '@xyflow/react';
import styles from '@/components/styles/nodes/base-node.module.css';
import executionStyles from '@/components/styles/node-types-execution.module.css';
import eventNodeStyles from '@/components/styles/nodes/event-node.module.css';
import { useProjectStore } from '@/context/project-store';
import type { BaseNodeProps } from './types';

/**
 * EventNode
 * ---------
 * Nodo que representa un evento en el sistema.
 * Solo tiene salida de datos (source) ya que los eventos son el origen de un flujo.
 */
export function EventNode({ data, selected }: BaseNodeProps) {
  const { state } = useProjectStore();
  return (
    <div className={`${styles.node} ${eventNodeStyles.eventNode} ${selected ? styles.nodeSelected : ''}`}>
      {/* Data flow handles & icon */}
      <div className={executionStyles.mainContent}>
        <Handle
          type="source"
          position={Position.Right}
          id="data-right"
          className={`${styles.handle} ${styles.handleSource}`}
        />
        <div className={styles.nodeIcon}>📢</div>
        <div className={styles.label}>{data.label}</div>
      </div>

      {/* Execution flow handles (conditional) */}
      <div
        className={executionStyles.executionSection}
        style={{ opacity: state.showExecutionFlow ? 1 : 0, pointerEvents: state.showExecutionFlow ? 'auto' : 'none' }}
      >
          <Handle
            type="target"
            position={Position.Left}
            id="exec-in"
            className={`${styles.handle} ${executionStyles.executionHandle}`}
          />
          <Handle
            type="source"
            position={Position.Right}
            id="exec-out"
            className={`${styles.handle} ${executionStyles.executionHandle}`}
          />
        </div>

    </div>
  );
}

export default EventNode;
