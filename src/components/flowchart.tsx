import React from 'react';

//後ほどReact Flow APIで実装したものとマージ
interface FlowChartInputProps {
  activeFlowchartType: string;
}


// フローチャートコンポーネントのプレースホルダー
// AppコンポーネントからactiveFlowchartTypeを受け取るように変更
export const FlowChart: React.FC<FlowChartInputProps>  = ({ activeFlowchartType }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md h-full flex flex-col">
      {/* タブボタンはAppコンポーネントに移動したため、ここからは削除 */}
      {/* コンテンツエリア */}
      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        {activeFlowchartType === 'SQ' ? 'フローチャートA' : 'フローチャートB'}
      </h2>
      <p className="text-gray-600 mt-2">
        （ここに{activeFlowchartType === 'SQ' ? 'フローチャートA' : 'フローチャートB'}が表示されます）
      </p>
      <div className="w-full h-3/4 bg-gray-100 rounded-md mt-4 flex items-center justify-center text-gray-400">
        {activeFlowchartType === 'SQ' ? 'フローチャートAの領域' : 'フローチャートBの領域'}
      </div>
    </div>
  );
};