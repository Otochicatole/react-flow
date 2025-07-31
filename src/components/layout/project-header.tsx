'use client'

/**
 * ProjectHeader
 * ------------
 * Barra superior del proyecto que muestra información y controles.
 * 
 * Características:
 * - Navegación entre proyectos
 * - Información del proyecto/proceso actual
 * - Estadísticas (nodos, conexiones)
 * - Toggle de flujo de ejecución
 * - Guardado de cambios
 * - Indicadores de estado
 * 
 * Estados visuales:
 * - Cambios sin guardar (dot rojo)
 * - Guardando (spinner)
 * - Mensaje de guardado (temporal)
 * - Nivel de proceso (L1, L2, etc.)
 */

import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Calendar, Loader2, Circle } from 'lucide-react';
import { useProject } from '@/context/project-context';
import { useState } from 'react';
import { ExecutionFlowToggle } from '@/components/common/execution-flow-toggle';
import styles from '@/components/styles/project-header.module.css';

export function ProjectHeader() {
  // Router para navegación
  const router = useRouter();

  // Estado y acciones del proyecto
  const { 
    currentProject,     // Proyecto actual
    breadcrumbs,       // Ruta de navegación
    currentProcessPath,// Ruta al proceso actual
    currentNodes,      // Nodos en el canvas
    currentEdges,      // Conexiones en el canvas
    saveCurrentProject,// Función de guardado
    isSaving,         // Estado de guardado
    hasUnsavedChanges // Cambios pendientes
  } = useProject();

  // Estado local para mensaje de guardado
  const [saveMessage, setSaveMessage] = useState<string>('');

  /**
   * Navega a la página principal.
   */
  const handleBackToHome = () => {
    router.push('/');
  };

  /**
   * Guarda los cambios del proyecto.
   * Muestra un mensaje temporal con el resultado.
   */
  const handleSave = async () => {
    const result = await saveCurrentProject();
    setSaveMessage(result.message);

    // Limpiar mensaje después de 3s
    setTimeout(() => {
      setSaveMessage('');
    }, 3000);
  };

  /**
   * Formatea una fecha para mostrar.
   * Formato: "MMM D, HH:mm"
   */
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  /**
   * Obtiene la información a mostrar en el header.
   * Maneja casos de:
   * - Sin proyecto
   * - Proyecto raíz
   * - Dentro de un proceso
   */
  const getCurrentDisplayInfo = () => {
    // Caso: sin proyecto
    if (!currentProject) {
      return {
        name: 'No Project Selected',
        description: 'Please select a project to continue',
        isInProcess: false,
        currentLevel: 0
      };
    }

    // Determinar ubicación actual
    const currentBreadcrumb = breadcrumbs[breadcrumbs.length - 1];
    const isInProcess = currentProcessPath.length > 0;

    // Retornar info según contexto
    return {
      name: currentBreadcrumb?.name || currentProject.name,
      description: isInProcess 
        ? `Process in ${currentProject.name}` 
        : currentProject.description,
      isInProcess,
      currentLevel: currentBreadcrumb?.level || 0
    };
  };

  // Obtener información a mostrar
  const displayInfo = getCurrentDisplayInfo();

  /**
   * Header sin proyecto
   * ------------------
   * Versión simplificada que solo muestra:
   * - Botón de regreso
   * - Mensaje de selección
   */
  if (!currentProject) {
    return (
      <header className={styles.header}>
        <div className={styles.content}>
          {/* Navegación */}
          <button onClick={handleBackToHome} className={styles.backButton}>
            <ArrowLeft size={20} />
            <span>Back to Projects</span>
          </button>
          
          {/* Info básica */}
          <div className={styles.projectInfo}>
            <h1 className={styles.projectName}>{displayInfo.name}</h1>
            <p className={styles.projectMeta}>{displayInfo.description}</p>
          </div>
          
          {/* Acciones (vacío) */}
          <div className={styles.actions} />
        </div>
      </header>
    );
  }

  /**
   * Header completo
   * --------------
   * Muestra toda la información del proyecto:
   * - Navegación
   * - Nombre y descripción
   * - Nivel de proceso
   * - Estadísticas
   * - Controles y acciones
   */
  return (
    <header className={styles.header}>
      <div className={styles.content}>
        {/* Navegación */}
        <button onClick={handleBackToHome} className={styles.backButton}>
          <ArrowLeft size={20} />
          <span>Back to Projects</span>
        </button>
        
        {/* Información del proyecto */}
        <div className={styles.projectInfo}>
          {/* Título con indicadores */}
          <div className={styles.projectNameContainer}>
            <h1 className={styles.projectName}>{displayInfo.name}</h1>
            {/* Indicador de nivel de proceso */}
            {displayInfo.isInProcess && (
              <span className={styles.processIndicator}>
                L{displayInfo.currentLevel}
              </span>
            )}
            {/* Indicador de cambios sin guardar */}
            {hasUnsavedChanges && (
              <div className={styles.unsavedIndicator} title="You have unsaved changes">
                <Circle size={8} className={styles.unsavedDot} />
              </div>
            )}
          </div>

          {/* Metadatos y estadísticas */}
          <div className={styles.projectMeta}>
            <span className={styles.description}>{displayInfo.description}</span>
            <div className={styles.stats}>
              {/* Contadores */}
              <span className={styles.stat}>
                {currentNodes.length} nodes
              </span>
              <span className={styles.stat}>
                {currentEdges.length} connections
              </span>
              {/* Última actualización */}
              <div className={styles.lastUpdated}>
                <Calendar size={14} />
                <span>Updated {formatDate(currentProject.updatedAt)}</span>
              </div>
            </div>
          </div>

          {/* Mensaje de guardado (temporal) */}
          {saveMessage && (
            <div className={styles.saveMessage}>
              {saveMessage}
            </div>
          )}
        </div>
        
        {/* Controles y acciones */}
        <div className={styles.actions}>
          {/* Toggle de flujo de ejecución */}
          <ExecutionFlowToggle />

          {/* Botón de guardado */}
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