import Stack from '@mui/material/Stack';
import { CustomPaper } from '../../../../components/CustomPaper.tsx';
import { NavbarButton } from '../NavbarButton.tsx';

export const NavbarTablet = () => {
  return (
    <CustomPaper sx={{ p: 1, borderRadius: 8, width: '100%' }}>
      <Stack
        direction="column"
        gap={1}
      >
        <NavbarButton
          sx={{ borderRadius: 8 }}
          path="/overview"
        >
          Dashboard
        </NavbarButton>
        <NavbarButton
          sx={{ borderRadius: 8 }}
          path="/issues"
        >
          Segnalazioni
        </NavbarButton>
        <NavbarButton
          sx={{ borderRadius: 8 }}
          path="/tasks"
        >
          Attività
        </NavbarButton>
        {/* <NavbarButton path="/tasks">Monitoraggio attività</NavbarButton> */}
        {/* {isAdmin && (
    <NavbarButton path="/gestione-utenti">Gestione Utenti</NavbarButton>
    */}
      </Stack>
    </CustomPaper>
  );
};
