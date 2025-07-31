'use client'
import { useCallback, useEffect } from 'react';
import { useReactFlow } from '@xyflow/react';
import { useCanvas } from '@/hooks/useCanvas';

export function DragDropHandler() {
  const { screenToFlowPosition } = useReactFlow();
  const { addNode } = useCanvas();

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }, []);

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();

      if (!event.dataTransfer) return;

      const nodeType = event.dataTransfer.getData('application/reactflow');

      if (typeof nodeType === 'undefined' || !nodeType) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const centeredPosition = {
        x: position.x,
        y: position.y
      };

      addNode(nodeType, centeredPosition);
    },
    [screenToFlowPosition, addNode],
  );

  useEffect(() => {

    document.addEventListener('dragover', onDragOver);
    document.addEventListener('drop', onDrop);

    return () => {
      document.removeEventListener('dragover', onDragOver);
      document.removeEventListener('drop', onDrop);
    };
  }, [onDragOver, onDrop]);

  return null;
} 