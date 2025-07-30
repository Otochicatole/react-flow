import { Project } from '@/context/project-store';
import { customNodeRepository, type StoredCustomNode } from './custom-node-repository';

const STORAGE_KEY = 'react-flow-projects';

export interface ProjectExportData {
  projects: Project[];
  customNodeTypes: StoredCustomNode[];
  exportedAt: Date;
  version: string;
}

export const projectRepository = {
  load(): Project[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      const parsed = JSON.parse(stored) as Project[];
      return parsed.map(p => ({
        ...p,
        createdAt: new Date(p.createdAt),
        updatedAt: new Date(p.updatedAt),
      }));
    } catch (err) {
      console.warn('Failed to load projects', err);
      return [];
    }
  },

  save(projects: Project[]) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch (err) {
      console.warn('Failed to save projects', err);
    }
  },

  // Export all projects and custom nodes
  exportAll(): ProjectExportData {
    const projects = this.load();
    const customNodeTypes = customNodeRepository.load();
    
    return {
      projects,
      customNodeTypes,
      exportedAt: new Date(),
      version: '1.0.0'
    };
  },

  // Export single project
  exportProject(projectId: string): Project | null {
    const projects = this.load();
    return projects.find(p => p.id === projectId) || null;
  },

  // Import projects (merge or replace)
  importProjects(data: ProjectExportData, options: { merge: boolean } = { merge: true }): { success: boolean; message: string; imported: number } {
    try {
      // Validate import data structure
      if (!data.projects || !Array.isArray(data.projects)) {
        return { success: false, message: 'Invalid import data: missing projects array', imported: 0 };
      }

      // Validate each project structure
      for (const project of data.projects) {
        if (!project.id || !project.name || !project.createdAt || !project.updatedAt) {
          return { success: false, message: 'Invalid project structure', imported: 0 };
        }
      }

      let existingProjects = options.merge ? this.load() : [];
      let importedCount = 0;

      // Process imported projects
      const importedProjects = data.projects.map(p => ({
        ...p,
        createdAt: new Date(p.createdAt),
        updatedAt: new Date(p.updatedAt),
      }));

      if (options.merge) {
        // Merge: avoid duplicates by ID, update existing ones
        importedProjects.forEach(newProject => {
          const existingIndex = existingProjects.findIndex(p => p.id === newProject.id);
          if (existingIndex >= 0) {
            existingProjects[existingIndex] = newProject;
          } else {
            existingProjects.push(newProject);
            importedCount++;
          }
        });
      } else {
        // Replace all
        existingProjects = importedProjects;
        importedCount = importedProjects.length;
      }

      // Save to localStorage
      this.save(existingProjects);

      // Import custom node types if available
      if (data.customNodeTypes && Array.isArray(data.customNodeTypes)) {
        if (options.merge) {
          const existingCustomNodes = customNodeRepository.load();
          const mergedCustomNodes = [...existingCustomNodes];
          
          data.customNodeTypes.forEach(newNode => {
            if (!mergedCustomNodes.some(existing => existing.name === newNode.name)) {
              mergedCustomNodes.push(newNode);
            }
          });
          
          customNodeRepository.save(mergedCustomNodes);
        } else {
          customNodeRepository.save(data.customNodeTypes);
        }
      }

      return {
        success: true,
        message: options.merge 
          ? `Successfully imported ${importedCount} new projects` 
          : `Successfully replaced all projects with ${importedCount} imported projects`,
        imported: importedCount
      };

    } catch (err) {
      console.error('Import failed:', err);
      return { 
        success: false, 
        message: err instanceof Error ? err.message : 'Unknown import error', 
        imported: 0 
      };
    }
  },

  // Download project as JSON file
  downloadProject(projectId: string) {
    const project = this.exportProject(projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    const dataToExport: ProjectExportData = {
      projects: [project],
      customNodeTypes: customNodeRepository.load(),
      exportedAt: new Date(),
      version: '1.0.0'
    };

    this.downloadJSON(dataToExport, `${project.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_project.json`);
  },

  // Download all projects as JSON file
  downloadAllProjects() {
    const exportData = this.exportAll();
    this.downloadJSON(exportData, `react_flow_projects_${new Date().toISOString().split('T')[0]}.json`);
  },

  // Helper to trigger JSON download
  downloadJSON(data: ProjectExportData, filename: string) {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  // Helper to read file and parse JSON
  async readJSONFile(file: File): Promise<ProjectExportData> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const data = JSON.parse(content) as ProjectExportData;
          resolve(data);
        } catch {
          reject(new Error('Invalid JSON file'));
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }
}; 