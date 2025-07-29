'use client'
import { useState, useEffect, useRef } from 'react';
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
}

export function ContextMenu({
  isOpen,
  position,
  onClose,
  selectedNode,
  selectedEdge,
  onDeleteNode,
  onDeleteEdge,
  onEditNodeLabel
}: ContextMenuProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editLabel, setEditLabel] = useState('');
  const [adjustedPosition, setAdjustedPosition] = useState(position);
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Adjust position to keep menu within viewport bounds
  useEffect(() => {
    if (isOpen && menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      let newX = position.x;
      let newY = position.y;
      
      // Check if menu goes beyond right edge
      if (position.x + rect.width > viewportWidth) {
        newX = viewportWidth - rect.width - 10; // 10px margin
      }
      
      // Check if menu goes beyond bottom edge
      if (position.y + rect.height > viewportHeight) {
        newY = viewportHeight - rect.height - 10; // 10px margin
      }
      
      // Ensure menu doesn't go beyond left or top edges
      newX = Math.max(10, newX);
      newY = Math.max(10, newY);
      
      setAdjustedPosition({ x: newX, y: newY });
    } else {
      setAdjustedPosition(position);
    }
  }, [isOpen, position]);

  useEffect(() => {
    if (selectedNode && isEditing) {
      setEditLabel(String(selectedNode.data.label || ''));
    }
  }, [selectedNode, isEditing]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as HTMLElement)) {
        onClose();
        setIsEditing(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
        setIsEditing(false);
      }
    }

    if (isOpen) {
      // Add a small delay to prevent the opening click from immediately closing the menu
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
  }, [isOpen, onClose]);

  const handleEditClick = () => {
    if (selectedNode) {
      setIsEditing(true);
    }
  };

  const handleLabelSubmit = () => {
    if (selectedNode && onEditNodeLabel && editLabel.trim()) {
      onEditNodeLabel(selectedNode.id, editLabel.trim());
      setIsEditing(false);
      onClose();
    }
  };

  const handleLabelKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
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
              <input
                ref={inputRef}
                type="text"
                value={editLabel}
                onChange={(e) => setEditLabel(e.target.value)}
                onKeyDown={handleLabelKeyDown}
                onBlur={handleLabelSubmit}
                className={styles.editInput}
                placeholder="Node name..."
              />
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
        <button
          className={styles.menuItem}
          onClick={handleDeleteEdge}
        >
          <Trash2 size={16} />
          <span>Delete Connection</span>
        </button>
      )}
    </div>
  );
} 