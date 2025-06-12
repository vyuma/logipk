import { futuristicTheme } from "../theme";
import { Box, Typography, Paper, Button } from "@mui/material";
import type { DebateGraph, EnhanceTODORequest, TODOSuggestions, EnhancementTODO } from "../interface";
import { AutoDebaterApiClient } from "../api/enhaneToDo";
import { useState } from 'react';
import type { Edge, Node } from '@xyflow/react';

export interface SuggestInputProps {
  selectedNodes: Node[] | null;
  setSelectedNodes: (node :Node[]) => void;
  selectedEdges: Edge[] | null;
  setSelectedEdges: (edge : Edge[]) => void;
}
// APIクライアントのインスタンスを作成
const apiClient = new AutoDebaterApiClient();

// ToDoサジェストコンポーネント
export const TodoSuggest  = ({ selectedNodes, selectedEdges }: SuggestInputProps) => {
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

    const subgraphNodes = selectedNodes ? selectedNodes.map(node => ({ argument: node.data.label, is_rebuttal: false })) : [];
    const subgraphEdges = selectedEdges ? selectedEdges.map(edge => ({
      cause: edge.source,
      effect: edge.target,
      is_rebuttal: false
    })) : [];
    const dynamicSubgraph: DebateGraph = {
          nodes: subgraphNodes,
          edges: subgraphEdges,
        };
    const enhanceTodoRequest: EnhanceTODORequest = {
      debate_graph: sampleDebateGraph,
      subgraph: dynamicSubgraph,
    };

    try {
      const result: TODOSuggestions = await apiClient.enhanceTodo(enhanceTodoRequest);
      console.log("TODO Suggestions:", result);

      if (result.todo && Array.isArray(result.todo)) {
        const mappedSuggestions = result.todo.map((item: EnhancementTODO) => {
          const title = item.title || 'タイトルなし';
          let content = '';

          if ('strengthen_edge' in item && item.strengthen_edge) {
            content = item.strengthen_edge.content;
          } else if ('strengthen_node' in item && item.strengthen_node) {
            content = item.strengthen_node.content;
          } else if ('insert_node' in item && item.insert_node) {
            content = `「${item.insert_node.cause_argument}」と「${item.insert_node.effect_argument}」の間に「${item.insert_node.intermediate_argument}」を挿入`;
          } else {
            content = '不明なTODOアクション';
          }
          return { title, content, isOpen: false };
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
      <Typography variant="h6" gutterBottom sx={{ color: futuristicTheme.palette.text, ml: 2}} >
        検証方法
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
        検証プランを作成
      </Button>
      </Box>
      <Box sx={{
            overflowY: 'auto',
            flexGrow: 1,
            backgroundColor: futuristicTheme.palette.background.paper,
            maxHeight: '80%',
            pt: 2
            }}>
      {todoSuggestions.map((suggestion, index) => (
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
              backgroundColor: futuristicTheme.palette.primary.light
            },
            // ここから追加・変更
            opacity: 0, // 最初は非表示
            transform: 'translateY(20px)', // 下から20pxの位置に設定
            animation: `slideIn 0.5s forwards ease-out ${index * 0.5}s`, // アニメーションを適用
            '@keyframes slideIn': {
                'from': {
                    opacity: 0,
                    transform: 'translateY(20px)',
                },
                'to': {
                    opacity: 1,
                    transform: 'translateY(0)',
                },
            },
            // ここまで追加・変更
          }}
        >
          <Typography
            variant="body1"
            color='black'
            onClick={() => handleToggle(index)}
            sx={{ cursor: 'pointer', fontWeight: 'bold' }}
          >
            {suggestion.title}
          </Typography>

          {suggestion.isOpen && (
            <Typography variant="body2" color='black' sx={{ mt: 1 }}>
              {suggestion.content}
            </Typography>
          )}
        </Paper>
      ))}
      </Box>
    </Box>
  );
};