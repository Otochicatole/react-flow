import { Handle, Position } from '@xyflow/react';
import { X } from 'lucide-react';
import styles from '@/components/styles/nodes/base-node.module.css';
import executionStyles from '@/components/styles/node-types-execution.module.css';
import notGateStyles from '@/components/styles/nodes/not-gate-node.module.css';
import { useProjectStore } from '@/context/project-store';
import type { BaseNodeProps } from './types';

export function NotGateNode({ data, selected }: BaseNodeProps) {
  const { state } = useProjectStore();
  return (
    <div className={`${styles.node} ${notGateStyles.notGateNode} ${selected ? styles.nodeSelected : ''}`}>
      <div className={executionStyles.mainContent}>
        <Handle type="target" position={Position.Left} id="data-input" className={`${styles.handle} ${styles.handleTarget}`} />
        <Handle type="source" position={Position.Right} id="data-output" className={`${styles.handle} ${styles.handleSource}`} />
        <div className={styles.nodeIcon}><X size={16} /></div>
        <div className={notGateStyles.gateLabel}>NOT</div>
        <div className={styles.label}>{data.label}</div>
      </div>
      <div
        className={executionStyles.executionSection}
        style={{ opacity: state.showExecutionFlow ? 1 : 0, pointerEvents: state.showExecutionFlow ? 'auto' : 'none' }}
      >
          <Handle type="target" position={Position.Left} id="exec-in" className={`${styles.handle} ${executionStyles.executionHandle}`} />
          <Handle type="source" position={Position.Right} id="exec-out" className={`${styles.handle} ${executionStyles.executionHandle}`} />
        </div>

    </div>
  );
}

export default NotGateNode;