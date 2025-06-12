import { styled } from '@mui/system';
import { Tab } from '@mui/material';
// カスタムスタイルのタブボタン
export const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  // fontSize: theme.typography.pxToRem(15),
//   fontWeight: theme.typography.h5.fontweight,
  marginRight: theme.spacing(1),
  color: theme.palette.text.secondary,
  '&.Mui-selected': {
    color: theme.palette.primary.main,
    border: `none`,
    outline: 'none',
  },
  '&.Mui-focusVisible': {
    backgroundColor: 'rgba(0, 230, 118, 0.1)',
  },
}));