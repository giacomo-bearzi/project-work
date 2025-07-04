import Stack from '@mui/material/Stack';
import { CustomPaper } from '../../../../components/CustomPaper.tsx';
import { useAuth } from '../../../dashboard-login/context/AuthContext.tsx';
import { NavbarButton } from '../NavbarButton.tsx';
import {
  AssignmentRounded,
  BarChartRounded,
  ErrorRounded,
  GroupRounded,
} from '@mui/icons-material';

export const NavbarDesktop = () => {
  const { user } = useAuth();

  if (!user) return;

  const isAdmin = user.role === 'admin';

  return (
    <CustomPaper
      elevation={2}
      sx={{
        borderRadius: 9,
        p: 1,
        width: 'fit-content',
        fontSize: '0.9rem',
      }}
    >
      <Stack direction="row" gap={1}>
        <NavbarButton path="/overview">
          <BarChartRounded fontSize="small" />
          Panoramica
        </NavbarButton>
        <NavbarButton path="/issues">
          <ErrorRounded fontSize="small" />
          Segnalazioni
        </NavbarButton>
        <NavbarButton path="/tasks">
          <AssignmentRounded fontSize="small" />
          Attività
        </NavbarButton>
        {isAdmin && (
          <NavbarButton path="/users">
            <GroupRounded fontSize="small" />
            Utenti
          </NavbarButton>
        )}
      </Stack>
    </CustomPaper>
  );
};
