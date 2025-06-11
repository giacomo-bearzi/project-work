import { InboxRounded, NotificationsRounded, } from '@mui/icons-material';
import { Badge, Box, IconButton, } from '@mui/material';
import { ToggleThemeModeButton } from '../../theme/components/ToggleThemeModeButton';
import { useAuth } from '../../log-in/context/AuthContext.tsx';
import { UserDropdown } from './UserDropdown.tsx';

export const UserMenu = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <Box
      gap={2}
      display={'flex'}
      alignItems={'center'}
    >
      <Box gap={1}>
        <IconButton>
          <InboxRounded />
        </IconButton>
        <IconButton>
          <Badge
            badgeContent={2}
            color="primary"
            overlap="circular"
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <NotificationsRounded />
          </Badge>
        </IconButton>
        <ToggleThemeModeButton />
      </Box>
      <UserDropdown fullName={user.fullName} role={user.role} onLogout={logout} />
    </Box>
  );
};
