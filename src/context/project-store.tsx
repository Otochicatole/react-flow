
'use client'

/**
 * project-store.tsx
 * ---------------
 * Store global para proyectos.
 * Maneja estado y acciones con reducer.
 */

import { createContext, useReducer, ReactNode, useContext, useEffect } from 'react';
import { type Node, type Edge, type XYPosition } from '@xyflow/react';
import { projectRepository } from '@/services/project-repository';
import { customNodeRepository } from '@/services/custom-node-repository';
import { generateProjectId, getFromStorage, setToStorage } from '@/utils';
import type { Project, ProjectState, FlowData, ProcessFlow } from '@/types';

/**
 * Genera ID único con prefijo
 * @param prefix - Prefijo del ID
 */
const generateId = (prefix: string) => 
  `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Re-export de tipos
export type { Project, ProjectState, FlowData, ProcessFlow } from '@/types';

/**
 * Crea proyecto con valores default
 * @param name - Nombre del proyecto
 * @param description - Descripción opcional
 */
export const createDefaultProject = (name: string, description?: string): Project => ({
  id: generateProjectId(),
  name,
  description,
  createdAt: new Date(),
  updatedAt: new Date(),
  nodes: [],
  edges: [],
  processes: {},
});

/**
 * Crea proceso con valores default
 * @param name - Nombre del proceso
 * @param description - Descripción opcional
 */
const createDefaultProcess = (name: string, description?: string): ProcessFlow => ({
  id: generateId('process'),
  name,
  description,
  nodes: [],
  edges: [],
  processes: {},
});

/**
 * Actualiza flujo en proyecto
 * Navega por la ruta y aplica updates.
 * 
 * @param project - Proyecto a actualizar
 * @param processPath - Ruta al proceso
 * @param updates - Cambios a aplicar
 */
const updateFlowInProject = (
  project: Project,
  processPath: string[],
  updates: Partial<FlowData>,
) => {
  // Si es raíz, actualizar proyecto
  if (processPath.length === 0) {
    return { ...project, ...updates, updatedAt: new Date() } as Project;
  }

  // Clonar proyecto
  const newProject: Project = JSON.parse(JSON.stringify(project));
  let current: FlowData = newProject;
  
  // Navegar por ruta
  for (let i = 0; i < processPath.length; i++) {
    const pid = processPath[i];
    if (!current.processes[pid]) break;
    
    // Actualizar proceso target
    if (i === processPath.length - 1) {
      current.processes[pid] = { 
        ...current.processes[pid], 
        ...updates 
      } as ProcessFlow;
    } else {
      current = current.processes[pid];
    }
  }
  
  // Actualizar timestamp
  newProject.updatedAt = new Date();
  return newProject;
};

/**
 * Acciones del reducer
 * Union type con todas las acciones posibles.
 */
export type ProjectAction =
  // Proyectos
  | { type: 'LOAD_PROJECTS'; projects: Project[] }
  | { type: 'CREATE_PROJECT'; project: Project }
  | { type: 'SELECT_PROJECT'; projectId: string }
  
  // Elementos de flujo
  | { type: 'UPDATE_NODES'; nodes: Node[] }
  | { type: 'UPDATE_EDGES'; edges: Edge[] }
  
  // Navegación
  | { type: 'ENTER_PROCESS'; processId: string }
  | { type: 'EXIT_PROCESS' }
  | { type: 'NAVIGATE_ROOT' }
  
  // Procesos
  | { type: 'CREATE_PROCESS'; name: string; description?: string; position?: XYPosition }
  | { type: 'UPDATE_PROCESS_NAME'; processId: string; newName: string }
  
  // Historial
  | { type: 'UNDO' }
  | { type: 'REDO' }
  
  // Nodos custom
  | { type: 'ADD_CUSTOM_NODE_TYPE'; node: { name: string } }
  | { type: 'REMOVE_CUSTOM_NODE_TYPE'; name: string }
  
  // Flujo de ejecución
  | { type: 'TOGGLE_EXECUTION_FLOW' };

/**
 * Reducer principal
 * Maneja todas las acciones del store.
 */
function reducer(state: ProjectState, action: ProjectAction): ProjectState {
  /**
   * Agrega proyecto al historial
   * Limpia future y actualiza listas.
   */
  const pushHistory = (nextProject: Project): ProjectState => ({
    ...state,
    future: [], // Limpiar redo
    currentProject: nextProject,
    projects: state.projects.map(p => 
      p.id === nextProject.id ? nextProject : p
    ),
  });

  switch (action.type) {
    // Cargar proyectos
    case 'LOAD_PROJECTS':
      return { ...state, projects: action.projects };

    // Crear proyecto
    case 'CREATE_PROJECT': {
      const newProject = action.project;
      return {
        ...state,
        projects: [...state.projects, newProject],
        currentProject: newProject,
        currentProcessPath: [], // Reset path
      };
    }

    // Seleccionar proyecto
    case 'SELECT_PROJECT': {
      const project = state.projects.find(p => p.id === action.projectId) || null;
      return {
        ...state,
        currentProject: project,
        currentProcessPath: [], // Reset path
      };
    }

    // Actualizar nodos
    case 'UPDATE_NODES': {
      if (!state.currentProject) return state;
      const updatedProject = updateFlowInProject(
        state.currentProject, 
        state.currentProcessPath, 
        { nodes: action.nodes }
      );
      return pushHistory(updatedProject);
    }

    // Actualizar conexiones
    case 'UPDATE_EDGES': {
      if (!state.currentProject) return state;
      const updatedProject = updateFlowInProject(
        state.currentProject, 
        state.currentProcessPath, 
        { edges: action.edges }
      );
      return pushHistory(updatedProject);
    }

    // Entrar a proceso
    case 'ENTER_PROCESS':
      return {
        ...state,
        currentProcessPath: [...state.currentProcessPath, action.processId],
      };

    // Salir de proceso
    case 'EXIT_PROCESS':
      return {
        ...state,
        currentProcessPath: state.currentProcessPath.slice(0, -1),
      };

    // Volver a raíz
    case 'NAVIGATE_ROOT':
      return {
        ...state,
        currentProcessPath: [],
      };

    // Crear proceso
    case 'CREATE_PROCESS': {
      if (!state.currentProject) return state;
      
      // Crear proceso y nodo
      const { name, description, position } = action;
      const newProcess = createDefaultProcess(name, description);
      const processNode: Node = {
        id: `process-node-${newProcess.id}`,
        type: 'process',
        position: position ?? { x: 300, y: 300 },
        data: {
          label: newProcess.name,
          processId: newProcess.id,
        },
      };

      // Actualizar proyecto
      let updatedProject: Project;
      if (state.currentProcessPath.length === 0) {
        // Agregar en raíz
        updatedProject = {
          ...state.currentProject,
          nodes: [...state.currentProject.nodes, processNode],
          processes: {
            ...state.currentProject.processes,
            [newProcess.id]: newProcess,
          },
        } as Project;
        updatedProject.updatedAt = new Date();
      } else {
        // Agregar en proceso anidado
        updatedProject = updateFlowInProject(
          state.currentProject, 
          state.currentProcessPath, 
          {}
        );
        const targetFlow = state.currentProcessPath.reduce(
          (f, pid) => f.processes[pid], 
          updatedProject as FlowData
        );
        targetFlow.nodes.push(processNode);
        targetFlow.processes[newProcess.id] = newProcess;
      }
      return pushHistory(updatedProject);
    }

    // Actualizar nombre de proceso
    case 'UPDATE_PROCESS_NAME': {
      if (!state.currentProject) return state;
      const { processId, newName } = action;

      // Clonar proyecto
      const deepClone: Project = JSON.parse(JSON.stringify(state.currentProject));

      // Actualizar nombre recursivamente
      const traverse = (flow: FlowData) => {
        // Actualizar proceso
        if (flow.processes[processId]) {
          flow.processes[processId].name = newName;
        }

        // Actualizar nodos
        flow.nodes = flow.nodes.map(n =>
          n.type === 'process' && 
          (n.data as { processId?: string }).processId === processId
            ? { 
                ...n, 
                data: { 
                  ...n.data, 
                  label: newName, 
                  _forceUpdate: Date.now() 
                } 
              }
            : n,
        );

        // Recursión en subprocesos
        Object.values(flow.processes).forEach(child => traverse(child));
      };

      traverse(deepClone);
      deepClone.updatedAt = new Date();
      return pushHistory(deepClone);
    }

    // Deshacer
    case 'UNDO': {
      if (state.past.length === 0 || !state.currentProject) return state;
      
      // Obtener estado anterior
      const previous = state.past[state.past.length - 1];
      const newPast = state.past.slice(0, -1);
      
      return {
        ...state,
        past: newPast,
        future: [
          JSON.parse(JSON.stringify(state.currentProject)) as Project, 
          ...state.future
        ],
        currentProject: previous,
        projects: state.projects.map(p => 
          p.id === previous.id ? previous : p
        ),
      };
    }

    // Rehacer
    case 'REDO': {
      if (state.future.length === 0 || !state.currentProject) return state;
      
      // Obtener siguiente estado
      const next = state.future[0];
      const newFuture = state.future.slice(1);
      
      return {
        ...state,
        past: [
          ...state.past, 
          JSON.parse(JSON.stringify(state.currentProject)) as Project
        ],
        future: newFuture,
        currentProject: next,
        projects: state.projects.map(p => 
          p.id === next.id ? next : p
        ),
      };
    }

    // Agregar nodo custom
    case 'ADD_CUSTOM_NODE_TYPE': {
      // Evitar duplicados
      if (state.customNodeTypes.some(n => n.name === action.node.name)) {
        return state;
      }
      
      const updated = [...state.customNodeTypes, action.node];
      return { ...state, customNodeTypes: updated };
    }

    // Eliminar nodo custom
    case 'REMOVE_CUSTOM_NODE_TYPE': {
      if (!state.currentProject) return state;
      const name = action.name;

      // Clonar proyecto
      const clone: Project = JSON.parse(JSON.stringify(state.currentProject));

      // Limpiar nodos y conexiones
      const cleanFlow = (flow: FlowData) => {
        const removedIds: Set<string> = new Set();
        
        // Filtrar nodos
        flow.nodes = flow.nodes.filter(n => {
          const match = n.type === 'custom' && 
            (n.data as { customName?: string }).customName === name;
          if (match) removedIds.add(n.id);
          return !match;
        });
        
        // Filtrar conexiones
        flow.edges = flow.edges.filter(e => 
          !removedIds.has(e.source) && !removedIds.has(e.target)
        );
        
        // Recursión
        Object.values(flow.processes).forEach(proc => cleanFlow(proc));
      };

      cleanFlow(clone);
      clone.updatedAt = new Date();

      // Actualizar lista
      const updatedCustoms = state.customNodeTypes.filter(n => 
        n.name !== name
      );

      return {
        ...state,
        customNodeTypes: updatedCustoms,
        currentProject: clone,
        projects: state.projects.map(p => 
          p.id === clone.id ? clone : p
        ),
        past: [
          ...state.past, 
          JSON.parse(JSON.stringify(state.currentProject)) as Project
        ].slice(-50), // Max 50 estados
        future: [],
      };
    }

    // Toggle flujo de ejecución
    case 'TOGGLE_EXECUTION_FLOW':
      return {
        ...state,
        showExecutionFlow: !state.showExecutionFlow,
      };

    // Acción desconocida
    default:
      return state;
  }
}

/**
 * Valor del contexto
 * @property state - Estado global
 * @property dispatch - Dispatcher de acciones
 */
interface StoreValue {
  state: ProjectState;
  dispatch: React.Dispatch<ProjectAction>;
}

// Crear contexto
const ProjectStoreContext = createContext<StoreValue | undefined>(undefined);

/**
 * Provider del store
 * Maneja estado global y persistencia.
 */
export function ProjectStoreProvider({ children }: { children: ReactNode }) {
  // Recuperar preferencia de flujo de ejecución persistida
  const initialShowExecutionFlow =
    typeof window !== 'undefined'
      ? getFromStorage<boolean>('showExecutionFlow', false)
      : false;

  // Inicializar reducer
  const [state, dispatch] = useReducer(reducer, {
    projects: [],             // Lista de proyectos
    currentProject: null,     // Proyecto activo
    currentProcessPath: [],   // Ruta actual
    past: [],                // Historial undo
    future: [],              // Historial redo
    customNodeTypes: [],     // Nodos custom
    showExecutionFlow: initialShowExecutionFlow, // Toggle ejecución (persistido)
  });

  // Cargar datos al montar
  useEffect(() => {
    // Cargar proyectos
    const loaded = projectRepository.load();
    if (loaded.length) {
      dispatch({ type: 'LOAD_PROJECTS', projects: loaded });
    }
    
    // Cargar nodos custom
    const customNodes = customNodeRepository.load();
    customNodes.forEach(node => 
      dispatch({ type: 'ADD_CUSTOM_NODE_TYPE', node: { name: (node as { name: string }).name } })
    );
  }, []);

  // Persistir proyectos
  useEffect(() => {
    projectRepository.save(state.projects);
  }, [state.projects]);

  // Persistir nodos custom
  useEffect(() => {
    customNodeRepository.save(state.customNodeTypes);
  }, [state.customNodeTypes]);

  // Persistir preferencia de flujo de ejecución
  useEffect(() => {
    setToStorage('showExecutionFlow', state.showExecutionFlow);
  }, [state.showExecutionFlow]);

  // Proveer contexto
  return (
    <ProjectStoreContext.Provider value={{ state, dispatch }}>
      {children}
    </ProjectStoreContext.Provider>
  );
}

/**
 * Hook para acceder al store
 * @throws Error si usado fuera del provider
 */
export function useProjectStore() {
  const ctx = useContext(ProjectStoreContext);
  if (!ctx) {
    throw new Error('useProjectStore must be used within ProjectStoreProvider');
  }
  return ctx;
} 