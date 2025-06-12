import {
    ReactFlow,
    MiniMap,
    Controls,
    Background,
    addEdge,
    useReactFlow,
    type Node,
    type Edge,
    type Connection,
    type OnNodesChange,
    type OnEdgesChange,
  } from '@xyflow/react';
import { useMemo, useCallback, useEffect } from 'react';

import TextUpdaterNode from './Node/CustumNode';
import TextSuggestNode from './Node/CustumNode_trans';
import CustomEdge from './Edge/CustumEdges';

export default function FlowInner({
nodes,
    setNodes,
    edges,
    setEdges,
    onNodesChange,
    onEdgesChange,
    getId,
    updateHistory,
  }: {
    nodes: Node[];
    setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
    edges: Edge[];
    setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
    onNodesChange: OnNodesChange;
    onEdgesChange: OnEdgesChange;
    getId: () => string;
    updateHistory: (nodes: Node[], edges: Edge[]) => void;
  }) {
    const reactFlow = useReactFlow<Node, Edge>();
    
  
    
    const onLabelChange = useCallback((id: string, value: string) => {
        setNodes((nds) =>
          nds.map((node) =>
            node.id === id ? { ...node, data: { ...node.data, label: value } } : node
          )
        );

    }, [setNodes]);

    const nodeTypes = useMemo(() => ({
        textUpdater: (props: { id: string; data: { label: string }; }) => (
          <TextUpdaterNode {...props} onLabelChange={onLabelChange} />
        ),
        textSuggest: TextSuggestNode,
      }), [onLabelChange]);
  
    const edgeTypes = useMemo(() => ({
      'custom-edge': CustomEdge,
    }), []);
  
    const onConnect = useCallback(
      (connection: Connection) => setEdges((eds) => addEdge({ ...connection, type: 'custom-edge' }, eds)),
      [setEdges],
    );
  
    // --- ダブルクリックによるノード追加 ---
    useEffect(() => {
      // ReactFlow初回マウント後にPane取得
      const pane = document.querySelector('.react-flow__pane');
      if (!pane) return;
  
      const handleDblClick = (event: MouseEvent) => {
        // 右クリック無効化
        if (event.button !== 0) return;
        // 画面上での絶対座標をFlow内の座標に変換
        const bounds = pane.getBoundingClientRect();
        const x = event.clientX - bounds.left;
        const y = event.clientY - bounds.top;
        const { x: viewportX, y: viewportY, zoom } = reactFlow.getViewport();
        const position = {
          x: (x - viewportX) / zoom,
          y: (y - viewportY) / zoom,
        };
        // ノード追加
        const newNode: Node = {
          id: getId(),
          type: 'textUpdater',
          position,
          data: { label: 'New Node' },
        };
        setNodes((nds) => {
          const next = [...nds, newNode];
          updateHistory(next, edges);
          return next;
        });
      };
  
      pane.addEventListener('dblclick', handleDblClick);
      return () => {
        pane.removeEventListener('dblclick', handleDblClick);
      };
    }, [reactFlow, setNodes, updateHistory, edges, getId]);
  
    return (
      <div className="w-full h-screen flex">
        <div style={{ width: '70%', height: '100%' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
            onSelectionChange={(elements) => {
              const selectedNodes = elements.nodes.filter((n) => n.selected);
              const selectedEdges = elements.edges.filter((e) => e.selected);
              console.log('Selected Nodes:', selectedNodes);
              console.log('Selected Edges:', selectedEdges);
            }}
          >
            <MiniMap />
            <Controls />
            <Background gap={12} size={1} />
          </ReactFlow>
        </div>
      </div>
    );
  }
  