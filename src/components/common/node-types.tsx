import { Handle, Position } from '@xyflow/react';
import { 
  Play, 
  Square, 
  Diamond, 
  FileText, 
  Database, 
  Circle,
  Zap,
  Plus,
  X,
  Minus,
  Type
} from 'lucide-react';
import styles from '@/components/styles/node-types.module.css';

interface BaseNodeProps {
  data: {
    label: string;
  };
  selected?: boolean;
}

// Event Node - triggers in the system
export function EventNode({ data, selected }: BaseNodeProps) {
  return (
    <div className={`${styles.node} ${styles.eventNode} ${selected ? styles.nodeSelected : ''}`}>
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className={`${styles.handle} ${styles.handleSource}`}
      />
      <div className={styles.nodeIcon}>📢</div>
      <div className={styles.label}>{data.label}</div>
    </div>
  );
}

// Command Node - actions to execute
export function CommandNode({ data, selected }: BaseNodeProps) {
  return (
    <div className={`${styles.node} ${styles.commandNode} ${selected ? styles.nodeSelected : ''}`}>
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className={`${styles.handle} ${styles.handleTarget}`}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className={`${styles.handle} ${styles.handleSource}`}
      />
      <div className={styles.nodeIcon}>⚡</div>
      <div className={styles.label}>{data.label}</div>
    </div>
  );
}

// Query Node - data retrieval
export function QueryNode({ data, selected }: BaseNodeProps) {
  return (
    <div className={`${styles.node} ${styles.queryNode} ${selected ? styles.nodeSelected : ''}`}>
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className={`${styles.handle} ${styles.handleTarget}`}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className={`${styles.handle} ${styles.handleSource}`}
      />
      <div className={styles.nodeIcon}>🔍</div>
      <div className={styles.label}>{data.label}</div>
    </div>
  );
}

// Aggregate Node - domain entities
export function AggregateNode({ data, selected }: BaseNodeProps) {
  return (
    <div className={`${styles.node} ${styles.aggregateNode} ${selected ? styles.nodeSelected : ''}`}>
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        className={`${styles.handle} ${styles.handleTarget}`}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className={`${styles.handle} ${styles.handleSource}`}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className={`${styles.handle} ${styles.handleTarget}`}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className={`${styles.handle} ${styles.handleSource}`}
      />
      <div className={styles.nodeIcon}>🏛️</div>
      <div className={styles.label}>{data.label}</div>
    </div>
  );
}

// Service Node - application services
export function ServiceNode({ data, selected }: BaseNodeProps) {
  return (
    <div className={`${styles.node} ${styles.serviceNode} ${selected ? styles.nodeSelected : ''}`}>
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        className={`${styles.handle} ${styles.handleTarget}`}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className={`${styles.handle} ${styles.handleSource}`}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className={`${styles.handle} ${styles.handleTarget}`}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className={`${styles.handle} ${styles.handleSource}`}
      />
      <div className={styles.nodeIcon}>⚙️</div>
      <div className={styles.label}>{data.label}</div>
    </div>
  );
}

// Message Bus Node - communication channels
export function MessageBusNode({ data, selected }: BaseNodeProps) {
  return (
    <div className={`${styles.node} ${styles.messageBusNode} ${selected ? styles.nodeSelected : ''}`}>
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        className={`${styles.handle} ${styles.handleTarget}`}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className={`${styles.handle} ${styles.handleSource}`}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className={`${styles.handle} ${styles.handleTarget}`}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className={`${styles.handle} ${styles.handleSource}`}
      />
      <div className={styles.nodeIcon}>🚌</div>
      <div className={styles.label}>{data.label}</div>
    </div>
  );
}

// === FLOWCHART NODES ===

// Start/End Node - terminal points
export function StartEndNode({ data, selected }: BaseNodeProps) {
  return (
    <div className={`${styles.node} ${styles.startEndNode} ${selected ? styles.nodeSelected : ''}`}>
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className={`${styles.handle} ${styles.handleSource}`}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className={`${styles.handle} ${styles.handleTarget}`}
      />
      <div className={styles.nodeIcon}>
        <Play size={16} />
      </div>
      <div className={styles.label}>{data.label}</div>
    </div>
  );
}

// Decision Node - conditional branching
export function DecisionNode({ data, selected }: BaseNodeProps) {
  return (
    <div className={`${styles.node} ${styles.decisionNode} ${selected ? styles.nodeSelected : ''}`}>
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        className={`${styles.handle} ${styles.handleTarget}`}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className={`${styles.handle} ${styles.handleSource}`}
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left"
        className={`${styles.handle} ${styles.handleSource}`}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className={`${styles.handle} ${styles.handleSource}`}
      />
      <div className={styles.label}>{data.label}</div>
    </div>
  );
}

// Input/Output Node - data flow
export function InputOutputNode({ data, selected }: BaseNodeProps) {
  return (
    <div className={`${styles.node} ${styles.inputOutputNode} ${selected ? styles.nodeSelected : ''}`}>
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className={`${styles.handle} ${styles.handleTarget}`}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className={`${styles.handle} ${styles.handleSource}`}
      />
      <div className={styles.nodeIcon}>
        <Square size={16} />
      </div>
      <div className={styles.label}>{data.label}</div>
    </div>
  );
}

// Text Input Node - generic text input
export function TextInputNode({ data, selected }: BaseNodeProps) {
  return (
    <div className={`${styles.node} ${styles.textInputNode} ${selected ? styles.nodeSelected : ''}`}>
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className={`${styles.handle} ${styles.handleTarget}`}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className={`${styles.handle} ${styles.handleSource}`}
      />
      <div className={styles.nodeIcon}>
        <Type size={16} />
      </div>
      <div className={styles.label}>{data.label}</div>
    </div>
  );
}

