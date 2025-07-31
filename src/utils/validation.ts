import type { Project, ProjectExportData, CustomNodeType } from '@/types';

/**
 * Validates if an object is a valid Project
 * @param obj - Object to validate
 * @returns True if valid project
 */
export function isValidProject(obj: unknown): obj is Project {
  if (!obj || typeof obj !== 'object' || obj === null) return false;
  
  const candidate = obj as Record<string, unknown>;
  
  return (
    'id' in candidate &&
    'name' in candidate &&
    'nodes' in candidate &&
    'edges' in candidate &&
    'processes' in candidate &&
    'createdAt' in candidate &&
    'updatedAt' in candidate &&
    typeof candidate.id === 'string' &&
    typeof candidate.name === 'string' &&
    Array.isArray(candidate.nodes) &&
    Array.isArray(candidate.edges) &&
    typeof candidate.processes === 'object'
  );
}

/**
 * Validates if an object is valid export data
 * @param obj - Object to validate
 * @returns True if valid export data
 */
export function isValidExportData(obj: unknown): obj is ProjectExportData {
  if (!obj || typeof obj !== 'object' || obj === null) return false;
  
  const candidate = obj as Record<string, unknown>;
  
  return (
    'projects' in candidate &&
    'customNodeTypes' in candidate &&
    'exportedAt' in candidate &&
    'version' in candidate &&
    Array.isArray(candidate.projects) &&
    Array.isArray(candidate.customNodeTypes) &&
    typeof candidate.version === 'string' &&
    (candidate.projects as unknown[]).every(isValidProject)
  );
}

/**
 * Validates if an object is a valid custom node type
 * @param obj - Object to validate
 * @returns True if valid custom node type
 */
export function isValidCustomNodeType(obj: unknown): obj is CustomNodeType {
  if (!obj || typeof obj !== 'object' || obj === null) return false;
  
  const candidate = obj as Record<string, unknown>;
  
  return (
    'name' in candidate &&
    'dir' in candidate &&
    typeof candidate.name === 'string' &&
    (candidate.dir === 'in' || candidate.dir === 'out')
  );
}

/**
 * Sanitizes a project name for file naming
 * @param name - Project name to sanitize
 * @returns Sanitized filename
 */
export function sanitizeFilename(name: string): string {
  return name
    .replace(/[^a-z0-9]/gi, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
    .toLowerCase();
}

/**
 * Validates an email address
 * @param email - Email to validate
 * @returns True if valid email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates a project name
 * @param name - Project name to validate
 * @returns True if valid name
 */
export function isValidProjectName(name: string): boolean {
  return name.trim().length > 0 && name.trim().length <= 100;
}