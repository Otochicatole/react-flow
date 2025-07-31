/**
 * node-types.tsx
 * -------------
 * Colección de componentes de nodo predefinidos para el diagrama.
 * Cada nodo está optimizado para un propósito específico y sigue
 * un patrón común de diseño.
 * 
 * Categorías de nodos:
 * 1. Nodos de dominio (Event, Command, Query, etc.)
 * 2. Nodos de control de flujo (Start, End, Decision)
 * 3. Nodos de datos (Document, Database)
 * 4. Compuertas lógicas (AND, OR, XOR, NOT)
 * 5. Nodos de proceso (Task, Milestone)
 * 
 * Características comunes:
 * - Puntos de conexión para flujo de datos
 * - Soporte para flujo de ejecución (toggle)
 * - Estilos y comportamiento consistentes
 * - Íconos y etiquetas descriptivas
 */

import { Handle, Position } from '@xyflow/react';
import {
  Play,    // Ícono de inicio
  Square,  // Ícono de fin/IO
  FileText,// Ícono de documento
  Database,// Ícono de base de datos
  Circle,  // Ícono de conector
  X,       // Ícono NOT
  Type     // Ícono de texto
} from 'lucide-react';
import styles from '@/components/styles/node-types.module.css';
import executionStyles from '@/components/styles/node-types-execution.module.css';
import { useProjectStore } from '@/context/project-store';

/**
 * Props base para todos los nodos.
 * @property data.label - Texto a mostrar en el nodo
 * @property selected - Si el nodo está seleccionado
 */
interface BaseNodeProps {
  data: {
    label: string;
  };
  selected?: boolean;
}

/**
 * EventNode
 * ---------
 * Nodo que representa un evento en el sistema.
 * Solo tiene salida de datos (source) ya que los eventos
 * son el origen de un flujo.
 */
export function EventNode({ data, selected }: BaseNodeProps) {
  const { state } = useProjectStore();
  return (
    <div className={`${styles.node} ${styles.eventNode} ${selected ? styles.nodeSelected : ''}`}>
      {}
      <div className={executionStyles.mainContent}>
        <Handle
          type="source"
          position={Position.Right}
          id="data-right"
          className={`${styles.handle} ${styles.handleSource}`}
        />
        <div className={styles.nodeIcon}>📢</div>
        <div className={styles.label}>{data.label}</div>
      </div>

      {}
      {state.showExecutionFlow && (
        <div className={executionStyles.executionSection}>
          <Handle
            type="target"
            position={Position.Left}
            id="exec-in"
            className={`${styles.handle} ${executionStyles.executionHandle}`}
          />
          <Handle
            type="source"
            position={Position.Right}
            id="exec-out"
            className={`${styles.handle} ${executionStyles.executionHandle}`}
          />
        </div>
      )}
    </div>
  );
}

/**
 * CommandNode
 * ----------
 * Nodo que representa un comando o acción a ejecutar.
 * Tiene entrada y salida de datos para encadenar acciones.
 * 
 * Características:
 * - Entrada izquierda (target)
 * - Salida derecha (source)
 * - Ícono de rayo (⚡)
 */
export function CommandNode({ data, selected }: BaseNodeProps) {
  const { state } = useProjectStore();
  return (
    <div className={`${styles.node} ${styles.commandNode} ${selected ? styles.nodeSelected : ''}`}>
      {}
      <div className={executionStyles.mainContent}>
        <Handle
          type="target"
          position={Position.Left}
          id="data-left"
          className={`${styles.handle} ${styles.handleTarget}`}
        />
        <Handle
          type="source"
          position={Position.Right}
          id="data-right"
          className={`${styles.handle} ${styles.handleSource}`}
        />
        <div className={styles.nodeIcon}>⚡</div>
        <div className={styles.label}>{data.label}</div>
      </div>

      {}
      {state.showExecutionFlow && (
        <div className={executionStyles.executionSection}>
          <Handle
            type="target"
            position={Position.Left}
            id="exec-in"
            className={`${styles.handle} ${executionStyles.executionHandle}`}
          />
          <Handle
            type="source"
            position={Position.Right}
            id="exec-out"
            className={`${styles.handle} ${executionStyles.executionHandle}`}
          />

        </div>
      )}
    </div>
  );
}

