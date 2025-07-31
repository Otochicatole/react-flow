import type { Node, Edge } from '@xyflow/react';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

export interface ProjectApiParams {
  name: string;
  description?: string;
}

export interface UpdateProjectParams {
  name?: string;
  description?: string;
  nodes?: Node[];
  edges?: Edge[];
}