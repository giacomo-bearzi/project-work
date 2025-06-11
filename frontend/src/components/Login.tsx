import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../features/log-in/context/AuthContext';
import api from '../utils/axios';

interface LoginResponse {
  token: string;
  user: User;
}
export interface User {
  _id: string;
  username: string;
  role: string;
  fullName: string;
}

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const theme = useTheme();

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const [themeMode, setThemeMode] = useState<
    '/background-light.svg' | '/background-dark.svg'
  >('/background-light.svg');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const responsePromise = api.post<LoginResponse>('/auth/login', {
      username,
      password,
    });

    const delayPromise = delay(500);

    try {
      const [response] = await Promise.all([responsePromise, delayPromise]);

      login(response.data.user, response.data.token);

      switch (response.data.user.role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'manager':
          navigate('/manager');
          break;
        case 'operator':
          navigate('/operator');
          break;
        default:
          navigate('/');
      }
    } catch (err) {
      await delayPromise;
      setError('Credenziali non valide');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (theme.palette.mode === 'light') {
      setThemeMode('/background-light.svg');
    } else {
      setThemeMode('/background-dark.svg');
    }
  }, [theme.palette.mode]);

  return (
    <div
      style={{
        backgroundImage: `url(${themeMode})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        width: '100dvw',
        height: '100dvh',
        padding: 0,
        margin: 0,
      }}
    >
      <Container
        component="main"
        maxWidth="xs"
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100dvh',
          }}
        >
          <Paper
            elevation={3}
            sx={{
              padding: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <img
              alt="Logo di TechManufactoring S.p.A."
              src="/logo.svg"
              style={{ width: '6rem' }}
            />
            <Typography
              component="h1"
              variant="h6"
            >
              Accedi al tuo account
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  sx: { paddingRight: '0px' },
                  endAdornment: (
                    <InputAdornment
                      position="end"
                      sx={{ marginRight: 0, marginLeft: 0, padding: 0 }}
                    >
                      <IconButton
                        disableRipple
                        disableFocusRipple
                        aria-label="toggle password visibility"
                        onMouseDown={() => {
                          setShowPassword(true);
                          setIsPressed(true);
                        }}
                        onMouseUp={() => {
                          setShowPassword(false);
                          setIsPressed(false);
                        }}
                        onMouseLeave={() => {
                          setShowPassword(false);
                          setIsPressed(false);
                        }}
                        edge="end"
                        sx={{
                          padding: '15px 10px',
                          borderRadius: '0 3px 3px 0',
                          margin: 0,
                          minWidth: 0,
                          backgroundColor: isPressed ? '#ccc' : 'transparent',
                          transition: 'background-color 0.2s ease',
                        }}
                      >
                        {showPassword ? (
                          <VisibilityOffOutlinedIcon />
                        ) : (
                          <VisibilityOutlinedIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {error && (
                <Alert
                  severity="error"
                  sx={{ mt: 2 }}
                >
                  {error}
                </Alert>
              )}

              <Typography
                variant="body1"
                align="right"
                sx={{ mt: 1 }}
              >
                <Typography
                  component={Link}
                  to="#"
                  sx={{
                    cursor: 'pointer',
                  }}
                >
                  Hai dimenticato la password?
                </Typography>
              </Typography>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <CircularProgress
                    size={24}
                    color="inherit"
                  />
                ) : (
                  'Accedi'
                )}
              </Button>
            </Box>
          </Paper>
        </Box>
      </Container>
    </div>
  );
};

export default Login;
