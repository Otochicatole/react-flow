/**
 * custom-node-repository.ts
 * -----------------------
 * Repositorio para nodos personalizados.
 * Maneja persistencia de nodos custom.
 */

import { STORAGE_KEYS } from '@/constants';
import { getFromStorage, setToStorage } from '@/utils';

/**
 * Clave de storage para nodos custom
 */
const STORAGE_KEY = STORAGE_KEYS.CUSTOM_NODES;

/**
 * Nodo personalizado almacenado
 * @property name - Nombre único del nodo
 * @property dir - Dirección del flujo
 */
export interface StoredCustomNode { 
  name: string;       // Nombre único
  dir: 'in' | 'out'; // Dirección
}

/**
 * Repositorio de nodos personalizados
 * Singleton con operaciones de persistencia.
 */
export const customNodeRepository = {
  /**
   * Carga nodos personalizados
   * @returns Lista de nodos custom
   * 
   * @example
   * const nodes = customNodeRepository.load();
   */
  load(): StoredCustomNode[] {
    return getFromStorage<StoredCustomNode[]>(STORAGE_KEY, []);
  },

  /**
   * Guarda nodos personalizados
   * @param nodes - Lista a guardar
   * 
   * @example
   * customNodeRepository.save(nodes);
   */
  save(nodes: StoredCustomNode[]) {
    setToStorage(STORAGE_KEY, nodes);
  },
}; 