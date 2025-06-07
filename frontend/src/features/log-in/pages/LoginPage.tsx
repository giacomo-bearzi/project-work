import { Box, Container } from '@mui/material';
import { LogoAndCompanyName } from '../components/LogoAndCompanyName.tsx';
import { ToggleThemeModeButton } from '../../theme/components/ToggleThemeModeButton.tsx';
import { LogInForm } from '../components/LoginForm.tsx';

export const LogInPage = () => {
  return (
    <Container
      maxWidth="xl"
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="end"
        py={2}
      >
        <ToggleThemeModeButton />
      </Box>
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Container maxWidth="xs">
          <LogInForm />
        </Container>
      </Box>
      <Box
        display="flex"
        justifyContent="start"
        py={2}
      >
        <LogoAndCompanyName />
      </Box>
    </Container>
  );
};
