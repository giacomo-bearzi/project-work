import { IconButton, ListItemIcon, ListItemText, MenuItem, Tooltip } from '@mui/material';
import { useThemeMode } from '../context/ThemeContext.tsx';
import { DarkMode, LightMode } from '@mui/icons-material';

export const ToggleThemeModeButton = ({ asMenuItem = false }: { asMenuItem?: boolean }) => {
  const { mode, toggleTheme } = useThemeMode();
  const icon = mode === 'light' ? <DarkMode fontSize="small" /> : <LightMode fontSize="small" />;
  const label = 'Cambia tema';

  if (asMenuItem) {
    return (
      <MenuItem
        onClick={toggleTheme}
        sx={{
          '& .MuiListItemIcon-root': {
            minWidth: 0,
            marginRight: 1,
            padding: '8px 0',
          },
        }}
      >
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={label} />
      </MenuItem>
    );
  }

  return (
    <Tooltip title={label} arrow>
      <IconButton aria-label={label} onClick={toggleTheme}>
        {icon}
      </IconButton>
    </Tooltip>
  );
};
