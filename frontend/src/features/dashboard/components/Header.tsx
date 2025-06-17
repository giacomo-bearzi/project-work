import { MenuRounded } from '@mui/icons-material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { useTheme } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useState } from 'react';
import { CustomPaper } from '../../../components/CustomPaper.tsx';
import { CustomHeaderDrawer } from './CustomHeaderDrawer.tsx';
import { Logo } from './Logo.tsx';
import { Navbar } from './Navbar.tsx';
import { UserMenu } from './UserMenu.tsx';

export const Header = () => {
  const [toggleDrawer, setToggleDrawer] = useState<boolean>(false);

  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'));

  if (isTablet) {
    return (
      <>
        <Box sx={{ flexGrow: 1, width: '100%' }}>
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
              <CustomPaper sx={{ p: 1, borderRadius: 9 }}>
                <IconButton onClick={() => setToggleDrawer(true)}>
                  <MenuRounded />
                </IconButton>
              </CustomPaper>
              <Logo />
              <UserMenu />
            </Toolbar>
          </AppBar>
        </Box>
        <CustomHeaderDrawer
          toggleDrawer={toggleDrawer}
          setToggleDrawer={setToggleDrawer}
        />
      </>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, width: '100%' }}>
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
          <Navbar />
          <Logo />
          <UserMenu />
        </Toolbar>
      </AppBar>
    </Box>
  );
};
