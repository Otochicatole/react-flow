import { Handle, Position } from '@xyflow/react';
import { Square } from 'lucide-react';
import styles from '@/components/styles/nodes/base-node.module.css';
import executionStyles from '@/components/styles/node-types-execution.module.css';
import endNodeStyles from '@/components/styles/nodes/end-node.module.css';
import { useProjectStore } from '@/context/project-store';
import type { BaseNodeProps } from './types';

export function EndNode({ data, selected }: BaseNodeProps) {
  const { state } = useProjectStore();
  return (
    <div className={`${styles.node} ${endNodeStyles.endNode} ${selected ? styles.nodeSelected : ''}`}>
      <div className={executionStyles.mainContent}>
        <Handle type="target" position={Position.Left} id="data-left" className={`${styles.handle} ${styles.handleTarget}`} />
        <Handle type="target" position={Position.Top} id="data-top" className={`${styles.handle} ${styles.handleTarget}`} />
        <div className={styles.nodeIcon}><Square size={16} /></div>
        <div className={styles.label}>{data.label}</div>
      </div>
      <div
        className={executionStyles.executionSection}
        style={{ opacity: state.showExecutionFlow ? 1 : 0, pointerEvents: state.showExecutionFlow ? 'auto' : 'none' }}
      >
          <Handle type="target" position={Position.Left} id="exec-in" className={`${styles.handle} ${executionStyles.executionHandle}`} />
        </div>

    </div>
  );
}

export default EndNode;
