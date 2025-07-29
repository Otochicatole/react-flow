const STORAGE_KEY = 'react-flow-custom-nodes';

export interface StoredCustomNode { name: string; dir: 'in' | 'out'; }

export const customNodeRepository = {
  load(): StoredCustomNode[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },
  save(nodes: StoredCustomNode[]) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nodes));
    } catch {}
  },
}; 