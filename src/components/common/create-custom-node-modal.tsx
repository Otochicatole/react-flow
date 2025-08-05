'use client'
import { useState, useRef, useEffect } from 'react';
import styles from '@/components/styles/create-project-modal.module.css';
import { useProject } from '@/context/project-context';
import { X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateCustomNodeModal({ isOpen, onClose }: Props) {
  const { customNodeTypes, addCustomNodeType } = useProject();
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setName('');
      setError('');
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return setError('Name required');
    if (customNodeTypes.some((n: { name: string }) => n.name === trimmed))
      return setError('Name already exists');
    addCustomNodeType({ name: trimmed });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>New Custom Node</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <form className={styles.content} onSubmit={handleSubmit}>
          <div className={styles.inputContainer}>
            <input
              ref={inputRef}
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Unique node name"
              className={styles.input}
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button className={styles.submitButton} type="submit">
            Create
          </button>
        </form>
      </div>
    </div>
  );
}
