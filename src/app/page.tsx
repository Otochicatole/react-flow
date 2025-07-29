'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, FolderOpen, Trash2, Calendar, FileText } from 'lucide-react';
import { useProject } from '@/context/project-context';
import { type Project } from '@/context/project-store';
import { CreateProjectModal } from '@/components/common/create-project-modal';
import { DeleteProjectModal } from '@/components/common/delete-project-modal';
import styles from '@/components/styles/home-page.module.css';

export default function Home() {
  const router = useRouter();
  const { projects, createProject, deleteProject, selectProject } = useProject();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    project: Project | null;
  }>({
    isOpen: false,
    project: null
  });

  const handleProjectSelect = (projectId: string) => {
    selectProject(projectId);
    router.push(`/project/${projectId}`);
  };

  const handleProjectDelete = (e: React.MouseEvent, project: Project) => {
    e.stopPropagation();
    setDeleteModalState({
      isOpen: true,
      project
    });
  };

  const handleDeleteConfirm = () => {
    if (deleteModalState.project) {
      deleteProject(deleteModalState.project.id);
    }
  };

  const handleDeleteModalClose = () => {
    setDeleteModalState({
      isOpen: false,
      project: null
    });
  };

  const handleCreateProject = (name: string, description?: string) => {
    const newProject = createProject(name, description);
    setIsCreateModalOpen(false);
    router.push(`/project/${newProject.id}`);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>React Flow Projects</h1>
          <p className={styles.subtitle}>
            Create and manage your flow diagrams for event-driven architecture
          </p>
        </div>
        
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className={styles.createButton}
        >
          <Plus size={20} />
          <span>New Project</span>
        </button>
      </div>

      <div className={styles.content}>
        {projects.length === 0 ? (
          <div className={styles.emptyState}>
            <FolderOpen size={64} className={styles.emptyIcon} />
            <h2 className={styles.emptyTitle}>No projects yet</h2>
            <p className={styles.emptyDescription}>
              Create your first project to start building flow diagrams
            </p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className={styles.emptyButton}
            >
              <Plus size={20} />
              <span>Create First Project</span>
            </button>
          </div>
        ) : (
          <div className={styles.projectsGrid}>
            {projects.map((project) => (
              <div
                key={project.id}
                className={styles.projectCard}
                onClick={() => handleProjectSelect(project.id)}
              >
                <div className={styles.projectHeader}>
                  <div className={styles.projectInfo}>
                    <h3 className={styles.projectName}>{project.name}</h3>
                    {project.description && (
                      <p className={styles.projectDescription}>{project.description}</p>
                    )}
                  </div>
                  
                  <button
                    onClick={(e) => handleProjectDelete(e, project)}
                    className={styles.deleteButton}
                    title="Delete project"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className={styles.projectStats}>
                  <div className={styles.stat}>
                    <span className={styles.statValue}>{project.nodes.length}</span>
                    <span className={styles.statLabel}>Nodes</span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.statValue}>{project.edges.length}</span>
                    <span className={styles.statLabel}>Connections</span>
                  </div>
                </div>

                <div className={styles.projectFooter}>
                  <div className={styles.timestamp}>
                    <Calendar size={14} />
                    <span>Updated {formatDate(project.updatedAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateProject}
      />

      <DeleteProjectModal
        isOpen={deleteModalState.isOpen}
        project={deleteModalState.project}
        onClose={handleDeleteModalClose}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
