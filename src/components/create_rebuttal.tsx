import React, { useState } from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import { futuristicTheme } from '../theme';
import { AutoDebaterApiClient } from '../api/enhaneToDo';
import type { CreateRebuttalRequest, DebateGraph, NodeRebuttal, EdgeRebuttal, CounterArgumentRebuttal, TurnArgumentRebuttal } from '../interface';
import type { Edge, Node } from '@xyflow/react';

export interface RebuttalInputProps {
  selectedNodes: Node[] | null;
  setSelectedNodes: (node :Node[]) => void;
  selectedEdges: Edge[] | null;
  setSelectedEdges: (edge : Edge[]) => void;
}
const apiClient = new AutoDebaterApiClient();

export const CreateRebuttalComponent = ({ selectedNodes, selectedEdges }: RebuttalInputProps) => { // selectedNodes を追加
  const [rebuttalResults, setRebuttalResults] = useState<string[]>([]);

  async function demonstrateCreateRebuttal() {
    const sampleDebateGraph: DebateGraph = {
      "nodes": [
        { "argument": "多くの小規模飲食店は、専門知識や時間不足から効果的なオンライン集客ができていない", "is_rebuttal": false },
        { "argument": "潜在顧客にリーチできず、機会損失が発生している", "is_rebuttal": false },
        { "argument": "AIが店舗情報から自動でWebサイトやSNS投稿を生成するSaaSを提供する", "is_rebuttal": false },
        { "argument": "オーナーは本来の調理・接客業務に集中できる", "is_rebuttal": false },
        { "argument": "オンラインでの認知度が向上し、新規顧客の来店が増加する", "is_rebuttal": false }
      ],
      "edges": [
        {
          "cause": "多くの小規模飲食店は、専門知識や時間不足から効果的なオンライン集客ができていない",
          "effect": "潜在顧客にリーチできず、機会損失が発生している",
          "is_rebuttal": false
        },
        {
          "cause": "AIが店舗情報から自動でWebサイトやSNS投稿を生成するSaaSを提供する",
          "effect": "オーナーは本来の調理・接客業務に集中できる",
          "is_rebuttal": false
        },
        {
          "cause": "AIが店舗情報から自動でWebサイトやSNS投稿を生成するSaaSを提供する",
          "effect": "オンラインでの認知度が向上し、新規顧客の来店が増加する",
          "is_rebuttal": false
        }
      ]
    };

    // selectedNodes と selectedEdges を DebateGraph の形式に変換
    const subgraphNodes = selectedNodes ? selectedNodes.map(node => ({ argument: node.data.label, is_rebuttal: false })) : [];
    const subgraphEdges = selectedEdges ? selectedEdges.map(edge => ({
      cause: edge.source, // エッジの source を cause にマッピング
      effect: edge.target, // エッジの target を effect にマッピング
      is_rebuttal: false
    })) : [];

    const dynamicSubgraph: DebateGraph = {
      nodes: subgraphNodes,
      edges: subgraphEdges,
    };

    const createRebuttalRequest: CreateRebuttalRequest = {
      debate_graph: sampleDebateGraph, // 全体のディベートグラフ
      subgraph: dynamicSubgraph, // 選択されたノードとエッジから生成されたサブグラフ
    };

    try {
      const result: DebateGraph = await apiClient.createRebuttal(createRebuttalRequest);
      console.log("Rebuttal Results:", result);

      const rebuttals: string[] = [];

      // ノードへの反論を処理
      if (result.node_rebuttals && result.node_rebuttals.length > 0) {
        result.node_rebuttals.forEach((rebuttal: NodeRebuttal) => {
          rebuttals.push(rebuttal.rebuttal_argument); // rebuttal_argument のみを追加
        });
      }

      // エッジへの反論を処理
      if (result.edge_rebuttals && result.edge_rebuttals.length > 0) {
        result.edge_rebuttals.forEach((rebuttal: EdgeRebuttal) => {
          rebuttals.push(rebuttal.rebuttal_argument); // rebuttal_argument のみを追加
        });
      }

      // カウンターアーギュメント反論を処理
      if (result.counter_argument_rebuttals && result.counter_argument_rebuttals.length > 0) {
        result.counter_argument_rebuttals.forEach((rebuttal: CounterArgumentRebuttal) => {
          rebuttals.push(rebuttal.rebuttal_argument); // rebuttal_argument のみを追加
        });
      }

      // ターンアーギュメント反論を処理
      if (result.turn_argument_rebuttals && result.turn_argument_rebuttals.length > 0) {
        result.turn_argument_rebuttals.forEach((rebuttal: TurnArgumentRebuttal) => {
          rebuttals.push(rebuttal.rebuttal_argument); // rebuttal_argument のみを追加
        });
      }

      if (rebuttals.length > 0) {
        setRebuttalResults(rebuttals);
      } else {
        setRebuttalResults(["反論は生成されませんでした。"]);
      }
    } catch (error: any) {
      console.error("Failed to create rebuttals:", error);
      setRebuttalResults(["エラーが発生しました: " + (error.message || String(error))]);
    }
  }

  const handleClick = () => {
    demonstrateCreateRebuttal();
  };

  return (
    <Box sx={{
    // overflowY: 'auto',
    flexGrow: 1,
    backgroundColor: futuristicTheme.palette.background.paper,
    maxHeight: '100%',
    gap: 4,
    }}>
      <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexGrow: 1,
        backgroundColor: futuristicTheme.palette.background.paper,
        maxHeight: '20%',
        borderBottom: '1px solid',
        borderColor: futuristicTheme.palette.primary.main
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ color: futuristicTheme.palette.text, ml: 2}}>
          仮説精査
        </Typography>
        <Button
          variant="contained"
          sx={{
            mr: 2,
            mb: 2,
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            '&:hover': {
              backgroundColor: futuristicTheme.palette.secondary.dark,
            },
          }}
          onClick={handleClick}
        >
          仮説を精査する
        </Button>
      </Box>
      <Box sx={{
      overflowY: 'auto',
      flexGrow: 1,
      backgroundColor: futuristicTheme.palette.background.paper,
      maxHeight: '80%',
      pt: 2
      }}>
      {rebuttalResults.length > 0 && (
        <Box>
          {rebuttalResults.map((rebuttal, index) => (
            <Paper
              key={index}
              elevation={2}
              sx={{
                p: 2,
                mb: 2,
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: 'none',
                outline: 'none',
                '&:hover': {
                  opacity: 0.8,
                  backgroundColor: 'white',
                }
              }}
            >
              <Typography variant="body1" color='black'>
                {rebuttal}
              </Typography>
            </Paper>
          ))}
        </Box>
      )}
    </Box>
    </Box>
  );
};