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
  import { useState, useCallback, useEffect } from 'react';
  import { useCanvas } from '@/hooks/useCanvas';
  import { Aside } from '@/components/layout/aside';
  import { ProjectHeader } from '@/components/layout/project-header';
  import { ProcessBreadcrumbs } from '@/components/layout/process-breadcrumbs';
  import { ContextMenu } from '@/components/common/context-menu';
  import styles from '@/components/styles/project-page.module.css';
  import { DragDropHandler } from '@/components/common/drag-drop-handler';
  import { useParams } from 'next/navigation';
  import { useProject } from '@/context/project-context';
  import { CustomNodeUsageModal } from '@/components/common/custom-node-usage-modal';
  import type { FlowData } from '@/context/project-store';
  
  export default function Project() {
    const { selectProject, currentProject, projects } = useProject();
    const params = useParams<{ project: string }>();
    const projectId = params.project;

    // ensure correct project selected on refresh
    useEffect(() => {
      if (
        projectId &&
        projects.length > 0 &&
        (!currentProject || currentProject.id !== projectId)
      ) {
        selectProject(projectId);
      }
    }, [projectId, projects, currentProject, selectProject]);

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
    } = useCanvas();

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

    type Usage = { path: string; dir: 'in' | 'out'; idPath: string[] };
    const [usageModal, setUsageModal] = useState<{isOpen:boolean; nodeName:string; usages:Usage[]}>({isOpen:false,nodeName:'',usages:[]});

    useEffect(() => {
      const handler = (e: CustomEvent<{ nodeName: string }>) => {
        if (!currentProject) return;
        const targetName = e.detail.nodeName;
        const usages: Usage[] = [];

        const traverse = (flow: FlowData, breadcrumb: string[], idBreadcrumb: string[]) => {
          let foundInCurrent = false;
          let inDir: 'in' | 'out' | null = null;

          flow.nodes.forEach(n => {
            if (n.type === 'custom' && (n.data as { customName?: string }).customName === targetName) {
              foundInCurrent = true;
              const id = n.id;
              const hasIn = edges.some(ed => ed.target === id);
              const hasOut = edges.some(ed => ed.source === id);
              if (hasIn && !hasOut) inDir = 'in';
              else if (!hasIn && hasOut) inDir = 'out';
              else inDir = 'in';
            }
          });

          if (foundInCurrent && inDir) usages.push({ path: breadcrumb.join(' > '), dir: inDir, idPath: idBreadcrumb });

          Object.values(flow.processes).forEach(proc => {
            const p = proc as FlowData & { id: string; name: string };
            traverse(p, [...breadcrumb, p.name], [...idBreadcrumb, p.id]);
          });
        };

        traverse(currentProject, [currentProject.name], []);
        setUsageModal({ isOpen: true, nodeName: targetName, usages });
      };

      window.addEventListener('customnode:dblclick', handler as EventListener);
      return () => {
        window.removeEventListener('customnode:dblclick', handler as EventListener);
      };
    }, [currentProject, edges]);

    const { navigateToRoot, enterProcess } = useProject();

    const handleUsageSelect = (idPath: string[]) => {
      navigateToRoot();
      idPath.forEach(id => enterProcess(id));
      setUsageModal(prev => ({ ...prev, isOpen: false }));
    };

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
        <ProcessBreadcrumbs />
        
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
            <CustomNodeUsageModal isOpen={usageModal.isOpen} nodeName={usageModal.nodeName} usages={usageModal.usages} onClose={() => setUsageModal(prev=>({...prev,isOpen:false}))} onSelect={handleUsageSelect} />
          </div>
        </div>
      </div>
    );
  }
  