// Document Node - documentation
export function DocumentNode({ data, selected }: BaseNodeProps) {
  return (
    <div className={`${styles.node} ${styles.documentNode} ${selected ? styles.nodeSelected : ''}`}>
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        className={`${styles.handle} ${styles.handleTarget}`}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className={`${styles.handle} ${styles.handleSource}`}
      />
      <div className={styles.nodeIcon}>
        <FileText size={16} />
      </div>
      <div className={styles.label}>{data.label}</div>
    </div>
  );
}

// Database Node - data storage
export function DatabaseNode({ data, selected }: BaseNodeProps) {
  return (
    <div className={`${styles.node} ${styles.databaseNode} ${selected ? styles.nodeSelected : ''}`}>
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        className={`${styles.handle} ${styles.handleTarget}`}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className={`${styles.handle} ${styles.handleSource}`}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className={`${styles.handle} ${styles.handleTarget}`}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className={`${styles.handle} ${styles.handleSource}`}
      />
      <div className={styles.nodeIcon}>
        <Database size={16} />
      </div>
      <div className={styles.label}>{data.label}</div>
    </div>
  );
}

// Connector Node - junction point
export function ConnectorNode({ data, selected }: BaseNodeProps) {
  return (
    <div className={`${styles.node} ${styles.connectorNode} ${selected ? styles.nodeSelected : ''}`}>
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        className={`${styles.handle} ${styles.handleTarget}`}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className={`${styles.handle} ${styles.handleSource}`}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className={`${styles.handle} ${styles.handleTarget}`}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className={`${styles.handle} ${styles.handleSource}`}
      />
      <div className={styles.nodeIcon}>
        <Circle size={8} />
      </div>
    </div>
  );
}

// === LOGIC GATE NODES ===

// AND Gate
export function AndGateNode({ data, selected }: BaseNodeProps) {
  return (
    <div className={`${styles.node} ${styles.logicGateNode} ${styles.andGate} ${selected ? styles.nodeSelected : ''}`}>
      <Handle
        type="target"
        position={Position.Left}
        id="input1"
        className={`${styles.handle} ${styles.handleTarget}`}
        style={{ top: '30%' }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="input2"
        className={`${styles.handle} ${styles.handleTarget}`}
        style={{ top: '70%' }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className={`${styles.handle} ${styles.handleSource}`}
      />
      <div className={styles.logicGateLabel}>AND</div>
      <div className={styles.label}>{data.label}</div>
    </div>
  );
}

// OR Gate
export function OrGateNode({ data, selected }: BaseNodeProps) {
  return (
    <div className={`${styles.node} ${styles.logicGateNode} ${styles.orGate} ${selected ? styles.nodeSelected : ''}`}>
      <Handle
        type="target"
        position={Position.Left}
        id="input1"
        className={`${styles.handle} ${styles.handleTarget}`}
        style={{ top: '30%' }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="input2"
        className={`${styles.handle} ${styles.handleTarget}`}
        style={{ top: '70%' }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className={`${styles.handle} ${styles.handleSource}`}
      />
      <div className={styles.logicGateLabel}>OR</div>
      <div className={styles.label}>{data.label}</div>
    </div>
  );
}

// XOR Gate
export function XorGateNode({ data, selected }: BaseNodeProps) {
  return (
    <div className={`${styles.node} ${styles.logicGateNode} ${styles.xorGate} ${selected ? styles.nodeSelected : ''}`}>
      <Handle
        type="target"
        position={Position.Left}
        id="input1"
        className={`${styles.handle} ${styles.handleTarget}`}
        style={{ top: '30%' }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="input2"
        className={`${styles.handle} ${styles.handleTarget}`}
        style={{ top: '70%' }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className={`${styles.handle} ${styles.handleSource}`}
      />
      <div className={styles.logicGateLabel}>XOR</div>
      <div className={styles.label}>{data.label}</div>
    </div>
  );
}

// NOT Gate
export function NotGateNode({ data, selected }: BaseNodeProps) {
  return (
    <div className={`${styles.node} ${styles.logicGateNode} ${styles.notGate} ${selected ? styles.nodeSelected : ''}`}>
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        className={`${styles.handle} ${styles.handleTarget}`}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className={`${styles.handle} ${styles.handleSource}`}
      />
      <div className={styles.nodeIcon}>
        <X size={16} />
      </div>
      <div className={styles.logicGateLabel}>NOT</div>
      <div className={styles.label}>{data.label}</div>
    </div>
  );
}

// === GANTT NODES ===

// Task Node - gantt task
export function TaskNode({ data, selected }: BaseNodeProps) {
  return (
    <div className={`${styles.node} ${styles.taskNode} ${selected ? styles.nodeSelected : ''}`}>
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className={`${styles.handle} ${styles.handleTarget}`}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className={`${styles.handle} ${styles.handleSource}`}
      />
      <div className={styles.taskBar}>
        <div className={styles.taskProgress}></div>
      </div>
      <div className={styles.label}>{data.label}</div>
    </div>
  );
}

// Milestone Node - project milestone
export function MilestoneNode({ data, selected }: BaseNodeProps) {
  return (
    <div className={`${styles.node} ${styles.milestoneNode} ${selected ? styles.nodeSelected : ''}`}>
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className={`${styles.handle} ${styles.handleTarget}`}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className={`${styles.handle} ${styles.handleSource}`}
      />
      <div className={styles.label}>{data.label}</div>
    </div>
  );
} 