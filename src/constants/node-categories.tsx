/**
 * node-categories.tsx
 * -----------------
 * Define las categorías y tipos de nodos disponibles.
 * Cada categoría agrupa nodos relacionados funcionalmente.
 * 
 * Estructura:
 * - Categoría
 *   • id: identificador único
 *   • label: nombre para mostrar
 *   • icon: ícono de Lucide
 *   • description: descripción corta
 *   • nodes: array de nodos
 *     - type: tipo interno
 *     - label: nombre para mostrar
 *     - icon: ícono de Lucide
 *     - description: descripción corta
 *     - color: color de acento
 */

import {
  // Íconos de dominio
  Zap,           // Eventos
  Send,          // Comandos
  Search,        // Queries
  Database,      // Almacenamiento
  Cog,           // Servicios
  MessageSquare, // Bus de mensajes
  Layers,        // Procesos
  
  // Íconos de flujo
  Play,          // Inicio
  Diamond,       // Decisión
  Square,        // Fin/IO
  FileText,      // Documento
  Circle,        // Conector
  
  // Íconos especiales
  Cpu,           // Compuertas
  Calendar,      // Gantt
  Type           // Input
} from 'lucide-react';
import type { NodeCategory } from '@/types';

/**
 * Categorías de nodos disponibles.
 * Cada categoría tiene su propia sección en el sidebar.
 */
export const NODE_CATEGORIES: NodeCategory[] = [
  /**
   * Event-Driven Architecture
   * -----------------------
   * Nodos para arquitecturas CQRS y DDD.
   * Enfoque en eventos, comandos y agregados.
   */
  {
    id: 'event-driven',
    label: 'Event-Driven Architecture',
    icon: <Zap size={18} />,
    description: 'CQRS, Event Sourcing & DDD components',
    nodes: [
      // Eventos del dominio
      {
        type: 'event',
        label: 'Event',
        icon: <Zap size={18} />,
        description: 'Domain events that represent something that happened',
        color: '#10b981' // Emerald
      },
      // Comandos/acciones
      {
        type: 'command',
        label: 'Command',
        icon: <Send size={18} />,
        description: 'Actions that should be performed in the system',
        color: '#3b82f6' // Blue
      },
      // Consultas
      {
        type: 'query',
        label: 'Query',
        icon: <Search size={18} />,
        description: 'Read operations to retrieve data from the system',
        color: '#8b5cf6' // Purple
      },
      // Agregados DDD
      {
        type: 'aggregate',
        label: 'Aggregate',
        icon: <Database size={18} />,
        description: 'Business logic containers that ensure consistency',
        color: '#f59e0b' // Amber
      },
      // Servicios
      {
        type: 'service',
        label: 'Service',
        icon: <Cog size={18} />,
        description: 'Application services that orchestrate business logic',
        color: '#ef4444' // Red
      },
      // Bus de mensajes
      {
        type: 'messageBus',
        label: 'Message Bus',
        icon: <MessageSquare size={18} />,
        description: 'Communication infrastructure for events and commands',
        color: '#06b6d4' // Cyan
      },
      // Procesos anidados
      {
        type: 'process',
        label: 'Process',
        icon: <Layers size={18} />,
        description: 'Nested process container for complex workflows',
        color: '#14b8a6' // Teal
      }
    ]
  },
  /**
   * Flowchart
   * ---------
   * Nodos tradicionales de diagramas de flujo.
   * Elementos básicos para cualquier diagrama.
   */
  {
    id: 'flowchart',
    label: 'Flowchart',
    icon: <Diamond size={18} />,
    description: 'Traditional flowchart elements',
    nodes: [
      // Inicio de flujo
      {
        type: 'start',
        label: 'Start',
        icon: <Play size={18} />,
        description: 'Beginning point of process flow',
        color: '#34d399' // Emerald
      },
      // Fin de flujo
      {
        type: 'end',
        label: 'End',
        icon: <Square size={18} />,
        description: 'Termination point of process flow',
        color: '#ef4444' // Red
      },
      // Punto de decisión
      {
        type: 'decision',
        label: 'Decision',
        icon: <Diamond size={18} />,
        description: 'Conditional branching point',
        color: '#fbbf24' // Amber
      },
      // Entrada/Salida
      {
        type: 'inputOutput',
        label: 'Input/Output',
        icon: <Square size={18} />,
        description: 'Data input or output operation',
        color: '#a78bfa' // Purple
      },
      // Documento
      {
        type: 'document',
        label: 'Document',
        icon: <FileText size={18} />,
        description: 'Document or report generation',
        color: '#94a3b8' // Gray
      },
      // Base de datos
      {
        type: 'database',
        label: 'Database',
        icon: <Database size={18} />,
        description: 'Data storage or retrieval',
        color: '#fb7185' // Rose
      },
      // Conector
      {
        type: 'connector',
        label: 'Connector',
        icon: <Circle size={18} />,
        description: 'Junction point for multiple flows',
        color: '#6b7280' // Gray
      },
      // Input de texto
      {
        type: 'textInput',
        label: 'Text Input',
        icon: <Type size={18} />,
        description: 'Generic text input field',
        color: '#22d3ee' // Cyan
      }
    ]
  },
  /**
   * Logic Gates
   * -----------
   * Compuertas lógicas para operaciones booleanas.
   * Todas usan el mismo color para consistencia visual.
   */
  {
    id: 'logic-gates',
    label: 'Logic Gates',
    icon: <Cpu size={18} />,
    description: 'Boolean logic operations',
    nodes: [
      // AND: todas las entradas verdaderas
      {
        type: 'andGate',
        label: 'AND Gate',
        icon: <Cpu size={18} />,
        description: 'Logical AND operation',
        color: '#60a5fa' // Blue
      },
      // OR: al menos una entrada verdadera
      {
        type: 'orGate',
        label: 'OR Gate',
        icon: <Cpu size={18} />,
        description: 'Logical OR operation',
        color: '#60a5fa' // Blue
      },
      // XOR: exactamente una entrada verdadera
      {
        type: 'xorGate',
        label: 'XOR Gate',
        icon: <Cpu size={18} />,
        description: 'Exclusive OR operation',
        color: '#60a5fa' // Blue
      },
      // NOT: inversión de entrada
      {
        type: 'notGate',
        label: 'NOT Gate',
        icon: <Cpu size={18} />,
        description: 'Logical NOT operation',
        color: '#60a5fa' // Blue
      }
    ]
  },
  /**
   * Project Management
   * ----------------
   * Elementos para gestión de proyectos.
   * Enfoque en tareas y seguimiento.
   */
  {
    id: 'gantt',
    label: 'Project Management',
    icon: <Calendar size={18} />,
    description: 'Gantt chart and project elements',
    nodes: [
      // Tarea con progreso
      {
        type: 'task',
        label: 'Task',
        icon: <Calendar size={18} />,
        description: 'Project task with progress tracking',
        color: '#14b8a6' // Teal
      },
      // Hito importante
      {
        type: 'milestone',
        label: 'Milestone',
        icon: <Diamond size={18} />,
        description: 'Important project milestone',
        color: '#f97316' // Orange
      }
    ]
  }
];