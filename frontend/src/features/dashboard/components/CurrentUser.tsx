import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import type { User } from '../../../components/Login.tsx';
import { useAuth } from '../../log-in/context/AuthContext.tsx';

export const CurrentUser = () => {
  const { user } = useAuth();

  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'));

  const avatarColors: Record<
    User['role'],
    { backgroundColor: string; color: string }
  > = {
    operator: {
      backgroundColor: '#31C8FF',
      color: '#000000',
    },
    manager: { backgroundColor: '#FFC758', color: '#FFFFFF' },
    admin: { backgroundColor: '#F35865', color: '#FFFFFF' },
  };

  if (!user) return null;

  if (isTablet) {
    return (
      <Avatar sx={avatarColors[user.role]}>
        <Typography
          component={'span'}
          variant={'h6'}
          sx={{ fontWeight: 500 }}
        >
          {user.fullName[0]}
        </Typography>
      </Avatar>
    );
  }

  return (
    <Box
      gap={1}
      display="flex"
      alignItems="center"
    >
      <Avatar sx={avatarColors[user.role]}>
        <Typography
          component={'span'}
          variant={'h6'}
          sx={{ fontWeight: 500 }}
        >
          {user.fullName[0]}
        </Typography>
      </Avatar>
      <Box
        display="flex"
        flexDirection="column"
      >
        <Typography
          variant="body2"
          fontWeight={600}
        >
          {user.fullName}
        </Typography>
        <Typography
          variant="body2"
          fontWeight={500}
          sx={{ opacity: 0.8 }}
        >
          {user.formattedRole}
        </Typography>
      </Box>
    </Box>
  );
};
