import { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import axios from "axios";

const AdminDashboard = () => {
  const { user, logout, token } = useAuth(); // assicurati che accessToken sia disponibile
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);

  if (!user) {
    return <Typography>Loading user data...</Typography>;
  }

  const handleShowUsers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(res.data);
      setOpen(true);
    } catch (err) {
      console.error("Errore nel recupero degli utenti:", err);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

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
            <Button
              variant="contained"
              color="primary"
              sx={{ mr: 2 }}
              onClick={handleShowUsers}
            >
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

      {/* Dialog per la lista utenti */}
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Lista Utenti</DialogTitle>
        <DialogContent>
          <List>
            {users.map((u: any) => (
              <ListItem key={u._id}>
                <ListItemText
                  primary={`${u.fullName} (${u.username})`}
                  secondary={`Ruolo: ${u.role}`}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;
