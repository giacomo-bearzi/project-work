import type { Theme } from '@emotion/react';
import { useTheme, type SxProps } from '@mui/material';
import Paper from '@mui/material/Paper';
import type { ReactNode } from 'react';

interface CustomPaperProps {
  children: ReactNode;
  sx?: SxProps<Theme>;
}

export const CustomPaper = ({ children, sx }: CustomPaperProps) => {
  const theme = useTheme();
  const currentTheme = theme.palette.mode;

  if (currentTheme === 'dark') {
    return (
      <Paper
        sx={{
          p: 1,
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
          ...sx,
        }}
      >
        {children}
      </Paper>
    );
  }

  return (
    <Paper
      sx={{
        p: 1,
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
        ...sx,
      }}
    >
      {children}
    </Paper>
  );
};