/**
 * QueryNode
 * ----------
 * Nodo que representa una consulta o búsqueda.
 * Recibe parámetros y retorna resultados.
 * 
 * Características:
 * - Entrada izquierda (target) para parámetros
 * - Salida derecha (source) para resultados
 * - Ícono de lupa (🔍)
 */
export function QueryNode({ data, selected }: BaseNodeProps) {
  const { state } = useProjectStore();
  return (
    <div className={`${styles.node} ${styles.queryNode} ${selected ? styles.nodeSelected : ''}`}>
      {}
      <div className={executionStyles.mainContent}>
        <Handle
          type="target"
          position={Position.Left}
          id="data-left"
          className={`${styles.handle} ${styles.handleTarget}`}
        />
        <Handle
          type="source"
          position={Position.Right}
          id="data-right"
          className={`${styles.handle} ${styles.handleSource}`}
        />
        <div className={styles.nodeIcon}>🔍</div>
        <div className={styles.label}>{data.label}</div>
      </div>

      {}
      {state.showExecutionFlow && (
        <div className={executionStyles.executionSection}>
          <Handle
            type="target"
            position={Position.Left}
            id="exec-in"
            className={`${styles.handle} ${executionStyles.executionHandle}`}
          />
          <Handle
            type="source"
            position={Position.Right}
            id="exec-out"
            className={`${styles.handle} ${executionStyles.executionHandle}`}
          />

        </div>
      )}
    </div>
  );
}

/**
 * AggregateNode
 * ------------
 * Nodo que representa un agregado DDD.
 * Maneja entidades y sus reglas de negocio.
 * 
 * Características:
 * - Entradas superior e izquierda (target)
 * - Salidas inferior y derecha (source)
 * - Ícono de edificio (🏛️)
 * - Punto central para lógica de dominio
 */
export function AggregateNode({ data, selected }: BaseNodeProps) {
  const { state } = useProjectStore();
  return (
    <div className={`${styles.node} ${styles.aggregateNode} ${selected ? styles.nodeSelected : ''}`}>
      {}
      <div className={executionStyles.mainContent}>
        <Handle
          type="target"
          position={Position.Top}
          id="data-top"
          className={`${styles.handle} ${styles.handleTarget}`}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          id="data-bottom"
          className={`${styles.handle} ${styles.handleSource}`}
        />
        <Handle
          type="target"
          position={Position.Left}
          id="data-left"
          className={`${styles.handle} ${styles.handleTarget}`}
        />
        <Handle
          type="source"
          position={Position.Right}
          id="data-right"
          className={`${styles.handle} ${styles.handleSource}`}
        />
        <div className={styles.nodeIcon}>🏛️</div>
        <div className={styles.label}>{data.label}</div>
      </div>

      {}
      {state.showExecutionFlow && (
        <div className={executionStyles.executionSection}>
          <Handle
            type="target"
            position={Position.Left}
            id="exec-in"
            className={`${styles.handle} ${executionStyles.executionHandle}`}
          />
          <Handle
            type="source"
            position={Position.Right}
            id="exec-out"
            className={`${styles.handle} ${executionStyles.executionHandle}`}
          />

        </div>
      )}
    </div>
  );
}

/**
 * ServiceNode
 * ----------
 * Nodo que representa un servicio del sistema.
 * Encapsula lógica de negocio y operaciones.
 * 
 * Características:
 * - Entradas superior e izquierda (target)
 * - Salidas inferior y derecha (source)
 * - Ícono de engranaje (⚙️)
 * - Punto central para servicios
 */
