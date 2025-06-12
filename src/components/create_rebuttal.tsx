import React, { useState } from 'react';
import { Box, Typography, Paper, Button } from '@mui/material'; // Buttonを追加
import { futuristicTheme } from '../theme'; // 仮定するテーマのインポート
import { AutoDebaterApiClient } from '../api/enhaneToDo'; // パスが正しいことを確認してください
import type { CreateRebuttalRequest, DebateGraph, NodeRebuttal, EdgeRebuttal, CounterArgumentRebuttal, TurnArgumentRebuttal } from '../interface'; // 必要な型をインポート

const apiClient = new AutoDebaterApiClient();

export const CreateRebuttalComponent: React.FC = () => {
  const [rebuttalResults, setRebuttalResults] = useState<string[]>([]); // 結果を文字列の配列として保持

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

    // サブグラフは、議論グラフの一部として定義します。
    // 今回は例として議論グラフ全体をサブグラフとします。
    const sampleSubgraph: DebateGraph = {
      "nodes": [
        { "argument": "AIが店舗情報から自動でWebサイトやSNS投稿を生成するSaaSを提供する", "is_rebuttal": false },
        { "argument": "オンラインでの認知度が向上し、新規顧客の来店が増加する", "is_rebuttal": false }
      ],
      "edges": [
        {
          "cause": "AIが店舗情報から自動でWebサイトやSNS投稿を生成するSaaSを提供する",
          "effect": "オンラインでの認知度が向上し、新規顧客の来店が増加する",
          "is_rebuttal": false
        }
      ]
    };

    const createRebuttalRequest: CreateRebuttalRequest = {
      debate_graph: sampleDebateGraph,
      subgraph: sampleSubgraph,
    };

    try {
      const result: DebateGraph = await apiClient.createRebuttal(createRebuttalRequest);
      console.log("Rebuttal Results:", result);

      const rebuttals: string[] = [];

      // ノードへの反論を処理
      if (result.node_rebuttals && result.node_rebuttals.length > 0) {
        result.node_rebuttals.forEach((rebuttal: NodeRebuttal) => {
          rebuttals.push(`**ノード反論**: ターゲット「${rebuttal.target_argument}」、タイプ「${rebuttal.rebuttal_type}」、反論「${rebuttal.rebuttal_argument}」`);
        });
      }

      // エッジへの反論を処理
      if (result.edge_rebuttals && result.edge_rebuttals.length > 0) {
        result.edge_rebuttals.forEach((rebuttal: EdgeRebuttal) => {
          rebuttals.push(`**エッジ反論**: ターゲット「${rebuttal.target_cause_argument}」から「${rebuttal.target_effect_argument}」、タイプ「${rebuttal.rebuttal_type}」、反論「${rebuttal.rebuttal_argument}」`);
        });
      }

      // カウンターアーギュメント反論を処理
      if (result.counter_argument_rebuttals && result.counter_argument_rebuttals.length > 0) {
        result.counter_argument_rebuttals.forEach((rebuttal: CounterArgumentRebuttal) => {
          rebuttals.push(`**カウンターアーギュメント反論**: ターゲット「${rebuttal.target_argument}」、反論「${rebuttal.rebuttal_argument}」`);
        });
      }

      // ターンアーギュメント反論を処理
      if (result.turn_argument_rebuttals && result.turn_argument_rebuttals.length > 0) {
        result.turn_argument_rebuttals.forEach((rebuttal: TurnArgumentRebuttal) => {
          rebuttals.push(`**ターンアーギュメント反論**: 反論「${rebuttal.rebuttal_argument}」`);
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
    <Box sx={{ overflowY: 'auto', flexGrow: 1, p: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ color: futuristicTheme.palette.primary.main }}>
        反論生成
      </Typography>
      <Button
        variant="contained"
        sx={{
          mb: 2,
          backgroundColor: futuristicTheme.palette.secondary.main,
          '&:hover': {
            backgroundColor: futuristicTheme.palette.secondary.dark,
          },
        }}
        onClick={handleClick}
      >
        反論を生成する
      </Button>
      {rebuttalResults.length > 0 && (
        <Box>
          <Typography variant="h6" gutterBottom sx={{ color: futuristicTheme.palette.primary.main }}>
            生成された反論
          </Typography>
          {rebuttalResults.map((rebuttal, index) => (
            <Paper
              key={index}
              elevation={2}
              sx={{
                p: 2,
                mb: 2,
                backgroundColor: futuristicTheme.palette.background.paper,
                borderRadius: '8px',
                boxShadow: 'none',
                outline: 'none',
              }}
            >
              <Typography variant="body1" sx={{ color: futuristicTheme.palette.text.primary }}>
                {rebuttal}
              </Typography>
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  );
};