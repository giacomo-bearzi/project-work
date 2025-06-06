import { Container, Typography, Box, Paper, Button } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const AdminDashboard = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return <Typography>Loading user data...</Typography>;
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Navbar
        title={`Dashboard ${user.role}`}
        userFullName={user.fullName}
        onLogout={logout}
      />
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
