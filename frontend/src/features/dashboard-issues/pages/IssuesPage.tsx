import {
  Box,
  CircularProgress,
  Grid,
  Paper,
  Stack,
  useTheme,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Avatar,
  Chip,
  Button,
  IconButton,
} from "@mui/material";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment"; // To format dates
import api from "../../../utils/axios.ts";
import { useAuth } from "../../log-in/context/AuthContext.tsx";
import axios from "axios";

import AddIcon from "@mui/icons-material/Add";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import EditIcon from "@mui/icons-material/Edit";
import { Delete } from "@mui/icons-material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { HeaderDesktop } from "../../dashboard/components/Header/HeaderDesktop.tsx";
import { IssueModal } from "../../dashboard/components/IssueModal.tsx";
import { se } from "date-fns/locale";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DashboardLayout } from "../../dashboard/layouts/DashboardLayout.tsx";

interface Issue {
  _id: string;
  lineId: string;
  type: string;
  priority: string;
  status: string;
  description: string;
  reportedBy: { _id: string; username: string; fullName: string; role: string };
  assignedTo: {
    _id: string;
    username: string;
    fullName: string;
    role: string;
  } | null;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}
const lineOptions = [
  { value: "line-1", label: "Linea 1" },
  { value: "line-2", label: "Linea 2" },
  { value: "line-3", label: "Linea 3" },
];

const typeOptions = [
  { value: "meccanico", label: "Meccanico" },
  { value: "elettrico", label: "Elettrico" },
  { value: "qualità", label: "Qualità" },
  { value: "sicurezza", label: "Sicurezza" },
];

const priorityOptions = [
  { value: "bassa", label: "Bassa" },
  { value: "media", label: "Media" },
  { value: "alta", label: "Alta" },
];

const statusOptions = [
  { value: "in lavorazione", label: "In lavorazione" },
  { value: "aperta", label: "Aperta" },
  { value: "risolta", label: "Risolta" },
];

// Funzione di mapping da "Linea 1" a "line-1"
const mapLineFilterToDb = (filterValue: string) => {
  // Esempio: "Linea 1" -> "line-1"
  const match = filterValue.match(/Linea (\d+)/i);
  if (match) {
    return `line-${match[1]}`;
  }
  return filterValue;
};

// Funzione per normalizzare un oggetto user
function normalizeUser(user: any): {
  _id: string;
  username: string;
  fullName: string;
  role: string;
} {
  return {
    _id: user && user._id ? user._id : "",
    username: user && user.username ? user.username : "",
    fullName: user && user.fullName ? user.fullName : "",
    role: user && user.role ? user.role : "",
  };
}

// Funzione per convertire una stringa datetime-local in una data UTC (ISO) mantenendo l'orario scelto dall'utente
function localDateTimeToUTC(dateTimeStr: string) {
  if (!dateTimeStr) return '';
  const [date, time] = dateTimeStr.split('T');
  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute] = time.split(':').map(Number);
  return new Date(Date.UTC(year, month - 1, day, hour, minute)).toISOString();
}