export function ServiceNode({ data, selected }: BaseNodeProps) {
  const { state } = useProjectStore();
  return (
    <div className={`${styles.node} ${styles.serviceNode} ${selected ? styles.nodeSelected : ''}`}>
      {}
      <div className={executionStyles.mainContent}>
        <Handle
          type="target"
          position={Position.Top}
          id="data-top"
          className={`${styles.handle} ${styles.handleTarget}`}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          id="data-bottom"
          className={`${styles.handle} ${styles.handleSource}`}
        />
        <Handle
          type="target"
          position={Position.Left}
          id="data-left"
          className={`${styles.handle} ${styles.handleTarget}`}
        />
        <Handle
          type="source"
          position={Position.Right}
          id="data-right"
          className={`${styles.handle} ${styles.handleSource}`}
        />
        <div className={styles.nodeIcon}>⚙️</div>
        <div className={styles.label}>{data.label}</div>
      </div>

      {}
      {state.showExecutionFlow && (
        <div className={executionStyles.executionSection}>
          <Handle
            type="target"
            position={Position.Left}
            id="exec-in"
            className={`${styles.handle} ${executionStyles.executionHandle}`}
          />
          <Handle
            type="source"
            position={Position.Right}
            id="exec-out"
            className={`${styles.handle} ${executionStyles.executionHandle}`}
          />

        </div>
      )}
    </div>
  );
}

/**
 * MessageBusNode
 * -------------
 * Nodo que representa un bus de mensajes.
 * Facilita la comunicación entre componentes.
 * 
 * Características:
 * - Entradas superior e izquierda (target)
 * - Salidas inferior y derecha (source)
 * - Ícono de bus (🚌)
 * - Punto central para eventos
 */
export function MessageBusNode({ data, selected }: BaseNodeProps) {
  const { state } = useProjectStore();
  return (
    <div className={`${styles.node} ${styles.messageBusNode} ${selected ? styles.nodeSelected : ''}`}>
      {}
      <div className={executionStyles.mainContent}>
        <Handle
          type="target"
          position={Position.Top}
          id="data-top"
          className={`${styles.handle} ${styles.handleTarget}`}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          id="data-bottom"
          className={`${styles.handle} ${styles.handleSource}`}
        />
        <Handle
          type="target"
          position={Position.Left}
          id="data-left"
          className={`${styles.handle} ${styles.handleTarget}`}
        />
        <Handle
          type="source"
          position={Position.Right}
          id="data-right"
          className={`${styles.handle} ${styles.handleSource}`}
        />
        <div className={styles.nodeIcon}>🚌</div>
        <div className={styles.label}>{data.label}</div>
      </div>

      {}
      {state.showExecutionFlow && (
        <div className={executionStyles.executionSection}>
          <Handle
            type="target"
            position={Position.Left}
            id="exec-in"
            className={`${styles.handle} ${executionStyles.executionHandle}`}
          />
          <Handle
            type="source"
            position={Position.Right}
            id="exec-out"
            className={`${styles.handle} ${executionStyles.executionHandle}`}
          />

        </div>
      )}
    </div>
  );
}

/**
 * StartNode
 * ---------
 * Nodo que marca el inicio de un flujo.
 * Solo tiene salidas ya que es un punto de origen.
 * 
 * Características:
 * - Salidas derecha e inferior (source)
 * - Ícono de play (▶)
 * - Estilo distintivo para inicio
 */
export function StartNode({ data, selected }: BaseNodeProps) {
  const { state } = useProjectStore();
  return (
    <div className={`${styles.node} ${styles.startNode} ${selected ? styles.nodeSelected : ''}`}>
      {}
      <div className={executionStyles.mainContent}>
        {}
        <Handle
          type="source"
          position={Position.Right}
          id="data-right"
          className={`${styles.handle} ${styles.handleSource}`}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          id="data-bottom"
          className={`${styles.handle} ${styles.handleSource}`}
        />
        <div className={styles.nodeIcon}>
          <Play size={16} />
        </div>
        <div className={styles.label}>{data.label}</div>
      </div>

      {}
      {state.showExecutionFlow && (
        <div className={executionStyles.executionSection}>
          <Handle
            type="source"
            position={Position.Right}
            id="exec-out"
            className={`${styles.handle} ${executionStyles.executionHandle}`}
          />

        </div>
      )}
    </div>
  );
}

