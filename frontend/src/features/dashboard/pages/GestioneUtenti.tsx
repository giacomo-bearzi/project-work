import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
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
import api from "../../../utils/axios.ts";
import { useNavigate } from "react-router-dom";
import { BarChart } from "@mui/x-charts/BarChart";
import { AddUserDialog } from "../../dashboard-users/components/AddUserDialog.tsx";
import { ConfirmDeleteDialog } from "../../dashboard-users/components/ConfirmDeleteDialog.tsx";

interface Issue {
  _id: string;
  lineId: string;
  type: string;
  priority: string;
  status: string;
  description: string;
  reportedBy: { username: string; fullName: string; role: string };
  assignedTo?: { username: string; fullName: string; role: string };
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

interface ChecklistItem {
  id?: string;
  item: string;
  done: boolean;
}

interface Task {
  _id: string;
  date: string;
  lineId: string;
  description: string;
  assignedTo: {
    _id: string;
    username: string;
    fullName: string;
    role: string;
  };
  estimatedMinutes: number;
  status: string;
  checklist: ChecklistItem[];
}

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
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const navigate = useNavigate();

  const [newUser, setNewUser] = useState({
    fullName: "",
    username: "",
    password: "",
    role: "operator",
  });

  const issueStatuses = Array.from(new Set(issues.map((i) => i.status)));
  const taskStatuses = Array.from(new Set(tasks.map((t) => t.status)));

  const allStatuses = Array.from(new Set([...issueStatuses, ...taskStatuses]));

  // 2. Costruisci le serie combinate per status
  const series = allStatuses.map((status) => ({
    label: status,
    data: [
      issues.filter((i) => i.status === status).length, // bar "Issues"
      tasks.filter((t) => t.status === status).length, // bar "Tasks"
    ],
  }));

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

  const handleGetIssues = async (username: string) => {
    try {
      const response = await api.get<Issue[]>("/issues");
      const filtered = response.data.filter(
        (issue) => issue.reportedBy.username === username
      );
      // console.log(filtered);

      setIssues(filtered);
    } catch (err) {
      console.error("Error fetching issues:", err);
    } finally {
      // setLoading(false);
    }
  };

