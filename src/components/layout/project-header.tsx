'use client'
import { useRouter } from 'next/navigation';
import { ArrowLeft, Settings, Save, Calendar, Loader2, Circle } from 'lucide-react';
import { useProject } from '@/context/project-context';
import { useState } from 'react';
import styles from '@/components/styles/project-header.module.css';

export function ProjectHeader() {
  const router = useRouter();
  const { 
    currentProject, 
    breadcrumbs, 
    currentProcessPath,
    currentNodes,
    currentEdges,
    saveCurrentProject, 
    isSaving, 
    hasUnsavedChanges 
  } = useProject();
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

  // Get current display name and context
  const getCurrentDisplayInfo = () => {
    if (!currentProject) {
      return {
        name: 'No Project Selected',
        description: 'Please select a project to continue',
        isInProcess: false,
        currentLevel: 0
      };
    }

    const currentBreadcrumb = breadcrumbs[breadcrumbs.length - 1];
    const isInProcess = currentProcessPath.length > 0;

    return {
      name: currentBreadcrumb?.name || currentProject.name,
      description: isInProcess 
        ? `Process in ${currentProject.name}` 
        : currentProject.description,
      isInProcess,
      currentLevel: currentBreadcrumb?.level || 0
    };
  };

  const displayInfo = getCurrentDisplayInfo();

  if (!currentProject) {
    return (
      <header className={styles.header}>
        <div className={styles.content}>
          <button onClick={handleBackToHome} className={styles.backButton}>
            <ArrowLeft size={20} />
            <span>Back to Projects</span>
          </button>
          
          <div className={styles.projectInfo}>
            <h1 className={styles.projectName}>{displayInfo.name}</h1>
            <p className={styles.projectMeta}>{displayInfo.description}</p>
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
            <h1 className={styles.projectName}>{displayInfo.name}</h1>
            {displayInfo.isInProcess && (
              <span className={styles.processIndicator}>
                L{displayInfo.currentLevel}
              </span>
            )}
            {hasUnsavedChanges && (
              <div className={styles.unsavedIndicator} title="You have unsaved changes">
                <Circle size={8} className={styles.unsavedDot} />
              </div>
            )}
          </div>
          <div className={styles.projectMeta}>
            <span className={styles.description}>{displayInfo.description}</span>
            <div className={styles.stats}>
              <span className={styles.stat}>
                {currentNodes.length} nodes
              </span>
              <span className={styles.stat}>
                {currentEdges.length} connections
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
        </div>
      </div>
    </header>
  );
} 