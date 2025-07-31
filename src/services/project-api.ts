/**
 * project-api.ts
 * -------------
 * Servicios de API para proyectos.
 * Simula llamadas a backend con delay.
 */

import { type Project } from '@/context/project-context';

/**
 * Delay simulado para APIs
 * Simula latencia de red.
 */
const API_DELAY = 800; // 800ms de delay

/**
 * Función de delay
 * Wrapper de setTimeout con Promise.
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Respuesta de API genérica
 * @template T - Tipo de datos
 */
interface ApiResponse<T> {
  success: boolean;   // Estado de operación
  data?: T;          // Datos de respuesta
  error?: string;    // Mensaje de error
  message?: string;  // Mensaje de éxito
}

/**
 * Obtiene lista de proyectos
 * GET /api/projects
 * 
 * @returns Promise con lista de proyectos
 * 
 * @example
 * const res = await getProjects();
 * if (res.success) {
 *   // Usar res.data
 * }
 */
export async function getProjects(): Promise<ApiResponse<Project[]>> {
  await delay(API_DELAY);
  
  try {
    // Simular éxito
    return {
      success: true,
      message: 'Projects fetched successfully'
    };
  } catch (error) {
    // Log y error
    console.error('Failed to fetch projects:', error);
    return {
      success: false,
      error: 'Failed to fetch projects from server'
    };
  }
}

/**
 * Crea nuevo proyecto
 * POST /api/projects
 * 
 * @returns Promise con proyecto creado
 * 
 * @example
 * const res = await createProjectApi();
 * if (res.success) {
 *   // Usar res.data
 * }
 */
export async function createProjectApi(): Promise<ApiResponse<Project>> {
  await delay(API_DELAY);
  
  try {
    // Simular éxito
    return {
      success: true,
      message: 'Project created successfully'
    };
  } catch (error) {
    // Log y error
    console.error('Failed to create project:', error);
    return {
      success: false,
      error: 'Failed to create project on server'
    };
  }
}

/**
 * Actualiza proyecto existente
 * PUT /api/projects/:id
 * 
 * @param _projectId - ID del proyecto
 * @param _updates - Campos a actualizar
 * @returns Promise con proyecto actualizado
 * 
 * @example
 * const res = await updateProjectApi('123', {
 *   name: 'New Name'
 * });
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function updateProjectApi(
  _projectId: string, 
  _updates: Partial<Omit<Project, 'id' | 'createdAt'>>
): Promise<ApiResponse<Project>> {
  await delay(API_DELAY);
  
  try {
    // Simular éxito
    return {
      success: true,
      message: 'Project saved successfully'
    };
  } catch (error) {
    // Log y error
    console.error('Failed to update project:', error);
    return {
      success: false,
      error: 'Failed to save project to server'
    };
  }
}

/**
 * Elimina proyecto
 * DELETE /api/projects/:id
 * 
 * @returns Promise vacío
 * 
 * @example
 * const res = await deleteProjectApi();
 * if (res.success) {
 *   // Proyecto eliminado
 * }
 */
export async function deleteProjectApi(): Promise<ApiResponse<void>> {
  await delay(API_DELAY);
  
  try {
    // Simular éxito
    return {
      success: true,
      message: 'Project deleted successfully'
    };
  } catch (error) {
    // Log y error
    console.error('Failed to delete project:', error);
    return {
      success: false,
      error: 'Failed to delete project from server'
    };
  }
}

/**
 * Sincroniza proyecto con servidor
 * Wrapper de updateProjectApi con datos completos.
 * 
 * @param project - Proyecto a sincronizar
 * @returns Promise con proyecto sincronizado
 * 
 * @example
 * const res = await syncProjectToServer(project);
 * if (res.success) {
 *   // Proyecto sincronizado
 * }
 */
export async function syncProjectToServer(project: Project): Promise<ApiResponse<Project>> {
  // Enviar datos completos
  return await updateProjectApi(project.id, {
    name: project.name,
    description: project.description,
    nodes: project.nodes,
    edges: project.edges,
    updatedAt: new Date(),
  });
} 