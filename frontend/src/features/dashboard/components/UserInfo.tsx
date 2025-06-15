import { Avatar, Box, Typography } from '@mui/material';
import type { User } from '../../../components/Login.tsx';
import { useAuth } from '../../log-in/context/AuthContext.tsx';

export const UserInfo = () => {
  const { user } = useAuth();

  const avatarColors: Record<
    User['role'],
    { backgroundColor: string; color: string }
  > = {
    operator: {
      backgroundColor: '#9ECBFF',
      color: '#000000',
    },
    manager: { backgroundColor: '#FFAB70', color: '#FFFFFF' },
    admin: { backgroundColor: '#F97583', color: '#FFFFFF' },
  };

  if (!user) return;

  return (
    <Box
      gap={1}
      display="flex"
      alignItems="start"
      sx={{ m: 1 }}
    >
      <Avatar sx={{ ...avatarColors[user.role] }}>
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
