/**
 * project-repository.ts
 * -------------------
 * Repositorio para gestión de proyectos.
 * Maneja persistencia y operaciones CRUD.
 */

import type { Project, ProjectExportData } from '@/types';
import { customNodeRepository } from './custom-node-repository';
import { getFromStorage, setToStorage } from '@/utils';
import { STORAGE_KEYS, APP_CONFIG } from '@/constants';

export type { ProjectExportData };

/**
 * Repositorio de proyectos
 * Singleton con operaciones de persistencia.
 */
export const projectRepository = {
  /**
   * Carga proyectos de localStorage
   * Convierte fechas a Date.
   * 
   * @returns Lista de proyectos
   * 
   * @example
   * const projects = projectRepository.load();
   */
  load(): Project[] {
    // Cargar y parsear fechas
    const projects = getFromStorage<Project[]>(STORAGE_KEYS.PROJECTS, []);
    return projects.map(p => ({
      ...p,
      createdAt: new Date(p.createdAt),
      updatedAt: new Date(p.updatedAt),
    }));
  },

  /**
   * Guarda proyectos en localStorage
   * @param projects - Lista a guardar
   * 
   * @example
   * projectRepository.save(projects);
   */
  save(projects: Project[]) {
    setToStorage(STORAGE_KEYS.PROJECTS, projects);
  },

  /**
   * Exporta todos los proyectos
   * Incluye nodos personalizados.
   * 
   * @returns Datos de exportación
   * 
   * @example
   * const data = projectRepository.exportAll();
   */
  exportAll(): ProjectExportData {
    // Cargar datos
    const projects = this.load();
    const customNodeTypes = customNodeRepository.load();
    
    // Crear export data
    return {
      projects,
      customNodeTypes,
      exportedAt: new Date(),
      version: APP_CONFIG.VERSION
    };
  },

  /**
   * Exporta un proyecto específico
   * @param projectId - ID del proyecto
   * @returns Proyecto o null
   * 
   * @example
   * const project = projectRepository.exportProject('123');
   */
  exportProject(projectId: string): Project | null {
    const projects = this.load();
    return projects.find(p => p.id === projectId) || null;
  },

  /**
   * Importa proyectos desde datos
   * Puede combinar o reemplazar.
   * 
   * @param data - Datos a importar
   * @param options - Opciones de merge
   * @returns Resultado de importación
   * 
   * @example
   * const result = projectRepository.importProjects(data, {
   *   merge: true // Combinar con existentes
   * });
   */
  importProjects(
    data: ProjectExportData, 
    options: { merge: boolean } = { merge: true }
  ): { success: boolean; message: string; imported: number } {
    try {
      // Validar estructura
      if (!data.projects || !Array.isArray(data.projects)) {
        return { 
          success: false, 
          message: 'Invalid import data: missing projects array', 
          imported: 0 
        };
      }

      // Validar proyectos
      for (const project of data.projects) {
        if (!project.id || !project.name || !project.createdAt || !project.updatedAt) {
          return { 
            success: false, 
            message: 'Invalid project structure', 
            imported: 0 
          };
        }
      }

      // Preparar datos
      let existingProjects = options.merge ? this.load() : [];
      let importedCount = 0;

      // Parsear fechas
      const importedProjects = data.projects.map(p => ({
        ...p,
        createdAt: new Date(p.createdAt),
        updatedAt: new Date(p.updatedAt),
      }));

      // Merge o reemplazo
      if (options.merge) {
        // Merge: actualizar existentes y agregar nuevos
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
        // Reemplazo: usar solo importados
        existingProjects = importedProjects;
        importedCount = importedProjects.length;
      }

      // Guardar proyectos
      this.save(existingProjects);

      // Procesar nodos personalizados
      if (data.customNodeTypes && Array.isArray(data.customNodeTypes)) {
        if (options.merge) {
          // Merge de nodos custom
          const existingCustomNodes = customNodeRepository.load();
          const mergedCustomNodes = [...existingCustomNodes];
          
          data.customNodeTypes.forEach(newNode => {
            if (!mergedCustomNodes.some(existing => existing.name === newNode.name)) {
              mergedCustomNodes.push(newNode);
            }
          });
          
          customNodeRepository.save(mergedCustomNodes);
        } else {
          // Reemplazo de nodos custom
          customNodeRepository.save(data.customNodeTypes);
        }
      }

      // Retornar resultado
      return {
        success: true,
        message: options.merge 
          ? `Successfully imported ${importedCount} new projects` 
          : `Successfully replaced all projects with ${importedCount} imported projects`,
        imported: importedCount
      };

    } catch (err) {
      // Log y error
      console.error('Import failed:', err);
      return { 
        success: false, 
        message: err instanceof Error ? err.message : 'Unknown import error', 
        imported: 0 
      };
    }
  },

  /**
   * Descarga un proyecto como JSON
   * @param projectId - ID del proyecto
   * 
   * @example
   * projectRepository.downloadProject('123');
   */
  downloadProject(projectId: string) {
    // Buscar proyecto
    const project = this.exportProject(projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    // Crear export data
    const dataToExport: ProjectExportData = {
      projects: [project],
      customNodeTypes: customNodeRepository.load(),
      exportedAt: new Date(),
      version: '1.0.0'
    };

    // Descargar archivo
    this.downloadJSON(
      dataToExport, 
      `${project.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_project.json`
    );
  },

  /**
   * Descarga todos los proyectos
   * Incluye nodos personalizados.
   * 
   * @example
   * projectRepository.downloadAllProjects();
   */
  downloadAllProjects() {
    const exportData = this.exportAll();
    this.downloadJSON(
      exportData, 
      `react_flow_projects_${new Date().toISOString().split('T')[0]}.json`
    );
  },

  /**
   * Descarga datos como archivo JSON
   * @param data - Datos a descargar
   * @param filename - Nombre del archivo
   * 
   * @example
   * projectRepository.downloadJSON(data, 'export.json');
   */
  downloadJSON(data: ProjectExportData, filename: string) {
    // Crear blob
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json'
    });
    
    // Simular click en link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    
    // Limpiar recursos
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  /**
   * Lee archivo JSON de proyecto
   * @param file - Archivo a leer
   * @returns Promise con datos
   * 
   * @example
   * const data = await projectRepository.readJSONFile(file);
   */
  async readJSONFile(file: File): Promise<ProjectExportData> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      // Handler de éxito
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const data = JSON.parse(content) as ProjectExportData;
          resolve(data);
        } catch {
          reject(new Error('Invalid JSON file'));
        }
      };
      
      // Handler de error
      reader.onerror = () => reject(new Error('Failed to read file'));
      
      // Iniciar lectura
      reader.readAsText(file);
    });
  }
}; 