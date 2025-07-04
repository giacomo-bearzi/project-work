import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { CustomPaper } from '../../../components/CustomPaper.tsx';

import type { ReactNode } from 'react';
import { ResponsiveHeader } from '../components/Header/ResponsiveHeader.tsx';

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <Box p={1} sx={{ width: '100dvw', height: '100dvh' }}>
      <Stack direction="column" gap={1} sx={{ height: '100%', width: '100%' }}>
        <ResponsiveHeader />
        <CustomPaper
          sx={{
            borderRadius: 6,
            p: 1,
            height: '100%',
            width: '100%',
            overflowY: 'auto',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          {children}
        </CustomPaper>
      </Stack>
    </Box>
  );
};
