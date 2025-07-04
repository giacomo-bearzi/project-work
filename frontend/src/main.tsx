import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { CustomThemeProvider } from './features/dashboard-theme/context/ThemeContext.tsx';
import { CssBaseline } from '@mui/material';

createRoot(document.getElementById('root')!).render(
  <CustomThemeProvider>
    <CssBaseline />
    <App />
  </CustomThemeProvider>
);
