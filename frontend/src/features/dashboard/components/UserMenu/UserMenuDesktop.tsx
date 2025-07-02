import {
  KeyboardArrowDownRounded,
  KeyboardArrowUpRounded,
  LogoutRounded,
} from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Stack,
} from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { CustomPaper } from '../../../../components/CustomPaper.tsx';
import { useAuth } from '../../../log-in/context/AuthContext.tsx';
import { ToggleThemeModeButton } from '../../../theme/components/ToggleThemeModeButton.tsx';
import { CustomAvatar } from '../CustomAvatar.tsx';
import { Notifications } from '../Header/Notifications.tsx';
import { useState, useRef } from 'react';

const roles = {
  admin: 'Amministratore',
  manager: 'Responsabile',
  operator: 'Operatore',
};

export const UserMenuDesktop = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { logout, user } = useAuth();

  const open = Boolean(anchorEl);

  const icon = open ? <KeyboardArrowUpRounded /> : <KeyboardArrowDownRounded />;

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogoutClick = () => {
    handleClose();
    setDialogOpen(true);
  };

  const confirmLogout = () => {
    setDialogOpen(false);
    logout();
  };

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        gap={2}
      >
        <Notifications />

        <Stack
          gap={2}
          flexDirection="column"
          width="fit-content"
        >
          <CustomPaper
            elevation={2}
            sx={{ borderRadius: 8, position: 'relative' }}
          >
            <Stack
              direction="row"
              gap={2}
            >
              <CustomAvatar
                size="40px"
                role={user!.role}
                fullName={user!.fullName}
              />
              <Stack>
                <Typography
                  variant="body2"
                  fontWeight={600}
                >
                  {user!.fullName}
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight={500}
                  sx={{ opacity: 0.8 }}
                >
                  {roles[user!.role]}
                </Typography>
              </Stack>
              <IconButton onClick={handleClick}>{icon}</IconButton>
            </Stack>
          </CustomPaper>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            PaperProps={{
              sx: {
                width: '100%',
                position: 'absolute',
                mt: 2,
                borderRadius: '0 0 8px 8px',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
              },
            }}
            disableAutoFocusItem
          >
            <ToggleThemeModeButton asMenuItem />

            <MenuItem
              onClick={handleLogoutClick}
              sx={{ padding: '10px 20px' }}
            >
              <LogoutRounded
                fontSize="small"
                sx={{ mr: 1 }}
              />
              Logout
            </MenuItem>
          </Menu>
        </Stack>
      </Box>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      >
        <DialogTitle>Sei sicuro di voler effettuare il logout?</DialogTitle>
        <DialogActions sx={{ justifyContent: 'center', gap: 2 }}>
          <Button
            onClick={() => setDialogOpen(false)}
            color="inherit"
            variant="outlined"
          >
            Annulla
          </Button>
          <Button
            onClick={confirmLogout}
            color="error"
            variant="contained"
          >
            Conferma
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

// @TODO: suddividere in altri componenti.
// @TODO: sistemare lo stile.
