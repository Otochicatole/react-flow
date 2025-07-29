'use client'
import { createContext, useContext, useCallback, useState, ReactNode, useEffect } from 'react';
import { type Node, type Edge } from '@xyflow/react';
import { syncProjectToServer } from '@/services/project-api';

// Common interface for flow data
export interface FlowData {
  nodes: Node[];
  edges: Edge[];
  processes: { [processId: string]: ProcessFlow };
}

// Process interface for nested flows
export interface ProcessFlow extends FlowData {
  id: string;
  name: string;
  description?: string;
}

// Project interface with nested processes support
export interface Project extends FlowData {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Navigation breadcrumb interface
export interface ProcessBreadcrumb {
  id: string;
  name: string;
  level: number;
}

// Project context interface
interface ProjectContextType {
  // Projects management
  projects: Project[];
  currentProject: Project | null;
  
  // Project operations
  createProject: (name: string, description?: string) => Project;
  deleteProject: (projectId: string) => void;
  selectProject: (projectId: string) => void;
  updateProject: (projectId: string, updates: Partial<Omit<Project, 'id' | 'createdAt'>>) => void;
  
  // Current project data (can be root or nested process)
  currentNodes: Node[];
  currentEdges: Edge[];
  updateCurrentProjectNodes: (nodes: Node[]) => void;
  updateCurrentProjectEdges: (edges: Edge[]) => void;
  
  // Process navigation
  currentProcessPath: string[]; // Array of process IDs representing the current path
  breadcrumbs: ProcessBreadcrumb[];
  enterProcess: (processId: string, processName: string) => void;
  exitProcess: () => void;
  navigateToRoot: () => void;
  createProcess: (name: string, description?: string) => string;
  updateProcessName: (processId: string, newName: string) => void;
  
  // Save functionality
  saveCurrentProject: () => Promise<{ success: boolean; message: string }>;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
}

// Helper functions
const generateProjectId = () => `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
const generateProcessId = () => `process_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const createDefaultProject = (name: string, description?: string): Project => ({
  id: generateProjectId(),
  name,
  description,
  createdAt: new Date(),
  updatedAt: new Date(),
  nodes: [
    { id: 'welcome-1', type: 'custom', position: { x: 100, y: 100 }, data: { label: 'Welcome to your project!' } },
    { id: 'welcome-2', type: 'event', position: { x: 400, y: 200 }, data: { label: 'Start building your flow' } },
  ],
  edges: [
    { 
      id: 'welcome-edge', 
      source: 'welcome-1', 
      target: 'welcome-2',
      sourceHandle: 'right',
      targetHandle: 'left'
    }
  ],
  processes: {}
});

const createDefaultProcess = (name: string, description?: string): ProcessFlow => ({
  id: generateProcessId(),
  name,
  description,
  nodes: [
    { id: 'process-start', type: 'event', position: { x: 200, y: 150 }, data: { label: 'Process Start' } },
  ],
  edges: [],
  processes: {}
});

// Helper function to get current flow data based on process path
const getCurrentFlow = (project: Project, processPath: string[]): FlowData => {
  if (processPath.length === 0) return project;
  
  let currentFlow: FlowData = project;
  for (const processId of processPath) {
    if (currentFlow.processes[processId]) {
      currentFlow = currentFlow.processes[processId];
    } else {
      // Invalid path, return to root
      return project;
    }
  }
  return currentFlow;
};

// Local storage helpers
const STORAGE_KEY = 'react-flow-projects';
const CURRENT_PROJECT_KEY = 'react-flow-current-project';
const CURRENT_PROCESS_PATH_KEY = 'react-flow-current-process-path';
const LAST_SAVED_KEY = 'react-flow-last-saved';

const saveProjectsToStorage = (projects: Project[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (error) {
    console.warn('Failed to save projects to localStorage:', error);
  }
};

const loadProjectsFromStorage = (): Project[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const projects = JSON.parse(stored) as Project[];
      // Convert date strings back to Date objects
      return projects.map((project: Project) => ({
        ...project,
        createdAt: new Date(project.createdAt),
        updatedAt: new Date(project.updatedAt),
        processes: project.processes || {} // Ensure processes exists
      }));
    }
  } catch (error) {
    console.warn('Failed to load projects from localStorage:', error);
  }
  return [];
};

