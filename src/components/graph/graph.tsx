// Flow.tsx
import { useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  type Node,
  type Edge,
  type Connection,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// 初期ノード & エッジ -------------------------------------------------------
const initialNodes: Node[] = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
  { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2' },
];

// コンポーネント ------------------------------------------------------------
export default function Flow() {
  // ReactFlow が提供する “便利ステートフック”
  const [nodes, setNodes, onNodesChange]   = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange]   = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (connection: Connection) =>
      setEdges((eds) => addEdge({ ...connection, type: 'step' }, eds)),
    [setEdges],
  );

  return (
    // 親要素に必ず「幅・高さ」を与えること！
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}
