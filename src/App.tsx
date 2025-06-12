import { useState } from 'react';
// MUI コンポーネントをインポート
import {
  CssBaseline,
  ThemeProvider,
  Box,
  Grid,
  Tabs,
} from '@mui/material';

// 仮説・TODOサジェスト・フローチャートコンポーネントのインポート
// これらのコンポーネントは外部ファイルで定義されていると想定
import { futuristicTheme } from './theme';
import { TodoSuggest } from './components/todo_suggest';
import { CreateRebuttalComponent } from './components/create_rebuttal';
import { StyledTab } from './components/styled_tab';
import { FlowChart } from './components/flowchart';
import type { Edge, Node } from '@xyflow/react';


function App() {
  // フローチャートの切り替え状態をAppコンポーネントで管理
  const [activeFlowchartType, setActiveFlowchartType] = useState('SQ'); // 'typeA' または 'typeB'

  const [selectedNodes, setSelectedNodes] = useState<Node[] | null>(null);
  const [selectedEdges, setSelectedEdges] = useState<Edge[]|null>(null);

  // フローチャートタブの変更ハンドラ
  const handleFlowchartChange = (_event: React.SyntheticEvent, newValue: string) => {
    setActiveFlowchartType(newValue);
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
            container
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
                <FlowChart activeFlowchartType={activeFlowchartType} 
                selectedEdges={selectedEdges}
                selectedNodes={selectedNodes}
                setSelectedEdges={setSelectedEdges}
                setSelectedNodes={setSelectedNodes}
                />
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
              width: '30%',
              height: '100%',
              p: 2,
            }}
          >
            {/* 右側上半分 - 仮説入力コンポーネントとタブ */}
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', borderRadius: 3, height: '45%' }}>
              <CreateRebuttalComponent 
                selectedNodes={selectedNodes}
                setSelectedNodes={setSelectedNodes}
                selectedEdges={selectedEdges}
                setSelectedEdges={setSelectedEdges}
              />
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
