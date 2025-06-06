import { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  TextField,
  Select,
  MenuItem,
  DialogContent,
  Dialog,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import axios from "axios";
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Close as CancelIcon,
} from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import type { User } from "../components/Login";

const AdminDashboard = () => {
  const { user, logout, token } = useAuth(); // assicurati che accessToken sia disponibile
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState({
    fullName: "",
    username: "",
    role: "",
  });
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    fullName: "",
    username: "",
    password: "",
    role: "operator",
  });

  if (!user) {
    return <Typography>Loading user data...</Typography>;
  }
  const handleOpenAddDialog = () => {
    setNewUser({
      fullName: "",
      username: "",
      password: "",
      role: "operator",
    });
    setAddDialogOpen(true);
  };

  const handleCloseAddDialog = () => {
    setAddDialogOpen(false);
  };

  const handleNewUserChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({
      ...prev,
      [name!]: value,
    }));
  };

  const handleAddUser = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/users", newUser, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers((prev) => [...prev, res.data.user]); // aggiungi alla lista
      handleCloseAddDialog();
    } catch (err: any) {
      console.error(
        "Errore durante la creazione dell'utente:",
        err.response?.data || err
      );
    }
  };

  const handleShowUsers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Errore nel recupero degli utenti:", err);
    }
  };

  const handleEditClick = (u: User) => {
    setEditingUserId(u._id);
    setEditValues({
      fullName: u.fullName,
      username: u.username,
      role: u.role,
    });
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setEditValues({ fullName: "", username: "", role: "" });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    setEditValues((prev) => ({
      ...prev,
      [name!]: value,
    }));
  };

  const handleSaveEdit = async (id: string) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/users/${id}`,
        editValues,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // aggiorna localmente
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, ...editValues } : u))
      );

      handleCancelEdit();
    } catch (err) {
      console.error("Errore durante l'aggiornamento:", err);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Navbar
        title={`Dashboard ${user?.role}`}
        userFullName={user?.fullName}
        onLogout={logout}
      />
      <Container>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Benvenuto, {user?.fullName}
          </Typography>
          <Box sx={{ my: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleShowUsers}
              sx={{ mr: 2 }}
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
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            sx={{ mt: 1, mb: 2 }}
            onClick={handleOpenAddDialog}
          >
            Aggiungi Utente
          </Button>

          {users.length > 0 && (
            <TableContainer component={Paper} sx={{ maxHeight: 500 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell>Full Name</TableCell>
                    <TableCell>Username</TableCell>
                    <TableCell>Ruolo</TableCell>
                    <TableCell align="right">Azioni</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((u: User) => {
                    const isEditing = editingUserId === u._id;

                    return (
                      <TableRow
                        key={u._id}
                        sx={isEditing ? { backgroundColor: "grey" } : {}}
                      >
                        <TableCell>
                          {isEditing ? (
                            <TextField
                              name="fullName"
                              value={editValues.fullName}
                              onChange={handleChange}
                              size="small"
                            />
                          ) : (
                            u.fullName
                          )}
                        </TableCell>
                        <TableCell>
                          {isEditing ? (
                            <TextField
                              name="username"
                              value={editValues.username}
                              onChange={handleChange}
                              size="small"
                            />
                          ) : (
                            u.username
                          )}
                        </TableCell>
                        <TableCell>
                          {isEditing ? (
                            <Select
                              name="role"
                              value={editValues.role}
                              onChange={handleChange}
                              size="small"
                            >
                              <MenuItem value="admin">admin</MenuItem>
                              <MenuItem value="manager">manager</MenuItem>
                              <MenuItem value="operator">operator</MenuItem>
                            </Select>
                          ) : (
                            u.role
                          )}
                        </TableCell>
                        <TableCell align="right">
                          {isEditing ? (
                            <>
                              <IconButton
                                color="success"
                                onClick={() => handleSaveEdit(u._id)}
                                className="no-focus-ring"
                              >
                                <SaveIcon />
                              </IconButton>
                              <IconButton
                                color="error"
                                onClick={handleCancelEdit}
                                className="no-focus-ring"
                              >
                                <CancelIcon />
                              </IconButton>
                            </>
                          ) : (
                            <IconButton
                              color="primary"
                              onClick={() => handleEditClick(u)}
                              className="no-focus-ring"
                            >
                              <EditIcon />
                            </IconButton>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          <Dialog open={addDialogOpen} onClose={handleCloseAddDialog} fullWidth>
            <DialogTitle>Nuovo Utente</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                name="fullName"
                label="Full Name"
                fullWidth
                value={newUser.fullName}
                onChange={handleNewUserChange}
              />
              <TextField
                margin="dense"
                name="username"
                label="Username"
                fullWidth
                value={newUser.username}
                onChange={handleNewUserChange}
                autoComplete="off"
              />
              <TextField
                margin="dense"
                name="password"
                label="Password"
                type="password"
                fullWidth
                value={newUser.password}
                onChange={handleNewUserChange}
                autoComplete="new-password"
              />
              <Select
                name="role"
                value={newUser.role}
                onChange={handleNewUserChange}
                fullWidth
                sx={{ mt: 2 }}
              >
                <MenuItem value="admin">admin</MenuItem>
                <MenuItem value="manager">manager</MenuItem>
                <MenuItem value="operator">operator</MenuItem>
              </Select>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseAddDialog}>Annulla</Button>
              <Button variant="contained" onClick={handleAddUser}>
                Salva
              </Button>
            </DialogActions>
          </Dialog>
        </Paper>
      </Container>
    </Box>
  );
};

export default AdminDashboard;
