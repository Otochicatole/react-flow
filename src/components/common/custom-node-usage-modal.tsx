'use client'
import styles from '@/components/styles/custom-node-modal.module.css';
import { X } from 'lucide-react';

interface Usage {
  path: string;
  dir: 'in' | 'out';
  idPath: string[];
}

interface Props {
  isOpen: boolean;
  nodeName: string;
  usages: Usage[];
  onClose: () => void;
  onSelect: (idPath: string[]) => void;
}

export function CustomNodeUsageModal({ isOpen, nodeName, usages, onClose, onSelect }: Props) {
  if (!isOpen) return null;
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Usages of &ldquo;{nodeName}&rdquo;</h2>
          <button className={styles.closeButton} onClick={onClose}><X size={18}/></button>
        </div>
        <div className={styles.content}>
          {usages.length === 0 ? (
            <p>No usages found</p>
          ) : (
            <ul className={styles.list}>
              {usages.map((u, idx) => (
                <li key={idx} className={styles.item} onClick={() => onSelect(u.idPath)}>
                  {u.dir === 'in' ? '<-' : '->'} {u.path}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
} 