import { IconButton, Tooltip } from '@mui/material';
import { useThemeMode } from '../../../context/ThemeContext.tsx';
import { DarkMode, LightMode } from '@mui/icons-material';

export const ToggleThemeModeButton = () => {
  const { mode, toggleTheme } = useThemeMode();

  const handleButtonClick = () => {
    toggleTheme();
  };

  // Variabile per gestire il tipo di icona in base al valore di `mode`.
  const icon = mode === 'light' ? <DarkMode /> : <LightMode />;

  return (
    <Tooltip
      title={`Cambia tema di visualizzazione`}
      arrow
    >
      <IconButton
        aria-label="Cambia tema di visualizzazione"
        onClick={handleButtonClick}
      >
        {icon}
      </IconButton>
    </Tooltip>
  );
};
