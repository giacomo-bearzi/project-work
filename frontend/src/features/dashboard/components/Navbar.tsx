import { Paper, Stack } from '@mui/material';
import { NavbarButton } from './NavbarButton.tsx';
import { useAuth } from '../../log-in/context/AuthContext.tsx';

export const Navbar = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  return (
    <Paper
      sx={{
        borderRadius: 8,
        p: 1,
        background: 'rgba(255, 255, 255, 0.07)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        width: 'fit-content',
        fontSize: '0.9rem',
      }}
    >
      <Stack
        direction="row"
        gap={2}
      >
        <NavbarButton path="/dashboard">Dashboard</NavbarButton>
        <NavbarButton path="/issues">Segnalazioni</NavbarButton>
        <NavbarButton path="/tasks">Attività</NavbarButton>
        <NavbarButton path="/planning">Pianificazione attività</NavbarButton>
        {isAdmin && <NavbarButton path="/gestione-utenti">Gestione Utenti</NavbarButton>}
      </Stack>
    </Paper>
  );
};
