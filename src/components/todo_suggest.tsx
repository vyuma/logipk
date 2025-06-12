import { futuristicTheme } from "../theme";
import { Box, Typography } from "@mui/material";

// ToDoサジェストコンポーネントのプレースホルダー
export const TodoSuggest = () => {
  return (
    <Box sx={{height: '100%'}}>
      <Typography sx={{color: futuristicTheme.palette.primary.main}}/>ToDoサジェスト
      <ul className="list-disc list-inside text-gray-700 space-y-2 w-full text-left pl-4">
        <li>データ収集計画を立てる</li>
        <li>ユーザーインタビューを実施する</li>
        <li>プロトタイプを作成する</li>
        <li>A/Bテストを設定する</li>
      </ul>
    </Box>
  );
};