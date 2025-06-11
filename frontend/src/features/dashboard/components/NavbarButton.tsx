import { Typography } from '@mui/material';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface NavbarButtonProps {
  path: string;
  children: ReactNode;
}

export const NavbarButton = ({ path, children }: NavbarButtonProps) => {
  return (
    <Link
      to={path}
      className="p-4"
    >
      <Typography
        component="span"
        variant="body2"
        fontWeight={500}
      >
        {children}
      </Typography>
    </Link>
  );
};
