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
import { useMemo, useCallback, useEffect, useRef} from 'react';

import TextUpdaterNode from './Node/CustumNode';
import TextSuggestNode from './Node/CustumNode_suggest';
import CustomEdge from './Edge/CustumEdges';

interface FlowInnerProps {
  nodes: Node[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  edges: Edge[];
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  getId: () => string;
  updateHistory: (nodes: Node[], edges: Edge[]) => void;
  selectedEdges: Edge[] | null;
  setSelectedEdges: (edges: Edge[]) => void;
  selectedNodes: Node[] | null;
  setSelectedNodes: (nodes: Node[]) => void;
  selectEnhanceLogic?: (nodes: Node[], edges: Edge[], selectedEdges:Edge[]) => void;
}

export default function FlowInner({
  nodes,
  setNodes,
  edges,
  setEdges,
  onNodesChange,
  onEdgesChange,
  getId,
  updateHistory,
  selectedEdges,
  setSelectedEdges,
  selectedNodes,
  setSelectedNodes,
  selectEnhanceLogic
}: FlowInnerProps) {
  const reactFlow = useReactFlow<Node, Edge>();
  
  // 前回の選択状態を記憶するref
  const lastSelectionRef = useRef<{
    nodeIds: string[];
    edgeIds: string[];
  }>({
    nodeIds: [],
    edgeIds: [],
  });

  const onLabelChange = useCallback((id: string, value: string) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, label: value } } : node
      )
    );
  }, [setNodes]);

  const nodeTypes = useMemo(() => ({
    textUpdater: (props: { id: string; data: { label: string }; selected?: boolean }) => (
      <TextUpdaterNode {...props} onLabelChange={onLabelChange} />
    ),
    textSuggest: (props: { id: string; data: { label: string }; selected?: boolean }) => (
      <TextSuggestNode {...props} onLabelChange={onLabelChange} />
    ),
  }), [onLabelChange]);

  const edgeTypes = useMemo(() => ({
    'custom-edge': CustomEdge,
  }), []);

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge({ ...connection, type: 'custom-edge' }, eds)),
    [setEdges],
  );


  

  // 無限ループを防ぐ選択変更ハンドラ
  const onSelectionChange = useCallback(
    ({ nodes: selectedNodes, edges: selectedEdges }:{
        nodes: Node[];
        edges: Edge[];
    }) => {
      // 現在の選択状態のIDを取得してソート
      const currentNodeIds = selectedNodes.map((node : Node)=> node.id).sort();
      const currentEdgeIds = selectedEdges.map((edge : Edge) => edge.id).sort();
      
      // 前回の選択状態と比較
      const prevNodeIds = lastSelectionRef.current.nodeIds;
      const prevEdgeIds = lastSelectionRef.current.edgeIds;
      
      // 選択状態に変化があるかチェック
      const nodeSelectionChanged = 
        currentNodeIds.length !== prevNodeIds.length ||
        currentNodeIds.some((id, index) => id !== prevNodeIds[index]);
        
      const edgeSelectionChanged = 
        currentEdgeIds.length !== prevEdgeIds.length ||
        currentEdgeIds.some((id, index) => id !== prevEdgeIds[index]);

      // 変化がない場合は何もしない
      if (!nodeSelectionChanged && !edgeSelectionChanged) {
        return;
      }

      // 選択状態を更新
      lastSelectionRef.current = {
        nodeIds: currentNodeIds,
        edgeIds: currentEdgeIds,
      };

      // 外部のステート更新（これが安全になった）
      setSelectedNodes(selectedNodes);
      setSelectedEdges(selectedEdges);

      // デバッグログ
      console.log('Selection changed safely:', {
        selectedNodes: selectedNodes,
        selectedEdges: selectedEdges,
      });
    },
    [setSelectedNodes, setSelectedEdges]
  );

  // ダブルクリックによるノード追加
  useEffect(() => {
    const pane = document.querySelector('.react-flow__pane');
    if (!pane) return;

    const handleDblClick = (event: MouseEvent) => {
      // 左クリックのみ有効
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
      
      // ノード追加（typoを修正: 'textSugges' → 'textSuggest'）
      const newNode: Node = {
        id: getId(),
        type: 'textSuggest', // typoを修正
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


//   AI機能
    const doubleClickHandler = () => {
        if (selectedEdges && selectedEdges.length > 0) {
            console.log('Selected edges:', selectedEdges);
            selectEnhanceLogic?.(nodes, edges, selectedEdges);
        }else{
            return 
        }
        
    }
    const handleKeyPress = useCallback((e: KeyboardEvent) => {
        // Ctrl+Enter (Win/Linux) または Cmd+Enter (macOS)
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
          console.log('Enter ショートカット：全ノードを textUpdater に変更');
    
          setNodes(prevNodes => {
            const updated = prevNodes.map(node => ({
              ...node,
              type: 'textUpdater',
            }));
            updateHistory(updated, edges);       // 変更後を履歴へ
            return updated;
          });
        }
      }, [edges, setNodes, updateHistory]);
    
      useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
      }, [handleKeyPress]);
    

  return (
    <div className="w-full h-screen flex dark bg-gray-900"
    >
      <div style={{ width: '100%', height: '100%' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onSelectionChange={onSelectionChange}
          fitView
          className="bg-gray-900"
          selectNodesOnDrag={false}
        >
          <MiniMap
            nodeColor={() => "#334155"}
            maskColor="#1e293b90"
          />
          <Controls />
          <Background
            gap={12}
            size={1}
            color="#334155"
          />
        </ReactFlow>
      </div>
      <button
        className="absolute bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded shadow-md hover:bg-blue-700 transition-colors"
        onClick={doubleClickHandler}
        >
        AI機能
        </button>
    </div>
  );
}