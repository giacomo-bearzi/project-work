import {
  KeyboardArrowDownRounded,
  KeyboardArrowUpRounded,
  Logout,
  NotificationsRounded,
  Settings,
} from '@mui/icons-material';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import { type MouseEvent, useState } from 'react';
import { useAuth } from '../../../log-in/context/AuthContext.tsx';
import { useThemeMode } from '../../../theme/context/ThemeContext.tsx';
import { UserInfoDesktop } from '../UserInfo/UserInfoDesktop.tsx';

export const UserMenuDesktop = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const { logout } = useAuth();

  const { toggleTheme } = useThemeMode();

  const icon = open ? <KeyboardArrowUpRounded /> : <KeyboardArrowDownRounded />;

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Stack
        display={'flex'}
        flexDirection={'row'}
        alignItems={'center'}
        gap={3}
      >
        <IconButton>
          <Badge
            badgeContent={4}
            color="secondary"
          >
            <NotificationsRounded />
          </Badge>
        </IconButton>
        <Stack
          onClick={handleClick}
          display={'flex'}
          flexDirection={'row'}
          alignItems={'center'}
          gap={2}
          p={1}
          sx={{
            ':hover': {
              borderRadius: 5,
              cursor: 'pointer',
              backgroundColor: 'red',
            },
          }}
        >
          <UserInfoDesktop />
          <IconButton>{icon}</IconButton>
        </Stack>
      </Stack>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              'overflow': 'visible',
              'filter': 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              'mt': 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem
          onClick={() => {
            toggleTheme();
            handleClose();
          }}
        >
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Cambia tema
        </MenuItem>
        <MenuItem onClick={() => logout()}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Esci
        </MenuItem>
      </Menu>
    </>
  );
};

// @TODO: suddividere in altri componenti.
// @TODO: sistemare lo stile.
