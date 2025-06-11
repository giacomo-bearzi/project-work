import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
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
  Typography,
} from "@mui/material";
import { Header } from "../components/Header.tsx";
import { useAuth } from "../../log-in/context/AuthContext.tsx";
import { useEffect, useState } from "react";
import type { User } from "../../../components/Login.tsx";
import AddIcon from "@mui/icons-material/Add";
import { Delete } from "@mui/icons-material";
import SaveIcon from "@mui/icons-material/Save";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";

import axios from "axios";

export const GestioneUtenti = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editedUser, setEditedUser] = useState<Partial<User>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const [newUser, setNewUser] = useState({
    fullName: "",
    username: "",
    password: "",
    role: "operator",
  });

  const openConfirmDialog = (user: User) => {
    setUserToDelete(user);
    setConfirmOpen(true);
  };

  const closeConfirmDialog = () => {
    setConfirmOpen(false);
    setUserToDelete(null);
  };

  const startEditing = (user: User) => {
    setEditingUserId(user._id);
    setEditedUser(user);
  };

  const cancelEditing = () => {
    setEditingUserId(null);
    setEditedUser({});
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({
      ...prev,
      [name!]: value,
    }));
  };

  const saveEdit = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/users/${editingUserId}`,
        editedUser,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEditingUserId(null);
      setEditedUser({});
      await fetchUsers();
    } catch (err) {
      console.error("Errore durante l'aggiornamento dell'utente:", err);
    }
  };

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

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/users/${userToDelete._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      closeConfirmDialog();
      await fetchUsers(); // aggiorna la lista
    } catch (err) {
      console.error("Errore durante l'eliminazione dell'utente:", err);
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

  const filteredUsers = users.filter((u: User) => {
    const term = searchTerm.toLowerCase();
    return (
      u.fullName.toLowerCase().includes(term) ||
      u.username.toLowerCase().includes(term) ||
      u.role.toLowerCase().includes(term)
    );
  });

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
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Errore nel recupero degli utenti:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchUsers();
    }, 1000); // 500ms di ritardo

    return () => clearTimeout(timeoutId);
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
                <div className="flex justify-between mb-2 mt-2 p-2">
                  <TextField
                    label="Cerca utente"
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    size="small"
                    sx={{ width: 300 }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleOpenAddDialog}
                    startIcon={<AddIcon />}
                  >
                    Aggiungi Utente
                  </Button>
                </div>

                {loading ? (
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height="400px"
                    width="100%"
                  >
                    <CircularProgress size='3rem' color="secondary" />
                  </Box>
                ) : (
                  <TableContainer
                    component={Paper}
                    sx={{
                      borderRadius: 8,
                      background: "rgba(255, 255, 255, 0.07)",
                      backdropFilter: "blur(20px) saturate(180%)",
                      WebkitBackdropFilter: "blur(20px) saturate(180%)",
                      boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                      display: "flex",
                      maxHeight: "650px",
                      overflowY: "scroll",
                      scrollbarWidth: "none",
                      "&::-webkit-scrollbar": {
                        display: "none",
                      },
                    }}
                  >
                    <Table stickyHeader aria-label="sticky table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Full Name</TableCell>
                          <TableCell>Username</TableCell>
                          <TableCell>Ruolo</TableCell>
                          <TableCell align="right">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredUsers.map((u: User) => {
                          const isEditing = editingUserId === u._id;

                          return (
                            <TableRow key={u._id}>
                              <TableCell>
                                {isEditing ? (
                                  <TextField
                                    name="fullName"
                                    value={editedUser.fullName || ""}
                                    onChange={handleEditChange}
                                    size="small"
                                    fullWidth
                                  />
                                ) : (
                                  u.fullName
                                )}
                              </TableCell>
                              <TableCell>
                                {isEditing ? (
                                  <TextField
                                    name="username"
                                    value={editedUser.username || ""}
                                    onChange={handleEditChange}
                                    size="small"
                                    fullWidth
                                  />
                                ) : (
                                  u.username
                                )}
                              </TableCell>
                              <TableCell>
                                {isEditing ? (
                                  <Select
                                    name="role"
                                    value={editedUser.role || ""}
                                    onChange={handleEditChange}
                                    size="small"
                                    fullWidth
                                  >
                                    <MenuItem value="admin">admin</MenuItem>
                                    <MenuItem value="manager">manager</MenuItem>
                                    <MenuItem value="operator">
                                      operator
                                    </MenuItem>
                                  </Select>
                                ) : (
                                  u.role
                                )}
                              </TableCell>
                              <TableCell align="right">
                                {isEditing ? (
                                  <>
                                    <Button
                                      onClick={saveEdit}
                                      variant="contained"
                                      size="small"
                                      sx={{ mr: 1 }}
                                    >
                                      <SaveIcon />
                                    </Button>
                                    <IconButton
                                      onClick={cancelEditing}
                                      // variant="text"
                                      size="small"
                                    >
                                      <ClearIcon />
                                    </IconButton>
                                  </>
                                ) : (
                                  <>
                                    <IconButton
                                      onClick={() => startEditing(u)}
                                      size="small"
                                      sx={{ mr: 1 }}
                                    >
                                      <EditIcon />
                                    </IconButton>
                                    <IconButton
                                      // variant="text"
                                      size="small"
                                      onClick={() => openConfirmDialog(u)}
                                    >
                                      <Delete />
                                    </IconButton>
                                  </>
                                )}
                              </TableCell>
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
                <Dialog open={confirmOpen} onClose={closeConfirmDialog}>
                  <DialogTitle>Conferma Eliminazione</DialogTitle>
                  <DialogContent>
                    Sei sicuro di voler eliminare l’utente{" "}
                    <strong>{userToDelete?.fullName}</strong>?
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={closeConfirmDialog}>Annulla</Button>
                    <Button
                      onClick={handleDeleteUser}
                      color="error"
                      variant="contained"
                    >
                      Elimina
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
