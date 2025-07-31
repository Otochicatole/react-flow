import type { FlowData } from './flow';

export interface Project extends FlowData {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  currentProcessPath: string[]; // nested process IDs
  past: Project[]; // history for undo
  future: Project[]; // history for redo
  customNodeTypes: CustomNodeType[];
}

export interface CustomNodeType {
  name: string;
  dir: 'in' | 'out';
}

export interface ProjectExportData {
  projects: Project[];
  customNodeTypes: CustomNodeType[];
  exportedAt: Date;
  version: string;
}

export interface ImportOptions {
  merge?: boolean;
  replaceExisting?: boolean;
}