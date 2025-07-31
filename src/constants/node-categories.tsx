import {
  Zap,
  Send,
  Search,
  Database,
  Cog,
  MessageSquare,
  Layers,
  Play,
  Diamond,
  Square,
  FileText,
  Circle,
  Cpu,
  Calendar,
  Type
} from 'lucide-react';
import type { NodeCategory } from '@/types';

export const NODE_CATEGORIES: NodeCategory[] = [
  {
    id: 'event-driven',
    label: 'Event-Driven Architecture',
    icon: <Zap size={18} />,
    description: 'CQRS, Event Sourcing & DDD components',
    nodes: [
      {
        type: 'event',
        label: 'Event',
        icon: <Zap size={18} />,
        description: 'Domain events that represent something that happened',
        color: '#10b981'
      },
      {
        type: 'command',
        label: 'Command',
        icon: <Send size={18} />,
        description: 'Actions that should be performed in the system',
        color: '#3b82f6'
      },
      {
        type: 'query',
        label: 'Query',
        icon: <Search size={18} />,
        description: 'Read operations to retrieve data from the system',
        color: '#8b5cf6'
      },
      {
        type: 'aggregate',
        label: 'Aggregate',
        icon: <Database size={18} />,
        description: 'Business logic containers that ensure consistency',
        color: '#f59e0b'
      },
      {
        type: 'service',
        label: 'Service',
        icon: <Cog size={18} />,
        description: 'Application services that orchestrate business logic',
        color: '#ef4444'
      },
      {
        type: 'messageBus',
        label: 'Message Bus',
        icon: <MessageSquare size={18} />,
        description: 'Communication infrastructure for events and commands',
        color: '#06b6d4'
      },
      {
        type: 'process',
        label: 'Process',
        icon: <Layers size={18} />,
        description: 'Nested process container for complex workflows',
        color: '#14b8a6'
      }
    ]
  },
  {
    id: 'flowchart',
    label: 'Flowchart',
    icon: <Diamond size={18} />,
    description: 'Traditional flowchart elements',
    nodes: [
      {
        type: 'start',
        label: 'Start',
        icon: <Play size={18} />,
        description: 'Beginning point of process flow',
        color: '#34d399'
      },
      {
        type: 'end',
        label: 'End',
        icon: <Square size={18} />,
        description: 'Termination point of process flow',
        color: '#ef4444'
      },
      {
        type: 'decision',
        label: 'Decision',
        icon: <Diamond size={18} />,
        description: 'Conditional branching point',
        color: '#fbbf24'
      },
      {
        type: 'inputOutput',
        label: 'Input/Output',
        icon: <Square size={18} />,
        description: 'Data input or output operation',
        color: '#a78bfa'
      },
      {
        type: 'document',
        label: 'Document',
        icon: <FileText size={18} />,
        description: 'Document or report generation',
        color: '#94a3b8'
      },
      {
        type: 'database',
        label: 'Database',
        icon: <Database size={18} />,
        description: 'Data storage or retrieval',
        color: '#fb7185'
      },
      {
        type: 'connector',
        label: 'Connector',
        icon: <Circle size={18} />,
        description: 'Junction point for multiple flows',
        color: '#6b7280'
      },
      {
        type: 'textInput',
        label: 'Text Input',
        icon: <Type size={18} />,
        description: 'Generic text input field',
        color: '#22d3ee'
      }
    ]
  },
  {
    id: 'logic-gates',
    label: 'Logic Gates',
    icon: <Cpu size={18} />,
    description: 'Boolean logic operations',
    nodes: [
      {
        type: 'andGate',
        label: 'AND Gate',
        icon: <Cpu size={18} />,
        description: 'Logical AND operation',
        color: '#60a5fa'
      },
      {
        type: 'orGate',
        label: 'OR Gate',
        icon: <Cpu size={18} />,
        description: 'Logical OR operation',
        color: '#60a5fa'
      },
      {
        type: 'xorGate',
        label: 'XOR Gate',
        icon: <Cpu size={18} />,
        description: 'Exclusive OR operation',
        color: '#60a5fa'
      },
      {
        type: 'notGate',
        label: 'NOT Gate',
        icon: <Cpu size={18} />,
        description: 'Logical NOT operation',
        color: '#60a5fa'
      }
    ]
  },
  {
    id: 'gantt',
    label: 'Project Management',
    icon: <Calendar size={18} />,
    description: 'Gantt chart and project elements',
    nodes: [
      {
        type: 'task',
        label: 'Task',
        icon: <Calendar size={18} />,
        description: 'Project task with progress tracking',
        color: '#14b8a6'
      },
      {
        type: 'milestone',
        label: 'Milestone',
        icon: <Diamond size={18} />,
        description: 'Important project milestone',
        color: '#f97316'
      }
    ]
  }
];