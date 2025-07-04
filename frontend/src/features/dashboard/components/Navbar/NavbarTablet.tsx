import Stack from '@mui/material/Stack';
import { CustomPaper } from '../../../../components/CustomPaper.tsx';
import { NavbarButton } from '../NavbarButton.tsx';
import { useAuth } from '../../../dashboard-login/context/AuthContext.tsx';
import {
  AssignmentRounded,
  BarChartRounded,
  ErrorRounded,
  GroupRounded,
} from '@mui/icons-material';

export const NavbarTablet = () => {
  const { user } = useAuth();
  const isAdmin = user!.role === 'admin';

  return (
    <CustomPaper sx={{ p: 1, borderRadius: 8, width: 'fit-content' }} elevation={2}>
      <Stack direction="row" gap={1}>
        <NavbarButton sx={{ borderRadius: 8 }} path="/overview">
          <BarChartRounded fontSize="small" />
        </NavbarButton>
        <NavbarButton sx={{ borderRadius: 8 }} path="/issues">
          <ErrorRounded fontSize="small" />
        </NavbarButton>
        <NavbarButton sx={{ borderRadius: 8 }} path="/tasks">
          <AssignmentRounded fontSize="small" />
        </NavbarButton>
        {isAdmin && (
          <NavbarButton path="/users">
            <GroupRounded fontSize="small" />
          </NavbarButton>
        )}
      </Stack>
    </CustomPaper>
  );
};
