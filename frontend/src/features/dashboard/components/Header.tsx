import { Stack } from '@mui/material';

import { Navbar } from './Navbar.tsx';
import { Logo } from './Logo.tsx';
import { UserMenu } from './UserMenu.tsx';

export const Header = () => {
  return (
    <Stack
      alignItems={'center'}
      justifyContent={'space-between'}
      direction={'row'}
      px={1}
    >
      <Logo />
      <Navbar />
      <UserMenu />
    </Stack>
  );
};
