'use client'
import { useRef, useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import styles from '@/components/styles/delete-project-modal.module.css';

interface Props {
  isOpen: boolean;
  nodeName: string;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteCustomNodeModal({ isOpen, nodeName, onClose, onConfirm }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key==='Escape'&&onClose();
    const click = (e: MouseEvent)=>{ if(ref.current && !ref.current.contains(e.target as Node)) onClose(); };
    if(isOpen){ document.addEventListener('keydown',esc); document.addEventListener('mousedown',click); }
    return ()=>{ document.removeEventListener('keydown',esc); document.removeEventListener('mousedown',click); };
  },[isOpen]);

  if(!isOpen) return null;
  return (
    <div className={styles.overlay}>
      <div className={styles.modal} ref={ref}>
        <div className={styles.header}>
          <div className={styles.iconContainer}><AlertTriangle size={24} className={styles.warningIcon}/></div>
          <button onClick={onClose} className={styles.closeButton}><X size={18}/></button>
        </div>
        <div className={styles.content}>
          <h2 className={styles.title}>Delete custom node</h2>
          <p className={styles.message}>Are you sure you want to delete &ldquo;{nodeName}&rdquo;? It will be removed from all processes.</p>
        </div>
        <div className={styles.actions}>
          <button onClick={onClose} className={styles.cancelButton}>Cancel</button>
          <button onClick={()=>{onConfirm();onClose();}} className={styles.deleteButton}>Delete</button>
        </div>
      </div>
    </div>
  );
} 