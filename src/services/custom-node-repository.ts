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
 */
export interface StoredCustomNode {
  name: string; // Nombre único
}

/**
 * Repositorio de nodos personalizados
 * Singleton con operaciones de persistencia.
 */
export const customNodeRepository = {
  /**
   * Carga nodos personalizados
   * @returns Lista de nodos custom
   */
  load(): StoredCustomNode[] {
    return getFromStorage<StoredCustomNode[]>(STORAGE_KEY, []);
  },

  /**
   * Guarda nodos personalizados
   * @param nodes - Lista a guardar
   */
  save(nodes: StoredCustomNode[]) {
    setToStorage(STORAGE_KEY, nodes);
  },
};
