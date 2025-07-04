import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import { useAuth } from '../../dashboard-login/context/AuthContext';
import type { ApiGetUser } from '../../users/types/usersTypes';

const avatarColors: Record<ApiGetUser['role'], { backgroundColor: string; color: string }> = {
  operator: {
    backgroundColor: '#31C8FF',
    color: '#000000',
  },
  manager: { backgroundColor: '#FFC758', color: '#FFFFFF' },
  admin: { backgroundColor: '#F35865', color: '#FFFFFF' },
};

interface CustomAvatarProps {
  size: string;
  fontSize?: string;
}

export const CustomAvatar = ({ size, fontSize }: CustomAvatarProps) => {
  const { user } = useAuth();

  if (!user) return;

  return (
    <Avatar sx={{ ...avatarColors[user.role], height: size, width: size }}>
      <Typography component={'span'} sx={{ fontWeight: 500, fontSize: fontSize }}>
        {user.fullName[0]}
      </Typography>
    </Avatar>
  );
};
