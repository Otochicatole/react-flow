'use client'

/**
 * project-context.tsx
 * -----------------
 * Contexto y hook para gestión de proyectos.
 * Provee acceso al estado global y operaciones.
 */

import { ReactNode, useCallback, useEffect, useState } from 'react';
import { useProjectStore, createDefaultProject } from '@/context/project-store';
import type { XYPosition } from '@xyflow/react';
import { type Node, type Edge } from '@xyflow/react';
import { syncProjectToServer } from '@/services/project-api';
import { projectRepository } from '@/services/project-repository';
import type { Project, FlowData } from '@/types';

import { getCurrentFlow } from '@/utils';

export type { Project, FlowData } from '@/context/project-store';

/**
 * Breadcrumb de proceso
 * @property id - ID único del proceso
 * @property name - Nombre para mostrar
 * @property level - Nivel de anidamiento
 */
export interface ProcessBreadcrumb {
  id: string;     // ID único
  name: string;   // Nombre
  level: number;  // Nivel
}

/**
 * Provider de contexto
 * Wrapper mínimo para el store.
 */
export function ProjectProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

/**
 * Hook principal de proyectos
 * Provee acceso al estado y operaciones.
 * 
 * @returns Objeto con estado y acciones
 * 
 * @example
 * const {
 *   currentProject,
 *   createProject,
 *   saveCurrentProject
 * } = useProject();
 */
