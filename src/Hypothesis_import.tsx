import React from 'react';

// 仮説入力コンポーネント
// AppコンポーネントからactiveInputTypeを受け取るように変更

interface HypothesisInputProps {
  activeInputType: string;
}

import TextField from '@mui/material/TextField'; // MUIのTextFieldをインポート
import Button from '@mui/material/Button';     // MUIのButtonをインポート
import Box from '@mui/material/Box';           // レイアウト用にBoxをインポート

// プロップスの型定義
interface HypothesisInputProps {
  activeInputType: string;
}

// 仮説入力コンポーネント
export const HypothesisInput: React.FC<HypothesisInputProps> = ({ activeInputType }) => {
  return (
    // Boxコンポーネントを最上位のコンテナとして使用し、Flexboxのスタイルを適用
    <Box className="p-4 bg-white rounded-lg shadow-md h-full flex flex-col">
      {/* コンテンツエリア */}
      {activeInputType === 'hypothesis' ? (
        <>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">仮説入力</h2>
          <TextField
            multiline // 複数行入力可能にする
            minRows={8} // 最小8行の高さ
            fullWidth // 幅を親要素いっぱいに広げる
            variant="outlined" // アウトライン表示
            placeholder="ここに仮説を入力してください..."
            className="mb-4" // Tailwindのmargin-bottomを維持
            sx={{
              // カスタムスタイルを適用 (近未来的な見た目のために枠線を青色に)
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#3b82f6', // 青色の枠線
                },
                '&:hover fieldset': {
                  borderColor: '#2563eb', // ホバー時の枠線色
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#1d4ed8', // フォーカス時の枠線色
                },
              },
            }}
          />
          <Button
            variant="contained" // 背景色付きボタン
            color="primary" // プライマリーカラー（通常は青系）
            className="mt-auto" // Tailwindのmargin-top-autoを維持
            sx={{
              // カスタムスタイルを適用 (近未来的なグラデーションやシャドウ)
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
              borderRadius: 3,
              height: 48,
              padding: '0 30px',
              color: 'white',
              '&:hover': {
                opacity: 0.9,
              },
            }}
          >
            仮説を保存
          </Button>
        </>
      ) : (
        <>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">予想質問</h2>
          <TextField
            multiline
            minRows={8}
            fullWidth
            variant="outlined"
            placeholder="ここに予想される質問や反論が表示されます..."
            className="mb-4"
            readOnly
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#3b82f6',
                },
                '&:hover fieldset': {
                  borderColor: '#2563eb',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#1d4ed8',
                },
              },
            }}
          />
          <Button
            variant="contained"
            color="secondary" // セカンダリーカラー（通常は紫系）
            className="mt-auto"
            sx={{
              // カスタムスタイルを適用
              background: 'linear-gradient(45deg, #9C27B0 30%, #E040FB 90%)',
              boxShadow: '0 3px 5px 2px rgba(224, 64, 251, .3)',
              borderRadius: 3,
              height: 48,
              padding: '0 30px',
              color: 'white',
              '&:hover': {
                opacity: 0.9,
              },
            }}
          >
            質問を生成
          </Button>
        </>
      )}
    </Box>
  );
};


// ToDoサジェストコンポーネントのプレースホルダー
export const TodoSuggest = () => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md h-full flex flex-col justify-center items-center">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">ToDoサジェスト</h2>
      <ul className="list-disc list-inside text-gray-700 space-y-2 w-full text-left pl-4">
        <li>データ収集計画を立てる</li>
        <li>ユーザーインタビューを実施する</li>
        <li>プロトタイプを作成する</li>
        <li>A/Bテストを設定する</li>
      </ul>
      <button className="mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out">
        新しいToDoを生成
      </button>
    </div>
  );
};

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
        {activeFlowchartType === 'typeA' ? 'フローチャートA' : 'フローチャートB'}
      </h2>
      <p className="text-gray-600 mt-2">
        （ここに{activeFlowchartType === 'typeA' ? 'フローチャートA' : 'フローチャートB'}が表示されます）
      </p>
      <div className="w-full h-3/4 bg-gray-100 rounded-md mt-4 flex items-center justify-center text-gray-400">
        {activeFlowchartType === 'typeA' ? 'フローチャートAの領域' : 'フローチャートBの領域'}
      </div>
    </div>
  );
};