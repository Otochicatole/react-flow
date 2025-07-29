import { Handle, Position } from '@xyflow/react';
import styles from '@/components/styles/node-types.module.css';

interface BaseNodeProps {
  data: {
    label: string;
  };
  selected?: boolean;
}

// Event Node - triggers in the system
export function EventNode({ data, selected }: BaseNodeProps) {
  return (
    <div className={`${styles.node} ${styles.eventNode} ${selected ? styles.nodeSelected : ''}`}>
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className={`${styles.handle} ${styles.handleSource}`}
      />
      <div className={styles.nodeIcon}>📢</div>
      <div className={styles.label}>{data.label}</div>
    </div>
  );
}

// Command Node - actions to execute
export function CommandNode({ data, selected }: BaseNodeProps) {
  return (
    <div className={`${styles.node} ${styles.commandNode} ${selected ? styles.nodeSelected : ''}`}>
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className={`${styles.handle} ${styles.handleTarget}`}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className={`${styles.handle} ${styles.handleSource}`}
      />
      <div className={styles.nodeIcon}>⚡</div>
      <div className={styles.label}>{data.label}</div>
    </div>
  );
}

// Query Node - data retrieval
export function QueryNode({ data, selected }: BaseNodeProps) {
  return (
    <div className={`${styles.node} ${styles.queryNode} ${selected ? styles.nodeSelected : ''}`}>
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className={`${styles.handle} ${styles.handleTarget}`}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className={`${styles.handle} ${styles.handleSource}`}
      />
      <div className={styles.nodeIcon}>🔍</div>
      <div className={styles.label}>{data.label}</div>
    </div>
  );
}

// Aggregate Node - domain entities
export function AggregateNode({ data, selected }: BaseNodeProps) {
  return (
    <div className={`${styles.node} ${styles.aggregateNode} ${selected ? styles.nodeSelected : ''}`}>
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        className={`${styles.handle} ${styles.handleTarget}`}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className={`${styles.handle} ${styles.handleSource}`}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className={`${styles.handle} ${styles.handleTarget}`}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className={`${styles.handle} ${styles.handleSource}`}
      />
      <div className={styles.nodeIcon}>🏛️</div>
      <div className={styles.label}>{data.label}</div>
    </div>
  );
}

// Service Node - application services
export function ServiceNode({ data, selected }: BaseNodeProps) {
  return (
    <div className={`${styles.node} ${styles.serviceNode} ${selected ? styles.nodeSelected : ''}`}>
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        className={`${styles.handle} ${styles.handleTarget}`}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className={`${styles.handle} ${styles.handleSource}`}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className={`${styles.handle} ${styles.handleTarget}`}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className={`${styles.handle} ${styles.handleSource}`}
      />
      <div className={styles.nodeIcon}>⚙️</div>
      <div className={styles.label}>{data.label}</div>
    </div>
  );
}

// Message Bus Node - communication channels
export function MessageBusNode({ data, selected }: BaseNodeProps) {
  return (
    <div className={`${styles.node} ${styles.messageBusNode} ${selected ? styles.nodeSelected : ''}`}>
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        className={`${styles.handle} ${styles.handleTarget}`}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className={`${styles.handle} ${styles.handleSource}`}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className={`${styles.handle} ${styles.handleTarget}`}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className={`${styles.handle} ${styles.handleSource}`}
      />
      <div className={styles.nodeIcon}>🚌</div>
      <div className={styles.label}>{data.label}</div>
    </div>
  );
} 