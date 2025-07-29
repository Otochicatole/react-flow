'use client'
import {
  Zap,
  Send,
  Search,
  Database,
  Cog,
  MessageSquare,
  Layers,
  Plus,
  Trash2,
} from 'lucide-react';
import styles from '@/components/styles/aside.module.css';
import { useProject } from '@/context/project-context';
import { useState } from 'react';
import { CreateCustomNodeModal } from '@/components/common/create-custom-node-modal';
import { DeleteCustomNodeModal } from '@/components/common/delete-custom-node-modal';

interface NodeTypeItem {
  type: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  color: string;
}

const nodeTypes: NodeTypeItem[] = [
  {
    type: 'event',
    label: 'Event',
    icon: <Zap size={18} />,
    description: 'Domain events that represent something that happened',
    color: '#10b981'
  },
  {
    type: 'command',
    label: 'Command',
    icon: <Send size={18} />,
    description: 'Actions that should be performed in the system',
    color: '#3b82f6'
  },
  {
    type: 'query',
    label: 'Query',
    icon: <Search size={18} />,
    description: 'Read operations to retrieve data from the system',
    color: '#8b5cf6'
  },
  {
    type: 'aggregate',
    label: 'Aggregate',
    icon: <Database size={18} />,
    description: 'Business logic containers that ensure consistency',
    color: '#f59e0b'
  },
  {
    type: 'service',
    label: 'Service',
    icon: <Cog size={18} />,
    description: 'Application services that orchestrate business logic',
    color: '#ef4444'
  },
  {
    type: 'messageBus',
    label: 'Message Bus',
    icon: <MessageSquare size={18} />,
    description: 'Communication infrastructure for events and commands',
    color: '#06b6d4'
  },
  {
    type: 'process',
    label: 'Process',
    icon: <Layers size={18} />,
    description: 'Nested process container for complex workflows',
    color: '#14b8a6'
  }
];

interface DraggableNodeProps {
  type: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  color: string;
}

function DraggableNode({ type, label, icon, description, color }: DraggableNodeProps) {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className={styles.draggableNode}
      onDragStart={(event) => onDragStart(event, type)}
      draggable
      style={{ '--node-color': color } as React.CSSProperties}
    >
      <div className={styles.nodeIcon}>
        {icon}
      </div>
      <div className={styles.nodeContent}>
        <h4 className={styles.nodeLabel}>{label}</h4>
        <p className={styles.nodeDescription}>{description}</p>
      </div>
    </div>
  );
}

export function Aside() {
  const { customNodeTypes, removeCustomNodeType } = useProject();
  const [isModalOpen, setModalOpen] = useState(false);
  const [deleteState,setDeleteState]=useState<{open:boolean;name:string}>({open:false,name:''});

  return (
    <aside className={styles.aside}>
      <div className={styles.header}>
        <h2 className={styles.title}>Node Types</h2>
        <p className={styles.subtitle}>Drag to canvas to create</p>
      </div>
      
      <div className={styles.nodeList}>
        {nodeTypes.map((nodeType) => (
          <DraggableNode
            key={nodeType.type}
            type={nodeType.type}
            label={nodeType.label}
            icon={nodeType.icon}
            description={nodeType.description}
            color={nodeType.color}
          />
        ))}
      </div>

      {/* Custom nodes section */}
      <div className={styles.headerCustom}>
        <h2 className={styles.title}>Custom Nodes</h2>
        <button className={styles.addCustomButton} onClick={() => setModalOpen(true)} title="Add custom node">
          <Plus size={16} />
        </button>
      </div>

      <div className={styles.customList}>
        {customNodeTypes.map(({name,dir}) => (
          <div className={styles.draggableNodeWrapper} key={name}>
            <DraggableNode
              type={`custom::${name}::${dir}`}
              label={name}
              icon={<Layers size={18} />}
              description={`Custom ${dir==='in'?'input':'output'} node`}
              color="#64748b"
            />
            <button className={styles.deleteCustom} onClick={(e)=>{e.stopPropagation(); setDeleteState({open:true,name});}} title="Delete custom node">
              <Trash2 size={14}/>
            </button>
          </div>
        ))}
      </div>

      <CreateCustomNodeModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
      <DeleteCustomNodeModal isOpen={deleteState.open} nodeName={deleteState.name} onClose={()=>setDeleteState({open:false,name:''})} onConfirm={()=>removeCustomNodeType(deleteState.name)} />
    </aside>
  );
} 