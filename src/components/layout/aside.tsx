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
  Play,
  Diamond,
  Square,
  FileText,
  Circle,
  Cpu,
  Calendar,
  ChevronDown,
  ChevronRight,
  Type
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

interface NodeCategory {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  nodes: NodeTypeItem[];
}

const nodeCategories: NodeCategory[] = [
  {
    id: 'event-driven',
    label: 'Event-Driven Architecture',
    icon: <Zap size={18} />,
    description: 'CQRS, Event Sourcing & DDD components',
    nodes: [
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
    ]
  },
  {
    id: 'flowchart',
    label: 'Flowchart',
    icon: <Diamond size={18} />,
    description: 'Traditional flowchart elements',
    nodes: [
      {
        type: 'startEnd',
        label: 'Start/End',
        icon: <Play size={18} />,
        description: 'Terminal points for process flow',
        color: '#34d399'
      },
      {
        type: 'decision',
        label: 'Decision',
        icon: <Diamond size={18} />,
        description: 'Conditional branching point',
        color: '#fbbf24'
      },
      {
        type: 'inputOutput',
        label: 'Input/Output',
        icon: <Square size={18} />,
        description: 'Data input or output operation',
        color: '#a78bfa'
      },
      {
        type: 'document',
        label: 'Document',
        icon: <FileText size={18} />,
        description: 'Document or report generation',
        color: '#94a3b8'
      },
      {
        type: 'database',
        label: 'Database',
        icon: <Database size={18} />,
        description: 'Data storage or retrieval',
        color: '#fb7185'
      },
      {
        type: 'connector',
        label: 'Connector',
        icon: <Circle size={18} />,
        description: 'Junction point for multiple flows',
        color: '#6b7280'
      },
      {
        type: 'textInput',
        label: 'Text Input',
        icon: <Type size={18} />,
        description: 'Generic text input field',
        color: '#22d3ee'
      }
    ]
  },
  {
    id: 'logic-gates',
    label: 'Logic Gates',
    icon: <Cpu size={18} />,
    description: 'Boolean logic operations',
    nodes: [
      {
        type: 'andGate',
        label: 'AND Gate',
        icon: <Cpu size={18} />,
        description: 'Logical AND operation',
        color: '#60a5fa'
      },
      {
        type: 'orGate',
        label: 'OR Gate',
        icon: <Cpu size={18} />,
        description: 'Logical OR operation',
        color: '#60a5fa'
      },
      {
        type: 'xorGate',
        label: 'XOR Gate',
        icon: <Cpu size={18} />,
        description: 'Exclusive OR operation',
        color: '#60a5fa'
      },
      {
        type: 'notGate',
        label: 'NOT Gate',
        icon: <Cpu size={18} />,
        description: 'Logical NOT operation',
        color: '#60a5fa'
      }
    ]
  },
  {
    id: 'gantt',
    label: 'Project Management',
    icon: <Calendar size={18} />,
    description: 'Gantt chart and project elements',
    nodes: [
      {
        type: 'task',
        label: 'Task',
        icon: <Calendar size={18} />,
        description: 'Project task with progress tracking',
        color: '#14b8a6'
      },
      {
        type: 'milestone',
        label: 'Milestone',
        icon: <Diamond size={18} />,
        description: 'Important project milestone',
        color: '#f97316'
      }
    ]
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

interface CategorySectionProps {
  category: NodeCategory;
  isExpanded: boolean;
  onToggle: () => void;
}

function CategorySection({ category, isExpanded, onToggle }: CategorySectionProps) {
  return (
    <div className={styles.categorySection}>
      <button className={styles.categoryHeader} onClick={onToggle}>
        <div className={styles.categoryInfo}>
          <div className={styles.categoryIcon}>{category.icon}</div>
          <div>
            <h3 className={styles.categoryTitle}>{category.label}</h3>
            <p className={styles.categoryDescription}>{category.description}</p>
          </div>
        </div>
        <div className={styles.expandIcon}>
          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </div>
      </button>
      
      {isExpanded && (
        <div className={styles.categoryNodes}>
          {category.nodes.map((node) => (
            <DraggableNode
              key={node.type}
              type={node.type}
              label={node.label}
              icon={node.icon}
              description={node.description}
              color={node.color}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function Aside() {
  const { customNodeTypes, removeCustomNodeType } = useProject();
  const [isModalOpen, setModalOpen] = useState(false);
  const [deleteState, setDeleteState] = useState<{open: boolean; name: string}>({open: false, name: ''});
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['event-driven']));

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  return (
    <aside className={styles.aside}>
      <div className={styles.header}>
        <h2 className={styles.title}>Node Library</h2>
        <p className={styles.subtitle}>Drag to canvas to create</p>
      </div>
      
      <div className={styles.categoriesContainer}>
        {nodeCategories.map((category) => (
          <CategorySection
            key={category.id}
            category={category}
            isExpanded={expandedCategories.has(category.id)}
            onToggle={() => toggleCategory(category.id)}
          />
        ))}
      </div>

      {/* Custom nodes section */}
      <div className={styles.categorySection}>
        <div className={styles.categoryHeader}>
          <div className={styles.categoryInfo}>
            <div className={styles.categoryIcon}>
              <Layers size={18} />
            </div>
            <div>
              <h3 className={styles.categoryTitle}>Custom Nodes</h3>
              <p className={styles.categoryDescription}>Your custom node types</p>
            </div>
          </div>
          <button className={styles.addCustomButton} onClick={() => setModalOpen(true)} title="Add custom node">
            <Plus size={16} />
          </button>
        </div>

        <div className={styles.categoryNodes}>
          {customNodeTypes.map(({name, dir}) => (
            <div className={styles.draggableNodeWrapper} key={name}>
              <DraggableNode
                type={`custom::${name}::${dir}`}
                label={name}
                icon={<Layers size={18} />}
                description={`Custom ${dir === 'in' ? 'input' : 'output'} node`}
                color="#64748b"
              />
              <button 
                className={styles.deleteCustom} 
                onClick={(e) => {
                  e.stopPropagation(); 
                  setDeleteState({open: true, name});
                }} 
                title="Delete custom node"
              >
                <Trash2 size={14}/>
              </button>
            </div>
          ))}
        </div>
      </div>

      <CreateCustomNodeModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
      <DeleteCustomNodeModal 
        isOpen={deleteState.open} 
        nodeName={deleteState.name} 
        onClose={() => setDeleteState({open: false, name: ''})} 
        onConfirm={() => removeCustomNodeType(deleteState.name)} 
      />
    </aside>
  );
} 