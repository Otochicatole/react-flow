/**
 * validation.ts
 * ------------
 * Utilidades de validación y sanitización.
 * Type guards y validadores de formato.
 */

import type { Project, ProjectExportData, CustomNodeType } from '@/types';

/**
 * Valida si un objeto es un Project válido.
 * Type guard para asegurar estructura correcta.
 * 
 * @param obj - Objeto a validar
 * @returns true si es Project válido
 * 
 * @example
 * if (isValidProject(data)) {
 *   // data es Project
 * }
 */
export function isValidProject(obj: unknown): obj is Project {
  // Validar tipo base
  if (!obj || typeof obj !== 'object' || obj === null) return false;
  
  // Cast para chequear props
  const candidate = obj as Record<string, unknown>;
  
  // Validar estructura
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
 * Valida si un objeto es ProjectExportData válido.
 * Type guard para datos de exportación.
 * 
 * @param obj - Objeto a validar
 * @returns true si es ProjectExportData válido
 * 
 * @example
 * if (isValidExportData(imported)) {
 *   // imported es ProjectExportData
 * }
 */
export function isValidExportData(obj: unknown): obj is ProjectExportData {
  // Validar tipo base
  if (!obj || typeof obj !== 'object' || obj === null) return false;
  
  // Cast para chequear props
  const candidate = obj as Record<string, unknown>;
  
  // Validar estructura
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
 * Valida si un objeto es CustomNodeType válido.
 * Type guard para nodos personalizados.
 * 
 * @param obj - Objeto a validar
 * @returns true si es CustomNodeType válido
 * 
 * @example
 * if (isValidCustomNodeType(node)) {
 *   // node es CustomNodeType
 * }
 */
export function isValidCustomNodeType(obj: unknown): obj is CustomNodeType {
  // Validar tipo base
  if (!obj || typeof obj !== 'object' || obj === null) return false;
  
  // Cast para chequear props
  const candidate = obj as Record<string, unknown>;
  
  // Validar estructura
  return (
    'name' in candidate &&
    'dir' in candidate &&
    typeof candidate.name === 'string' &&
    (candidate.dir === 'in' || candidate.dir === 'out')
  );
}

/**
 * Sanitiza un nombre de archivo.
 * Remueve caracteres inválidos y normaliza.
 * 
 * @param name - Nombre original
 * @returns Nombre sanitizado
 * 
 * @example
 * const safe = sanitizeFilename('My File!.txt');
 * // my_file_txt
 */
export function sanitizeFilename(name: string): string {
  return name
    .replace(/[^a-z0-9]/gi, '_') // Solo alfanuméricos
    .replace(/_+/g, '_')         // No _ repetidos
    .replace(/^_|_$/g, '')       // No _ al inicio/fin
    .toLowerCase();              // Todo minúsculas
}

/**
 * Valida formato de email.
 * Usa regex simple pero efectiva.
 * 
 * @param email - Email a validar
 * @returns true si el formato es válido
 * 
 * @example
 * if (isValidEmail(input)) {
 *   // Email válido
 * }
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida nombre de proyecto.
 * Chequea longitud y espacios.
 * 
 * @param name - Nombre a validar
 * @returns true si el nombre es válido
 * 
 * @example
 * if (isValidProjectName(input)) {
 *   // Nombre válido
 * }
 */
export function isValidProjectName(name: string): boolean {
  return name.trim().length > 0 && name.trim().length <= 100;
}