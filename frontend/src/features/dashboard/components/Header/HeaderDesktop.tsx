import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { CustomPaper } from '../../../../components/CustomPaper.tsx';
import { NavbarDesktop } from '../Navbar/NavbarDesktop.tsx';
import { UserMenuDesktop } from '../UserMenu/UserMenuDesktop.tsx';
import { CurrentTime } from './CurrentTime.tsx';
import Stack from '@mui/material/Stack';
import { Logo } from '../Logo.tsx';

export const HeaderDesktop = () => {
  return (
    <CustomPaper sx={{ borderRadius: 6 }}>
      <AppBar
        position="static"
        color="transparent"
        sx={{ boxShadow: 'none', width: '100%' }}
      >
        <Toolbar
          disableGutters
          variant="dense"
          sx={{
            minHeight: 'fit-content',
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Stack
            display={'flex'}
            flexDirection={'row'}
            gap={1}
          >
            <Logo />
            <CurrentTime />
          </Stack>
          <NavbarDesktop />
          <UserMenuDesktop />
        </Toolbar>
      </AppBar>
    </CustomPaper>
  );
};
