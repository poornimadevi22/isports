import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  direction: 'ltr',
  palette: {
    primary: {
      main: '#008755',
    },
    secondary: {
      main: '#8D9093',
    }
  },
  typography: {
    titleStyle: {
      fontSize: '16px',
      fontWeight: 600,
      lineHeight: '23.06px',
    },
  }
});

export default theme;