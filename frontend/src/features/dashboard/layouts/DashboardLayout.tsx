import Box from '@mui/material/Box';
import { CustomPaper } from '../../../components/CustomPaper.tsx';
import Stack from '@mui/material/Stack';
import { Header } from '../components/Header.tsx';
import type { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <Box
      p={1}
      sx={{ width: '100dvw', height: '100dvh' }}
    >
      <CustomPaper
        sx={{ p: 1, borderRadius: 10, height: '100%', width: '100%' }}
      >
        <Stack
          direction="column"
          gap={2}
          sx={{ height: '100%', width: '100%' }}
        >
          <Header />
          <CustomPaper
            sx={{
              'borderRadius': 9,
              'p': 1,
              'height': '100%',
              'overflowY': 'auto',
              'scrollbarWidth': 'none',
              '&::-webkit-scrollbar': { display: 'none' },
            }}
          >
            {children}
          </CustomPaper>
        </Stack>
      </CustomPaper>
    </Box>
  );
};
