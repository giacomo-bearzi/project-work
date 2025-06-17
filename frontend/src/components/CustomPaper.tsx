import type { Theme } from '@emotion/react';
import type { SxProps } from '@mui/material';
import Paper from '@mui/material/Paper';
import type { ReactNode } from 'react';

interface CustomPaperProps {
  children: ReactNode;
  sx?: SxProps<Theme>;
}

export const CustomPaper = ({ children, sx }: CustomPaperProps) => {
  return (
    <Paper
      sx={{
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderLeft: '1px solid rgba(255, 255, 255, 0.3)',
        borderTop: '1px solid rgba(255, 255, 255, 0.3)',
        ...sx,
      }}
    >
      {children}
    </Paper>
  );
};
