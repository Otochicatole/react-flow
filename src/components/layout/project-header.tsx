'use client'
import { useRouter } from 'next/navigation';
import { ArrowLeft, Settings, Save, Calendar, Loader2, Circle } from 'lucide-react';
import { useProject } from '@/context/project-context';
import { useState } from 'react';
import styles from '@/components/styles/project-header.module.css';

export function ProjectHeader() {
  const router = useRouter();
  const { currentProject, saveCurrentProject, isSaving, hasUnsavedChanges } = useProject();
  const [saveMessage, setSaveMessage] = useState<string>('');

  const handleBackToHome = () => {
    router.push('/');
  };

  const handleSave = async () => {
    const result = await saveCurrentProject();
    setSaveMessage(result.message);
    
    // Clear message after 3 seconds
    setTimeout(() => {
      setSaveMessage('');
    }, 3000);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (!currentProject) {
    return (
      <header className={styles.header}>
        <div className={styles.content}>
          <button onClick={handleBackToHome} className={styles.backButton}>
            <ArrowLeft size={20} />
            <span>Back to Projects</span>
          </button>
          
          <div className={styles.projectInfo}>
            <h1 className={styles.projectName}>No Project Selected</h1>
            <p className={styles.projectMeta}>Please select a project to continue</p>
          </div>
          
          <div className={styles.actions}>
            {/* Empty space for layout balance */}
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className={styles.header}>
      <div className={styles.content}>
        <button onClick={handleBackToHome} className={styles.backButton}>
          <ArrowLeft size={20} />
          <span>Back to Projects</span>
        </button>
        
        <div className={styles.projectInfo}>
          <div className={styles.projectNameContainer}>
            <h1 className={styles.projectName}>{currentProject.name}</h1>
            {hasUnsavedChanges && (
              <div className={styles.unsavedIndicator} title="You have unsaved changes">
                <Circle size={8} className={styles.unsavedDot} />
              </div>
            )}
          </div>
          <div className={styles.projectMeta}>
            {currentProject.description && (
              <span className={styles.description}>{currentProject.description}</span>
            )}
            <div className={styles.stats}>
              <span className={styles.stat}>
                {currentProject.nodes.length} nodes
              </span>
              <span className={styles.stat}>
                {currentProject.edges.length} connections
              </span>
              <div className={styles.lastUpdated}>
                <Calendar size={14} />
                <span>Updated {formatDate(currentProject.updatedAt)}</span>
              </div>
            </div>
          </div>
          {saveMessage && (
            <div className={styles.saveMessage}>
              {saveMessage}
            </div>
          )}
        </div>
        
        <div className={styles.actions}>
          <button 
            onClick={handleSave}
            disabled={isSaving || !hasUnsavedChanges}
            className={`${styles.saveButton} ${hasUnsavedChanges ? styles.hasChanges : ''}`}
            title={hasUnsavedChanges ? 'Save changes to server' : 'All changes saved'}
          >
            {isSaving ? (
              <Loader2 size={18} className={styles.spinner} />
            ) : (
              <Save size={18} />
            )}
            <span>{isSaving ? 'Saving...' : 'Save'}</span>
          </button>
          
          <button className={styles.actionButton} title="Project Settings">
            <Settings size={18} />
          </button>
        </div>
      </div>
    </header>
  );
} 