import { type Project } from '@/context/project-context';

// Simulated delay for API calls
const API_DELAY = 800;

// Helper function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simulated API response wrapper
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// GET /api/projects - Fetch all projects
export async function getProjects(): Promise<ApiResponse<Project[]>> {
  await delay(API_DELAY);
  
  try {
    // Simulate API call
    // const response = await fetch(`${API_BASE_URL}`, {
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${getAuthToken()}`,
    //   },
    // });
    // 
    // if (!response.ok) {
    //   throw new Error(`HTTP error! status: ${response.status}`);
    // }
    // 
    // const projects = await response.json();
    
    // For now, return success (localStorage handles the data)
    return {
      success: true,
      message: 'Projects fetched successfully'
    };
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    return {
      success: false,
      error: 'Failed to fetch projects from server'
    };
  }
}

// POST /api/projects - Create a new project
export async function createProjectApi(): Promise<ApiResponse<Project>> {
  await delay(API_DELAY);
  
  try {
    // Simulate API call
    // const response = await fetch(`${API_BASE_URL}`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${getAuthToken()}`,
    //   },
    //   body: JSON.stringify({
    //     name: project.name,
    //     description: project.description,
    //     nodes: project.nodes,
    //     edges: project.edges,
    //   }),
    // });
    // 
    // if (!response.ok) {
    //   throw new Error(`HTTP error! status: ${response.status}`);
    // }
    // 
    // const createdProject = await response.json();
    // return {
    //   success: true,
    //   data: createdProject,
    //   message: 'Project created successfully'
    // };
    
    // For now, return success
    return {
      success: true,
      message: 'Project created successfully'
    };
  } catch (error) {
    console.error('Failed to create project:', error);
    return {
      success: false,
      error: 'Failed to create project on server'
    };
  }
}

// PUT /api/projects/:id - Update an existing project
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function updateProjectApi(_projectId: string, _updates: Partial<Omit<Project, 'id' | 'createdAt'>>): Promise<ApiResponse<Project>> {
  await delay(API_DELAY);
  
  try {
    // Simulate API call
    // const response = await fetch(`${API_BASE_URL}/${projectId}`, {
    //   method: 'PUT',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${getAuthToken()}`,
    //   },
    //   body: JSON.stringify({
    //     name: updates.name,
    //     description: updates.description,
    //     nodes: updates.nodes,
    //     edges: updates.edges,
    //     updatedAt: updates.updatedAt,
    //   }),
    // });
    // 
    // if (!response.ok) {
    //   throw new Error(`HTTP error! status: ${response.status}`);
    // }
    // 
    // const updatedProject = await response.json();
    // return {
    //   success: true,
    //   data: updatedProject,
    //   message: 'Project updated successfully'
    // };
    
    // For now, return success
    return {
      success: true,
      message: 'Project saved successfully'
    };
  } catch (error) {
    console.error('Failed to update project:', error);
    return {
      success: false,
      error: 'Failed to save project to server'
    };
  }
}

// DELETE /api/projects/:id - Delete a project
export async function deleteProjectApi(): Promise<ApiResponse<void>> {
  await delay(API_DELAY);
  
  try {
    // Simulate API call
    // const response = await fetch(`${API_BASE_URL}/${projectId}`, {
    //   method: 'DELETE',
    //   headers: {
    //     'Authorization': `Bearer ${getAuthToken()}`,
    //   },
    // });
    // 
    // if (!response.ok) {
    //   throw new Error(`HTTP error! status: ${response.status}`);
    // }
    
    // For now, return success
    return {
      success: true,
      message: 'Project deleted successfully'
    };
  } catch (error) {
    console.error('Failed to delete project:', error);
    return {
      success: false,
      error: 'Failed to delete project from server'
    };
  }
}

// Helper function to get auth token (would be implemented with your auth system)
// function getAuthToken(): string {
//   return localStorage.getItem('authToken') || '';
// }

// Sync function to save current state to server
export async function syncProjectToServer(project: Project): Promise<ApiResponse<Project>> {
  return await updateProjectApi(project.id, {
    name: project.name,
    description: project.description,
    nodes: project.nodes,
    edges: project.edges,
    updatedAt: new Date(),
  });
} 