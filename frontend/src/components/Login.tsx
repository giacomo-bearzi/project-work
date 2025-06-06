import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import { Container, Box, Typography, TextField, Button, Paper, Alert, InputAdornment, IconButton } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useAuth } from '../context/AuthContext';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { CircularProgress } from '@mui/material';

interface LoginResponse {
    token: string;
    user: {
        _id: string;
        username: string;
        role: string;
        fullName: string;
    };
}

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    paddingTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
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
                    <Box
                        sx={{
                            backgroundColor: 'primary.main',
                            borderRadius: '50%',
                            padding: 1,
                            marginBottom: 2,
                        }}
                    >
                        <LockOutlinedIcon sx={{ color: 'white' }} />
                    </Box>
                    <Typography component="h1" variant="h5">
                        Accedi al tuo account
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
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
                                    <InputAdornment position="end" sx={{ marginRight: 0, marginLeft: 0, padding: 0 }}>
                                        <IconButton
                                            className="no-focus-ring"
                                            aria-label="toggle password visibility"
                                            onMouseDown={() => setShowPassword(true)}
                                            onMouseUp={() => setShowPassword(false)}
                                            onMouseLeave={() => setShowPassword(false)}
                                            edge="end"
                                            sx={{
                                                padding: "15px 10px",
                                                margin: 0,
                                                minWidth: 0,
                                                backgroundColor: 'transparent',
                                            }}
                                        >
                                            {showPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                        {error && (
                            <Alert severity="error" sx={{ mt: 2 }}>
                                {error}
                            </Alert>
                        )}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={isLoading}
                        >
                            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Accedi'}
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default Login; 