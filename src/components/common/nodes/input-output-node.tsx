import { Handle, Position } from '@xyflow/react';
import { Square } from 'lucide-react';
import styles from '@/components/styles/nodes/base-node.module.css';
import executionStyles from '@/components/styles/node-types-execution.module.css';
import ioNodeStyles from '@/components/styles/nodes/input-output-node.module.css';
import { useProjectStore } from '@/context/project-store';
import type { BaseNodeProps } from './types';

export function InputOutputNode({ data, selected }: BaseNodeProps) {
  const { state } = useProjectStore();
  return (
    <div className={`${styles.node} ${ioNodeStyles.inputOutputNode} ${selected ? styles.nodeSelected : ''}`}>
      <div className={executionStyles.mainContent}>
        <Handle type="target" position={Position.Left} id="data-left" className={`${styles.handle} ${styles.handleTarget}`} />
        <Handle type="source" position={Position.Right} id="data-right" className={`${styles.handle} ${styles.handleSource}`} />
        <div className={styles.nodeIcon}><Square size={16} /></div>
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

export default InputOutputNode;
