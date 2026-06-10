// src/theme.js
import { createTheme } from '@mui/material/styles';

// ZEAL design tokens — deep black / electric blue
export const zeal = {
  bg: '#04070d',
  bgRaised: '#070d18',
  surface: 'rgba(11, 19, 34, 0.72)',
  surfaceSolid: '#0b1322',
  border: 'rgba(59, 130, 246, 0.18)',
  borderStrong: 'rgba(96, 165, 250, 0.4)',
  blue: '#3b82f6',
  blueLight: '#60a5fa',
  cyan: '#38bdf8',
  glow: 'rgba(59, 130, 246, 0.35)',
  text: '#e6edf7',
  textDim: '#8ca3c7',
  gradientText:
    'linear-gradient(100deg, #e6edf7 0%, #60a5fa 55%, #38bdf8 100%)',
  gradientBtn: 'linear-gradient(120deg, #2563eb 0%, #3b82f6 55%, #38bdf8 100%)',
};

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: zeal.blue,
      light: zeal.blueLight,
    },
    secondary: {
      main: zeal.cyan,
    },
    background: {
      default: zeal.bg,
      paper: zeal.surfaceSolid,
    },
    text: {
      primary: zeal.text,
      secondary: zeal.textDim,
    },
    divider: zeal.border,
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h1: { fontFamily: '"Space Grotesk", "Inter", sans-serif', fontWeight: 700 },
    h2: { fontFamily: '"Space Grotesk", "Inter", sans-serif', fontWeight: 700 },
    h3: { fontFamily: '"Space Grotesk", "Inter", sans-serif', fontWeight: 700 },
    h4: { fontFamily: '"Space Grotesk", "Inter", sans-serif', fontWeight: 700 },
    h5: { fontFamily: '"Space Grotesk", "Inter", sans-serif', fontWeight: 600 },
    h6: { fontFamily: '"Space Grotesk", "Inter", sans-serif', fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: zeal.bg,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '10px 22px',
        },
        containedPrimary: {
          background: zeal.gradientBtn,
          boxShadow: '0 8px 24px rgba(37, 99, 235, 0.35)',
          '&:hover': {
            background: zeal.gradientBtn,
            filter: 'brightness(1.12)',
            boxShadow: '0 10px 30px rgba(56, 189, 248, 0.45)',
          },
        },
        outlined: {
          borderColor: zeal.borderStrong,
          '&:hover': {
            borderColor: zeal.cyan,
            backgroundColor: 'rgba(56, 189, 248, 0.08)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: zeal.surface,
          backgroundImage: 'none',
          border: `1px solid ${zeal.border}`,
          backdropFilter: 'blur(14px)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(4, 9, 18, 0.6)',
          borderRadius: 10,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: zeal.border,
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: zeal.borderStrong,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: zeal.blueLight,
            boxShadow: `0 0 0 3px rgba(59, 130, 246, 0.18)`,
          },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          color: zeal.textDim,
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          color: zeal.textDim,
          '&.Mui-checked': {
            color: zeal.cyan,
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          border: `1px solid ${zeal.border}`,
        },
      },
    },
  },
});

export default theme;
