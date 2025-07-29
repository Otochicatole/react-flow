'use client'
import { Handle, Position } from '@xyflow/react';
import { Layers, ArrowRight } from 'lucide-react';
import { useProject } from '@/context/project-context';
import styles from '@/components/styles/process-node.module.css';

interface ProcessNodeProps {
  data: {
    label: string;
    processId: string;
    description?: string;
    _forceUpdate?: number;
  };
  selected?: boolean;
}

export function ProcessNode({ data, selected }: ProcessNodeProps) {
  const { enterProcess } = useProject();

  const handleDoubleClick = () => {
    if (data.processId) {
      enterProcess(data.processId, data.label);
    }
  };

  return (
    <div 
      key={`${data.processId}-${data._forceUpdate || 0}`} // Force re-render with unique key
      className={`${styles.processNode} ${selected ? styles.selected : ''}`}
      onDoubleClick={handleDoubleClick}
      title={`Double-click to enter ${data.label} process`}
    >
      {/* Handles for connections */}
      <Handle
        type="target"
        position={Position.Top}
        className={styles.handle}
        data-handlepos="top"
      />
      <Handle
        type="target"
        position={Position.Left}
        className={styles.handle}
        data-handlepos="left"
      />
      <Handle
        type="source"
        position={Position.Right}
        className={styles.handle}
        data-handlepos="right"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className={styles.handle}
        data-handlepos="bottom"
      />

      {/* Node content */}
      <div className={styles.header}>
        <div className={styles.iconContainer}>
          <Layers size={18} className={styles.icon} />
        </div>
        <h3 className={styles.title} key={data.label}>{data.label}</h3>
        <div className={styles.enterIndicator}>
          <ArrowRight size={14} />
        </div>
      </div>

      {data.description && (
        <p className={styles.description}>{data.description}</p>
      )}

      <div className={styles.footer}>
        <span className={styles.type}>Process</span>
        <span className={styles.doubleClickHint}>Double-click to enter</span>
      </div>
    </div>
  );
} 