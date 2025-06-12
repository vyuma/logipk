// FlowInner.tsx
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
  import { useMemo, useCallback } from 'react';

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
  
    const nodeTypes = useMemo(() => ({
      textUpdater: TextUpdaterNode,
      textSuggest: TextSuggestNode,
    }), []);
  
    const edgeTypes = useMemo(() => ({
      'custom-edge': CustomEdge,
    }), []);
  
    const onConnect = useCallback(
      (connection: Connection) => setEdges((eds) => addEdge({ ...connection, type: 'custom-edge' }, eds)),
      [setEdges],
    );
  
    const onPaneDoubleClick = useCallback(
      (event: React.MouseEvent) => {
        const { x: viewportX, y: viewportY, zoom } = reactFlow.getViewport();
        const position = {
          x: (event.clientX - viewportX) / zoom,
          y: (event.clientY - viewportY) / zoom,
        };
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
      },
      [reactFlow, setNodes, updateHistory, edges, getId]
    );

  
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
            onNodeDoubleClick={onPaneDoubleClick}
            onPaneClick={onPaneDoubleClick}
            onSelectionChange={(elements) => {
                const selectedNodes = elements.nodes.filter((n) => n.selected);
                const selectedEdges = elements.edges.filter((e) => e.selected);
                console.log('Selected Nodes:', selectedNodes);
                console.log('Selected Edges:', selectedEdges);
              }}
            fitView
          >
            <MiniMap />
            <Controls />
            <Background gap={12} size={1} />
          </ReactFlow>
        </div>
      </div>
    );
  }
  