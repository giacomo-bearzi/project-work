import { Paper, Stack } from '@mui/material';
import { NavbarButton } from './NavbarButton.tsx';

export const Navbar = () => {
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
        <NavbarButton path="/">Panoramica</NavbarButton>
        <NavbarButton path="/">Monitoraggio produzione</NavbarButton>
        <NavbarButton path="/">Segnalazioni e problemi</NavbarButton>
        <NavbarButton path="/">Pianificazione attività</NavbarButton>
      </Stack>
    </Paper>
  );
};
