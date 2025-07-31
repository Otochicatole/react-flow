'use client'
import { useProjectStore } from '@/context/project-store';
import styles from '@/components/styles/execution-flow-toggle.module.css';

export function ExecutionFlowToggle() {
  const { state, dispatch } = useProjectStore();

  const handleToggle = () => {
    dispatch({ type: 'TOGGLE_EXECUTION_FLOW' });
  };

  return (
    <div className={styles.toggleContainer}>
      <label className={styles.toggleLabel}>
        <span className={styles.labelText}>Execution Flow</span>
        <button
          type="button"
          onClick={handleToggle}
          className={`${styles.toggle} ${state.showExecutionFlow ? styles.active : ''}`}
          aria-pressed={state.showExecutionFlow}
        >
          <span className={styles.slider} />
        </button>
      </label>
    </div>
  );
}