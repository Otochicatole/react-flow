'use client'

import { ReactNode, useCallback, useEffect, useState } from 'react';
import { useProjectStore, type Project, type FlowData, createDefaultProject } from '@/context/project-store';
import type { XYPosition } from '@xyflow/react';
import { type Node, type Edge } from '@xyflow/react';
import { syncProjectToServer } from '@/services/project-api';
import { projectRepository } from '@/services/project-repository';

// helper to navigate nested processes
const getCurrentFlow = (project: Project, processPath: string[]): FlowData => {
  if (processPath.length === 0) return project;
  let current: FlowData = project;
  for (const pid of processPath) {
    current = current.processes[pid];
  }
  return current;
};

// Re-export types from project-store
export type { Project, FlowData } from '@/context/project-store';

export interface ProcessBreadcrumb {
  id: string;
  name: string;
  level: number;
}

// dummy provider for backward-compat
export function ProjectProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function useProject() {
  const { state, dispatch } = useProjectStore();
  const { projects, currentProject, currentProcessPath } = state;

  // ------------ selectors ------------
  const currentFlow = currentProject ? getCurrentFlow(currentProject, currentProcessPath) : null;
  const currentNodes: Node[] = currentFlow?.nodes || [];
  const currentEdges: Edge[] = currentFlow?.edges || [];

  // breadcrumbs
  const breadcrumbs: ProcessBreadcrumb[] = [];
  if (currentProject) {
    breadcrumbs.push({ id: 'root', name: currentProject.name, level: 0 });
    let tmpFlow: FlowData = currentProject;
    currentProcessPath.forEach((pid, index) => {
      const proc = tmpFlow.processes[pid];
      if (proc) {
        breadcrumbs.push({ id: pid, name: proc.name, level: index + 1 });
        tmpFlow = proc;
      }
    });
  }

  // ------------ mutations ------------
  const createProject = useCallback((name: string, description?: string): Project => {
    const newProject = createDefaultProject(name, description);
    dispatch({ type: 'CREATE_PROJECT', project: newProject });
    return newProject;
  }, [dispatch]);

  const deleteProject = useCallback((projectId: string) => {
    const newList = projects.filter(p => p.id !== projectId);
    dispatch({ type: 'LOAD_PROJECTS', projects: newList });
  }, [dispatch, projects]);

  const selectProject = useCallback((projectId: string) => {
    dispatch({ type: 'SELECT_PROJECT', projectId });
  }, [dispatch]);

  const updateProject = useCallback((projectId: string, updates: Partial<Omit<Project, 'id' | 'createdAt'>>) => {
    const updatedList = projects.map(p => p.id === projectId ? { ...p, ...updates, updatedAt: new Date() } : p);
    dispatch({ type: 'LOAD_PROJECTS', projects: updatedList });
  }, [dispatch, projects]);

  const updateCurrentProjectNodes = useCallback((nodes: Node[]) => {
    dispatch({ type: 'UPDATE_NODES', nodes });
  }, [dispatch]);

  const updateCurrentProjectEdges = useCallback((edges: Edge[]) => {
    dispatch({ type: 'UPDATE_EDGES', edges });
  }, [dispatch]);

  const enterProcess = useCallback((processId: string) => dispatch({ type: 'ENTER_PROCESS', processId }), [dispatch]);
  const exitProcess = useCallback(() => dispatch({ type: 'EXIT_PROCESS' }), [dispatch]);
  const navigateToRoot = useCallback(() => dispatch({ type: 'NAVIGATE_ROOT' }), [dispatch]);

  const createProcess = useCallback((name: string, description?: string, position?: XYPosition) => {
    dispatch({ type: 'CREATE_PROCESS', name, description, position });
    // return id could be derived; but for simplicity, return empty string
    return '';
  }, [dispatch]);

  const updateProcessName = useCallback((processId: string, newName: string) => {
    dispatch({ type: 'UPDATE_PROCESS_NAME', processId, newName });
  }, [dispatch]);

  const undo = useCallback(() => dispatch({ type: 'UNDO' }), [dispatch]);
  const redo = useCallback(() => dispatch({ type: 'REDO' }), [dispatch]);

  const addCustomNodeType = useCallback((node: {name:string;dir:'in'|'out'}) => {
    dispatch({ type: 'ADD_CUSTOM_NODE_TYPE', node });
  }, [dispatch]);

  const removeCustomNodeType = useCallback((name: string) => dispatch({ type: 'REMOVE_CUSTOM_NODE_TYPE', name }), [dispatch]);

  // save logic & unsaved flag
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  useEffect(() => {
    if (currentProject) {
      setHasUnsavedChanges(true);
    }
  }, [currentProject]);

  const saveCurrentProject = useCallback(async () => {
    if (!currentProject) return { success: false, message: 'No project selected' };
    setIsSaving(true);
    try {
      const result = await syncProjectToServer(currentProject);
      setHasUnsavedChanges(false);
      return { success: result.success, message: result.message ?? '' };
    } finally {
      setIsSaving(false);
    }
  }, [currentProject]);

  // Import/Export functionality
  const exportAllProjects = useCallback(() => {
    projectRepository.downloadAllProjects();
  }, []);

  const exportProject = useCallback((projectId: string) => {
    projectRepository.downloadProject(projectId);
  }, []);

  const importProjects = useCallback(async (file: File, merge: boolean = true): Promise<{ success: boolean; message: string; imported: number }> => {
    try {
      const data = await projectRepository.readJSONFile(file);
      const result = projectRepository.importProjects(data, { merge });
      
      if (result.success) {
        // Reload projects from localStorage to reflect changes
        const updatedProjects = projectRepository.load();
        dispatch({ type: 'LOAD_PROJECTS', projects: updatedProjects });
      }
      
      return result;
    } catch (err) {
      return {
        success: false,
        message: err instanceof Error ? err.message : 'Failed to import projects',
        imported: 0
      };
    }
  }, [dispatch]);

  return {
    // state
    projects,
    currentProject,
    currentNodes,
    currentEdges,
    currentProcessPath,
    breadcrumbs,
    // mutations
    createProject,
    deleteProject,
    selectProject,
    updateProject,
    updateCurrentProjectNodes,
    updateCurrentProjectEdges,
    enterProcess,
    exitProcess,
    navigateToRoot,
    createProcess,
    updateProcessName,
    undo,
    redo,
    saveCurrentProject,
    isSaving,
    hasUnsavedChanges,
    customNodeTypes: state.customNodeTypes,
    addCustomNodeType,
    removeCustomNodeType,
    // import/export
    exportAllProjects,
    exportProject,
    importProjects,
  } as const;
} 