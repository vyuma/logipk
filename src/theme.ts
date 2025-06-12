import {
  createTheme,
} from '@mui/material';

// カスタムテーマの定義 (近未来的なデザイン用)
export const futuristicTheme = createTheme({
  palette: {
    mode: 'dark', // ダークモードを基調とする
    primary: {
      main: '#00A786', // 明るいグリーン (アクセントカラー)
      light: '#88E0CC', // メインカラーより明るい緑 (もしあれば)
      dark: '#007A60',//メインカラーより暗い緑
    },
    secondary: {
      main: '#2563eb', // 青 (サブアクセント)
      light: '#60a5fa', // より明るい青
    },
    background: {
      default: '#000000', // 非常に濃い青 (全体の背景)
      paper: '#00043A', // やや明るい濃いグレー (カードやコンポーネントの背景)
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