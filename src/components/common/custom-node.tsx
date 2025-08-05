/**
 * CustomNode
 * ---------
 * Componente de nodo personalizable que puede actuar como entrada o salida de datos.
 * Soporta tanto flujo de datos como flujo de ejecución, con puntos de conexión
 * específicos para cada tipo.
 * 
 * Características:
 * - Dirección configurable (entrada/salida/ambos)
 * - Puntos de conexión en todas las caras
 * - Soporte para flujo de ejecución (toggle)
 * - Doble click para editar
 * 
 * @example
 * // Nodo de entrada
 * <CustomNode data={{ label: "Input", dir: "in" }} />
 * 
 * // Nodo de salida
 * <CustomNode data={{ label: "Output", dir: "out" }} />
 * 
 * // Nodo bidireccional
 * <CustomNode data={{ label: "Processor" }} />
 */

import { Handle, Position } from '@xyflow/react';
import { useProjectStore } from '@/context/project-store';
import styles from '@/components/styles/custom-node.module.css';

// Evento personalizado para edición de nodo
declare global {
  interface WindowEventMap {
    'customnode:dblclick': CustomEvent<{ nodeName: string }>;
  }
}

/**
 * Props del componente CustomNode
 * @property data.label - Texto a mostrar en el nodo
 * @property data.customName - Nombre interno del nodo (opcional)
 * @property data.dir - Dirección del flujo: 'in' | 'out' (opcional)
 * @property selected - Si el nodo está seleccionado
 */
interface CustomNodeProps {
  data: {
    label: string;
    customName?: string;
    dir?: 'in' | 'out';
  };
  selected?: boolean;
}

export function CustomNode({ data, selected }: CustomNodeProps) {
  // Accedemos al estado global para el toggle de flujo de ejecución
  const { state } = useProjectStore();
  
  /**
   * Maneja el doble click en el nodo.
   * Dispara un evento customizado para abrir el modal de edición.
   */
  const handleDoubleClick = () => {
    const name = data.customName ?? data.label;
    window.dispatchEvent(new CustomEvent('customnode:dblclick', { detail: { nodeName: name } }));
  };

  return (
    <div 
      className={`${styles.node} ${selected ? styles.nodeSelected : ''}`} 
      onDoubleClick={handleDoubleClick}
    >
      {/* Contenedor principal del nodo */}
      <div className={styles.mainContent}>
        {/* Puntos de conexión para flujo de datos */}
        {data.dir === 'out' ? (
          // Nodo de salida: solo puntos target (recibe datos)
          <>
            <Handle
              type="target"
              position={Position.Top}
              id="data-top-target"
              className={`${styles.handle} ${styles.handleTarget}`}
              data-handlepos="top"
            />
            <Handle
              type="target"
              position={Position.Left}
              id="data-left-target"
              className={`${styles.handle} ${styles.handleTarget}`}
              data-handlepos="left"
              style={{ top: '50%' }}
            />
            <Handle
              type="target"
              position={Position.Right}
              id="data-right-target"
              className={`${styles.handle} ${styles.handleTarget}`}
              data-handlepos="right"
              style={{ top: '50%' }}
            />
          </>
        ) : data.dir === 'in' ? (
          // Nodo de entrada: solo puntos source (envía datos)
          <>
            <Handle
              type="source"
              position={Position.Top}
              id="data-top"
              className={`${styles.handle} ${styles.handleSource}`}
              data-handlepos="top"
            />
            <Handle
              type="source"
              position={Position.Left}
              id="data-left"
              className={`${styles.handle} ${styles.handleSource}`}
              data-handlepos="left"
              style={{ top: '50%' }}
            />
            <Handle
              type="source"
              position={Position.Right}
              id="data-right"
              className={`${styles.handle} ${styles.handleSource}`}
              data-handlepos="right"
              style={{ top: '50%' }}
            />
          </>
        ) : (
          // Nodo bidireccional: puntos source y target
          <>
            {/* Puntos superiores */}
            <Handle
              type="source"
              position={Position.Top}
              id="data-top"
              className={`${styles.handle} ${styles.handleSource}`}
              data-handlepos="top"
            />
            <Handle
              type="target"
              position={Position.Top}
              id="data-top-target"
              className={`${styles.handle} ${styles.handleTarget}`}
              data-handlepos="top"
            />
            {/* Puntos izquierdos */}
            <Handle
              type="source"
              position={Position.Left}
              id="data-left"
              className={`${styles.handle} ${styles.handleSource}`}
              data-handlepos="left"
              style={{ top: '30%' }}
            />
            <Handle
              type="target"
              position={Position.Left}
              id="data-left-target"
              className={`${styles.handle} ${styles.handleTarget}`}
              data-handlepos="left"
              style={{ top: '50%' }}
            />
            {/* Puntos derechos */}
            <Handle
              type="source"
              position={Position.Right}
              id="data-right"
              className={`${styles.handle} ${styles.handleSource}`}
              data-handlepos="right"
              style={{ top: '30%' }}
            />
            <Handle
              type="target"
              position={Position.Right}
              id="data-right-target"
              className={`${styles.handle} ${styles.handleTarget}`}
              data-handlepos="right"
              style={{ top: '50%' }}
            />
          </>
        )}

        {/* Etiqueta del nodo con indicador IN/OUT */}
        <div className={styles.label}>
          <p>{data.dir === 'in' ? 'IN' : ''}</p>
          {data.label}
          <p>{data.dir === 'out' ? 'OUT' : ''}</p>
        </div>
      </div>

      {/* Sección de flujo de ejecución (siempre montada, visible según toggle) */}
      <div
        className={styles.executionSection}
        style={{ opacity: state.showExecutionFlow ? 1 : 0, pointerEvents: state.showExecutionFlow ? 'auto' : 'none' }}
      >
          {/* Punto de entrada de ejecución */}
          <Handle
            type="target"
            position={Position.Left}
            id="exec-in"
            className={`${styles.handle} ${styles.executionHandle}`}
            data-handlepos="left"
          />

          {/* Punto de salida de ejecución */}
          <Handle
            type="source"
            position={Position.Right}
            id="exec-out"
            className={`${styles.handle} ${styles.executionHandle}`}
            data-handlepos="right"
          />
        </div>

      {/* Puntos de conexión inferiores */}
      {data.dir === 'out' ? (
        // Nodo de salida: solo punto target inferior
        <Handle
          type="target"
          position={Position.Bottom}
          id="data-bottom-target"
          className={`${styles.handle} ${styles.handleTarget}`}
          data-handlepos="bottom"
        />
      ) : data.dir === 'in' ? (
        // Nodo de entrada: solo punto source inferior
        <Handle
          type="source"
          position={Position.Bottom}
          id="data-bottom"
          className={`${styles.handle} ${styles.handleSource}`}
          data-handlepos="bottom"
        />
      ) : (
        // Nodo bidireccional: ambos puntos inferiores
        <>
          <Handle
            type="source"
            position={Position.Bottom}
            id="data-bottom"
            className={`${styles.handle} ${styles.handleSource}`}
            data-handlepos="bottom"
          />
          <Handle
            type="target"
            position={Position.Bottom}
            id="data-bottom-target"
            className={`${styles.handle} ${styles.handleTarget}`}
            data-handlepos="bottom"
            style={{ left: '60%' }}
          />
        </>
      )}
    </div>
  );
} 