const saveCurrentProjectId = (projectId: string | null) => {
  try {
    if (projectId) {
      localStorage.setItem(CURRENT_PROJECT_KEY, projectId);
    } else {
      localStorage.removeItem(CURRENT_PROJECT_KEY);
    }
  } catch (error) {
    console.warn('Failed to save current project to localStorage:', error);
  }
};

const loadCurrentProjectId = (): string | null => {
  try {
    return localStorage.getItem(CURRENT_PROJECT_KEY);
  } catch (error) {
    console.warn('Failed to load current project from localStorage:', error);
    return null;
  }
};

const saveCurrentProcessPath = (processPath: string[]) => {
  try {
    localStorage.setItem(CURRENT_PROCESS_PATH_KEY, JSON.stringify(processPath));
  } catch (error) {
    console.warn('Failed to save current process path to localStorage:', error);
  }
};

const loadCurrentProcessPath = (): string[] => {
  try {
    const stored = localStorage.getItem(CURRENT_PROCESS_PATH_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.warn('Failed to load current process path from localStorage:', error);
    return [];
  }
};

const saveLastSavedTimestamp = (projectId: string, timestamp: Date) => {
  try {
    const lastSaved = JSON.parse(localStorage.getItem(LAST_SAVED_KEY) || '{}');
    lastSaved[projectId] = timestamp.toISOString();
    localStorage.setItem(LAST_SAVED_KEY, JSON.stringify(lastSaved));
  } catch (error) {
    console.warn('Failed to save last saved timestamp:', error);
  }
};

const getLastSavedTimestamp = (projectId: string): Date | null => {
  try {
    const lastSaved = JSON.parse(localStorage.getItem(LAST_SAVED_KEY) || '{}');
    return lastSaved[projectId] ? new Date(lastSaved[projectId]) : null;
  } catch (error) {
    console.warn('Failed to get last saved timestamp:', error);
    return null;
  }
};

// Create context
const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

// Provider component
interface ProjectProviderProps {
  children: ReactNode;
}

export function ProjectProvider({ children }: ProjectProviderProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [currentProcessPath, setCurrentProcessPath] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Get current flow based on process path
  const currentFlow = currentProject ? getCurrentFlow(currentProject, currentProcessPath) : null;
  const currentNodes = currentFlow?.nodes || [];
  const currentEdges = currentFlow?.edges || [];

  // Generate breadcrumbs
  const breadcrumbs: ProcessBreadcrumb[] = [];
  if (currentProject) {
    breadcrumbs.push({ id: 'root', name: currentProject.name, level: 0 });
    
    let tempFlow: FlowData = currentProject;
    for (let i = 0; i < currentProcessPath.length; i++) {
      const processId = currentProcessPath[i];
      if (tempFlow.processes[processId]) {
        const process = tempFlow.processes[processId];
        breadcrumbs.push({ 
          id: processId, 
          name: process.name, 
          level: i + 1 
        });
        tempFlow = process;
      }
    }
  }

  // Load projects and current project on mount
  useEffect(() => {
    const loadedProjects = loadProjectsFromStorage();
    setProjects(loadedProjects);

    const currentProjectId = loadCurrentProjectId();
    const processPath = loadCurrentProcessPath();
    
    if (currentProjectId && loadedProjects.length > 0) {
      const foundProject = loadedProjects.find(p => p.id === currentProjectId);
      if (foundProject) {
        setCurrentProject(foundProject);
        setCurrentProcessPath(processPath);
      }
    }
  }, []);

  // Save projects when they change
  useEffect(() => {
    if (projects.length > 0) {
      saveProjectsToStorage(projects);
    }
  }, [projects]);

  // Save current project ID and process path when they change
  useEffect(() => {
    saveCurrentProjectId(currentProject?.id || null);
  }, [currentProject]);

  useEffect(() => {
    saveCurrentProcessPath(currentProcessPath);
  }, [currentProcessPath]);

  // Check for unsaved changes
  useEffect(() => {
    if (currentProject) {
      const lastSaved = getLastSavedTimestamp(currentProject.id);
      const hasChanges = !lastSaved || currentProject.updatedAt > lastSaved;
      setHasUnsavedChanges(hasChanges);
    } else {
      setHasUnsavedChanges(false);
    }
  }, [currentProject]);

  const createProject = useCallback((name: string, description?: string) => {
    const newProject = createDefaultProject(name, description);
    
    setProjects(prev => [...prev, newProject]);
    setCurrentProject(newProject);
    setCurrentProcessPath([]);
    
    return newProject;
  }, []);

  const deleteProject = useCallback((projectId: string) => {
    setProjects(prev => prev.filter(project => project.id !== projectId));
    
    // If we're deleting the current project, clear it
    if (currentProject?.id === projectId) {
      setCurrentProject(null);
      setCurrentProcessPath([]);
    }
  }, [currentProject]);

  const selectProject = useCallback((projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setCurrentProject(project);
      setCurrentProcessPath([]);
    }
  }, [projects]);

  const updateProject = useCallback((projectId: string, updates: Partial<Omit<Project, 'id' | 'createdAt'>>) => {
    const updatedProject = {
      ...updates,
      updatedAt: new Date(),
    };

    setProjects(prev => 
      prev.map(project => 
        project.id === projectId 
          ? { ...project, ...updatedProject }
          : project
      )
    );

    // Update current project if it's the one being updated
    if (currentProject?.id === projectId) {
      setCurrentProject(prev => prev ? { ...prev, ...updatedProject } : null);
    }
  }, [currentProject]);

  // Helper function to update nested flow data
  const updateFlowInProject = useCallback((
    project: Project, 
    processPath: string[], 
    updates: { nodes?: Node[], edges?: Edge[] }
  ): Project => {
    if (processPath.length === 0) {
      // Update root level
      return {
        ...project,
        ...updates,
        updatedAt: new Date()
      };
    }

    // Deep clone project for nested updates
    const newProject = JSON.parse(JSON.stringify(project));
    let currentFlow = newProject;

    // Navigate to the target process
    for (let i = 0; i < processPath.length - 1; i++) {
      currentFlow = currentFlow.processes[processPath[i]];
    }

    // Update the target process
    const targetProcessId = processPath[processPath.length - 1];
    currentFlow.processes[targetProcessId] = {
      ...currentFlow.processes[targetProcessId],
      ...updates
    };

    newProject.updatedAt = new Date();
    return newProject;
  }, []);

  const updateCurrentProjectNodes = useCallback((nodes: Node[]) => {
    if (currentProject) {
      const updatedProject = updateFlowInProject(currentProject, currentProcessPath, { nodes });
      
      setProjects(prev => 
        prev.map(project => 
          project.id === currentProject.id ? updatedProject : project
        )
      );
      
      setCurrentProject(updatedProject);
    }
  }, [currentProject, currentProcessPath, updateFlowInProject]);

  const updateCurrentProjectEdges = useCallback((edges: Edge[]) => {
    if (currentProject) {
      const updatedProject = updateFlowInProject(currentProject, currentProcessPath, { edges });
      
      setProjects(prev => 
        prev.map(project => 
          project.id === currentProject.id ? updatedProject : project
        )
      );
      
      setCurrentProject(updatedProject);
    }
  }, [currentProject, currentProcessPath, updateFlowInProject]);

  const enterProcess = useCallback((processId: string, processName: string) => {
    setCurrentProcessPath(prev => [...prev, processId]);
  }, []);

  const exitProcess = useCallback(() => {
    setCurrentProcessPath(prev => prev.slice(0, -1));
  }, []);

  const navigateToRoot = useCallback(() => {
    setCurrentProcessPath([]);
  }, []);

  const createProcess = useCallback((name: string, description?: string): string => {
    if (!currentProject) return '';

    const newProcess = createDefaultProcess(name, description);
    const newProcessNode: Node = {
      id: `process-node-${newProcess.id}`,
      type: 'process',
      position: { x: 300, y: 300 },
      data: { 
        label: name,
        processId: newProcess.id,
        description: description || ''
      }
    };

    // Add process to the project structure
    const updatedProject = updateFlowInProject(currentProject, currentProcessPath, {
      nodes: [...currentNodes, newProcessNode]
    });

    // Add the process to the processes collection
    if (currentProcessPath.length === 0) {
      updatedProject.processes[newProcess.id] = newProcess;
    } else {
      let targetFlow: FlowData = updatedProject;
      for (const pathProcessId of currentProcessPath) {
        targetFlow = targetFlow.processes[pathProcessId];
      }
      targetFlow.processes[newProcess.id] = newProcess;
    }

    setProjects(prev => 
      prev.map(project => 
        project.id === currentProject.id ? updatedProject : project
      )
    );
    
    setCurrentProject(updatedProject);
    
    return newProcess.id;
  }, [currentProject, currentProcessPath, currentNodes, updateFlowInProject]);

  const updateProcessName = useCallback((processId: string, newName: string) => {
    if (!currentProject) return;

    // Deep clone project for updates
    const newProject = JSON.parse(JSON.stringify(currentProject));
    
    // Helper function to find and update process recursively
    const updateProcessInFlow = (flow: FlowData, pathIndex: number = 0): boolean => {
      if (pathIndex === currentProcessPath.length) {
        // We're at the target level, update the process
        if (flow.processes[processId]) {
          flow.processes[processId].name = newName;
          return true;
        }
        return false;
      }

      // Navigate deeper
      const nextProcessId = currentProcessPath[pathIndex];
      if (flow.processes[nextProcessId]) {
        return updateProcessInFlow(flow.processes[nextProcessId], pathIndex + 1);
      }
      return false;
    };

    const updated = updateProcessInFlow(newProject);
    
    if (updated) {
      newProject.updatedAt = new Date();
      
      // Also update the corresponding node in the canvas that represents this process
      const currentFlow = getCurrentFlow(newProject, currentProcessPath);
      if (currentFlow && currentFlow.nodes) {
        currentFlow.nodes = currentFlow.nodes.map(node => {
          if (node.type === 'process' && node.data.processId === processId) {
            return {
              ...node,
              data: {
                ...node.data,
                label: newName,
                _forceUpdate: Date.now()
              }
            };
          }
          return node;
        });
      }
      
      setProjects(prev => 
        prev.map(project => 
          project.id === currentProject.id ? newProject : project
        )
      );
      
      setCurrentProject(newProject);
    }
  }, [currentProject, currentProcessPath]);

  const saveCurrentProject = useCallback(async (): Promise<{ success: boolean; message: string }> => {
    if (!currentProject) {
      return { success: false, message: 'No project selected' };
    }

    setIsSaving(true);
    
    try {
      const result = await syncProjectToServer(currentProject);
      
      if (result.success) {
        // Mark project as saved
        saveLastSavedTimestamp(currentProject.id, new Date());
        setHasUnsavedChanges(false);
        return { success: true, message: result.message || 'Project saved successfully' };
      } else {
        return { success: false, message: result.error || 'Failed to save project' };
      }
    } catch (error) {
      console.error('Save project error:', error);
      return { success: false, message: 'Network error while saving project' };
    } finally {
      setIsSaving(false);
    }
  }, [currentProject]);

  return (
    <ProjectContext.Provider value={{
      projects,
      currentProject,
      createProject,
      deleteProject,
      selectProject,
      updateProject,
      currentNodes,
      currentEdges,
      updateCurrentProjectNodes,
      updateCurrentProjectEdges,
      currentProcessPath,
      breadcrumbs,
      enterProcess,
      exitProcess,
      navigateToRoot,
      createProcess,
      updateProcessName,
      saveCurrentProject,
      isSaving,
      hasUnsavedChanges,
    }}>
      {children}
    </ProjectContext.Provider>
  );
}

// Custom hook to use the context
export function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
} 