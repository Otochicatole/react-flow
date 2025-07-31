'use client'
import { createContext, useReducer, ReactNode, useContext, useEffect } from 'react';
import { type Node, type Edge, type XYPosition } from '@xyflow/react';
import { projectRepository } from '@/services/project-repository';
import { customNodeRepository } from '@/services/custom-node-repository';
import { generateProjectId } from '@/utils';
import type { Project, ProjectState, FlowData, ProcessFlow } from '@/types';

// Helper to generate IDs  
const generateId = (prefix: string) => `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Re-export types for backward compatibility
export type { Project, ProjectState, FlowData, ProcessFlow } from '@/types';

// ---------- HELPERS ----------
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

const createDefaultProcess = (name: string, description?: string): ProcessFlow => ({
  id: generateId('process'),
  name,
  description,
  nodes: [],
  edges: [],
  processes: {},
});

// ---------- NESTED FLOW HELPER ----------
const updateFlowInProject = (
  project: Project,
  processPath: string[],
  updates: Partial<FlowData>,
) => {
  if (processPath.length === 0) {
    return { ...project, ...updates, updatedAt: new Date() } as Project;
  }

  const newProject: Project = JSON.parse(JSON.stringify(project));
  let current: FlowData = newProject;
  for (let i = 0; i < processPath.length; i++) {
    const pid = processPath[i];
    if (!current.processes[pid]) break;
    if (i === processPath.length - 1) {
      current.processes[pid] = { ...current.processes[pid], ...updates } as ProcessFlow;
    } else {
      current = current.processes[pid];
    }
  }
  newProject.updatedAt = new Date();
  return newProject;
};

// ---------- ACTIONS ----------
export type ProjectAction =
  | { type: 'LOAD_PROJECTS'; projects: Project[] }
  | { type: 'CREATE_PROJECT'; project: Project }
  | { type: 'SELECT_PROJECT'; projectId: string }
  | { type: 'UPDATE_NODES'; nodes: Node[] }
  | { type: 'UPDATE_EDGES'; edges: Edge[] }
  | { type: 'ENTER_PROCESS'; processId: string }
  | { type: 'EXIT_PROCESS' }
  | { type: 'NAVIGATE_ROOT' }
  | { type: 'CREATE_PROCESS'; name: string; description?: string; position?: XYPosition }
  | { type: 'UPDATE_PROCESS_NAME'; processId: string; newName: string }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'ADD_CUSTOM_NODE_TYPE'; node: {name:string;dir:'in'|'out'} }
  | { type: 'REMOVE_CUSTOM_NODE_TYPE'; name: string };

// ---------- REDUCER ----------
function reducer(state: ProjectState, action: ProjectAction): ProjectState {
  // Helper to push currentProject to history when mutating
  const pushHistory = (nextProject: Project): ProjectState => ({
    ...state,
    past: [...state.past, JSON.parse(JSON.stringify(state.currentProject)) as Project].slice(-50), // limit 50
    future: [],
    currentProject: nextProject,
    projects: state.projects.map(p => (p.id === nextProject.id ? nextProject : p)),
  });

  switch (action.type) {
    case 'LOAD_PROJECTS':
      return { ...state, projects: action.projects };

    case 'CREATE_PROJECT': {
      const newProject = action.project;
      return {
        ...state,
        projects: [...state.projects, newProject],
        currentProject: newProject,
        currentProcessPath: [],
      };
    }

    case 'SELECT_PROJECT': {
      const project = state.projects.find(p => p.id === action.projectId) || null;
      return {
        ...state,
        currentProject: project,
        currentProcessPath: [],
      };
    }

    case 'UPDATE_NODES': {
      if (!state.currentProject) return state;
      const updatedProject = updateFlowInProject(state.currentProject, state.currentProcessPath, { nodes: action.nodes });
      return pushHistory(updatedProject);
    }

    case 'UPDATE_EDGES': {
      if (!state.currentProject) return state;
      const updatedProject = updateFlowInProject(state.currentProject, state.currentProcessPath, { edges: action.edges });
      return pushHistory(updatedProject);
    }

    case 'ENTER_PROCESS':
      return {
        ...state,
        currentProcessPath: [...state.currentProcessPath, action.processId],
      };

    case 'EXIT_PROCESS':
      return {
        ...state,
        currentProcessPath: state.currentProcessPath.slice(0, -1),
      };

    case 'NAVIGATE_ROOT':
      return {
        ...state,
        currentProcessPath: [],
      };

    case 'CREATE_PROCESS': {
      if (!state.currentProject) return state;
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

      let updatedProject: Project;
      if (state.currentProcessPath.length === 0) {
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
        updatedProject = updateFlowInProject(state.currentProject, state.currentProcessPath, {});
        // add node to canvas flow
        const targetFlow = state.currentProcessPath.reduce((f, pid) => f.processes[pid], updatedProject as FlowData);
        targetFlow.nodes.push(processNode);
        targetFlow.processes[newProcess.id] = newProcess;
      }
      return pushHistory(updatedProject);
    }

    case 'UPDATE_PROCESS_NAME': {
      if (!state.currentProject) return state;
      const { processId, newName } = action;

      const deepClone: Project = JSON.parse(JSON.stringify(state.currentProject));

      // recursive helper to update processes and node labels
      const traverse = (flow: FlowData) => {
        // update if this level has the process
        if (flow.processes[processId]) {
          flow.processes[processId].name = newName;
        }

        // update nodes in this flow
        flow.nodes = flow.nodes.map(n =>
          n.type === 'process' && (n.data as { processId?: string }).processId === processId
            ? { ...n, data: { ...n.data, label: newName, _forceUpdate: Date.now() } }
            : n,
        );

        // recurse into nested processes
        Object.values(flow.processes).forEach(child => traverse(child));
      };

      traverse(deepClone);
      deepClone.updatedAt = new Date();
      return pushHistory(deepClone);
    }

    case 'UNDO': {
      if (state.past.length === 0 || !state.currentProject) return state;
      const previous = state.past[state.past.length - 1];
      const newPast = state.past.slice(0, -1);
      return {
        ...state,
        past: newPast,
        future: [JSON.parse(JSON.stringify(state.currentProject)) as Project, ...state.future],
        currentProject: previous,
        projects: state.projects.map(p => (p.id === previous.id ? previous : p)),
      };
    }

    case 'REDO': {
      if (state.future.length === 0 || !state.currentProject) return state;
      const next = state.future[0];
      const newFuture = state.future.slice(1);
      return {
        ...state,
        past: [...state.past, JSON.parse(JSON.stringify(state.currentProject)) as Project],
        future: newFuture,
        currentProject: next,
        projects: state.projects.map(p => (p.id === next.id ? next : p)),
      };
    }

    case 'ADD_CUSTOM_NODE_TYPE': {
      if (state.customNodeTypes.some(n=>n.name===action.node.name)) return state;
      const updated = [...state.customNodeTypes, action.node];
      return { ...state, customNodeTypes: updated };
    }

    case 'REMOVE_CUSTOM_NODE_TYPE': {
      if (!state.currentProject) return state;
      const name = action.name;
      // helper to deep clone and clean nodes
      const clone: Project = JSON.parse(JSON.stringify(state.currentProject));

      const cleanFlow = (flow: FlowData) => {
        const removedIds: Set<string> = new Set();
        flow.nodes = flow.nodes.filter(n => {
          const match = n.type === 'custom' && (n.data as { customName?: string }).customName === name;
          if (match) removedIds.add(n.id);
          return !match;
        });
        flow.edges = flow.edges.filter(e => !removedIds.has(e.source) && !removedIds.has(e.target));
        Object.values(flow.processes).forEach(proc => cleanFlow(proc));
      };

      cleanFlow(clone);
      clone.updatedAt = new Date();

      const updatedCustoms = state.customNodeTypes.filter(n => n.name !== name);

      return {
        ...state,
        customNodeTypes: updatedCustoms,
        currentProject: clone,
        projects: state.projects.map(p => (p.id === clone.id ? clone : p)),
        past: [...state.past, JSON.parse(JSON.stringify(state.currentProject)) as Project].slice(-50),
        future: [],
      };
    }

    default:
      return state;
  }
}

// ---------- CONTEXT ----------
interface StoreValue {
  state: ProjectState;
  dispatch: React.Dispatch<ProjectAction>;
}

const ProjectStoreContext = createContext<StoreValue | undefined>(undefined);

export function ProjectStoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    projects: [],
    currentProject: null,
    currentProcessPath: [],
    past: [],
    future: [],
    customNodeTypes: [],
  });

  // Load projects from localStorage on mount
  useEffect(() => {
    const loaded = projectRepository.load();
    if (loaded.length) {
      dispatch({ type: 'LOAD_PROJECTS', projects: loaded });
    }
    const customNodes = customNodeRepository.load();
    customNodes.forEach(node => dispatch({ type: 'ADD_CUSTOM_NODE_TYPE', node }));
  }, []);

  // Persist projects to localStorage whenever they change
  useEffect(() => {
    projectRepository.save(state.projects);
  }, [state.projects]);

  useEffect(() => {
    customNodeRepository.save(state.customNodeTypes);
  }, [state.customNodeTypes]);

  return (
    <ProjectStoreContext.Provider value={{ state, dispatch }}>
      {children}
    </ProjectStoreContext.Provider>
  );
}

export function useProjectStore() {
  const ctx = useContext(ProjectStoreContext);
  if (!ctx) {
    throw new Error('useProjectStore must be used within ProjectStoreProvider');
  }
  return ctx;
} 