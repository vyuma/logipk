import React from 'react';
import Flow from './graph';

//後ほどReact Flow APIで実装したものとマージ
interface FlowChartInputProps {
  activeFlowchartType: string;
}


// フローチャートコンポーネントのプレースホルダー
// AppコンポーネントからactiveFlowchartTypeを受け取るように変更
export const FlowChart: React.FC<FlowChartInputProps>  = ({ activeFlowchartType }) => {
  return (
    <div className=" h-full flex flex-col">
      <Flow  /> 
    </div>
  );
};