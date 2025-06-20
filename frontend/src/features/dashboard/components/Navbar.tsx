import Stack from '@mui/material/Stack';
import { CustomPaper } from '../../../components/CustomPaper.tsx';
// import { useAuth } from '../../log-in/context/AuthContext.tsx';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { NavbarButton } from './NavbarButton.tsx';

export const Navbar = () => {
  // const { user } = useAuth();

  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'));

  // const isAdmin = user!.role === 'admin';

  if (isTablet) {
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
            path="/planning"
          >
            Attività
          </NavbarButton>
          {/* <NavbarButton path="/planning">Monitoraggio attività</NavbarButton> */}
          {/* {isAdmin && (
      <NavbarButton path="/gestione-utenti">Gestione Utenti</NavbarButton>
      */}
        </Stack>
      </CustomPaper>
    );
  }

  return (
    <CustomPaper
      sx={{
        borderRadius: 9,
        p: 1,
        width: 'fit-content',
        fontSize: '0.9rem',
      }}
    >
      <Stack
        direction="row"
        gap={1}
      >
        <NavbarButton path="/overview">Panoramica</NavbarButton>
        <NavbarButton path="/issues">Segnalazioni</NavbarButton>
        <NavbarButton path="/planning">Attività</NavbarButton>
        {/* <NavbarButton path="/planning">Monitoraggio attività</NavbarButton> */}
        {/* {isAdmin && (
          <NavbarButton path="/gestione-utenti">Gestione Utenti</NavbarButton>
        )} */}
      </Stack>
    </CustomPaper>
  );
};
