/**
 * flow-helpers.ts
 * -------------
 * Utilidades para trabajar con flujos y procesos.
 * Maneja navegación y validación de procesos anidados.
 */

import type { Project, FlowData } from '@/types';

/**
 * Obtiene el flujo actual según la ruta de proceso.
 * Navega recursivamente por los procesos anidados.
 * 
 * @param project - Proyecto actual
 * @param processPath - Array de IDs de proceso
 * @returns FlowData del proceso actual
 * 
 * @example
 * // Obtener proceso raíz
 * getCurrentFlow(project, [])
 * 
 * // Obtener proceso anidado
 * getCurrentFlow(project, ['proc_1', 'proc_2'])
 */
export function getCurrentFlow(project: Project, processPath: string[]): FlowData {
  // Si no hay ruta, retornar proyecto raíz
  if (processPath.length === 0) return project;
  
  // Navegar por la ruta de procesos
  let current: FlowData = project;
  for (const processId of processPath) {
    current = current.processes[processId];
  }
  return current;
}

/**
 * Crea array de breadcrumbs para navegación.
 * Cada breadcrumb tiene nombre y ruta acumulada.
 * 
 * @param project - Proyecto actual
 * @param processPath - Array de IDs de proceso
 * @returns Array de breadcrumbs con label y path
 * 
 * @example
 * // Resultado:
 * [
 *   { label: "Project", path: [] },
 *   { label: "Process 1", path: ["proc_1"] },
 *   { label: "Process 2", path: ["proc_1", "proc_2"] }
 * ]
 */
export function createBreadcrumbs(project: Project, processPath: string[]): Array<{ label: string; path: string[] }> {
  // Iniciar con proyecto raíz
  const breadcrumbs: Array<{ label: string; path: string[] }> = [
    { label: project.name, path: [] }
  ];
  
  // Agregar cada proceso en la ruta
  let current: FlowData = project;
  for (let i = 0; i < processPath.length; i++) {
    const processId = processPath[i];
    const process = current.processes[processId];
    if (process) {
      breadcrumbs.push({
        label: process.name,
        path: processPath.slice(0, i + 1)
      });
      current = process;
    }
  }
  
  return breadcrumbs;
}

/**
 * Valida si una ruta de proceso existe.
 * Intenta navegar la ruta y captura errores.
 * 
 * @param project - Proyecto actual
 * @param processPath - Array de IDs de proceso
 * @returns true si la ruta es válida
 * 
 * @example
 * // Validar ruta
 * if (isValidProcessPath(project, path)) {
 *   // Ruta existe
 * }
 */
export function isValidProcessPath(project: Project, processPath: string[]): boolean {
  try {
    // Intentar navegar la ruta
    getCurrentFlow(project, processPath);
    return true;
  } catch {
    // Error = ruta inválida
    return false;
  }
}