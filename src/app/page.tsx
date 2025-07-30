'use client'
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, FolderOpen, Trash2, Calendar, Download, Upload, Share } from 'lucide-react';
import { useProject } from '@/context/project-context';
import { type Project } from '@/context/project-store';
import { CreateProjectModal } from '@/components/common/create-project-modal';
import { DeleteProjectModal } from '@/components/common/delete-project-modal';
import styles from '@/components/styles/home-page.module.css';

export default function Home() {
  const router = useRouter();
  const { projects, createProject, deleteProject, selectProject, exportAllProjects, exportProject, importProjects } = useProject();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    project: Project | null;
  }>({
    isOpen: false,
    project: null
  });
  const [importStatus, setImportStatus] = useState<{
    loading: boolean;
    message: string;
    success: boolean | null;
  }>({
    loading: false,
    message: '',
    success: null
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleExportAll = () => {
    try {
      exportAllProjects();
      setImportStatus({
        loading: false,
        message: 'Projects exported successfully!',
        success: true
      });
      setTimeout(() => setImportStatus(prev => ({ ...prev, message: '', success: null })), 3000);
    } catch {
      setImportStatus({
        loading: false,
        message: 'Failed to export projects',
        success: false
      });
      setTimeout(() => setImportStatus(prev => ({ ...prev, message: '', success: null })), 3000);
    }
  };

  const handleExportProject = (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    try {
      exportProject(projectId);
      setImportStatus({
        loading: false,
        message: 'Project exported successfully!',
        success: true
      });
      setTimeout(() => setImportStatus(prev => ({ ...prev, message: '', success: null })), 3000);
    } catch {
      setImportStatus({
        loading: false,
        message: 'Failed to export project',
        success: false
      });
      setTimeout(() => setImportStatus(prev => ({ ...prev, message: '', success: null })), 3000);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportStatus({
      loading: true,
      message: 'Importing projects...',
      success: null
    });

    try {
      const result = await importProjects(file, true);
      setImportStatus({
        loading: false,
        message: result.message,
        success: result.success
      });
      
      // Clear the input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      setTimeout(() => setImportStatus(prev => ({ ...prev, message: '', success: null })), 5000);
    } catch {
      setImportStatus({
        loading: false,
        message: 'Failed to import projects',
        success: false
      });
      setTimeout(() => setImportStatus(prev => ({ ...prev, message: '', success: null })), 3000);
    }
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
          {importStatus.message && (
            <div className={`${styles.statusMessage} ${importStatus.success === true ? styles.success : importStatus.success === false ? styles.error : styles.loading}`}>
              {importStatus.message}
            </div>
          )}
        </div>
        
        <div className={styles.headerActions}>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileImport}
            style={{ display: 'none' }}
          />
          
          <button
            onClick={handleImportClick}
            className={styles.actionButton}
            disabled={importStatus.loading}
            title="Import projects from JSON file"
          >
            <Upload size={18} />
            <span>Import</span>
          </button>

          <button
            onClick={handleExportAll}
            className={styles.actionButton}
            disabled={projects.length === 0}
            title="Export all projects to JSON file"
          >
            <Download size={18} />
            <span>Export All</span>
          </button>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className={styles.createButton}
          >
            <Plus size={20} />
            <span>New Project</span>
          </button>
        </div>
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
                  
                  <div className={styles.projectActions}>
                    <button
                      onClick={(e) => handleExportProject(e, project.id)}
                      className={styles.exportButton}
                      title="Export project"
                    >
                      <Share size={16} />
                    </button>
                    <button
                      onClick={(e) => handleProjectDelete(e, project)}
                      className={styles.deleteButton}
                      title="Delete project"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
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
