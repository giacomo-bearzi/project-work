import Typography from '@mui/material/Typography';
import type { ApiUser } from '../../log-in/types/types.api';
import Avatar from '@mui/material/Avatar';

const avatarColors: Record<
  ApiUser['role'],
  { backgroundColor: string; color: string }
> = {
  operator: {
    backgroundColor: '#31C8FF',
    color: '#000000',
  },
  manager: { backgroundColor: '#FFC758', color: '#FFFFFF' },
  admin: { backgroundColor: '#F35865', color: '#FFFFFF' },
};

interface CustomAvatarProps {
  size: string;
  role: ApiUser['role'];
  fontSize?: string;
  fullName: ApiUser['fullName'];
}

export const CustomAvatar = ({
  size,
  role,
  fontSize,
  fullName,
}: CustomAvatarProps) => {
  return (
    <Avatar sx={{ ...avatarColors[role], height: size, width: size }}>
      <Typography
        component={'span'}
        sx={{ fontWeight: 500, fontSize: fontSize }}
      >
        {fullName[0]}
      </Typography>
    </Avatar>
  );
};
