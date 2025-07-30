'use client'
import { ChevronRight, Home, Layers } from 'lucide-react';
import { useProject } from '@/context/project-context';
import styles from '@/components/styles/process-breadcrumbs.module.css';

export function ProcessBreadcrumbs() {
  const { breadcrumbs, navigateToRoot, exitProcess } = useProject();

  if (!breadcrumbs.length || breadcrumbs.length <= 1) {
    return null;
  }

  const handleBreadcrumbClick = (breadcrumbIndex: number) => {
    if (breadcrumbIndex === 0) {
      // Navigate to root
      navigateToRoot();
    } else {
      // Navigate to specific level by exiting processes
      const targetLevel = breadcrumbIndex;
      const currentLevel = breadcrumbs.length - 1;
      const levelsToExit = currentLevel - targetLevel;
      
      for (let i = 0; i < levelsToExit; i++) {
        exitProcess();
      }
    }
  };

  return (
    <div className={styles.breadcrumbs}>
      <div className={styles.container}>
        {breadcrumbs.map((breadcrumb, index) => (
          <div key={breadcrumb.id} className={styles.breadcrumbItem}>
            <button
              onClick={() => handleBreadcrumbClick(index)}
              className={`${styles.breadcrumbButton} ${
                index === breadcrumbs.length - 1 ? styles.current : ''
              }`}
              disabled={index === breadcrumbs.length - 1}
            >
              {index === 0 ? (
                <Home size={16} className={styles.icon} />
              ) : (
                <Layers size={16} className={styles.icon} />
              )}
              <span className={styles.label}>{breadcrumb.name}</span>
              {breadcrumb.level > 0 && (
                <span className={styles.level}>L{breadcrumb.level}</span>
              )}
            </button>
            
            {index < breadcrumbs.length - 1 && (
              <ChevronRight size={16} className={styles.separator} />
            )}
          </div>
        ))}
      </div>
      
      <div className={styles.info}>
        <span className={styles.currentLevel}>
          Level {breadcrumbs[breadcrumbs.length - 1]?.level || 0}
        </span>
      </div>
    </div>
  );
} 