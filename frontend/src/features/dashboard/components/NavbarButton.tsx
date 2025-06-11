import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';

interface NavbarButtonProps {
  path: string;
  children: ReactNode;
}

export const NavbarButton = ({ path, children }: NavbarButtonProps) => {
  const navigate = useNavigate();
  return (
    <Button variant="text" color="inherit" onClick={() => navigate(path)}>
      {children}
    </Button>
  );
};
