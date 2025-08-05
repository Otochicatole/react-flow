'use client'

/**
 * ProcessNode
 * ----------
 * Componente de nodo especial que representa un proceso anidado.
 * Permite navegar a subprocesos mediante doble click y soporta
 * tanto flujo de datos como de ejecución.
 * 
 * Características:
 * - Navegación a subprocesos
 * - Puntos de conexión en todas las caras
 * - Soporte para flujo de ejecución (toggle)
 * - Descripción opcional
 * - Indicadores visuales de interacción
 * 
 * @example
 * <ProcessNode 
 *   data={{ 
 *     label: "Main Process",
 *     processId: "proc_123",
 *     description: "Handles user registration"
 *   }} 
 * />
 */

import { Handle, Position } from '@xyflow/react';
import { Layers, ArrowRight } from 'lucide-react';
import { useProject } from '@/context/project-context';
import { useProjectStore } from '@/context/project-store';
import styles from '@/components/styles/process-node.module.css';

/**
 * Props del componente ProcessNode
 * @property data.label - Nombre del proceso
 * @property data.processId - ID único del proceso
 * @property data.description - Descripción opcional
 * @property data._forceUpdate - Timestamp para forzar re-render
 * @property selected - Si el nodo está seleccionado
 */
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
  // Hook para navegar entre procesos
  const { enterProcess } = useProject();
  
  // Estado global para el toggle de flujo de ejecución
  const { state } = useProjectStore();

  /**
   * Maneja el doble click en el nodo.
   * Navega al subproceso usando el processId.
   */
  const handleDoubleClick = () => {
    if (data.processId) {
      enterProcess(data.processId);
    }
  };

  return (
    <div 
      className={`${styles.processNode} ${selected ? styles.selected : ''}`}
      onDoubleClick={handleDoubleClick}
      title={`Double-click to enter ${data.label} process`}
    >
      {/* Contenedor principal */}
      <div className={styles.mainContent}>
        {/* Puntos de conexión para flujo de datos */}
        {/* Entrada superior */}
        <Handle
          type="target"
          position={Position.Top}
          id="data-top"
          className={styles.handle}
          data-handlepos="top"
        />
        {/* Entrada izquierda */}
        <Handle
          type="target"
          position={Position.Left}
          id="data-left"
          className={styles.handle}
          data-handlepos="left"
          style={{ top: '40%' }}
        />
        {/* Salida derecha */}
        <Handle
          type="source"
          position={Position.Right}
          id="data-right"
          className={styles.handle}
          data-handlepos="right"
          style={{ top: '40%' }}
        />
        {/* Salida inferior */}
        <Handle
          type="source"
          position={Position.Bottom}
          id="data-bottom"
          className={styles.handle}
          data-handlepos="bottom"
        />

        {/* Cabecera del proceso */}
        <div className={styles.header}>
          {/* Ícono de capas (indica proceso anidado) */}
          <div className={styles.iconContainer}>
            <Layers size={18} className={styles.icon} />
          </div>
          {/* Título del proceso */}
          <h3 className={styles.title} key={data.label}>{data.label}</h3>
          {/* Indicador de entrada (flecha) */}
          <div className={styles.enterIndicator}>
            <ArrowRight size={14} />
          </div>
        </div>

        {/* Descripción opcional */}
        {data.description && (
          <p className={styles.description}>{data.description}</p>
        )}

        {/* Pie con tipo y ayuda */}
        <div className={styles.footer}>
          <span className={styles.type}>Process</span>
          <span className={styles.doubleClickHint}>Double-click to enter</span>
        </div>
      </div>

      {/* Sección de flujo de ejecución (siempre montada, visible según toggle) */}
      <div
        className={styles.executionSection}
        style={{ opacity: state.showExecutionFlow ? 1 : 0, pointerEvents: state.showExecutionFlow ? 'auto' : 'none' }}
      >
          {/* Entrada de ejecución (izquierda) */}
          <Handle
            type="target"
            position={Position.Left}
            id="exec-in"
            className={`${styles.handle} ${styles.executionHandle}`}
            data-handlepos="left"
            style={{ top: '50%', transform: 'translateY(-50%)', left: '-8px' }}
          />
          {/* Salida de ejecución (derecha) */}
          <Handle
            type="source"
            position={Position.Right}
            id="exec-out"
            className={`${styles.handle} ${styles.executionHandle}`}
            data-handlepos="right"
            style={{ top: '50%', transform: 'translateY(-50%)', right: '-8px' }}
          />
        </div>
    </div>
  );
} 