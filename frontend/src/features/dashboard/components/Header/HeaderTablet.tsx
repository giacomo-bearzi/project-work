import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';

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
            <CustomPaper sx={{ p: 1, borderRadius: 9 }}>
              <IconButton onClick={() => setToggleDrawer(true)}>
                <MenuRounded />
              </IconButton>
            </CustomPaper>
            <Logo />
            <UserDropdown
              fullName={user!.fullName}
              role={user!.role}
              onLogout={logout}
            />
          </Toolbar>
        </AppBar>
      </Box>
      <CustomHeaderDrawer
        toggleDrawer={toggleDrawer}
        setToggleDrawer={setToggleDrawer}
      />
    </>
  );
};
