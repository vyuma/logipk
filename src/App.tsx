import { useState } from 'react';
// MUI コンポーネントをインポート
import {
  CssBaseline,
  ThemeProvider,
  Box,
  Grid,
  Tabs,
  Tab,
  Typography,
} from '@mui/material';

// 仮説・TODOサジェスト・フローチャートコンポーネントのインポート
// これらのコンポーネントは外部ファイルで定義されていると想定
import { futuristicTheme } from './theme';
import { FlowChart } from './components/flowchart';
import { TodoSuggest } from './components/todo_suggest';
import { HypothesisInput } from './components/hypothesis_import';
import { StyledTab } from './components/styled_tab';


function App() {
  // フローチャートの切り替え状態をAppコンポーネントで管理
  const [activeFlowchartType, setActiveFlowchartType] = useState('SQ'); // 'typeA' または 'typeB'
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
          height: '100vh',
          width: '100vw',
          bgcolor: 'background.default',
          // p: 2,
          fontFamily: 'Inter, sans-serif',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Grid
          container
          spacing={3}
          sx={{
            height: '100%',
            width: '100%',
            flexGrow: 1,
            bgcolor: 'background.default',
            p: 2,
            flexDirection: 'column'
          }}
        >
          {/* 左側半分 - フローチャートコンポーネントとタブ */}
          <Grid
            item
            sx={{
              display: 'flex',
              flexDirection: 'column',
              bgcolor: 'background.default',
              p: 2,
              width: '70%'
            }}
          >
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              {/* フローチャートのタブボタン */}
              <Tabs
                value={activeFlowchartType}
                onChange={handleFlowchartChange}
                aria-label="flowchart type tabs"
                scrollButtons="auto"
                sx={{ mb: 2 }}
              >
                <StyledTab label="課題の検証" value="SQ" />
                <StyledTab label="ソリューションの検証" value="AP" />
              </Tabs>
              <Box sx={{ flexGrow: 1 }}>
                {/* FlowChart コンポーネント */}
                <FlowChart activeFlowchartType={activeFlowchartType} />
              </Box>
            </Box>
          </Grid>

          {/* 右側半分 - 上下で分割 */}
          <Grid
            container
            spacing={3}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              bgcolor: 'background.default',
              witdh: '30%',
              height: '100%',
              p: 2,
            }}
          >
            {/* 右側上半分 - 仮説入力コンポーネントとタブ */}
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2, bgcolor: 'background.paper', borderRadius: 3, height: '45%' }}>
              {/* 仮説/反論のタブボタン */}
              <Tabs
                value={activeInputType}
                onChange={handleInputTypeChange}
                aria-label="input type tabs"
                variant="scrollable"
                scrollButtons="auto"
                sx={{ mb: 2 }}
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
            <Box sx={{ flexGrow: 1, p: 2, bgcolor: 'background.paper', borderRadius: 3, height: '45%'}}>
              <TodoSuggest />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
}

export default App;