export function useProject() {
  // Estado global y dispatch
  const { state, dispatch } = useProjectStore();
  const { projects, currentProject, currentProcessPath } = state;

  // Flujo actual y sus elementos
  const currentFlow = currentProject ? getCurrentFlow(currentProject, currentProcessPath) : null;
  const currentNodes: Node[] = currentFlow?.nodes || [];
  const currentEdges: Edge[] = currentFlow?.edges || [];

  /**
   * Genera breadcrumbs para navegación
   * Incluye proyecto raíz y procesos anidados.
   */
  const breadcrumbs: ProcessBreadcrumb[] = [];
  if (currentProject) {
    // Agregar raíz
    breadcrumbs.push({ id: 'root', name: currentProject.name, level: 0 });
    
    // Agregar procesos anidados
    let tmpFlow: FlowData = currentProject;
    currentProcessPath.forEach((pid, index) => {
      const proc = tmpFlow.processes[pid];
      if (proc) {
        breadcrumbs.push({ id: pid, name: proc.name, level: index + 1 });
        tmpFlow = proc;
      }
    });
  }

  /**
   * Crea nuevo proyecto
   * @param name - Nombre del proyecto
   * @param description - Descripción opcional
   */
  const createProject = useCallback((name: string, description?: string): Project => {
    const newProject = createDefaultProject(name, description);
    dispatch({ type: 'CREATE_PROJECT', project: newProject });
    return newProject;
  }, [dispatch]);

  /**
   * Elimina proyecto existente
   * @param projectId - ID del proyecto
   */
  const deleteProject = useCallback((projectId: string) => {
    const newList = projects.filter(p => p.id !== projectId);
    dispatch({ type: 'LOAD_PROJECTS', projects: newList });
  }, [dispatch, projects]);

  /**
   * Selecciona proyecto activo
   * @param projectId - ID del proyecto
   */
  const selectProject = useCallback((projectId: string) => {
    dispatch({ type: 'SELECT_PROJECT', projectId });
  }, [dispatch]);

  /**
   * Actualiza proyecto existente
   * @param projectId - ID del proyecto
   * @param updates - Campos a actualizar
   */
  const updateProject = useCallback((
    projectId: string, 
    updates: Partial<Omit<Project, 'id' | 'createdAt'>>
  ) => {
    const updatedList = projects.map(p => 
      p.id === projectId 
        ? { ...p, ...updates, updatedAt: new Date() } 
        : p
    );
    dispatch({ type: 'LOAD_PROJECTS', projects: updatedList });
  }, [dispatch, projects]);

  /**
   * Actualiza nodos del proyecto actual
   * @param nodes - Lista de nodos
   */
  const updateCurrentProjectNodes = useCallback((nodes: Node[]) => {
    dispatch({ type: 'UPDATE_NODES', nodes });
  }, [dispatch]);

  /**
   * Actualiza conexiones del proyecto actual
   * @param edges - Lista de conexiones
   */
  const updateCurrentProjectEdges = useCallback((edges: Edge[]) => {
    dispatch({ type: 'UPDATE_EDGES', edges });
  }, [dispatch]);

  /**
   * Navegación de procesos
   */
  const enterProcess = useCallback(
    (processId: string) => dispatch({ type: 'ENTER_PROCESS', processId }), 
    [dispatch]
  );
  const exitProcess = useCallback(
    () => dispatch({ type: 'EXIT_PROCESS' }), 
    [dispatch]
  );
  const navigateToRoot = useCallback(
    () => dispatch({ type: 'NAVIGATE_ROOT' }), 
    [dispatch]
  );

  /**
   * Crea nuevo proceso
   * @param name - Nombre del proceso
   * @param description - Descripción opcional
   * @param position - Posición en canvas
   */
  const createProcess = useCallback((
    name: string, 
    description?: string, 
    position?: XYPosition
  ) => {
    dispatch({ type: 'CREATE_PROCESS', name, description, position });
    return '';
  }, [dispatch]);

  /**
   * Actualiza nombre de proceso
   * @param processId - ID del proceso
   * @param newName - Nuevo nombre
   */
  const updateProcessName = useCallback((processId: string, newName: string) => {
    dispatch({ type: 'UPDATE_PROCESS_NAME', processId, newName });
  }, [dispatch]);

  /**
   * Operaciones de historial
   */
  const undo = useCallback(() => dispatch({ type: 'UNDO' }), [dispatch]);
  const redo = useCallback(() => dispatch({ type: 'REDO' }), [dispatch]);

  /**
   * Gestión de nodos personalizados
   */
  const addCustomNodeType = useCallback((node: { name: string }) => {
    dispatch({ type: 'ADD_CUSTOM_NODE_TYPE', node });
  }, [dispatch]);

  const removeCustomNodeType = useCallback(
    (name: string) => dispatch({ type: 'REMOVE_CUSTOM_NODE_TYPE', name }), 
    [dispatch]
  );

  /**
   * Estado de guardado
   */
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // Marcar cambios sin guardar
  useEffect(() => {
    if (currentProject) {
      setHasUnsavedChanges(true);
    }
  }, [currentProject]);

  /**
   * Guarda proyecto actual
   * Sincroniza con servidor simulado.
   */
  const saveCurrentProject = useCallback(async () => {
    if (!currentProject) {
      return { success: false, message: 'No project selected' };
    }
    
    setIsSaving(true);
    try {
      const result = await syncProjectToServer(currentProject);
      setHasUnsavedChanges(false);
      return { success: result.success, message: result.message ?? '' };
    } finally {
      setIsSaving(false);
    }
  }, [currentProject]);

  /**
   * Operaciones de exportación
   */
  const exportAllProjects = useCallback(() => {
    projectRepository.downloadAllProjects();
  }, []);

  const exportProject = useCallback((projectId: string) => {
    projectRepository.downloadProject(projectId);
  }, []);

  /**
   * Importa proyectos desde archivo
   * @param file - Archivo JSON
   * @param merge - Si combinar con existentes
   */
  const importProjects = useCallback(async (
    file: File, 
    merge: boolean = true
  ): Promise<{ success: boolean; message: string; imported: number }> => {
    try {
      // Leer archivo
      const data = await projectRepository.readJSONFile(file);
      const result = projectRepository.importProjects(data, { merge });
      
      // Actualizar estado si éxito
      if (result.success) {
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

  // Retornar estado y acciones
  return {
    // Estado
    projects,
    currentProject,
    currentNodes,
    currentEdges,
    currentProcessPath,
    breadcrumbs,

    // Operaciones CRUD
    createProject,
    deleteProject,
    selectProject,
    updateProject,
    updateCurrentProjectNodes,
    updateCurrentProjectEdges,

    // Navegación
    enterProcess,
    exitProcess,
    navigateToRoot,
    createProcess,
    updateProcessName,

    // Historial
    undo,
    redo,

    // Guardado
    saveCurrentProject,
    isSaving,
    hasUnsavedChanges,

    // Nodos custom
    customNodeTypes: state.customNodeTypes,
    addCustomNodeType,
    removeCustomNodeType,

    // Import/Export
    exportAllProjects,
    exportProject,
    importProjects,
  } as const;
} 