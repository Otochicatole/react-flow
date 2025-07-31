import { STORAGE_KEYS } from '@/constants';
import { getFromStorage, setToStorage } from '@/utils';

// Use constant instead of magic string
const STORAGE_KEY = STORAGE_KEYS.CUSTOM_NODES;

export interface StoredCustomNode { name: string; dir: 'in' | 'out'; }

export const customNodeRepository = {
  load(): StoredCustomNode[] {
    return getFromStorage<StoredCustomNode[]>(STORAGE_KEY, []);
  },

  save(nodes: StoredCustomNode[]) {
    setToStorage(STORAGE_KEY, nodes);
  },
}; 