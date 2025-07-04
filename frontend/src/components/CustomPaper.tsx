import type { Theme } from '@emotion/react';
import { useTheme, type SxProps } from '@mui/material';
import Paper from '@mui/material/Paper';
import type { ReactNode } from 'react';

const elevationColors: Record<string, Record<number, string>> = {
  dark: {
    1: '#252525',
    2: '#454545',
    3: '#656565',
  },
  light: {
    1: '#F2F2F2',
    2: '#E5E5E5',
    3: '#D8D8D8',
  },
};

interface CustomPaperProps {
  elevation?: number;
  children: ReactNode;
  sx?: SxProps<Theme>;
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

export const CustomPaper = ({ elevation = 1, children, sx, onClick }: CustomPaperProps) => {
  const theme = useTheme();
  const currentTheme = theme.palette.mode;

  return (
    <Paper
      sx={{
        p: 1,
        background: elevationColors[currentTheme][elevation],
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
        backgroundClip: 'padding-box',
        WebkitBackgroundClip: 'padding-box',
        ...sx,
      }}
      onClick={onClick}
    >
      {children}
    </Paper>
  );
};
