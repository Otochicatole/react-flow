import { Handle, Position } from '@xyflow/react';
import { Circle } from 'lucide-react';
import styles from '@/components/styles/nodes/base-node.module.css';
import executionStyles from '@/components/styles/node-types-execution.module.css';
import connectorStyles from '@/components/styles/nodes/connector-node.module.css';
import { useProjectStore } from '@/context/project-store';

export function ConnectorNode({ selected }: { selected?: boolean }) {
  const { state } = useProjectStore();
  return (
    <div className={`${styles.node} ${connectorStyles.connectorNode} ${selected ? styles.nodeSelected : ''}`}>
      <div className={executionStyles.mainContent}>
        <Handle type="target" position={Position.Top} id="data-top" className={`${styles.handle} ${styles.handleTarget}`} />
        <Handle type="source" position={Position.Bottom} id="data-bottom" className={`${styles.handle} ${styles.handleSource}`} />
        <Handle type="target" position={Position.Left} id="data-left" className={`${styles.handle} ${styles.handleTarget}`} />
        <Handle type="source" position={Position.Right} id="data-right" className={`${styles.handle} ${styles.handleSource}`} />
        <div className={styles.nodeIcon}><Circle size={8} /></div>
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

export default ConnectorNode;