  const handleGetTasks = async (username: string) => {
    try {
      const response = await api.get("/tasks");
      const filtered = response.data.filter(
        (task: Task) => task.assignedTo.username === username
      );
      console.log(filtered);
      setTasks(filtered);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    } finally {
      // setLoading(false);
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

  const handleShowInfo = (user: User) => {
    setSelectedUser(user);
    handleGetIssues(user.username);
    handleGetTasks(user.username);
  };

  const fetchUsers = async () => {
    setLoading(true);

    setTimeout(async () => {
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
    }, 1000); // Ritardo di 1 secondo
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
            <Grid container size={3}>
              <Grid size={12}>
                <Paper
                  elevation={1}
                  sx={{
                    borderRadius: 11,
                    p: 2,
                    background: "rgba(255, 255, 255, 0.07)",
                    backdropFilter: "blur(20px) saturate(180%)",
                    WebkitBackdropFilter: "blur(20px) saturate(180%)",
                    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                    maxHeight: "400px",
                    overflowY: "scroll",
                    scrollbarWidth: "none",
                    "&::-webkit-scrollbar": {
                      display: "none",
                    },
                  }}
                >
                  {selectedUser ? (
                    <>
                      <Typography>
                        {selectedUser.fullName} - {selectedUser.role}
                      </Typography>

                      <Divider sx={{ my: 2 }} />

                      <Typography
                        variant="h6"
                        gutterBottom
                        onClick={() => navigate("/issues")}
                        sx={{
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            textDecoration: "underline",
                            color: "secondary.main",
                          },
                        }}
                      >
                        Issues segnalate
                      </Typography>

                      {loading ? (
                        <Typography variant="body2">
                          Caricamento issues...
                        </Typography>
                      ) : issues.length > 0 ? (
                        <ul style={{ paddingLeft: "1rem" }}>
                          {issues.map((issue, id) => (
                            <li key={issue._id}>
                              <Typography variant="body2">
                                <span>#{id + 1}</span>
                                <br />
                                <strong>Descrizione:</strong>{" "}
                                {issue.description} <br />
                                <strong>Stato:</strong> {issue.status}
                              </Typography>
                              <Divider sx={{ my: 1 }} />
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <Typography variant="body2">
                          Nessuna issue trovata per questo utente.
                        </Typography>
                      )}

                      <Typography
                        variant="h6"
                        gutterBottom
                        onClick={() => navigate("/planning")}
                        sx={{
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            textDecoration: "underline",
                            color: "secondary.main",
                          },
                        }}
                      >
                        Tasks segnalate
                      </Typography>

                      {loading ? (
                        <Typography variant="body2">
                          Caricamento tasks...
                        </Typography>
                      ) : tasks.length > 0 ? (
                        <ul style={{ paddingLeft: "1rem" }}>
                          {tasks.map((task, id) => (
                            <li key={task._id}>
                              <Typography variant="body2">
                                <span>#{id + 1}</span>
                                <br />
                                <strong>Data:</strong> {task.date} <br />
                                <strong>Linea:</strong> {task.lineId} <br />
                                <strong>Descrizione:</strong>{" "}
                                {task.description.length > 30
                                  ? task.description.substring(0, 30) + "..."
                                  : task.description}{" "}
                                <br />
                                <strong>Stima:</strong> {task.estimatedMinutes}{" "}
                                minuti <br />
                                <strong>Stato:</strong> {task.status}
                              </Typography>

                              {task.checklist?.length > 0 && (
                                <Box ml={2} mt={1}>
                                  <Typography variant="subtitle2">
                                    Checklist:
                                  </Typography>
                                  <ul
                                    style={{
                                      marginTop: 0,
                                      paddingLeft: "1rem",
                                    }}
                                  >
                                    {task.checklist.map((item, index) => (
                                      <li key={index}>
                                        <Typography variant="body2">
                                          -{item.item}
                                          {item.done
                                            ? "✅ Completato"
                                            : "⏳ In sospeso"}
                                        </Typography>
                                      </li>
                                    ))}
                                  </ul>
                                </Box>
                              )}
                              <Divider sx={{ my: 1 }} />
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <Typography variant="body2">
                          Nessuna task trovata per questo utente.
                        </Typography>
                      )}
                    </>
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      Seleziona un utente per visualizzare i dettagli.
                    </Typography>
                  )}
                </Paper>
              </Grid>
              <Grid size={12}>
                <Paper
                  elevation={1}
                  sx={{
                    borderRadius: 11,
                    p: 2,
                    background: "rgba(255, 255, 255, 0.07)",
                    backdropFilter: "blur(20px) saturate(180%)",
                    WebkitBackdropFilter: "blur(20px) saturate(180%)",
                    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  {selectedUser && (tasks.length > 0 || issues.length > 0) ? (
                    <>
                      <BarChart
                        width={350}
                        height={250}
                        series={series}
                        hideLegend
                        borderRadius={6}
                        barLabel="value"
                        xAxis={[
                          {
                            data: ["Issues", "Tasks"],
                            scaleType: "band",
                          },
                        ]}
                      />
                    </>
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      {selectedUser
                        ? "Nessuna grafico disponibile per questo utente."
                        : "Seleziona un utente per visualizzare il grafico."}
                    </Typography>
                  )}
                </Paper>
              </Grid>
            </Grid>
            <Grid size={9}>
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
                    <CircularProgress size="3rem" color="secondary" />
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
                          <TableCell>Nome</TableCell>
                          <TableCell>Username</TableCell>
                          <TableCell>Ruolo</TableCell>
                          <TableCell align="right">Azioni</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredUsers.map((u: User) => {
                          const isEditing = editingUserId === u._id;

                          return (
                            <TableRow
                              key={u._id}
                              hover
                              onClick={() => handleShowInfo(u)}
                              sx={{
                                cursor: "pointer",
                                backgroundColor:
                                  selectedUser && selectedUser._id === u._id
                                    ? "rgba(255, 255, 255, 0.2)"
                                    : "transparent",
                                transition: "background-color 0.3s",
                              }}
                            >
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
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        saveEdit();
                                      }}
                                      variant="contained"
                                      size="small"
                                      sx={{ mr: 1 }}
                                    >
                                      <SaveIcon />
                                    </Button>
                                    <IconButton
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        cancelEditing();
                                      }}
                                      // variant="text"
                                      size="small"
                                    >
                                      <ClearIcon />
                                    </IconButton>
                                  </>
                                ) : (
                                  <>
                                    <IconButton
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        startEditing(u);
                                      }}
                                      size="small"
                                      sx={{ mr: 1 }}
                                    >
                                      <EditIcon />
                                    </IconButton>
                                    <IconButton
                                      // variant="text"
                                      size="small"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        openConfirmDialog(u);
                                      }}
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

                <AddUserDialog
                  open={addDialogOpen}
                  onClose={handleCloseAddDialog}
                  onSave={handleAddUser}
                  newUser={newUser}
                  onChange={handleNewUserChange}
                />
                <ConfirmDeleteDialog
                  open={confirmOpen}
                  user={userToDelete}
                  onClose={closeConfirmDialog}
                  onConfirm={handleDeleteUser}
                />
              </Paper>
            </Grid>
          </Grid>
        </Stack>
      </Paper>
    </Box>
  );
};
