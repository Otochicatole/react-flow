'use client'

/**
 * ProcessBreadcrumbs
 * -----------------
 * Barra de navegación que muestra la ruta actual en el proyecto.
 * Permite navegar entre procesos anidados.
 * 
 * Características:
 * - Muestra jerarquía de procesos
 * - Navegación directa a cualquier nivel
 * - Indicadores de nivel (L1, L2, etc.)
 * - Íconos distintivos (home/layers)
 * - Estilo para nivel actual
 * 
 * Comportamiento:
 * - Click en Home: vuelve a raíz
 * - Click en proceso: sube hasta ese nivel
 * - Nivel actual deshabilitado
 * - Se oculta si no hay procesos anidados
 */

import { ChevronRight, Home, Layers } from 'lucide-react';
import { useProject } from '@/context/project-context';
import styles from '@/components/styles/process-breadcrumbs.module.css';

export function ProcessBreadcrumbs() {
  // Acciones de navegación
  const { 
    breadcrumbs,     // Lista de procesos en la ruta actual
    navigateToRoot,  // Volver a raíz
    exitProcess      // Subir un nivel
  } = useProject();

  // Ocultar si no hay procesos anidados
  if (!breadcrumbs.length || breadcrumbs.length <= 1) {
    return null;
  }

  /**
   * Maneja click en un breadcrumb.
   * - Si es Home (index 0): vuelve a raíz
   * - Si es proceso: sube niveles hasta llegar al target
   */
  const handleBreadcrumbClick = (breadcrumbIndex: number) => {
    if (breadcrumbIndex === 0) {
      // Click en Home: directo a raíz
      navigateToRoot();
    } else {
      // Click en proceso: subir N niveles
      const targetLevel = breadcrumbIndex;
      const currentLevel = breadcrumbs.length - 1;
      const levelsToExit = currentLevel - targetLevel;
      
      // Subir nivel por nivel hasta llegar al target
      for (let i = 0; i < levelsToExit; i++) {
        exitProcess();
      }
    }
  };

  return (
    <div className={styles.breadcrumbs}>
      {/* Lista de breadcrumbs */}
      <div className={styles.container}>
        {breadcrumbs.map((breadcrumb, index) => (
          <div key={breadcrumb.id} className={styles.breadcrumbItem}>
            {/* Botón de navegación */}
            <button
              onClick={() => handleBreadcrumbClick(index)}
              className={`${styles.breadcrumbButton} ${
                index === breadcrumbs.length - 1 ? styles.current : ''
              }`}
              disabled={index === breadcrumbs.length - 1}
            >
              {/* Ícono según tipo */}
              {index === 0 ? (
                <Home size={16} className={styles.icon} />
              ) : (
                <Layers size={16} className={styles.icon} />
              )}
              {/* Nombre del proceso */}
              <span className={styles.label}>{breadcrumb.name}</span>
              {/* Indicador de nivel */}
              {breadcrumb.level > 0 && (
                <span className={styles.level}>L{breadcrumb.level}</span>
              )}
            </button>
            
            {/* Separador entre items */}
            {index < breadcrumbs.length - 1 && (
              <ChevronRight size={16} className={styles.separator} />
            )}
          </div>
        ))}
      </div>
      
      {/* Indicador de nivel actual */}
      <div className={styles.info}>
        <span className={styles.currentLevel}>
          Level {breadcrumbs[breadcrumbs.length - 1]?.level || 0}
        </span>
      </div>
    </div>
  );
} 