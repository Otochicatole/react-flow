'use client'
import { useRef, useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { type Project } from '@/context/project-store';
import styles from '@/components/styles/delete-project-modal.module.css';

interface DeleteProjectModalProps {
  isOpen: boolean;
  project: Project | null;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteProjectModal({ isOpen, project, onClose, onConfirm }: DeleteProjectModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as HTMLElement)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);

      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  if (!isOpen || !project) return null;

  return (
    <div className={styles.overlay}>
      <div ref={modalRef} className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.iconContainer}>
            <AlertTriangle size={24} className={styles.warningIcon} />
          </div>
          <button onClick={onClose} className={styles.closeButton}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.content}>
          <h2 className={styles.title}>Delete Project</h2>
          <p className={styles.message}>
            Are you sure you want to delete{' '}
            <span className={styles.projectName}>&ldquo;{project.name}&rdquo;</span>?
          </p>
          <p className={styles.warning}>
            This action cannot be undone. All nodes, connections, and project data will be permanently removed.
          </p>
          
          <div className={styles.projectInfo}>
            <div className={styles.stat}>
              <span className={styles.statValue}>{project.nodes.length}</span>
              <span className={styles.statLabel}>nodes will be deleted</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>{project.edges.length}</span>
              <span className={styles.statLabel}>connections will be deleted</span>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button onClick={onClose} className={styles.cancelButton}>
            Cancel
          </button>
          <button onClick={handleConfirm} className={styles.deleteButton}>
            Delete Project
          </button>
        </div>
      </div>
    </div>
  );
} 