export const IssuesPage = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const theme = useTheme(); // Get the current theme
  const [themeMode, setThemeMode] = useState("/background-light.svg");
  const { user, logout } = useAuth();
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedPriority, setSelectedPriority] = useState<string[]>([]);
  const [selectedLine, setSelectedLine] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string[]>([]);
  const [searchId, setSearchId] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [issueToEdit, setIssueToEdit] = useState<Issue | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [issueToDelete, setIssueToDelete] = useState<Issue | null>(null);

  useEffect(() => {
    // Set background image based on theme mode
    // if (theme.palette.mode === "light") {
    //   setThemeMode("/background-light.svg");
    // } else {
    //   setThemeMode("/background-dark.svg");
    // }

    const fetchIssues = async () => {
      setLoading(true);
      setTimeout(async () => {
        try {
          const response = await api.get<Issue[]>("/issues");
          setIssues(response.data);
        } catch (err) {
          console.error("Error fetching issues:", err);
          setError("Failed to load issues");
        } finally {
          setLoading(false);
        }
      }, 500);
    };

    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/users`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setUsers(res.data);
      } catch (err) {
        // Ignora errori
      }
    };
    fetchUsers();
    fetchIssues();

    // Optional: Set up polling for real-time updates (e.g., every 30 seconds)
    // const pollingInterval = setInterval(fetchIssues, 30000); // Poll every 30 seconds
    // return () => clearInterval(pollingInterval); // Cleanup interval on component unmount
  }, []); // Rerun effect if theme mode changes

  // if (!user || loading) {
  //   // You might want a dedicated loading page or spinner component
  //   return (
  //     <Box
  //       sx={{
  //         display: 'flex',
  //         justifyContent: 'center',
  //         alignItems: 'center',
  //         height: '100vh',
  //       }}
  //     >
  //       <CircularProgress size={80} />
  //     </Box>
  //   );
  // }

  const filteredIssues = issues
    .filter((issue) => {
      // Filtro descrizione
      const normalizedSearch = searchId.trim().toLowerCase();
      const normalizedDescription = issue.description.toLowerCase();
      if (
        normalizedSearch &&
        !normalizedDescription.includes(normalizedSearch)
      ) {
        return false;
      }
      // Filtro Priorità
      if (
        selectedPriority.length > 0 &&
        !selectedPriority
          .map((p) => p.toLowerCase())
          .includes(issue.priority.toLowerCase())
      ) {
        return false;
      }
      // Filtro Stato
      if (
        selectedStatus.length > 0 &&
        !selectedStatus
          .map((s) => s.toLowerCase())
          .includes(issue.status.toLowerCase())
      ) {
        return false;
      }
      // Filtro Linea
      if (
        selectedLine.length > 0 &&
        !selectedLine.map(mapLineFilterToDb).includes(issue.lineId)
      ) {
        return false;
      }
      // Filtro Tipo
      if (
        selectedType.length > 0 &&
        !selectedType
          .map((t) => t.toLowerCase())
          .includes(issue.type.toLowerCase())
      ) {
        return false;
      }
      // Filtro Data di creazione
      if (selectedDate) {
        const createdAtDate = moment(issue.createdAt).format("YYYY-MM-DD");
        if (createdAtDate !== selectedDate) {
          return false;
        }
      }
      return true;
    })
    .filter((issue) => {
      // Mostra solo le issue assegnate all'utente se è operator
      if (user.role === "operator") {
        return issue.assignedTo && issue.assignedTo._id === user._id;
      }
      return true;
    });

  // Funzione per creare una nuova issue
  const handleCreateIssue = async (data: any) => {
    try {
      console.log("DATI", data);
      await api.post("/issues", data);
      // Aggiorna la lista dopo la creazione
      const response = await api.get<Issue[]>("/issues");
      setIssues(response.data);
      setModalOpen(false);
    } catch (err) {
      alert("Errore nella creazione della issue");
    }
  };

  // Funzione per modificare una issue
  const handleEditIssue = async (data: any) => {
    if (!issueToEdit) return;
    try {
      await api.put(`/issues/${issueToEdit._id}`, data);

      const response = await api.get<Issue[]>("/issues");
      setIssues(response.data);
      setEditModalOpen(false);
      setIssueToEdit(null);
    } catch (err: any) {
      if (err.response) {
        console.log("PUT ERROR", err.response.data);
      }
      alert("Errore nella modifica della issue");
    }
  };
  

  // Funzione per eliminare una issue
  const openDeleteDialog = (issue: Issue) => {
    setIssueToDelete(issue);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteIssue = async () => {
    if (!issueToDelete) return;
    try {
      await api.delete(`/issues/${issueToDelete._id}`);
      const response = await api.get<Issue[]>("/issues");
      setIssues(response.data);
      setDeleteDialogOpen(false);
      setIssueToDelete(null);
    } catch (err) {
      alert("Errore nell'eliminazione della issue");
    }
  };

  const handleResolveIssue = async (issue: Issue) => {
    try {
      // Prendi la data/ora locale attuale e convertila in formato ISO UTC per il db
      const now = new Date();
      const pad = (n: number) => n.toString().padStart(2, '0');
      const localDateTime =
        now.getFullYear() +
        '-' + pad(now.getMonth() + 1) +
        '-' + pad(now.getDate()) +
        'T' + pad(now.getHours()) +
        ':' + pad(now.getMinutes());
      const resolvedAtUTC = localDateTimeToUTC(localDateTime);
      await api.put(`/issues/${issue._id}`, {
        ...issue,
        status: "risolta",
        resolvedAt: resolvedAtUTC,
        assignedTo: issue.assignedTo ? issue.assignedTo._id : null,
        reportedBy: issue.reportedBy ? issue.reportedBy._id : null,
      });
      const response = await api.get<Issue[]>("/issues");
      setIssues(response.data);
    } catch (err) {
      alert("Errore nella risoluzione della issue");
    }
  };

  return (
    <DashboardLayout>
      <Box p={1}>
        <Stack direction="column" gap={1} sx={{ height: "100%" }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
            sx={{
              mb: 2,
              //  mt: 2,
              // p: 2,
            }}
          >
            {/* Titolo a sinistra */}
            <Box fontWeight="bold" fontSize={18} letterSpacing={1}>
              ISSUES
            </Box>
            {/* Filtri e bottone a destra */}
            <Stack direction="row" spacing={2} alignItems="center">
              <TextField
                placeholder="Cerca la descrizione"
                size="small"
                variant="outlined"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  minWidth: 160,
                  "& .MuiInputBase-input::placeholder": {
                    color: theme.palette.mode === "dark" ? "#B0B3B8" : "#222",
                    opacity: 1,
                  },
                }}
              />
              <Select
                multiple
                displayEmpty
                value={selectedStatus}
                onChange={(e) =>
                  setSelectedStatus(
                    typeof e.target.value === "string"
                      ? e.target.value.split(",")
                      : e.target.value
                  )
                }
                renderValue={() => "Stato"}
                size="small"
                sx={{ minWidth: 120 }}
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <Checkbox
                      checked={selectedStatus.indexOf(option.value) > -1}
                    />
                    <ListItemText primary={option.label} />
                  </MenuItem>
                ))}
              </Select>
              <Select
                multiple
                displayEmpty
                value={selectedPriority}
                onChange={(e) =>
                  setSelectedPriority(
                    typeof e.target.value === "string"
                      ? e.target.value.split(",")
                      : e.target.value
                  )
                }
                renderValue={() => "Priorità"}
                size="small"
                sx={{ minWidth: 120 }}
              >
                {priorityOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <Checkbox
                      checked={selectedPriority.indexOf(option.value) > -1}
                    />
                    <ListItemText primary={option.label} />
                  </MenuItem>
                ))}
              </Select>
              <Select
                multiple
                displayEmpty
                value={selectedLine}
                onChange={(e) =>
                  setSelectedLine(
                    typeof e.target.value === "string"
                      ? e.target.value.split(",")
                      : e.target.value
                  )
                }
                renderValue={() => "Linea"}
                size="small"
                sx={{ minWidth: 120 }}
              >
                {lineOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <Checkbox
                      checked={selectedLine.indexOf(option.value) > -1}
                    />
                    <ListItemText primary={option.label} />
                  </MenuItem>
                ))}
              </Select>
              <Select
                multiple
                displayEmpty
                value={selectedType}
                onChange={(e) =>
                  setSelectedType(
                    typeof e.target.value === "string"
                      ? e.target.value.split(",")
                      : e.target.value
                  )
                }
                renderValue={() => "Tipo"}
                size="small"
                sx={{ minWidth: 120 }}
              >
                {typeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <Checkbox
                      checked={selectedType.indexOf(option.value) > -1}
                    />
                    <ListItemText primary={option.label} />
                  </MenuItem>
                ))}
              </Select>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Data"
                  value={selectedDate ? new Date(selectedDate) : null}
                  onChange={(newValue) =>
                    setSelectedDate(
                      newValue ? newValue.toISOString().slice(0, 10) : ""
                    )
                  }
                  slotProps={{
                    textField: {
                      size: "small",
                      sx: { minWidth: 140 },
                    },
                  }}
                />
              </LocalizationProvider>
              {/* <TextField
              type="date"
              size="small"
              variant="outlined"
              sx={{ minWidth: 140 }}
              InputLabelProps={{ shrink: true }}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            /> */}
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setModalOpen(true)}
              >
                Segnala
              </Button>
            </Stack>
          </Stack>
          {/* Tabella delle issues */}
          {loading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="400px"
              width="100%"
            >
              <CircularProgress size={80} color="secondary" />
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
                maxHeight: "75vh",
                overflowY: "scroll",
                scrollbarWidth: "none",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
              }}
            >
              <Table
                stickyHeader
                sx={{
                  "& td, & th": {
                    verticalAlign: "middle",
                  },
                }}
              >
                <TableHead>
                  <TableRow
                    sx={{
                      position: "sticky",
                      top: 0,
                      zIndex: 1,
                      // background:
                      //   theme.palette.mode === "dark" ? "#23272F" : "#F6F6F6",
                      // "& th": {
                      //   borderBottom: "none",
                      //   color:
                      //     theme.palette.mode === "dark" ? "#B0B3B8" : "#7D7D7D",
                      // },
                    }}
                  >
                    {/* <TableCell>Id</TableCell> */}
                    <TableCell>Descrizione</TableCell>
                    <TableCell>Linea</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Proprietà</TableCell>
                    <TableCell>Stato</TableCell>
                    <TableCell>Segnalata Da</TableCell>
                    <TableCell>Assegnata A</TableCell>
                    <TableCell>Creata Il</TableCell>
                    <TableCell>Risolta Il</TableCell>
                    <TableCell>Azioni</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredIssues.map((issue, idx) => (
                    <TableRow
                      key={issue._id}
                      sx={{
                        "&:last-child td, &:last-child th": {
                          borderBottom: "none",
                        },
                      }}
                    >
                      {/* <TableCell>{`#${String(idx + 1).padStart(3, '0')}`}</TableCell> */}
                      <TableCell>{issue.description}</TableCell>
                      <TableCell>{issue.lineId}</TableCell>
                      <TableCell>{issue.type}</TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <span
                            style={{
                              color:
                                issue.priority === "alta"
                                  ? "#FF3B3B"
                                  : issue.priority === "media"
                                  ? "#FFB800"
                                  : "#00B67A",
                              fontWeight: 600,
                              marginRight: 6,
                              fontSize: 30,
                              lineHeight: 1,
                              display: "inline-block",
                            }}
                          >
                            •
                          </span>
                          <span style={{ fontSize: 16 }}>{issue.priority}</span>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {issue.status === "aperta" ? (
                          <Chip
                            label="Aperta"
                            sx={{
                              background: "#E6FAF0",
                              color: "#00B67A",
                              fontWeight: 600,
                              borderColor: "#00B67A",
                              borderWidth: 1,
                              borderStyle: "solid",
                            }}
                          />
                        ) : issue.status === "in lavorazione" ? (
                          <Chip
                            label="In lavorazione"
                            sx={{
                              background: "#FFE6B0", // arancione chiaro
                              color: "#FF9800", // arancione scuro
                              fontWeight: 600,
                              borderColor: "#FF9800",
                              borderWidth: 1,
                              borderStyle: "solid",
                            }}
                          />
                        ) : (
                          <Chip
                            label="Risolta"
                            sx={{
                              background: "#E6F0FA",
                              color: "#3B82F6",
                              fontWeight: 600,
                              borderColor: "#3B82F6",
                              borderWidth: 1,
                              borderStyle: "solid",
                            }}
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        {issue.reportedBy?.fullName ? (
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Avatar
                              sx={{
                                width: 24,
                                height: 24,
                                fontSize: 14,
                                mr: 1,
                                backgroundColor:
                                  theme.palette.mode === "dark"
                                    ? "#fff"
                                    : "black",
                                color:
                                  theme.palette.mode === "dark"
                                    ? "black"
                                    : "#fff",
                              }}
                            >
                              {issue.reportedBy.fullName[0]}
                            </Avatar>
                            {issue.reportedBy.fullName}
                          </Box>
                        ) : null}
                      </TableCell>
                      <TableCell>
                        {issue.assignedTo && issue.assignedTo.username ? (
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Avatar
                              sx={{
                                width: 24,
                                height: 24,
                                fontSize: 14,
                                mr: 1,
                                backgroundColor:
                                  theme.palette.mode === "dark"
                                    ? "#fff"
                                    : "black",
                                color:
                                  theme.palette.mode === "dark"
                                    ? "black"
                                    : "#fff",
                              }}
                            >
                              {issue.assignedTo.fullName[0]}
                            </Avatar>
                            {issue.assignedTo.fullName}
                          </Box>
                        ) : null}
                      </TableCell>
                      <TableCell>
                        {moment.utc(issue.createdAt).format("YYYY-MM-DD HH:mm")}
                      </TableCell>
                      <TableCell>
                        {issue.resolvedAt
                          ? moment
                              .utc(issue.resolvedAt)
                              .format("YYYY-MM-DD HH:mm")
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <IconButton
                            onClick={() => {
                              const reportedByUser = normalizeUser(
                                users.find(
                                  (u: any) =>
                                    u.username === issue.reportedBy.username
                                ) || issue.reportedBy
                              );
                              const assignedToUser =
                                issue.assignedTo && issue.assignedTo.username
                                  ? normalizeUser(
                                      users.find(
                                        (u: any) =>
                                          u.username ===
                                          issue.assignedTo!.username
                                      ) || issue.assignedTo
                                    )
                                  : null;
                              setIssueToEdit({
                                ...issue,
                                reportedBy: reportedByUser,
                                assignedTo: assignedToUser,
                              });
                              setEditModalOpen(true);
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton onClick={() => handleResolveIssue(issue)} disabled={issue.status === "risolta"}>
                            <span style={{ color: issue.status === "risolta" ? '#aaa' : '#00B67A' }}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12l2 2l4 -4" /><circle cx="12" cy="12" r="10" /></svg>
                            </span>
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Stack>
        <IssueModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleCreateIssue}
          lineOptions={lineOptions}
          typeOptions={typeOptions}
          priorityOptions={priorityOptions}
          statusOptions={statusOptions}
          currentUser={user!}
        />
        <IssueModal
          open={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setIssueToEdit(null);
          }}
          onSave={handleEditIssue}
          lineOptions={lineOptions}
          typeOptions={typeOptions}
          priorityOptions={priorityOptions}
          statusOptions={statusOptions}
          currentUser={user!}
          initialValues={issueToEdit || undefined}
          onDelete={async () => {
            if (!issueToEdit) return;
            try {
              await api.delete(`/issues/${issueToEdit._id}`);
              const response = await api.get<Issue[]>("/issues");
              setIssues(response.data);
              setEditModalOpen(false);
              setIssueToEdit(null);
            } catch (err) {
              alert("Errore nell'eliminazione della issue");
            }
          }}
        />
      </Box>
    </DashboardLayout>
  );
};