/**
 * EndNode
 * -------
 * Nodo que marca el fin de un flujo.
 * Solo tiene entradas ya que es un punto final.
 * 
 * Características:
 * - Entradas izquierda y superior (target)
 * - Ícono de stop (■)
 * - Estilo distintivo para fin
 */
export function EndNode({ data, selected }: BaseNodeProps) {
  const { state } = useProjectStore();
  return (
    <div className={`${styles.node} ${styles.endNode} ${selected ? styles.nodeSelected : ''}`}>
      {}
      <div className={executionStyles.mainContent}>
        {}
        <Handle
          type="target"
          position={Position.Left}
          id="data-left"
          className={`${styles.handle} ${styles.handleTarget}`}
        />
        <Handle
          type="target"
          position={Position.Top}
          id="data-top"
          className={`${styles.handle} ${styles.handleTarget}`}
        />
        <div className={styles.nodeIcon}>
          <Square size={16} />
        </div>
        <div className={styles.label}>{data.label}</div>
      </div>

      {}
      {state.showExecutionFlow && (
        <div className={executionStyles.executionSection}>
          <Handle
            type="target"
            position={Position.Left}
            id="exec-in"
            className={`${styles.handle} ${executionStyles.executionHandle}`}
          />

        </div>
      )}
    </div>
  );
}

/**
 * DecisionNode
 * -----------
 * Nodo que representa un punto de decisión.
 * Tiene una entrada y múltiples salidas para ramificar el flujo.
 * 
 * Características:
 * - Entrada superior (target)
 * - Salidas inferior, izquierda y derecha (source)
 * - Forma de rombo
 * - Ideal para condiciones
 */
export function DecisionNode({ data, selected }: BaseNodeProps) {
  const { state } = useProjectStore();
  return (
    <div className={`${styles.node} ${styles.decisionNode} ${selected ? styles.nodeSelected : ''}`}>
      {}
      <div className={executionStyles.mainContent}>
        <Handle
          type="target"
          position={Position.Top}
          id="data-top"
          className={`${styles.handle} ${styles.handleTarget}`}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          id="data-bottom"
          className={`${styles.handle} ${styles.handleSource}`}
        />
        <Handle
          type="source"
          position={Position.Left}
          id="data-left"
          className={`${styles.handle} ${styles.handleSource}`}
        />
        <Handle
          type="source"
          position={Position.Right}
          id="data-right"
          className={`${styles.handle} ${styles.handleSource}`}
        />
        <div className={styles.label}>{data.label}</div>
      </div>

      {}
      {state.showExecutionFlow && (
        <div className={executionStyles.executionSection}>
          <Handle
            type="target"
            position={Position.Left}
            id="exec-in"
            className={`${styles.handle} ${executionStyles.executionHandle}`}
          />
          <Handle
            type="source"
            position={Position.Right}
            id="exec-out"
            className={`${styles.handle} ${executionStyles.executionHandle}`}
          />

        </div>
      )}
    </div>
  );
}

/**
 * InputOutputNode
 * -------------
 * Nodo que representa una operación de entrada/salida.
 * Maneja interacciones con sistemas externos.
 * 
 * Características:
 * - Entrada izquierda (target)
 * - Salida derecha (source)
 * - Ícono de cuadrado (■)
 * - Estilo inclinado para I/O
 */
export function InputOutputNode({ data, selected }: BaseNodeProps) {
  const { state } = useProjectStore();
  return (
    <div className={`${styles.node} ${styles.inputOutputNode} ${selected ? styles.nodeSelected : ''}`}>
      {}
      <div className={executionStyles.mainContent}>
        <Handle
          type="target"
          position={Position.Left}
          id="data-left"
          className={`${styles.handle} ${styles.handleTarget}`}
        />
        <Handle
          type="source"
          position={Position.Right}
          id="data-right"
          className={`${styles.handle} ${styles.handleSource}`}
        />
        <div className={styles.nodeIcon}>
          <Square size={16} />
        </div>
        <div className={styles.label}>{data.label}</div>
      </div>

      {}
      {state.showExecutionFlow && (
        <div className={executionStyles.executionSection}>
          <Handle
            type="target"
            position={Position.Left}
            id="exec-in"
            className={`${styles.handle} ${executionStyles.executionHandle}`}
          />
          <Handle
            type="source"
            position={Position.Right}
            id="exec-out"
            className={`${styles.handle} ${executionStyles.executionHandle}`}
          />

        </div>
      )}
    </div>
  );
}

