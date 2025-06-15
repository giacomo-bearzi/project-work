import {
  InboxRounded,
  LogoutRounded,
  NotificationsRounded,
} from '@mui/icons-material';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { CustomPaper } from '../../../components/CustomPaper.tsx';
import { ToggleThemeModeButton } from '../../theme/components/ToggleThemeModeButton';
import { CurrentUser } from './CurrentUser.tsx';
import { useAuth } from '../../log-in/context/AuthContext.tsx';
// import { UserDropdown } from './UserDropdown.tsx';

export const UserMenu = () => {
  const { logout } = useAuth();

  return (
    <Box
      display={'flex'}
      alignItems={'center'}
      gap={2}
    >
      <CustomPaper sx={{ p: 1, borderRadius: 9 }}>
        <Box
          gap={2}
          display={'flex'}
          alignItems={'center'}
        >
          <ToggleThemeModeButton />
          <Box gap={1}>
            <IconButton>
              <InboxRounded />
            </IconButton>
            <IconButton>
              <Badge
                badgeContent={'😭'}
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
          </Box>
        </Box>
      </CustomPaper>
      <CustomPaper sx={{ p: 1, borderRadius: 9 }}>
        <Box
          gap={2}
          display="flex"
          alignItems="center"
          flexDirection="row"
        >
          <CurrentUser />
          <IconButton onClick={() => logout()}>
            <LogoutRounded />
          </IconButton>
        </Box>
      </CustomPaper>
    </Box>
  );
};
