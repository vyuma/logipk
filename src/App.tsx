import { useState } from 'react';
// MUI コンポーネントをインポート
import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  Box,
  Grid,
  Tabs,
  Tab,
  Typography,
} from '@mui/material';
import { styled } from '@mui/system'; // styled をインポート

// 仮説・TODOサジェスト・フローチャートコンポーネントのインポート
// これらのコンポーネントは外部ファイルで定義されていると想定
import { HypothesisInput, TodoSuggest, FlowChart } from './Hypothesis_import';

// カスタムテーマの定義 (近未来的なデザイン用)
const futuristicTheme = createTheme({
  palette: {
    mode: 'dark', // ダークモードを基調とする
    primary: {
      main: '#00e676', // 明るいグリーン (アクセントカラー)
    },
    secondary: {
      main: '#9c27b0', // 紫 (サブアクセント)
    },
    background: {
      default: '#0A1929', // 非常に濃い青 (全体の背景)
      paper: '#1A2027', // やや明るい濃いグレー (カードやコンポーネントの背景)
    },
    text: {
      primary: '#E0E0E0', // 明るいグレー (主要なテキスト)
      secondary: '#B0BEC5', // 少し暗いグレー (補助的なテキスト)
    },
  },
  typography: {
    fontFamily: ['Inter', 'sans-serif'].join(','), // Inter フォントを優先
    h5: {
      fontWeight: 600,
      color: '#00e676', // Primary color for headings
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // 角丸
          textTransform: 'none', // 大文字変換を無効化
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          color: '#B0BEC5', // タブのデフォルトテキスト色
          '&.Mui-selected': {
            color: '#00e676', // 選択されたタブのテキスト色
          },
        },
        // indicator: {
        //   backgroundColor: '#00e676', // 選択されたタブの下線色
        // },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12, // 全体の角丸
          boxShadow: '0px 0px 15px rgba(0, 230, 118, 0.3)', // 微妙なグロー効果
          backdropFilter: 'blur(5px)', // 背景のぼかし効果
          backgroundColor: 'rgba(26, 32, 39, 0.7)', // 少し透明感のある背景
        },
      },
    },
  },
});

// カスタムスタイルのタブボタン
const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  fontSize: theme.typography.pxToRem(15),
  fontWeight: theme.typography.fontWeightMedium,
  marginRight: theme.spacing(1),
  color: theme.palette.text.secondary,
  '&.Mui-selected': {
    color: theme.palette.primary.main,
  },
  '&.Mui-focusVisible': {
    backgroundColor: 'rgba(0, 230, 118, 0.1)',
  },
}));

function App() {
  // フローチャートの切り替え状態をAppコンポーネントで管理
  const [activeFlowchartType, setActiveFlowchartType] = useState('typeA'); // 'typeA' または 'typeB'
  // 仮説/反論の切り替え状態をAppコンポーネントで管理
  const [activeInputType, setActiveInputType] = useState('hypothesis'); // 'hypothesis' または 'rebuttal'

  // フローチャートタブの変更ハンドラ
  const handleFlowchartChange = (event, newValue) => {
    setActiveFlowchartType(newValue);
  };

  // 仮説/反論タブの変更ハンドラ
  const handleInputTypeChange = (event, newValue) => {
    setActiveInputType(newValue);
  };

  return (
    <ThemeProvider theme={futuristicTheme}>
      <CssBaseline /> {/* MUIのCSSリセット */}
      <Box
        sx={{
          // minHeight: '100vh',
          bgcolor: 'background.paper', // 全体の背景色
          p: 2, // パディング
          fontFamily: 'Inter, sans-serif',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          border: '1px white'
        }}
      >
        <Grid
          container
          spacing={3} // グリッド間のスペース
          sx={{
            height: { xs: 'auto', md: 'calc(100vh - 32px)' }, // モバイルとデスクトップでの高さ調整
            // width: '10%',
            // maxWidth: '1400px', // 最大幅
            flexGrow: 1,
            bgcolor: 'background.paper'
          }}
        >
          {/* 左側半分 - フローチャートコンポーネントとタブ */}
          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column',  borderColor: 'white',  bgcolor: 'background.paper'}}>
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2, bgcolor: 'background..paper', borderRadius: 3 }}>
              {/* フローチャートのタブボタン */}
              <Tabs
                value={activeFlowchartType}
                onChange={handleFlowchartChange}
                aria-label="flowchart type tabs"
                variant="scrollable" // タブが多くてもスクロール可能に
                scrollButtons="auto"
                sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}
              >
                <StyledTab label="フローチャートAC" value="typeA" />
                <StyledTab label="フローチャートB" value="typeB" />
              </Tabs>
              <Box sx={{ flexGrow: 1 }}>
                {/* FlowChart コンポーネント */}
                <FlowChart activeFlowchartType={activeFlowchartType} />
              </Box>
            </Box>
          </Grid>

          {/* 右側半分 - 上下で分割 */}
          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* 右側上半分 - 仮説入力コンポーネントとタブ */}
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2, bgcolor: 'background.paper', borderRadius: 3 }}>
              {/* 仮説/反論のタブボタン */}
              <Tabs
                value={activeInputType}
                onChange={handleInputTypeChange}
                aria-label="input type tabs"
                variant="scrollable"
                scrollButtons="auto"
                sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}
              >
                <StyledTab label="仮説" value="hypothesis" />
                <StyledTab label="反論 (予想質問)" value="rebuttal" />
              </Tabs>
              <Box sx={{ flexGrow: 1 }}>
                {/* HypothesisInput コンポーネント */}
                <HypothesisInput activeInputType={activeInputType} />
              </Box>
            </Box>

            {/* 右側下半分 - ToDoサジェストコンポーネント */}
            <Box sx={{ flexGrow: 1, p: 2, bgcolor: 'background.paper', borderRadius: 3 }}>
              <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
                ToDo サジェスト
              </Typography>
              {/* TodoSuggest コンポーネント */}
              <TodoSuggest />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
}

export default App;
