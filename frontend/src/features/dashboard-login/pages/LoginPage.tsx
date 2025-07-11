import { Alert, Box, CircularProgress, Container } from '@mui/material';
import { useEffect, useState } from 'react';
import { ToggleThemeModeButton } from '../../dashboard-theme/components/ToggleThemeModeButton.tsx';
import { LogInForm } from '../components/LoginForm.tsx';
import { LogoAndCompanyName } from '../components/LogoAndCompanyName.tsx';
import { useAuth } from '../context/AuthContext.tsx';

export const LogInPage = () => {
  const { loading: authLoading, sessionExpired } = useAuth();
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      const timer = setTimeout(() => {
        setShowLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setShowLoading(true);
    }
  }, [authLoading]);

  if (showLoading) {
    return (
      <Container
        maxWidth="sm"
        sx={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container
      maxWidth="xl"
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="end" py={2}>
        <ToggleThemeModeButton />
      </Box>

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <Container maxWidth="xs">
          {sessionExpired && (
            <Alert
              variant="filled"
              severity="warning"
              sx={{ display: 'flex', alignItems: 'center', mb: 2 }}
            >
              Sessione scaduta. Effettua nuovamente il login.
            </Alert>
          )}
          <LogInForm />
        </Container>
      </Box>

      <Box display="flex" justifyContent="start" py={2}>
        <LogoAndCompanyName />
      </Box>
    </Container>
  );
};
