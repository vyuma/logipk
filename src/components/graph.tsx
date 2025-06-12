import { useState, useCallback, useEffect} from 'react';
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

import mockData from './mock.json';
import { EnhanceLogic } from '../api/enhanceLogic';



const addNodeType = (initialNodes:Node[]) => {
  return initialNodes.map(node => {
    if (!node.type) {
      return { ...node, type: 'textUpdater' }; // デフォルトのノードタイプを設定
    }
    return node;
  });
}
const addEdgeType = (initialEdges:Edge[]) => {
  return initialEdges.map(edge => {
    if (!edge.type) {
      return { ...edge, data:{label:edge.label} ,type: 'custom-edge' }; // デフォルトのエッジタイプを設定
    }
    return edge;
  });
}

const initialNodes = addNodeType(mockData.nodes);
const initialEdges = addEdgeType(mockData.edges);

export default function Flow({activeFlowchartType, selectedNodes  ,selectedEdges,setSelectedNodes ,setSelectedEdges, } :{
  activeFlowchartType?: string;
  selectedNodes: Node[] | null;
  selectedEdges: Edge[] | null;
  setSelectedNodes: (node :Node[]) => void;
  setSelectedEdges: (edge : Edge[]) => void;
 }) {
  if (!activeFlowchartType) {
    console.warn('activeFlowchartType is not provided, using default mock data');
  }


  const [nodes, setNodes, onNodesChangeOriginal] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChangeOriginal] = useEdgesState(initialEdges);
  // 最初にローカルストレージにデータを保存する。
  localStorage.setItem('nodes', JSON.stringify(initialNodes));
  localStorage.setItem('edges', JSON.stringify(initialEdges));

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
      localStorage.setItem('nodes', JSON.stringify(nodes));
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
      localStorage.setItem('edges', JSON.stringify(edges));
    },
    [nodes],
  );

  const selectEnhanceLogic = async (
    allNodes: Node[],
    allEdge: Edge[],
    selectedEdges: Edge[],
  ) => {
    if (selectedEdges.length === 0) return;
  
    /* --- 前処理 ------------------------------------------------ */
    const response = await EnhanceLogic(
      allNodes.map(n => ({ id: n.id, position: n.position, data: { label: String(n.data?.label || '') } })),
      allEdge.map(e => ({ id: e.id, source: e.source, target: e.target, data: { label: e.data?.label || '' } })),
      {
        id: selectedEdges[0].id,
        source: selectedEdges[0].source,
        target: selectedEdges[0].target,
      },
    );
  
    /* --- ステート更新を 1 回ずつにまとめる --------------------- */
    response.forEach(res => {
      /* 1) ノード ---------- */
      const idMap: Record<string, string> = {};
      const nodesToAdd: Node[] = res.nodesToAdd.map(n => {
        const newId = getId();          // 衝突が不安なら新しい ID を発行
        idMap[n.id] = newId;            // 旧 ID → 新 ID を記録
        return {
          id: newId,
          position: n.position,
          data: { label: n.data.label },
          type: 'textSuggest',
        };
      });
  
      setNodes(prev => [...prev, ...nodesToAdd]);
  
      /* 2) エッジ ---------- */
      setEdges(prev => {
        // 既存エッジをまず更新／削除
        let nextEdges = prev
          .filter(e => !res.edgesToRemove.some(rem => rem.id === e.id))
          .map(e => {
            const upd = res.edgesToUpdate.find(u => u.id === e.id);
            return upd ? { ...e, data: { label: upd.label } } : e;
          });
  
        // 追加エッジを生成（ID マッピングを適用）
        const edgesToAdd: Edge[] = res.edgesToAdd.map(e => ({
          id: getId(),
          source: idMap[e.source] ?? e.source,
          target: idMap[e.target] ?? e.target,
          data: { label: e.label },
          type: 'custom-edge',
          animated: true,
        }));
  
        return [...nextEdges, ...edgesToAdd];
      });
    });
  };
  
  

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
        selectedEdges={selectedEdges}
        setSelectedEdges={setSelectedEdges}
        selectedNodes={selectedNodes}
        setSelectedNodes={setSelectedNodes}
        selectEnhanceLogic={selectEnhanceLogic}

      />
    </ReactFlowProvider>
  );
}