/**
 * TextInputNode
 * ------------
 * Nodo que representa un campo de texto.
 * Para captura de datos del usuario.
 * 
 * Características:
 * - Entrada izquierda (target)
 * - Salida derecha (source)
 * - Ícono de texto (T)
 * - Estilo para entrada de datos
 */
export function TextInputNode({ data, selected }: BaseNodeProps) {
  const { state } = useProjectStore();
  return (
    <div className={`${styles.node} ${styles.textInputNode} ${selected ? styles.nodeSelected : ''}`}>
      {}
      <div className={executionStyles.mainContent}>
        <Handle
          type="target"
          position={Position.Left}
          id="data-left"
          className={`${styles.handle} ${styles.handleTarget}`}
        />
        <Handle
          type="source"
          position={Position.Right}
          id="data-right"
          className={`${styles.handle} ${styles.handleSource}`}
        />
        <div className={styles.nodeIcon}>
          <Type size={16} />
        </div>
        <div className={styles.label}>{data.label}</div>
      </div>

      {}
      {state.showExecutionFlow && (
        <div className={executionStyles.executionSection}>
          <Handle
            type="target"
            position={Position.Left}
            id="exec-in"
            className={`${styles.handle} ${executionStyles.executionHandle}`}
          />
          <Handle
            type="source"
            position={Position.Right}
            id="exec-out"
            className={`${styles.handle} ${executionStyles.executionHandle}`}
          />

        </div>
      )}
    </div>
  );
}

/**
 * DocumentNode
 * -----------
 * Nodo que representa un documento o archivo.
 * Para operaciones con documentos/archivos.
 * 
 * Características:
 * - Entrada superior (target)
 * - Salida inferior (source)
 * - Ícono de archivo (📄)
 * - Estilo para documentos
 */
export function DocumentNode({ data, selected }: BaseNodeProps) {
  const { state } = useProjectStore();
  return (
    <div className={`${styles.node} ${styles.documentNode} ${selected ? styles.nodeSelected : ''}`}>
      {}
      <div className={executionStyles.mainContent}>
        <Handle
          type="target"
          position={Position.Top}
          id="data-top"
          className={`${styles.handle} ${styles.handleTarget}`}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          id="data-bottom"
          className={`${styles.handle} ${styles.handleSource}`}
        />
        <div className={styles.nodeIcon}>
          <FileText size={16} />
        </div>
        <div className={styles.label}>{data.label}</div>
      </div>

      {}
      {state.showExecutionFlow && (
        <div className={executionStyles.executionSection}>
          <Handle
            type="target"
            position={Position.Left}
            id="exec-in"
            className={`${styles.handle} ${executionStyles.executionHandle}`}
          />
          <Handle
            type="source"
            position={Position.Right}
            id="exec-out"
            className={`${styles.handle} ${executionStyles.executionHandle}`}
          />

        </div>
      )}
    </div>
  );
}

/**
 * DatabaseNode
 * -----------
 * Nodo que representa una base de datos.
 * Para operaciones de persistencia.
 * 
 * Características:
 * - Entradas superior e izquierda (target)
 * - Salidas inferior y derecha (source)
 * - Ícono de base de datos (🗄️)
 * - Estilo para almacenamiento
 */
