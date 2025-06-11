import { Button } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

interface NavbarButtonProps {
  path: string;
  children: ReactNode;
}

export const NavbarButton = ({ path, children }: NavbarButtonProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isSelected = location.pathname === path;
  return (
    <Button
      variant="text"
      color="inherit"
      onClick={() => navigate(path)}
      sx={{
        ...(isSelected && {
          backgroundColor: 'rgb(248, 219, 224)',
        }),
        '&:hover': {
          backgroundColor: 'rgb(248, 219, 224)',
        },
      }}
    >
      {children}
    </Button>
  );
};
