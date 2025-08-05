
'use client'

/**
 * useCanvas Hook
 * --------------
 * Hook central que maneja toda la interacción con React Flow.
 * 
 * Responsabilidades:
 * - Gestionar el estado de nodos y conexiones
 * - Manejar eventos de React Flow (cambios, conexiones)
 * - Validar conexiones entre nodos
 * - Proveer operaciones CRUD para nodos y conexiones
 * - Sincronizar cambios con el ProjectStore global
 * 
 * Este hook es el puente entre la UI de React Flow y nuestro estado global,
 * asegurando que todas las operaciones sean consistentes y persistan.
 */

import { useCallback, useMemo } from 'react';
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type NodeChange,
  type EdgeChange,
  type Connection,
  type XYPosition,
  type Node,
  type Edge,
} from '@xyflow/react';
import { useProjectStore } from '@/context/project-store';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Project, FlowData } from '@/types';
import { getCurrentFlow } from '@/utils';

// Importamos todos los tipos de nodos disponibles
import { CustomNode } from '@/components/common/custom-node';
import { ProcessNode } from '@/components/common/process-node';
import {
  // Nodos de dominio
  EventNode,         // Eventos del sistema
  CommandNode,       // Comandos/acciones
  QueryNode,         // Consultas
  AggregateNode,     // Agregados DDD
  ServiceNode,       // Servicios
  MessageBusNode,    // Bus de mensajes

  // Nodos de control de flujo
  StartNode,         // Inicio de flujo
  EndNode,          // Fin de flujo
  DecisionNode,     // Puntos de decisión
  InputOutputNode,  // Entrada/Salida
  TextInputNode,    // Input de texto
  DocumentNode,     // Documentos
  DatabaseNode,     // Base de datos
  ConnectorNode,    // Conectores

  // Compuertas lógicas
  AndGateNode,      // AND
  OrGateNode,       // OR
  XorGateNode,      // XOR
  NotGateNode,      // NOT

  // Nodos de proceso
  TaskNode,         // Tareas
  MilestoneNode,    // Hitos
} from '@/components/common/nodes';

/**
 * Genera un ID único para nodos y conexiones.
 * Combina: prefijo + timestamp + random para evitar colisiones.
 */
