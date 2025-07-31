'use client'
import { Plus, Trash2, ChevronDown, ChevronRight, Layers } from 'lucide-react';
import styles from '@/components/styles/aside.module.css';
import { useProject } from '@/context/project-context';
import { useState } from 'react';
import { CreateCustomNodeModal } from '@/components/common/create-custom-node-modal';
import { DeleteCustomNodeModal } from '@/components/common/delete-custom-node-modal';
import { NODE_CATEGORIES } from '@/constants';
import type { NodeCategory } from '@/types';

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
        {NODE_CATEGORIES.map((category) => (
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