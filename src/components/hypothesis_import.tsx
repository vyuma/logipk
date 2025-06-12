import React from 'react';

// 仮説入力コンポーネント
// AppコンポーネントからactiveInputTypeを受け取るように変更

interface HypothesisInputProps {
  activeInputType: string;
}

import { TextField, Stack, Box, Button } from '@mui/material';        // レイアウト用にBoxをインポート
import { futuristicTheme } from '../theme';

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
        <Stack spacing={4} sx={{ height: '100%' }}>
            <TextField
            multiline
            minRows={5}
            fullWidth
            variant="outlined"
            placeholder="ここに仮説を入力してください..."
            className="mb-4"
            sx={{
                '& .MuiOutlinedInput-root': {
                '& fieldset': {
                    borderColor: 'gray',
                },
                '&:hover fieldset': {
                    borderColor: futuristicTheme.palette.secondary.light,
                },
                '&.Mui-focused fieldset': {
                    borderColor: futuristicTheme.palette.secondary.main,
                },
                },
            }}
            />
            <Button
            variant="contained"
            // color="primary"
            // className="mt-auto" // Tailwindのmargin-top-autoを維持
            sx={{
                // カスタムスタイルを適用 (近未来的なグラデーションやシャドウ)
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                borderRadius: 3,
                borderColor: 'black',
                height: '5vh',
                padding: '1',
                color: 'white',
                '&:hover': {
                opacity: 0.9,
                },
            }}
            >
            仮説を検証
            </Button>
        </Stack>
        </>
      ) : (
        <>
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
                  borderColor: 'gray',
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
          {/* <Button
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
          </Button> */}
        </>
      )}
    </Box>
  );
};