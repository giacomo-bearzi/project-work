import type { Theme } from '@emotion/react';
import { Button, useTheme, type SxProps } from '@mui/material';
import type { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface NavbarButtonProps {
  path: string;
  children: ReactNode;
  sx?: SxProps<Theme>;
}

export const NavbarButton = ({ path, children, sx }: NavbarButtonProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const isSelected = location.pathname === path;

  const colors = {
    light: {
      color: isSelected ? '#FFF' : '#000',
      backgroundColor: isSelected ? '#000' : 'rgba(255, 255, 255, 0.1)',
      '&:hover': {
        backgroundColor: isSelected ? '#000' : 'rgba(0, 0, 0, 0.1)',
        color: isSelected ? '#FFF' : '#000',
      },
    },
    dark: {
      color: isSelected ? '#000' : '#FFF',
      backgroundColor: isSelected ? '#FFF' : 'rgba(0, 0, 0, 0)',
      '&:hover': {
        backgroundColor: isSelected ? '#FFF' : 'rgba(255, 255, 255, 0.1)',
        color: isSelected ? '#000' : '#FFF',
      },
    },
  };

  const currentTheme = colors[theme.palette.mode];

  const handleButtonClick = () => {
    navigate(path);
  };

  return (
    <Button
      variant="text"
      color="inherit"
      onClick={handleButtonClick}
      sx={{
        py: 1,
        px: 2,
        display: 'flex',
        gap: 1,
        alignItems: 'center',
        ...currentTheme,
        ...sx,
      }}
    >
      {children}
    </Button>
  );
};
