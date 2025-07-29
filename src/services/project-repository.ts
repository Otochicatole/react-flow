import { Project } from '@/context/project-store';

const STORAGE_KEY = 'react-flow-projects';

export const projectRepository = {
  load(): Project[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      const parsed = JSON.parse(stored) as Project[];
      return parsed.map(p => ({
        ...p,
        createdAt: new Date(p.createdAt),
        updatedAt: new Date(p.updatedAt),
      }));
    } catch (err) {
      console.warn('Failed to load projects', err);
      return [];
    }
  },

  save(projects: Project[]) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch (err) {
      console.warn('Failed to save projects', err);
    }
  },
}; 