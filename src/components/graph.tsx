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
import type { DebateNode , DebateEdge } from '../api/enhanceLogic';


// const initialNodes: Node[] = [
//   { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
//   { id: '2', position: { x: 0, y: 150.4 }, data: { label: '2' } },
//   { id: '3', position: { x: 0, y: 200 }, data: { label: '3' }, type: 'textUpdater' },
//   { id: '4', position: { x: 0, y: 300 }, data: { label: '4' }, type: 'textSuggest' },
// ];

// const initialEdges: Edge[] = [
//   { id: 'e1-2', source: '1', target: '2' },
//   { id: 'e2-3', source: '2', target: '3', type: 'custom-edge' },
// ];

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

  const selectEnhanceLogic = async (allNodes: Node[], allEdge: Edge[] , selectedEdges:Edge[]) => {
    

    const allDebateEdges: DebateEdge[] = allEdge.map(edge => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      data: { label: edge.data?.label || '' },
    }));

    const debateEdges: DebateEdge[] = selectedEdges.map(edge => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      data: { label: edge.data?.label || '' },
    }));

    const allDebateNods: DebateNode[] = allNodes.map(node => ({
      id: node.id,
      position: node.position,
      data: { label: String(node.data?.label || '') },
    }));

    const response = await EnhanceLogic(
      allDebateNods,
      allDebateEdges,
      debateEdges[0], // 最初の選択されたエッジを対象にする
    );
    response.forEach((res) => {
      res.nodesToAdd.forEach((node)=>{
        const newNode: Node = {
          id: getId(),
          position: { x: node.position.x, y: node.position.y },
          data: { label: node.data.label },
          type: 'textSuggest', 
        };
        setNodes((nds) => [...nds, newNode]);
      })

      res.edgesToAdd.forEach((edge) => {
        const newEdge: Edge = {
          id: getId(),
          source: edge.source,
          target: edge.target,
          data: { label: edge.label },
          type: 'custom-edge',
        };
        setEdges((eds) => [...eds, newEdge]);
      }
      );
      // res.edgesToRemove.forEach((edge) => {
      //   const removeEdge : Edge = {
      //     id : edge.id,
      //     source: edge.source,
      //     target: edge.target,
      //     data: { label: edge.label },
      //   };
      //   setEdges((eds) => eds.filter((e) => e.id !== removeEdge.id));
      //   }
      // );
      res.edgesToUpdate.forEach((edges)=>{
        const updatedEdge: Edge = {
          id: edges.id,
          source: edges.source,
          target: edges.target,
          data: { label: edges.label },
          type: 'custom-edge',
        };
        setEdges((eds) => eds.map((e) => (e.id === updatedEdge.id ? updatedEdge : e)));
      })
    });
  }
  

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
