'use client'
import { useState, useEffect, useRef, useCallback } from 'react';
import { Edit3, Trash2 } from 'lucide-react';
import { type Node, type Edge } from '@xyflow/react';
import styles from '@/components/styles/context-menu.module.css';

export interface ContextMenuProps {
  isOpen: boolean;
  position: { x: number; y: number };
  onClose: () => void;
  selectedNode?: Node | null;
  selectedEdge?: Edge | null;
  onDeleteNode?: (nodeId: string) => void;
  onDeleteEdge?: (edgeId: string) => void;
  onEditNodeLabel?: (nodeId: string, newLabel: string) => void;
  onEditEdgeLabel?: (edgeId: string, newLabel: string) => void;
}

export function ContextMenu({
  isOpen,
  position,
  onClose,
  selectedNode,
  selectedEdge,
  onDeleteNode,
  onDeleteEdge,
  onEditNodeLabel,
  onEditEdgeLabel
}: ContextMenuProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editLabel, setEditLabel] = useState('');
  const [adjustedPosition, setAdjustedPosition] = useState(position);
  const menuRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen && menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      let newX = position.x;
      let newY = position.y;

      if (position.x + rect.width > viewportWidth) {

      }

      if (position.y + rect.height > viewportHeight) {

      }

      newX = Math.max(10, newX);
      newY = Math.max(10, newY);
      
      setAdjustedPosition({ x: newX, y: newY });
    } else {
      setAdjustedPosition(position);
    }
  }, [isOpen, position]);

  useEffect(() => {
    if (isEditing) {
      if (selectedNode) {
        setEditLabel(String(selectedNode.data.label || ''));
      } else if (selectedEdge) {
        setEditLabel(String(selectedEdge.label || ''));
      }
    }
  }, [selectedNode, selectedEdge, isEditing]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();

      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [isEditing]);

  useEffect(() => {
    if (isOpen) {
      const label = selectedNode?.data?.label || selectedEdge?.label || '';
      setEditLabel(String(label));
      setIsEditing(false);
    } else {
      setIsEditing(false);
      setEditLabel('');
    }
  }, [isOpen, selectedNode, selectedEdge]);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditLabel(e.target.value);

    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  };

  const handleLabelSubmit = useCallback(() => {
    if (selectedNode && onEditNodeLabel) {

      onEditNodeLabel(selectedNode.id, editLabel.trim());
    } else if (selectedEdge && onEditEdgeLabel) {

      onEditEdgeLabel(selectedEdge.id, editLabel.trim());
    }
    setIsEditing(false);
    onClose();
  }, [selectedNode, selectedEdge, onEditNodeLabel, onEditEdgeLabel, editLabel, onClose]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as HTMLElement)) {

        if (isEditing) {
          handleLabelSubmit();
        } else {
          onClose();
        }
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        if (isEditing) {
          setIsEditing(false);
        } else {
          onClose();
        }
      }
    }

    if (isOpen) {

      const timeoutId = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside, { capture: true });
        document.addEventListener('keydown', handleEscape);
      }, 100);

      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener('mousedown', handleClickOutside, { capture: true });
        document.removeEventListener('keydown', handleEscape);
      };
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside, { capture: true });
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose, isEditing, handleLabelSubmit]);

  const handleEditClick = () => {
    if (selectedNode) {
      setIsEditing(true);
    } else if (selectedEdge) {
      setIsEditing(true);
    }
  };

  const handleLabelKeyDown = (event: React.KeyboardEvent) => {

    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      handleLabelSubmit();
    } else if (event.key === 'Escape') {
      setIsEditing(false);
    }

  };

  const handleDeleteNode = () => {
    if (selectedNode && onDeleteNode) {
      onDeleteNode(selectedNode.id);
      onClose();
    }
  };

  const handleDeleteEdge = () => {
    if (selectedEdge && onDeleteEdge) {
      onDeleteEdge(selectedEdge.id);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className={styles.contextMenu}
      style={{
        left: adjustedPosition.x,
        top: adjustedPosition.y,
      }}
    >
      {selectedNode && (
        <>
          {isEditing ? (
            <div className={styles.editContainer}>
              <textarea
                ref={textareaRef}
                value={editLabel}
                onChange={handleTextareaChange}
                onKeyDown={handleLabelKeyDown}
                onBlur={handleLabelSubmit}
                className={styles.editTextarea}
                placeholder="Node name...&#10;(Ctrl+Enter to save)"
                rows={1}
              />
              <div className={styles.editHint}>
                Ctrl+Enter to save, Esc to cancel
              </div>
            </div>
          ) : (
            <button
              className={styles.menuItem}
              onClick={handleEditClick}
            >
              <Edit3 size={16} />
              <span>Edit Name</span>
            </button>
          )}
          <button
            className={styles.menuItem}
            onClick={handleDeleteNode}
          >
            <Trash2 size={16} />
            <span>Delete Node</span>
          </button>
        </>
      )}

      {selectedEdge && (
        <>
          {isEditing ? (
            <div className={styles.editContainer}>
              <textarea
                ref={textareaRef}
                value={editLabel}
                onChange={handleTextareaChange}
                onKeyDown={handleLabelKeyDown}
                onBlur={handleLabelSubmit}
                className={styles.editTextarea}
                placeholder="Connection label...&#10;(Ctrl+Enter to save)"
                rows={1}
              />
              <div className={styles.editHint}>
                Ctrl+Enter to save, Esc to cancel
              </div>
            </div>
          ) : (
            <button
              className={styles.menuItem}
              onClick={handleEditClick}
            >
              <Edit3 size={16} />
              <span>{selectedEdge.label ? 'Edit Label' : 'Add Label'}</span>
            </button>
          )}
          <button
            className={styles.menuItem}
            onClick={handleDeleteEdge}
          >
            <Trash2 size={16} />
            <span>Delete Connection</span>
          </button>
        </>
      )}
    </div>
  );
} 