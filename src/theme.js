// src/theme.js
import { createTheme } from '@mui/material/styles';
import { blue, pink } from '@mui/material/colors';

// Define your custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: blue[600], // Custom primary color
    },
    secondary: {
      main: pink[500], // Custom secondary color
    },
    background: {
      default: '#f0f2f5', // Light grey background
      paper: '#ffffff', // White paper background
    },
    text: {
      primary: '#333333', // Dark text
      secondary: '#666666', // Light text
    },
  },
  typography: {
    // Define default font family
    fontFamily: '"Roboto Mono", monospace',
    h5: {
      fontWeight: 700,
      color: 'primary.main',
    },
    body1: {
      color: 'text.primary',
    },
    // Define variants as needed
  },
  components: {
    // Customize MUI components here
    MuiButton: {
      styleOverrides: {
        contained: {
          borderRadius: '8px',
          padding: '10px 20px',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: '"Roboto Mono", monospace', // Ensure Typography uses Roboto Mono
        },
      },
    },
    // ... other component customizations
  },
});

export default theme;
