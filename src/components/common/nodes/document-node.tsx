import { Handle, Position } from '@xyflow/react';
import { FileText } from 'lucide-react';
import styles from '@/components/styles/nodes/base-node.module.css';
import executionStyles from '@/components/styles/node-types-execution.module.css';
import documentStyles from '@/components/styles/nodes/document-node.module.css';
import { useProjectStore } from '@/context/project-store';
import type { BaseNodeProps } from './types';

export function DocumentNode({ data, selected }: BaseNodeProps) {
  const { state } = useProjectStore();
  return (
    <div className={`${styles.node} ${documentStyles.documentNode} ${selected ? styles.nodeSelected : ''}`}>
      <div className={executionStyles.mainContent}>
        <Handle type="target" position={Position.Top} id="data-top" className={`${styles.handle} ${styles.handleTarget}`} />
        <Handle type="source" position={Position.Bottom} id="data-bottom" className={`${styles.handle} ${styles.handleSource}`} />
        <div className={styles.nodeIcon}><FileText size={16} /></div>
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

export default DocumentNode;
