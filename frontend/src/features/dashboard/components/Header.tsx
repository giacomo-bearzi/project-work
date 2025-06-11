import { Stack } from '@mui/material';

import { Navbar } from './Navbar.tsx';
import { LogoAndDashboard } from './LogoAndDashboard.tsx';
import { UserMenu } from './UserMenu.tsx';

export const Header = () => {
  return (
    <Stack
      alignItems={'center'}
      justifyContent={'space-between'}
      direction={'row'}
      px={1}
    >
      <LogoAndDashboard />
      <Navbar />
      <UserMenu />
    </Stack>
  );
};