export function DatabaseNode({ data, selected }: BaseNodeProps) {
  const { state } = useProjectStore();
  return (
    <div className={`${styles.node} ${styles.databaseNode} ${selected ? styles.nodeSelected : ''}`}>
      {}
      <div className={executionStyles.mainContent}>
        <Handle
          type="target"
          position={Position.Top}
          id="data-top"
          className={`${styles.handle} ${styles.handleTarget}`}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          id="data-bottom"
          className={`${styles.handle} ${styles.handleSource}`}
        />
        <Handle
          type="target"
          position={Position.Left}
          id="data-left"
          className={`${styles.handle} ${styles.handleTarget}`}
        />
        <Handle
          type="source"
          position={Position.Right}
          id="data-right"
          className={`${styles.handle} ${styles.handleSource}`}
        />
        <div className={styles.nodeIcon}>
          <Database size={16} />
        </div>
        <div className={styles.label}>{data.label}</div>
      </div>

      {}
      {state.showExecutionFlow && (
        <div className={executionStyles.executionSection}>
          <Handle
            type="target"
            position={Position.Left}
            id="exec-in"
            className={`${styles.handle} ${executionStyles.executionHandle}`}
          />
          <Handle
            type="source"
            position={Position.Right}
            id="exec-out"
            className={`${styles.handle} ${executionStyles.executionHandle}`}
          />

        </div>
      )}
    </div>
  );
}

/**
 * ConnectorNode
 * ------------
 * Nodo que actúa como punto de conexión.
 * Útil para organizar flujos complejos.
 * 
 * Características:
 * - Entradas superior e izquierda (target)
 * - Salidas inferior y derecha (source)
 * - Ícono de círculo (○)
 * - Tamaño mínimo para conexiones
 */
export function ConnectorNode({ selected }: { selected?: boolean }) {
  const { state } = useProjectStore();
  return (
    <div className={`${styles.node} ${styles.connectorNode} ${selected ? styles.nodeSelected : ''}`}>
      {}
      <div className={executionStyles.mainContent}>
        <Handle
          type="target"
          position={Position.Top}
          id="data-top"
          className={`${styles.handle} ${styles.handleTarget}`}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          id="data-bottom"
          className={`${styles.handle} ${styles.handleSource}`}
        />
        <Handle
          type="target"
          position={Position.Left}
          id="data-left"
          className={`${styles.handle} ${styles.handleTarget}`}
        />
        <Handle
          type="source"
          position={Position.Right}
          id="data-right"
          className={`${styles.handle} ${styles.handleSource}`}
        />
        <div className={styles.nodeIcon}>
          <Circle size={8} />
        </div>
      </div>

      {}
      {state.showExecutionFlow && (
        <div className={executionStyles.executionSection}>
          <Handle
            type="target"
            position={Position.Left}
            id="exec-in"
            className={`${styles.handle} ${executionStyles.executionHandle}`}
          />
          <Handle
            type="source"
            position={Position.Right}
            id="exec-out"
            className={`${styles.handle} ${executionStyles.executionHandle}`}
          />

        </div>
      )}
    </div>
  );
}

/**
 * AndGateNode
 * ----------
 * Nodo que representa una compuerta AND.
 * Requiere que todas las entradas sean verdaderas.
 * 
 * Características:
 * - Dos entradas izquierdas (target)
 * - Una salida derecha (source)
 * - Texto "AND"
 * - Estilo de compuerta lógica
 */
export function AndGateNode({ data, selected }: BaseNodeProps) {
  const { state } = useProjectStore();
  return (
    <div className={`${styles.node} ${styles.logicGateNode} ${styles.andGate} ${selected ? styles.nodeSelected : ''}`}>
      {}
      <div className={executionStyles.mainContent}>
        <Handle
          type="target"
          position={Position.Left}
          id="data-input1"
          className={`${styles.handle} ${styles.handleTarget}`}
          style={{ top: '30%' }}
        />
        <Handle
          type="target"
          position={Position.Left}
          id="data-input2"
          className={`${styles.handle} ${styles.handleTarget}`}
          style={{ top: '70%' }}
        />
        <Handle
          type="source"
          position={Position.Right}
          id="data-output"
          className={`${styles.handle} ${styles.handleSource}`}
        />
        <div className={styles.logicGateLabel}>AND</div>
        <div className={styles.label}>{data.label}</div>
      </div>

      {}
      {state.showExecutionFlow && (
        <div className={executionStyles.executionSection}>
          <Handle
            type="target"
            position={Position.Left}
            id="exec-in"
            className={`${styles.handle} ${executionStyles.executionHandle}`}
          />
          <Handle
            type="source"
            position={Position.Right}
            id="exec-out"
            className={`${styles.handle} ${executionStyles.executionHandle}`}
          />

        </div>
      )}
    </div>
  );
}

