import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { useAuth } from '../../../dashboard-login/context/AuthContext.tsx';
import type { ApiUser } from '../../../dashboard-login/types/types.api.ts';
import Typography from '@mui/material/Typography';

const avatarColors: Record<ApiUser['role'], { backgroundColor: string; color: string }> = {
  operator: {
    backgroundColor: '#31C8FF',
    color: '#000',
  },
  manager: { backgroundColor: '#FFAB70', color: '#FFF' },
  admin: { backgroundColor: '#F97583', color: '#FFF' },
};

const userRole: Record<ApiUser['role'], string> = {
  operator: 'Operatore',
  manager: 'Manager',
  admin: 'Amministratore',
};

export const UserInfoDesktop = () => {
  const { user } = useAuth();

  if (!user) return;

  return (
    <Stack display={'flex'} flexDirection={'row'} alignItems={'center'} gap={1}>
      <Avatar
        sx={{
          ...avatarColors[user.role],
          width: 36,
          height: 36,
          fontWeight: 500,
        }}
      >
        {user.fullName[0]}
      </Avatar>
      <Stack display={'flex'} flexDirection={'column'} alignItems={'start'} gap={0}>
        <Typography fontWeight={500} fontSize={'0.9rem'}>
          {user.fullName}
        </Typography>
        <Typography fontSize={'0.8rem'} sx={{ opacity: 0.8 }}>
          {userRole[user.role]}
        </Typography>
      </Stack>
    </Stack>
  );
};
