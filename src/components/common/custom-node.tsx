import { Handle, Position } from '@xyflow/react';
import styles from '@/components/styles/custom-node.module.css';

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
  const handleDoubleClick = () => {
    const name = data.customName ?? data.label;
    window.dispatchEvent(new CustomEvent('customnode:dblclick', { detail: { nodeName: name } }));
  };
  return (
    <div className={`${styles.node} ${selected ? styles.nodeSelected : ''}`} onDoubleClick={handleDoubleClick}>
      {/* Top handles */}
      <Handle
        type="source"
        position={Position.Top}
        id="top"
        className={`${styles.handle} ${styles.handleSource}`}
        data-handlepos="top"
      />
      <Handle
        type="target"
        position={Position.Top}
        id="top-target"
        className={`${styles.handle} ${styles.handleTarget}`}
        data-handlepos="top"
      />
      
      {/* Bottom handles */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className={`${styles.handle} ${styles.handleSource}`}
        data-handlepos="bottom"
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id="bottom-target"
        className={`${styles.handle} ${styles.handleTarget}`}
        data-handlepos="bottom"
      />
      
      {/* Left handles */}
      <Handle
        type="source"
        position={Position.Left}
        id="left"
        className={`${styles.handle} ${styles.handleSource}`}
        data-handlepos="left"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left-target"
        className={`${styles.handle} ${styles.handleTarget}`}
        data-handlepos="left"
      />
      
      {/* Right handles */}
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className={`${styles.handle} ${styles.handleSource}`}
        data-handlepos="right"
      />
      <Handle
        type="target"
        position={Position.Right}
        id="right-target"
        className={`${styles.handle} ${styles.handleTarget}`}
        data-handlepos="right"
      />
      
      <div className={styles.label}>{data.dir==='in'?'<-':''}{data.label}{data.dir==='out'? '->':''}</div>
    </div>
  );
} 