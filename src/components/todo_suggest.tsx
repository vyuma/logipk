import { futuristicTheme } from "../theme";
import { Box, Typography, Paper, Button } from "@mui/material";
import type { DebateGraph, EnhanceTODORequest, TODOSuggestions, EnhancementTODO } from "../interface";
import { AutoDebaterApiClient } from "../api/enhaneToDo";
import { useState } from 'react'; // useStateをインポート

// --- Example Usage (Optional - for demonstration) ---

// To use this client:
// 1. Import it into your frontend application.
// 2. Create an instance:
const apiClient = new AutoDebaterApiClient();

// ToDoサジェストコンポーネントのプレースホルダー
export const TodoSuggest = () => {
  const [todoSuggestions, setTodoSuggestions] = useState<string[]>([]); // ToDoサジェストを文字列の配列として保持するstate

  async function demonstrateEnhanceTodo() {
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

    const sampleSubgraph: DebateGraph = {
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
    }
    const enhanceTodoRequest: EnhanceTODORequest = {
      debate_graph: sampleDebateGraph,
      subgraph: sampleSubgraph,
    };

    try {
      const result: TODOSuggestions = await apiClient.enhanceTodo(enhanceTodoRequest);
      console.log("TODO Suggestions:", result);

      if (result.todo && Array.isArray(result.todo)) {
        // EnhancementTODO の各型を判別し、適切な文字列に変換する
        const mappedSuggestions = result.todo.map((item: EnhancementTODO) => {
          if ('strengthen_edge' in item && item.strengthen_edge) {
            return `**エッジ強化**: 「${item.strengthen_edge.cause_argument}」から「${item.strengthen_edge.effect_argument}」へ (${item.strengthen_edge.enhancement_type}) - ${item.strengthen_edge.content}`;
          } else if ('strengthen_node' in item && item.strengthen_node) {
            return `**ノード強化**: 「${item.strengthen_node.target_argument}」 - ${item.strengthen_node.content}`;
          } else if ('insert_node' in item && item.insert_node) {
            return `**ノード挿入**: 「${item.insert_node.cause_argument}」と「${item.insert_node.effect_argument}」の間に「${item.insert_node.intermediate_argument}」を挿入`;
          }
          return '不明なTODOアクション'; // 予期しないケースのためのフォールバック
        });
        console.log("結果を取得しました", result.todo)
        setTodoSuggestions(mappedSuggestions); // 配列としてセット
      } else {
        setTodoSuggestions(["TODOサジェストが取得できませんでした。"]);
      }
    } catch (error: any) {
      console.error("Failed to get TODO suggestions:", error);
      setTodoSuggestions(["エラーが発生しました: " + (error.message || String(error))]);
    }
  }

  const handleClick = () => {
    demonstrateEnhanceTodo();
  };

  return (
    <Box sx={{ overflowY: 'auto', flexGrow: 1, backgroundColor: futuristicTheme.palette.background.paper, maxHeight: '100%'}}>
      <Typography variant="h6" gutterBottom>
        ToDoサジェスト
      </Typography>
      <Button
        variant="contained"
        onClick={handleClick}
        sx={{ mb: 2 }} // ボタンと下のPaperの間に余白
      >
        ToDoサジェストを取得
      </Button>

      {/* todoSuggestionsがある場合、各要素をPaperコンポーネントで表示 */}
      {todoSuggestions.map((suggestion, index) => (
        <Paper
          key={index} // 各Paperにユニークなkeyを設定
          elevation={2}
          sx={{
            p: 2,
            mb: 2, // 各Paperの下に余白
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: 'none',
            outline: 'none',
            '&:hover': {
              opacity: 0.8,
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            }
          }}
        >
          <Typography variant="body1" color='black'>
            {suggestion}
          </Typography>
        </Paper>
      ))}
    </Box>
  );
};