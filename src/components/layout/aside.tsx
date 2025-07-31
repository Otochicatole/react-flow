'use client'

/**
 * Aside
 * -----
 * Panel lateral que contiene la biblioteca de nodos.
 * Permite arrastrar nodos al canvas y gestionar nodos personalizados.
 * 
 * Características:
 * - Nodos agrupados por categorías
 * - Categorías expandibles/colapsables
 * - Drag & drop al canvas
 * - Gestión de nodos personalizados
 * - Estilos y colores por tipo
 * 
 * Estructura:
 * - Header con título
 * - Lista de categorías
 * - Sección de nodos personalizados
 * - Modales de gestión
 */

import { Plus, Trash2, ChevronDown, ChevronRight, Layers } from 'lucide-react';
import styles from '@/components/styles/aside.module.css';
import { useProject } from '@/context/project-context';
import { useState } from 'react';
import { CreateCustomNodeModal } from '@/components/common/create-custom-node-modal';
import { DeleteCustomNodeModal } from '@/components/common/delete-custom-node-modal';
import { NODE_CATEGORIES } from '@/constants';
import type { NodeCategory } from '@/types';

/**
 * Props para nodos arrastrables
 * @property type - Tipo interno del nodo
 * @property label - Texto a mostrar
 * @property icon - Ícono del nodo
 * @property description - Descripción corta
 * @property color - Color de acento
 */
interface DraggableNodeProps {
  type: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  color: string;
}

/**
 * DraggableNode
 * ------------
 * Componente que representa un nodo en la biblioteca.
 * Configura el drag & drop y muestra la info del nodo.
 */
function DraggableNode({ type, label, icon, description, color }: DraggableNodeProps) {
  /**
   * Configura el drag & drop del nodo.
   * Guarda el tipo en el dataTransfer para React Flow.
   */
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
      {/* Ícono del nodo */}
      <div className={styles.nodeIcon}>
        {icon}
      </div>
      {/* Info del nodo */}
      <div className={styles.nodeContent}>
        <h4 className={styles.nodeLabel}>{label}</h4>
        <p className={styles.nodeDescription}>{description}</p>
      </div>
    </div>
  );
}

/**
 * Props para sección de categoría
 * @property category - Datos de la categoría
 * @property isExpanded - Si está expandida
 * @property onToggle - Función para expandir/colapsar
 */
interface CategorySectionProps {
  category: NodeCategory;
  isExpanded: boolean;
  onToggle: () => void;
}

/**
 * CategorySection
 * -------------
 * Sección expandible que agrupa nodos relacionados.
 * Muestra header con info y lista de nodos cuando está expandida.
 */
function CategorySection({ category, isExpanded, onToggle }: CategorySectionProps) {
  return (
    <div className={styles.categorySection}>
      {/* Header de categoría */}
      <button className={styles.categoryHeader} onClick={onToggle}>
        <div className={styles.categoryInfo}>
          {/* Ícono de categoría */}
          <div className={styles.categoryIcon}>{category.icon}</div>
          {/* Info de categoría */}
          <div>
            <h3 className={styles.categoryTitle}>{category.label}</h3>
            <p className={styles.categoryDescription}>{category.description}</p>
          </div>
        </div>
        {/* Indicador expandir/colapsar */}
        <div className={styles.expandIcon}>
          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </div>
      </button>
      
      {/* Lista de nodos (condicional) */}
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

/**
 * Aside
 * -----
 * Componente principal del panel lateral.
 * Gestiona el estado de categorías y nodos personalizados.
 */
export function Aside() {
  // Estado y acciones
  const { customNodeTypes, removeCustomNodeType } = useProject();
  
  // Estados locales
  const [isModalOpen, setModalOpen] = useState(false);
  const [deleteState, setDeleteState] = useState<{open: boolean; name: string}>({
    open: false, 
    name: ''
  });
  
  // Categorías expandidas (event-driven por defecto)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['event-driven'])
  );

  /**
   * Toggle de categoría expandida/colapsada.
   * Mantiene un Set de IDs de categorías expandidas.
   */
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
      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>Node Library</h2>
        <p className={styles.subtitle}>Drag to canvas to create</p>
      </div>
      
      {/* Categorías predefinidas */}
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

      {/* Sección de nodos personalizados */}
      <div className={styles.categorySection}>
        {/* Header con botón de agregar */}
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
          <button 
            className={styles.addCustomButton} 
            onClick={() => setModalOpen(true)} 
            title="Add custom node"
          >
            <Plus size={16} />
          </button>
        </div>

        {/* Lista de nodos personalizados */}
        <div className={styles.categoryNodes}>
          {customNodeTypes.map(({name, dir}) => (
            <div className={styles.draggableNodeWrapper} key={name}>
              {/* Nodo arrastrable */}
              <DraggableNode
                type={`custom::${name}::${dir}`}
                label={name}
                icon={<Layers size={18} />}
                description={`Custom ${dir === 'in' ? 'input' : 'output'} node`}
                color="#64748b"
              />
              {/* Botón de eliminar */}
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

      {/* Modales de gestión */}
      <CreateCustomNodeModal 
        isOpen={isModalOpen} 
        onClose={() => setModalOpen(false)} 
      />
      <DeleteCustomNodeModal 
        isOpen={deleteState.open} 
        nodeName={deleteState.name} 
        onClose={() => setDeleteState({open: false, name: ''})} 
        onConfirm={() => removeCustomNodeType(deleteState.name)} 
      />
    </aside>
  );
} 