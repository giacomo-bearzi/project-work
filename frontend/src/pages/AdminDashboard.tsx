import { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Paper,
    AppBar,
    Toolbar,
    IconButton,
    Menu,
    MenuItem,
    Button
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
    };

    if (!user) {
        return <Typography>Loading user data...</Typography>;
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Dashboard Amministratore
                    </Typography>
                    <div>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="inherit"
                        >
                            <AccountCircle />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </Menu>
                    </div>
                </Toolbar>
            </AppBar>
            <Container>
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h5" gutterBottom>
                        Benvenuto, {user?.fullName}
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Questa è la dashboard dell'amministratore. Qui potrai:
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                        <Button variant="contained" color="primary" sx={{ mr: 2 }}>
                            Gestisci Utenti
                        </Button>
                        <Button variant="contained" color="primary" sx={{ mr: 2 }}>
                            Gestisci Prodotti
                        </Button>
                        <Button variant="contained" color="primary">
                            Visualizza Statistiche
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default AdminDashboard; 