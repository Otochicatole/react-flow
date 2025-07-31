import type { Project, FlowData } from '@/types';

/**
 * Gets the current flow data based on the process path
 * @param project - The project containing the flows
 * @param processPath - Array of process IDs representing the navigation path
 * @returns The current flow data
 */
export function getCurrentFlow(project: Project, processPath: string[]): FlowData {
  if (processPath.length === 0) return project;
  
  let current: FlowData = project;
  for (const processId of processPath) {
    current = current.processes[processId];
  }
  return current;
}

/**
 * Creates navigation breadcrumbs from a process path
 * @param project - The project containing the flows
 * @param processPath - Array of process IDs
 * @returns Array of breadcrumb objects
 */
export function createBreadcrumbs(project: Project, processPath: string[]): Array<{ label: string; path: string[] }> {
  const breadcrumbs: Array<{ label: string; path: string[] }> = [{ label: project.name, path: [] }];
  
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
 * Validates if a process path exists in the project
 * @param project - The project to validate against
 * @param processPath - The path to validate
 * @returns True if the path is valid
 */
export function isValidProcessPath(project: Project, processPath: string[]): boolean {
  try {
    getCurrentFlow(project, processPath);
    return true;
  } catch {
    return false;
  }
}