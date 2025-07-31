/**
 * api.ts
 * ------
 * Tipos para interacción con APIs.
 * Define estructuras de request/response.
 */

import type { Node, Edge } from '@xyflow/react';

/**
 * Respuesta genérica de API
 * Wrapper para respuestas consistentes.
 * 
 * @template T - Tipo de datos de respuesta
 * @property data - Datos de respuesta (opcional)
 * @property error - Mensaje de error (opcional)
 * @property success - Si la operación fue exitosa
 * 
 * @example
 * type Response = ApiResponse<Project>;
 * const res: Response = {
 *   data: project,
 *   success: true
 * };
 */
export interface ApiResponse<T> {
  data?: T;           // Datos tipados
  error?: string;     // Error si falla
  success: boolean;   // Estado de op
}

/**
 * Parámetros para crear proyecto
 * Datos mínimos requeridos.
 * 
 * @property name - Nombre del proyecto
 * @property description - Descripción opcional
 * 
 * @example
 * const params: ProjectApiParams = {
 *   name: "My Project",
 *   description: "Optional desc"
 * };
 */
export interface ProjectApiParams {
  name: string;         // Requerido
  description?: string; // Opcional
}

/**
 * Parámetros para actualizar proyecto
 * Todos los campos son opcionales.
 * 
 * @property name - Nuevo nombre
 * @property description - Nueva descripción
 * @property nodes - Nuevos nodos
 * @property edges - Nuevas conexiones
 * 
 * @example
 * const update: UpdateProjectParams = {
 *   name: "New Name",
 *   nodes: [...],
 *   edges: [...]
 * };
 */
export interface UpdateProjectParams {
  name?: string;        // Nuevo nombre
  description?: string; // Nueva desc
  nodes?: Node[];       // Nuevos nodos
  edges?: Edge[];       // Nuevas edges
}