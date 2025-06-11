import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { Header } from "../components/Header.tsx";
import { useAuth } from "../../log-in/context/AuthContext.tsx";
import { useEffect, useState } from "react";
import type { User } from "../../../components/Login.tsx";
import AddIcon from "@mui/icons-material/Add";
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Close as CancelIcon,
} from "@mui/icons-material";
import axios from "axios";

export const GestioneUtenti = () => {
  const { token } = useAuth(); // assicurati che accessToken sia disponibile
  const [users, setUsers] = useState([]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    fullName: "",
    username: "",
    password: "",
    role: "operator",
  });

 const handleAddUser = async () => {
  try {
    await axios.post("http://localhost:5000/api/users", newUser, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    await fetchUsers(); // <-- aggiorna la lista dopo l'aggiunta
    handleCloseAddDialog(); // chiudi il dialog
  } catch (err: any) {
    console.error(
      "Errore durante la creazione dell'utente:",
      err.response?.data || err
    );
  }
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

  const handleCloseAddDialog = () => {
    setAddDialogOpen(false);
  };
  const handleOpenAddDialog = () => {
    setNewUser({
      fullName: "",
      username: "",
      password: "",
      role: "operator",
    });
    setAddDialogOpen(true);
  };

  const fetchUsers = async () => {
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

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Box p={1} height={"100dvh"}>
      <Paper
        elevation={1}
        sx={{
          borderRadius: 11,
          p: 1,
          background: "rgba(255, 255, 255, 0.07)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
          height: "100%",
        }}
      >
        <Stack direction="column" gap={1} sx={{ height: "100%" }}>
          <Header />

          <Grid
            container
            spacing={1}
            sx={{
              height: "100%",
            }}
          >
            <Grid size={2}>
              <Paper
                elevation={1}
                sx={{
                  borderRadius: 11,
                  p: 1,
                  background: "rgba(255, 255, 255, 0.07)",
                  backdropFilter: "blur(20px) saturate(180%)",
                  WebkitBackdropFilter: "blur(20px) saturate(180%)",
                  boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                  height: "100%",
                }}
              >
                {" "}
              </Paper>
            </Grid>
            <Grid size={10}>
              <Paper
                elevation={1}
                sx={{
                  borderRadius: 11,
                  p: 1,
                  background: "rgba(255, 255, 255, 0.07)",
                  backdropFilter: "blur(20px) saturate(180%)",
                  WebkitBackdropFilter: "blur(20px) saturate(180%)",
                  boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div>
                  <Button
                    variant="contained"
                    onClick={handleOpenAddDialog}
                    startIcon={<AddIcon />}
                  >
                    Aggiungi User
                  </Button>{" "}
                </div>
                {users.length > 0 && (
                  <TableContainer
                    component={Paper}
                    sx={{
                      borderRadius: 11,
                      background: "rgba(255, 255, 255, 0.07)",
                      backdropFilter: "blur(20px) saturate(180%)",
                      WebkitBackdropFilter: "blur(20px) saturate(180%)",
                      boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                      display: "flex",
                      maxHeight: "700px",
                    }}
                  >
                    <Table stickyHeader aria-label="sticky table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Full Name</TableCell>
                          <TableCell>Username</TableCell>
                          <TableCell>Ruolo</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {users.map((u: User) => {
                          return (
                            <TableRow key={u._id}>
                              <TableCell>{u.fullName}</TableCell>
                              <TableCell>{u.username}</TableCell>
                              <TableCell>{u.role}</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
                <Dialog
                  open={addDialogOpen}
                  onClose={handleCloseAddDialog}
                  fullWidth
                >
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
            </Grid>
          </Grid>
        </Stack>
      </Paper>
    </Box>
  );
};
