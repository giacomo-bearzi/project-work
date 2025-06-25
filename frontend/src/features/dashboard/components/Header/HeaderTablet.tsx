import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { CustomPaper } from '../../../../components/CustomPaper.tsx';
import IconButton from '@mui/material/IconButton';
import { MenuRounded } from '@mui/icons-material';
import { Logo } from '../Logo.tsx';
import { UserDropdown } from '../UserDropdown.tsx';
import { CustomHeaderDrawer } from '../CustomHeaderDrawer.tsx';

export const HeaderTablet = () => {
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
            {/* <CustomPaper sx={{ p: 1, borderRadius: 9 }}>
              <IconButton onClick={() => setToggleDrawer(true)}>
                <MenuRounded />
              </IconButton>
            </CustomPaper> */}
            <Logo />
            {/* <UserDropdown
              fullName={user!.fullName}
              role={user!.role}
              onLogout={logout}
            /> */}
          </Toolbar>
        </AppBar>
      </Box>
      {/* <CustomHeaderDrawer
        toggleDrawer={toggleDrawer}
        setToggleDrawer={setToggleDrawer}
      /> */}
    </>
  );
};