/**
 * OrGateNode
 * ---------
 * Nodo que representa una compuerta OR.
 * Se activa si al menos una entrada es verdadera.
 * 
 * Características:
 * - Dos entradas izquierdas (target)
 * - Una salida derecha (source)
 * - Texto "OR"
 * - Estilo de compuerta lógica
 */
export function OrGateNode({ data, selected }: BaseNodeProps) {
  const { state } = useProjectStore();
  return (
    <div className={`${styles.node} ${styles.logicGateNode} ${styles.orGate} ${selected ? styles.nodeSelected : ''}`}>
      {}
      <div className={executionStyles.mainContent}>
        <Handle
          type="target"
          position={Position.Left}
          id="data-input1"
          className={`${styles.handle} ${styles.handleTarget}`}
          style={{ top: '30%' }}
        />
        <Handle
          type="target"
          position={Position.Left}
          id="data-input2"
          className={`${styles.handle} ${styles.handleTarget}`}
          style={{ top: '70%' }}
        />
        <Handle
          type="source"
          position={Position.Right}
          id="data-output"
          className={`${styles.handle} ${styles.handleSource}`}
        />
        <div className={styles.logicGateLabel}>OR</div>
        <div className={styles.label}>{data.label}</div>
      </div>

      {}
      {state.showExecutionFlow && (
        <div className={executionStyles.executionSection}>
          <Handle
            type="target"
            position={Position.Left}
            id="exec-in"
            className={`${styles.handle} ${executionStyles.executionHandle}`}
          />
          <Handle
            type="source"
            position={Position.Right}
            id="exec-out"
            className={`${styles.handle} ${executionStyles.executionHandle}`}
          />

        </div>
      )}
    </div>
  );
}

/**
 * XorGateNode
 * ----------
 * Nodo que representa una compuerta XOR.
 * Se activa si exactamente una entrada es verdadera.
 * 
 * Características:
 * - Dos entradas izquierdas (target)
 * - Una salida derecha (source)
 * - Texto "XOR"
 * - Estilo de compuerta lógica
 */
export function XorGateNode({ data, selected }: BaseNodeProps) {
  const { state } = useProjectStore();
  return (
    <div className={`${styles.node} ${styles.logicGateNode} ${styles.xorGate} ${selected ? styles.nodeSelected : ''}`}>
      {}
      <div className={executionStyles.mainContent}>
        <Handle
          type="target"
          position={Position.Left}
          id="data-input1"
          className={`${styles.handle} ${styles.handleTarget}`}
          style={{ top: '30%' }}
        />
        <Handle
          type="target"
          position={Position.Left}
          id="data-input2"
          className={`${styles.handle} ${styles.handleTarget}`}
          style={{ top: '70%' }}
        />
        <Handle
          type="source"
          position={Position.Right}
          id="data-output"
          className={`${styles.handle} ${styles.handleSource}`}
        />
        <div className={styles.logicGateLabel}>XOR</div>
        <div className={styles.label}>{data.label}</div>
      </div>

      {}
      {state.showExecutionFlow && (
        <div className={executionStyles.executionSection}>
          <Handle
            type="target"
            position={Position.Left}
            id="exec-in"
            className={`${styles.handle} ${executionStyles.executionHandle}`}
          />
          <Handle
            type="source"
            position={Position.Right}
            id="exec-out"
            className={`${styles.handle} ${executionStyles.executionHandle}`}
          />

        </div>
      )}
    </div>
  );
}

/**
 * NotGateNode
 * ----------
 * Nodo que representa una compuerta NOT.
 * Invierte el valor de entrada.
 * 
 * Características:
 * - Una entrada izquierda (target)
 * - Una salida derecha (source)
 * - Ícono X
 * - Texto "NOT"
 * - Estilo de compuerta lógica
 */
