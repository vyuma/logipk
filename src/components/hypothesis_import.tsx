import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { futuristicTheme } from '../theme';

// 仮説入力コンポーネント（現在は予想質問の表示に特化）
export const HypothesisInput: React.FC = () => {
  // 予想される質問のダミーデータ
  const predictedQuestions = [
    "この仮説の根拠は何ですか？",
    "どのようなデータでこの仮説を検証しますか？",
    "この仮説が間違っていた場合、どのような影響がありますか？",
    "競合する仮説はありますか？",
    "この仮説の新規性は何ですか？"
  ];

  return (
    <Box sx={{ overflowY: 'auto', flexGrow: 1}}>
    <Typography variant="h6" gutterBottom>
        予想される質問
    </Typography>
    {predictedQuestions.map((question, index) => (
        <Paper
          key={index}
          elevation={2}
          sx={{
            p: 2,
            mb: 2,
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: 'none', // ホバー時の影をなくす場合
            outline: 'none',
            '&:hover': {
              opacity: 0.8,
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            }
          }}
        >
          <Typography variant="body1" color='black'>
            {question}
          </Typography>
        </Paper>
    ))}
    </Box>
  );
};