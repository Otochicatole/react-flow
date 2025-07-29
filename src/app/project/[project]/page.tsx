'use client'
import {
    Background,
    BackgroundVariant,
    Controls,
    MiniMap,
    ReactFlow,
    type Node,
    type Edge
  } from '@xyflow/react';
  import '@xyflow/react/dist/style.css';
  import { useState, useCallback } from 'react';
  import { useNodes } from '@/context/nodes-context';
  import { Aside } from '@/components/layout/aside';
  import { ProjectHeader } from '@/components/layout/project-header';
  import { ContextMenu } from '@/components/common/context-menu';
  import styles from '@/components/styles/project-page.module.css';
  import { DragDropHandler } from '@/components/common/drag-drop-handler';
  
  export default function Project() {
    const {
      nodes,
      edges,
      onNodesChange,
      onEdgesChange,
      onConnect,
      nodeTypes,
      deleteNode,
      deleteEdge,
      updateNodeLabel
    } = useNodes();

    const [contextMenu, setContextMenu] = useState<{
      isOpen: boolean;
      position: { x: number; y: number };
      selectedNode?: Node | null;
      selectedEdge?: Edge | null;
    }>({
      isOpen: false,
      position: { x: 0, y: 0 },
      selectedNode: null,
      selectedEdge: null
    });

    const handleNodeContextMenu = useCallback((event: React.MouseEvent, node: Node) => {
      event.preventDefault();
      setContextMenu({
        isOpen: true,
        position: { x: event.clientX, y: event.clientY },
        selectedNode: node,
        selectedEdge: null
      });
    }, []);

    const handleEdgeContextMenu = useCallback((event: React.MouseEvent, edge: Edge) => {
      event.preventDefault();
      setContextMenu({
        isOpen: true,
        position: { x: event.clientX, y: event.clientY },
        selectedNode: null,
        selectedEdge: edge
      });
    }, []);

    const handlePaneContextMenu = useCallback((event: React.MouseEvent | MouseEvent) => {
      event.preventDefault();
      setContextMenu({
        isOpen: false,
        position: { x: 0, y: 0 },
        selectedNode: null,
        selectedEdge: null
      });
    }, []);

    const closeContextMenu = useCallback(() => {
      setContextMenu(prev => ({ ...prev, isOpen: false }));
    }, []);

    return (
      <div className={styles.pageContainer}>
        <ProjectHeader />
        
        <div className={styles.container}>
          <Aside />
          <div className={styles.reactFlowWrapper}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              onNodeContextMenu={handleNodeContextMenu}
              onEdgeContextMenu={handleEdgeContextMenu}
              onPaneContextMenu={handlePaneContextMenu}
              fitView
              fitViewOptions={{
                padding: 0.2,
              }}
            >
              <Controls />
              <MiniMap />
              <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
              <DragDropHandler />
            </ReactFlow>
            
            <ContextMenu
              isOpen={contextMenu.isOpen}
              position={contextMenu.position}
              selectedNode={contextMenu.selectedNode}
              selectedEdge={contextMenu.selectedEdge}
              onClose={closeContextMenu}
              onDeleteNode={deleteNode}
              onDeleteEdge={deleteEdge}
              onEditNodeLabel={updateNodeLabel}
            />
          </div>
        </div>
      </div>
    );
  }
  