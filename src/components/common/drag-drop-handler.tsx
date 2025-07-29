'use client'
import { useCallback, useEffect } from 'react';
import { useReactFlow } from '@xyflow/react';
import { useNodes } from '@/context/nodes-context';

export function DragDropHandler() {
  const { screenToFlowPosition, getViewport } = useReactFlow();
  const { addNode } = useNodes();

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

      // Check if the dropped element is a valid node type
      if (typeof nodeType === 'undefined' || !nodeType) {
        return;
      }

      // Use screenToFlowPosition directly - it handles all transformations automatically
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      // Center the node on the cursor position (approximate node size: 100x60)
      const centeredPosition = {
        x: position.x - 50, // half of node width
        y: position.y - 30, // half of node height
      };

      addNode(nodeType, centeredPosition);
    },
    [screenToFlowPosition, addNode],
  );

  useEffect(() => {
    // Add event listeners to the document for drag and drop
    document.addEventListener('dragover', onDragOver);
    document.addEventListener('drop', onDrop);

    return () => {
      document.removeEventListener('dragover', onDragOver);
      document.removeEventListener('drop', onDrop);
    };
  }, [onDragOver, onDrop]);

  // This component doesn't render anything, it just handles events
  return null;
} 