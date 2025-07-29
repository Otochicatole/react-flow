'use client'
import { createContext, useContext, useCallback, useState, ReactNode, useEffect } from 'react';
import { type Node, type Edge } from '@xyflow/react';
import { syncProjectToServer } from '@/services/project-api';

// Project interface
export interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  nodes: Node[];
  edges: Edge[];
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
  
  // Current project data
  updateCurrentProjectNodes: (nodes: Node[]) => void;
  updateCurrentProjectEdges: (edges: Edge[]) => void;
  
  // Save functionality
  saveCurrentProject: () => Promise<{ success: boolean; message: string }>;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
}

// Helper functions
const generateProjectId = () => `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

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
});

// Local storage helpers
const STORAGE_KEY = 'react-flow-projects';
const CURRENT_PROJECT_KEY = 'react-flow-current-project';
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
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Load projects and current project on mount
  useEffect(() => {
    const loadedProjects = loadProjectsFromStorage();
    setProjects(loadedProjects);

    const currentProjectId = loadCurrentProjectId();
    if (currentProjectId && loadedProjects.length > 0) {
      const foundProject = loadedProjects.find(p => p.id === currentProjectId);
      if (foundProject) {
        setCurrentProject(foundProject);
      }
    }
  }, []);

  // Save projects when they change
  useEffect(() => {
    if (projects.length > 0) {
      saveProjectsToStorage(projects);
    }
  }, [projects]);

  // Save current project ID when it changes
  useEffect(() => {
    saveCurrentProjectId(currentProject?.id || null);
  }, [currentProject]);

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
    
    return newProject;
  }, []);

  const deleteProject = useCallback((projectId: string) => {
    setProjects(prev => prev.filter(project => project.id !== projectId));
    
    // If we're deleting the current project, clear it
    if (currentProject?.id === projectId) {
      setCurrentProject(null);
    }
  }, [currentProject]);

  const selectProject = useCallback((projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setCurrentProject(project);
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

  const updateCurrentProjectNodes = useCallback((nodes: Node[]) => {
    if (currentProject) {
      const updates = { nodes, updatedAt: new Date() };
      
      setProjects(prev => 
        prev.map(project => 
          project.id === currentProject.id 
            ? { ...project, ...updates }
            : project
        )
      );
      
      setCurrentProject(prev => prev ? { ...prev, ...updates } : null);
    }
  }, [currentProject]);

  const updateCurrentProjectEdges = useCallback((edges: Edge[]) => {
    if (currentProject) {
      const updates = { edges, updatedAt: new Date() };
      
      setProjects(prev => 
        prev.map(project => 
          project.id === currentProject.id 
            ? { ...project, ...updates }
            : project
        )
      );
      
      setCurrentProject(prev => prev ? { ...prev, ...updates } : null);
    }
  }, [currentProject]);

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
      updateCurrentProjectNodes,
      updateCurrentProjectEdges,
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