'use client'
import styles from '@/components/styles/aside.module.css';

export interface NodeTypeItem {
  type: string;
  label: string;
  icon: string;
  description: string;
  color: string;
}

const nodeTypes: NodeTypeItem[] = [
  {
    type: 'event',
    label: 'Event',
    icon: '📢',
    description: 'System triggers',
    color: '#3b82f6'
  },
  {
    type: 'command',
    label: 'Command',
    icon: '⚡',
    description: 'Actions to execute',
    color: '#f59e0b'
  },
  {
    type: 'query',
    label: 'Query',
    icon: '🔍',
    description: 'Data retrieval',
    color: '#10b981'
  },
  {
    type: 'aggregate',
    label: 'Aggregate',
    icon: '🏛️',
    description: 'Domain entities',
    color: '#8b5cf6'
  },
  {
    type: 'service',
    label: 'Service',
    icon: '⚙️',
    description: 'Application services',
    color: '#ef4444'
  },
  {
    type: 'messageBus',
    label: 'Message Bus',
    icon: '🚌',
    description: 'Communication channels',
    color: '#06b6d4'
  }
];

interface DraggableNodeProps {
  nodeType: NodeTypeItem;
}

function DraggableNode({ nodeType }: DraggableNodeProps) {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className={styles.draggableNode}
      draggable
      onDragStart={(e) => onDragStart(e, nodeType.type)}
      style={{ '--node-color': nodeType.color } as React.CSSProperties}
    >
      <div className={styles.nodeIcon}>{nodeType.icon}</div>
      <div className={styles.nodeInfo}>
        <div className={styles.nodeLabel}>{nodeType.label}</div>
        <div className={styles.nodeDescription}>{nodeType.description}</div>
      </div>
    </div>
  );
}

export function Aside() {
  return (
    <aside className={styles.aside}>
      <div className={styles.asideHeader}>
        <h3 className={styles.asideTitle}>Node Types</h3>
        <p className={styles.asideSubtitle}>Drag to canvas</p>
      </div>
      
      <div className={styles.nodeList}>
        {nodeTypes.map((nodeType) => (
          <DraggableNode key={nodeType.type} nodeType={nodeType} />
        ))}
      </div>
    </aside>
  );
} 