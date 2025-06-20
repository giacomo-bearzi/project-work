import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Header } from "../components/Header.tsx";
import { useAuth } from "../../log-in/context/AuthContext.tsx";
import { useEffect, useState } from "react";
import type { User } from "../../../components/Login.tsx";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import api from "../../../utils/axios.ts";
import { useNavigate } from "react-router-dom";
import { AddUserDialog } from "../../dashboard-users/components/AddUserDialog.tsx";
import { ConfirmDeleteDialog } from "../../dashboard-users/components/ConfirmDeleteDialog.tsx";
import { UsersTable } from "../../dashboard-users/components/UsersTable.tsx";
import { UserDetails } from "../../dashboard-users/components/UserDetails.tsx";
import { UserActivityChart } from "../../dashboard-users/components/UserActivityChart.tsx";

export interface Issue {
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

export interface Task {
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
                    <UserDetails
                      user={selectedUser}
                      issues={issues}
                      tasks={tasks}
                      loading={loading}
                      onNavigateToIssues={() => navigate("/issues")}
                      onNavigateToPlanning={() => navigate("/planning")}
                    />
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
                  <UserActivityChart
                    user={selectedUser}
                    issues={issues}
                    tasks={tasks}
                  />
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
                  <UsersTable
                    users={users}
                    selectedUser={selectedUser}
                    editingUserId={editingUserId}
                    editedUser={editedUser}
                    searchTerm={searchTerm}
                    onEditChange={handleEditChange}
                    onStartEditing={startEditing}
                    onCancelEditing={cancelEditing}
                    onSaveEdit={saveEdit}
                    onSelectUser={handleShowInfo}
                    onDeleteClick={openConfirmDialog}
                  />
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
