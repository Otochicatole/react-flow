/**
 * Generates a unique ID with a given prefix
 * @param prefix - The prefix for the ID
 * @returns A unique string ID
 */
export const generateId = (prefix: string): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  return `${prefix}_${timestamp}_${random}`;
};

/**
 * Generates a project ID
 */
export const generateProjectId = (): string => generateId('project');

/**
 * Generates a node ID
 */
export const generateNodeId = (): string => generateId('node');

/**
 * Generates a process ID
 */
export const generateProcessId = (): string => generateId('process');

/**
 * Generates an edge ID
 */
export const generateEdgeId = (): string => generateId('edge');