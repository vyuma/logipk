import Flow from './graph';
import type { Node } from '@xyflow/react';
import type { Edge } from '@xyflow/react';

//後ほどReact Flow APIで実装したものとマージ
export interface FlowChartInputProps {
  activeFlowchartType: string;
  selectedNodes : Node[]|null;
  setSelectedNodes: (node :Node[]) => void;
  selectedEdges: Edge[]|null;
  setSelectedEdges: (edge : Edge[]) => void;
}


// フローチャートコンポーネントのプレースホルダー
// AppコンポーネントからactiveFlowchartTypeを受け取るように変更
export const FlowChart  = ({ activeFlowchartType ,selectedNodes,selectedEdges, setSelectedNodes , setSelectedEdges }:FlowChartInputProps) => {
  return (
    <div className=" h-full flex flex-col">
      <Flow activeFlowchartType={activeFlowchartType} setSelectedNodes={setSelectedNodes} setSelectedEdges={setSelectedEdges} selectedNodes={selectedNodes} selectedEdges={selectedEdges}   />
    </div>
  );
};