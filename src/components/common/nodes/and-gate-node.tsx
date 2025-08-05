import { Handle, Position } from '@xyflow/react';
import styles from '@/components/styles/nodes/base-node.module.css';
import executionStyles from '@/components/styles/node-types-execution.module.css';
import andGateStyles from '@/components/styles/nodes/and-gate-node.module.css';
import { useProjectStore } from '@/context/project-store';
import type { BaseNodeProps } from './types';

export function AndGateNode({ data, selected }: BaseNodeProps) {
  const { state } = useProjectStore();
  return (
    <div className={`${styles.node} ${andGateStyles.andGateNode} ${selected ? styles.nodeSelected : ''}`}>
      <div className={executionStyles.mainContent}>
        <Handle type="target" position={Position.Left} id="data-input1" className={`${styles.handle} ${styles.handleTarget}`} style={{ top: '30%' }} />
        <Handle type="target" position={Position.Left} id="data-input2" className={`${styles.handle} ${styles.handleTarget}`} style={{ top: '70%' }} />
        <Handle type="source" position={Position.Right} id="data-output" className={`${styles.handle} ${styles.handleSource}`} />
        <div className={andGateStyles.gateLabel}>AND</div>
        <div className={styles.label}>{data.label}</div>
      </div>
      {state.showExecutionFlow && (
        <div className={executionStyles.executionSection}>
          <Handle type="target" position={Position.Left} id="exec-in" className={`${styles.handle} ${executionStyles.executionHandle}`} />
          <Handle type="source" position={Position.Right} id="exec-out" className={`${styles.handle} ${executionStyles.executionHandle}`} />
        </div>
      )}
    </div>
  );
}

export default AndGateNode;