import { futuristicTheme } from "../theme";
import { Box, Typography, Paper, Button } from "@mui/material";
import type { DebateGraph, EnhanceTODORequest, TODOSuggestions, EnhancementTODO } from "../interface";
import { AutoDebaterApiClient } from "../api/enhaneToDo";
import { useState } from 'react'; // useStateをインポート

// APIクライアントのインスタンスを作成
const apiClient = new AutoDebaterApiClient();

// ToDoサジェストコンポーネント
export const TodoSuggest = () => {
  // ToDoサジェストとその展開状態を保持するstate
  const [todoSuggestions, setTodoSuggestions] = useState<
    Array<{
      title: string;
      content: string;
      isOpen: boolean;
    }>
  >([]);

  // TODOアイテムの展開/折りたたみ状態を切り替える関数
  const handleToggle = (index: number) => {
    setTodoSuggestions((prevSuggestions) =>
      prevSuggestions.map((item, i) =>
        i === index ? { ...item, isOpen: !item.isOpen } : item
      )
    );
  };

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
          "cause": "AIが店舗情報から自動でWebサイトやSNSを提供する",
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
        const mappedSuggestions = result.todo.map((item: EnhancementTODO) => {
          // TODOのタイトルと内容を抽出
          const title = item.title || 'タイトルなし'; // Titleフィールドを使用
          let content = '';

          if ('strengthen_edge' in item && item.strengthen_edge) {
            content = `**エッジ強化**: 「${item.strengthen_edge.cause_argument}」から「${item.strengthen_edge.effect_argument}」へ (${item.strengthen_edge.enhancement_type}) - ${item.strengthen_edge.content}`;
          } else if ('strengthen_node' in item && item.strengthen_node) {
            content = `**ノード強化**: 「${item.strengthen_node.target_argument}」 - ${item.strengthen_node.content}`;
          } else if ('insert_node' in item && item.insert_node) {
            content = `**ノード挿入**: 「${item.insert_node.cause_argument}」と「${item.insert_node.effect_argument}」の間に「${item.insert_node.intermediate_argument}」を挿入`;
          } else {
            content = '不明なTODOアクション'; // 予期しないケースのためのフォールバック
          }
          return { title, content, isOpen: false }; // 最初は閉じている状態
        });
        console.log("結果を取得しました", result.todo)
        setTodoSuggestions(mappedSuggestions);
      } else {
        setTodoSuggestions([{ title: "TODOサジェストが取得できませんでした。", content: "", isOpen: false }]);
      }
    } catch (error: any) {
      console.error("Failed to get TODO suggestions:", error);
      setTodoSuggestions([{ title: "エラーが発生しました", content: error.message || String(error), isOpen: false }]);
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
        sx={{
          mb: 2,
          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
          '&:hover': {
            backgroundColor: futuristicTheme.palette.secondary.dark,
          },
        }}
        onClick={handleClick}
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
              backgroundColor: 'white'
            }
          }}
        >
          {/* タイトルを表示し、クリックでトグル */}
          <Typography
            variant="body1"
            color='black'
            onClick={() => handleToggle(index)}
            sx={{ cursor: 'pointer', fontWeight: 'bold' }} // クリック可能であることを示すスタイル
          >
            {suggestion.title}
          </Typography>

          {/* isOpenがtrueの場合のみ内容を表示 */}
          {suggestion.isOpen && (
            <Typography variant="body2" color='black' sx={{ mt: 1 }}>
              {suggestion.content}
            </Typography>
          )}
        </Paper>
      ))}
    </Box>
  );
};