export function NotGateNode({ data, selected }: BaseNodeProps) {
  const { state } = useProjectStore();
  return (
    <div className={`${styles.node} ${styles.logicGateNode} ${styles.notGate} ${selected ? styles.nodeSelected : ''}`}>
      {}
      <div className={executionStyles.mainContent}>
        <Handle
          type="target"
          position={Position.Left}
          id="data-input"
          className={`${styles.handle} ${styles.handleTarget}`}
        />
        <Handle
          type="source"
          position={Position.Right}
          id="data-output"
          className={`${styles.handle} ${styles.handleSource}`}
        />
        <div className={styles.nodeIcon}>
          <X size={16} />
        </div>
        <div className={styles.logicGateLabel}>NOT</div>
        <div className={styles.label}>{data.label}</div>
      </div>

      {}
      {state.showExecutionFlow && (
        <div className={executionStyles.executionSection}>
          <Handle
            type="target"
            position={Position.Left}
            id="exec-in"
            className={`${styles.handle} ${executionStyles.executionHandle}`}
          />
          <Handle
            type="source"
            position={Position.Right}
            id="exec-out"
            className={`${styles.handle} ${executionStyles.executionHandle}`}
          />

        </div>
      )}
    </div>
  );
}

/**
 * TaskNode
 * --------
 * Nodo que representa una tarea o actividad.
 * Puede mostrar progreso de ejecución.
 * 
 * Características:
 * - Entrada izquierda (target)
 * - Salida derecha (source)
 * - Barra de progreso
 * - Estilo para tareas
 */
export function TaskNode({ data, selected }: BaseNodeProps) {
  const { state } = useProjectStore();
  return (
    <div className={`${styles.node} ${styles.taskNode} ${selected ? styles.nodeSelected : ''}`}>
      {}
      <div className={executionStyles.mainContent}>
        <Handle
          type="target"
          position={Position.Left}
          id="data-left"
          className={`${styles.handle} ${styles.handleTarget}`}
        />
        <Handle
          type="source"
          position={Position.Right}
          id="data-right"
          className={`${styles.handle} ${styles.handleSource}`}
        />
        <div className={styles.taskBar}>
          <div className={styles.taskProgress}></div>
        </div>
        <div className={styles.label}>{data.label}</div>
      </div>

      {}
      {state.showExecutionFlow && (
        <div className={executionStyles.executionSection}>
          <Handle
            type="target"
            position={Position.Left}
            id="exec-in"
            className={`${styles.handle} ${executionStyles.executionHandle}`}
          />
          <Handle
            type="source"
            position={Position.Right}
            id="exec-out"
            className={`${styles.handle} ${executionStyles.executionHandle}`}
          />

        </div>
      )}
    </div>
  );
}

/**
 * MilestoneNode
 * ------------
 * Nodo que representa un hito o punto clave.
 * Marca momentos importantes en el flujo.
 * 
 * Características:
 * - Entrada izquierda (target)
 * - Salida derecha (source)
 * - Estilo distintivo para hitos
 * - Forma de diamante
 */
export function MilestoneNode({ data, selected }: BaseNodeProps) {
  const { state } = useProjectStore();
  return (
    <div className={`${styles.node} ${styles.milestoneNode} ${selected ? styles.nodeSelected : ''}`}>
      {}
      <div className={executionStyles.mainContent}>
        <Handle
          type="target"
          position={Position.Left}
          id="data-left"
          className={`${styles.handle} ${styles.handleTarget}`}
        />
        <Handle
          type="source"
          position={Position.Right}
          id="data-right"
          className={`${styles.handle} ${styles.handleSource}`}
        />
        <div className={styles.label}>{data.label}</div>
      </div>

      {}
      {state.showExecutionFlow && (
        <div className={executionStyles.executionSection}>
          <Handle
            type="target"
            position={Position.Left}
            id="exec-in"
            className={`${styles.handle} ${executionStyles.executionHandle}`}
          />
          <Handle
            type="source"
            position={Position.Right}
            id="exec-out"
            className={`${styles.handle} ${executionStyles.executionHandle}`}
          />

        </div>
      )}
    </div>
  );
} 