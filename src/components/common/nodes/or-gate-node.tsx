import { Handle, Position } from '@xyflow/react';
import styles from '@/components/styles/nodes/base-node.module.css';
import executionStyles from '@/components/styles/node-types-execution.module.css';
import orGateStyles from '@/components/styles/nodes/or-gate-node.module.css';
import { useProjectStore } from '@/context/project-store';
import type { BaseNodeProps } from './types';

export function OrGateNode({ data, selected }: BaseNodeProps) {
  const { state } = useProjectStore();
  return (
    <div className={`${styles.node} ${orGateStyles.orGateNode} ${selected ? styles.nodeSelected : ''}`}>
      <div className={executionStyles.mainContent}>
        <Handle type="target" position={Position.Left} id="data-input1" className={`${styles.handle} ${styles.handleTarget}`} style={{ top: '30%' }} />
        <Handle type="target" position={Position.Left} id="data-input2" className={`${styles.handle} ${styles.handleTarget}`} style={{ top: '70%' }} />
        <Handle type="source" position={Position.Right} id="data-output" className={`${styles.handle} ${styles.handleSource}`} />
        <div className={orGateStyles.gateLabel}>OR</div>
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

export default OrGateNode;