const generateId = (prefix: string) => `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

/**
 * Determina la etiqueta por defecto para cada tipo de nodo.
 * Los nodos lógicos (AND, OR, etc.) no tienen texto por defecto.
 */
const getDefaultNodeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    event: 'New Event',
    command: 'New Command',
    query: 'New Query',
    aggregate: 'New Aggregate',
    service: 'New Service',
    messageBus: 'New Message Bus',
    process: 'New Process',
    custom: 'New Node',

    start: 'Start',
    end: 'End',
    decision: 'Decision',
    inputOutput: 'Input/Output',
    textInput: 'Text Input',
    document: 'Document',
    database: 'Database',
    connector: 'Connector',

    andGate: '',
    orGate: '',
    xorGate: '',
    notGate: '',

    task: 'Task',
    milestone: 'Milestone',
  };
  return labels[type] ?? 'New Node';
};

/**
 * Registro de todos los tipos de nodos disponibles.
 * React Flow usa este objeto para renderizar el componente correcto
 * según el type de cada nodo.
 * 
 * Organizado por categorías:
 * - Nodos base (custom, process)
 * - Nodos de dominio (event, command, etc.)
 * - Nodos de control de flujo
 * - Compuertas lógicas
 * - Nodos de proceso
 */
export const nodeTypes = {
  // Nodos base
  custom: CustomNode,      // Nodo personalizado (in/out)
  process: ProcessNode,    // Proceso con subprocesos

  // Nodos de dominio
  event: EventNode,        // Eventos del sistema
  command: CommandNode,    // Comandos/acciones
  query: QueryNode,        // Consultas
  aggregate: AggregateNode,// Agregados DDD
  service: ServiceNode,    // Servicios
  messageBus: MessageBusNode, // Bus de mensajes

  // Nodos de control de flujo
  start: StartNode,        // Inicio de flujo
  end: EndNode,           // Fin de flujo
  decision: DecisionNode, // Puntos de decisión
  inputOutput: InputOutputNode, // Entrada/Salida
  textInput: TextInputNode,// Input de texto
  document: DocumentNode, // Documentos
  database: DatabaseNode,// Base de datos
  connector: ConnectorNode,// Conectores

  // Compuertas lógicas
  andGate: AndGateNode,   // AND
  orGate: OrGateNode,     // OR
  xorGate: XorGateNode,   // XOR
  notGate: NotGateNode,   // NOT

  // Nodos de proceso
  task: TaskNode,         // Tareas
  milestone: MilestoneNode,// Hitos
};

/**
 * Hook principal para interactuar con el canvas de React Flow.
 * Provee todas las operaciones necesarias para manipular el diagrama.
 * 
 * @returns Objeto con nodos, conexiones y operaciones del canvas
 */
export function useCanvas() {
  // Accedemos al estado global y sus acciones
  const { state, dispatch } = useProjectStore();
  const { currentProject, currentProcessPath, showExecutionFlow } = state;

  // Obtenemos el flujo actual basado en la ruta de proceso
  const currentFlow = currentProject ? getCurrentFlow(currentProject, currentProcessPath) : null;
  
  /**
   * Lista de nodos del flujo actual.
   * Se recalcula solo cuando cambia currentFlow.
   */
  const nodes: Node[] = useMemo(() => currentFlow?.nodes || [], [currentFlow]);

  /**
   * Lista de conexiones del flujo actual.
   * Filtra las conexiones de ejecución si showExecutionFlow está desactivado.
   */
  const edges: Edge[] = useMemo(() => {
    const allEdges = currentFlow?.edges || [];
    if (!showExecutionFlow) {
      // Filtramos conexiones de ejecución cuando el toggle está off
      return allEdges.filter(edge => {
        const isExecutionEdge = edge.data?.connectionType === 'execution' || 
                               edge.sourceHandle?.includes('exec') || 
                               edge.targetHandle?.includes('exec');
        return !isExecutionEdge;
      });
    }
    return allEdges;
  }, [currentFlow, showExecutionFlow]);

  /**
   * Maneja cambios en los nodos (posición, selección, etc).
   * Aplica los cambios y actualiza el estado global.
   */
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      const updated = applyNodeChanges(changes, nodes);
      dispatch({ type: 'UPDATE_NODES', nodes: updated });
    },
    [nodes, dispatch],
  );

  /**
   * Maneja cambios en las conexiones (eliminación, selección).
   * Aplica los cambios y actualiza el estado global.
   */
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      const updated = applyEdgeChanges(changes, edges);
      dispatch({ type: 'UPDATE_EDGES', edges: updated });
    },
    [edges, dispatch],
  );

  /**
   * Maneja la creación de nuevas conexiones entre nodos.
   * Detecta si es una conexión de ejecución o datos y aplica los estilos correspondientes.
   */
  const onConnect = useCallback(
    (params: Connection) => {
      // Detectamos si es una conexión de flujo de ejecución
      const isExecutionFlow = params.sourceHandle?.includes('exec') || params.targetHandle?.includes('exec');
      
      // Configuramos los datos y estilos según el tipo
      const edgeData = {
        ...params,
        type: isExecutionFlow ? 'default' : 'default', // Make data flow edges curved like execution flow
        data: { 
          connectionType: isExecutionFlow ? 'execution' : 'data' 
        },
        className: isExecutionFlow ? 'execution-edge' : 'data-edge',
      };
      
      // Creamos la conexión y actualizamos el estado
      const updated = addEdge(edgeData, edges);
      dispatch({ type: 'UPDATE_EDGES', edges: updated });
    },
    [edges, dispatch],
  );

  /**
   * Valida si una conexión es permitida.
   * Solo permite conectar:
   * - Flujo de ejecución con flujo de ejecución
   * - Flujo de datos con flujo de datos
   */
  const isValidConnection = useCallback((connection: Connection | Edge) => {
    const sourceIsExec = connection.sourceHandle?.includes('exec');
    const targetIsExec = connection.targetHandle?.includes('exec');

    return sourceIsExec === targetIsExec;
  }, []);

  /**
   * Agrega un nuevo nodo al canvas.
   * Maneja tres tipos de nodos:
   * 1. Nodos personalizados (custom::name::dir)
   * 2. Nodos de proceso (con subprocesos)
   * 3. Nodos estándar (todos los demás)
   */
  const addNode = useCallback(
    (type: string, position: XYPosition) => {
      if (!currentProject) return;

      if (type.startsWith('custom::')) {
        // Nodo personalizado (formato: custom::nombre)
        const [, customName] = type.split('::');
        const newNode = {
          id: generateId('node'),
          type: 'custom',
          position,
          data: { label: customName, customName },
        } as Node;
        dispatch({ type: 'UPDATE_NODES', nodes: [...nodes, newNode] });

      } else if (type === 'process') {
        // Nodo de proceso (con subproceso anidado)
        const count = nodes.filter(n => n.type === 'process').length + 1;
        dispatch({ 
          type: 'CREATE_PROCESS', 
          name: `Process ${count}`, 
          description: 'New process description', 
          position 
        });

      } else {
        // Nodo estándar
        const newNode = {
          id: generateId('node'),
          type,
          position,
          data: { label: getDefaultNodeLabel(type) },
        } as Node;
        dispatch({ type: 'UPDATE_NODES', nodes: [...nodes, newNode] });
      }
    },
    [nodes, dispatch, currentProject],
  );

  /**
   * Elimina un nodo y todas sus conexiones.
   * Actualiza tanto la lista de nodos como la de conexiones.
   */
  const deleteNode = useCallback(
    (nodeId: string) => {
      // Filtramos el nodo y sus conexiones
      const updatedNodes = nodes.filter(n => n.id !== nodeId);
      const updatedEdges = edges.filter(e => e.source !== nodeId && e.target !== nodeId);
      
      // Actualizamos el estado
      dispatch({ type: 'UPDATE_NODES', nodes: updatedNodes });
      dispatch({ type: 'UPDATE_EDGES', edges: updatedEdges });
    },
    [nodes, edges, dispatch],
  );

  /**
   * Elimina una conexión específica.
   */
  const deleteEdge = useCallback(
    (edgeId: string) => {
      const updatedEdges = edges.filter(e => e.id !== edgeId);
      dispatch({ type: 'UPDATE_EDGES', edges: updatedEdges });
    },
    [edges, dispatch],
  );

  /**
   * Actualiza la etiqueta de un nodo.
   * Manejo especial para nodos de proceso:
   * - Actualiza el nombre del proceso en el estado global
   * - Fuerza re-render con _forceUpdate
   */
  const updateNodeLabel = useCallback(
    (nodeId: string, newLabel: string) => {
      // Actualizamos la etiqueta del nodo
      const updatedNodes = nodes.map(n =>
        n.id === nodeId ? { 
          ...n, 
          data: { 
            ...n.data, 
            label: newLabel, 
            _forceUpdate: Date.now() // Forzar re-render
          } 
        } : n,
      );
      dispatch({ type: 'UPDATE_NODES', nodes: updatedNodes });

      // Si es un nodo de proceso, actualizamos el nombre del proceso
      const target = nodes.find(n => n.id === nodeId);
      if (target?.type === 'process') {
        const procId = (target.data as { processId?: string }).processId;
        if (procId) {
          dispatch({ type: 'UPDATE_PROCESS_NAME', processId: procId, newName: newLabel });
        }
      }
    },
    [nodes, dispatch],
  );

  /**
   * Actualiza la etiqueta de una conexión.
   */
  const updateEdgeLabel = useCallback(
    (edgeId: string, newLabel: string) => {
      const updatedEdges = edges.map(e =>
        e.id === edgeId ? { ...e, label: newLabel } : e,
      );
      dispatch({ type: 'UPDATE_EDGES', edges: updatedEdges });
    },
    [edges, dispatch],
  );

  /**
   * Retorna todas las operaciones y datos necesarios para el canvas.
   * 
   * @property nodes - Lista de nodos actual
   * @property edges - Lista de conexiones actual
   * @property onNodesChange - Maneja cambios en nodos
   * @property onEdgesChange - Maneja cambios en conexiones
   * @property onConnect - Maneja nuevas conexiones
   * @property isValidConnection - Valida conexiones
   * @property addNode - Agrega nuevo nodo
   * @property deleteNode - Elimina nodo y sus conexiones
   * @property deleteEdge - Elimina una conexión
   * @property updateNodeLabel - Actualiza etiqueta de nodo
   * @property updateEdgeLabel - Actualiza etiqueta de conexión
   * @property nodeTypes - Registro de componentes de nodo
   */
  return {
    // Estado actual
    nodes,
    edges,
    
    // Eventos React Flow
    onNodesChange,
    onEdgesChange,
    onConnect,
    isValidConnection,
    
    // Operaciones CRUD
    addNode,
    deleteNode,
    deleteEdge,
    updateNodeLabel,
    updateEdgeLabel,
    
    // Configuración
    nodeTypes,
  } as const;
} 