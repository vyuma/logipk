import { useState, useCallback, useEffect } from 'react';
import {
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
} from '@xyflow/react';


import '@xyflow/react/dist/style.css';

import FlowInner from './FlowInner';

const initialNodes: Node[] = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
  { id: '2', position: { x: 0, y: 150.4 }, data: { label: '2' } },
  { id: '3', position: { x: 0, y: 200 }, data: { label: '3' }, type: 'textUpdater' },
  { id: '4', position: { x: 0, y: 300 }, data: { label: '4' }, type: 'textSuggest' },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3', type: 'custom-edge' },
];

export default function Flow() {
  const [nodes, setNodes, onNodesChangeOriginal] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChangeOriginal] = useEdgesState(initialEdges);

  const [history, setHistory] = useState<{ nodes: Node[]; edges: Edge[] }[]>([
    { nodes: initialNodes, edges: initialEdges },
  ]);
  const getId = () => `node_${crypto.randomUUID()}`;

  const updateHistory = (newNodes: Node[], newEdges: Edge[]) => {
    setHistory((prevHistory) => [...prevHistory, { nodes: newNodes, edges: newEdges }]);
  };

  const undo = useCallback(() => {
    if (history.length > 1) {
      const newHistory = history.slice(0, -1);
      const prevState = newHistory[newHistory.length - 1];
      setNodes(prevState.nodes);
      setEdges(prevState.edges);
      setHistory(newHistory);
    }
  }, [history, setNodes, setEdges]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'z') {
        event.preventDefault();
        undo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo]);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      onNodesChangeOriginal(changes);
      setNodes((nds) => {
        const updatedNodes = nds.map((n) => ({ ...n }));
        updateHistory(updatedNodes, edges);
        return updatedNodes;
      });
    },
    [edges],
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => {
      onEdgesChangeOriginal(changes);
      setEdges((eds) => {
        const updatedEdges = eds.map((e) => ({ ...e }));
        updateHistory(nodes, updatedEdges);
        return updatedEdges;
      });
    },
    [nodes],
  );

  return (
    <ReactFlowProvider>
      <FlowInner
        nodes={nodes}
        setNodes={setNodes}
        edges={edges}
        setEdges={setEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        getId={getId}
        updateHistory={(nodes, edges) => setHistory((h) => [...h, { nodes, edges }])}
      />
    </ReactFlowProvider>
  );
}
