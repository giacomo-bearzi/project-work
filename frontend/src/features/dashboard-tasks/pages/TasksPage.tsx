import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Stack,
  Typography,
  Button,
  Avatar,
  Snackbar,
  Alert,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import api from "../../../utils/axios.ts";

import { useAuth } from "../../log-in/context/AuthContext.tsx";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BarChartIcon from "@mui/icons-material/BarChart";
import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { TaskModal } from "../../dashboard/components/TaskModal.tsx";
import { EditTaskModal } from "../../dashboard/components/EditTaskModal.tsx";
import { DashboardLayout } from "../../dashboard/layouts/DashboardLayout.tsx";

interface ChecklistItem {
  item: string;
  done: boolean;
}

interface Task {
  _id: string;
  lineId: string;
  description: string;
  assignedTo: { _id: string; fullName: string } | string;
  estimatedMinutes: number;
  status: string;
  checklist: ChecklistItem[];
  startTime?: string;
  endTime?: string;
  completedAt?: string;
  date: string;
  type: string;
}

interface User {
  _id: string;
  fullName: string;
  username: string;
  role: string;
}

interface ProductionLine {
  _id: string;
  name: string;
  description?: string;
  lineId: string;
}

const COLUMNS = [
  { id: "todo", title: "Da Fare" },
  { id: "waiting", title: "In Attesa" },
  { id: "in_corso", title: "In Corso" },
  { id: "done", title: "Completata" },
];

export const TasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [productionLines, setProductionLines] = useState<ProductionLine[]>([]);
  const [selectedDate, setSelectedDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const { user } = useAuth();
  const currentUserRole = user?.role || "";
  const canEdit = currentUserRole === "manager" || currentUserRole === "admin";

  useEffect(() => {
    api.get("/users").then((res) => setUsers(res.data));
    api.get("/production-lines").then((res) => setProductionLines(res.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    api
      .get("/tasks")
      .then(async (res) => {
        const today = new Date().toISOString().slice(0, 10);
        const isToday = selectedDate === today;
        const tasksFetched = res.data;
        console.log("[DEBUG] Tasks from first GET:", tasksFetched);
        // Mostra subito le task filtrate per la data selezionata
        const filtered = tasksFetched.filter((t: Task) => t.date.slice(0, 10) === selectedDate);
        console.log(`[DEBUG] Tasks filtrate per la data ${selectedDate}:`, filtered);
        setTasks(filtered);
        // Solo se la data selezionata è oggi, aggiorna in background le task incomplete con data < oggi
        if (isToday) {
          const toUpdate = tasksFetched.filter(
            (t: Task) => t.status !== "completata" && t.date.slice(0, 10) < today
          );
          console.log("[DEBUG] Tasks da aggiornare a oggi:", toUpdate);
          if (toUpdate.length > 0) {
            await Promise.all(
              toUpdate.map((t: Task) =>
                api.put(`/tasks/${t._id}`, { ...t, date: today, type: t.type })
              )
            );
            // Dopo l'update, aggiorna la lista solo se la data selezionata è ancora oggi
            const updated = (await api.get("/tasks")).data;
            console.log("[DEBUG] Tasks from second GET dopo update:", updated);
            const filteredUpdated = updated.filter((t: Task) => t.date.slice(0, 10) === selectedDate);
            console.log(`[DEBUG] Tasks filtrate per la data ${selectedDate} dopo update:`, filteredUpdated);
            setTasks(filteredUpdated);
          }
        }
      })
      .catch((err) => {
        console.error("[DEBUG] Errore nella GET /tasks:", err);
        setTasks([]);
      })
      .finally(() => setLoading(false));
  }, [selectedDate]);

  // Raggruppa le task per stato
  const tasksByStatus: Record<string, Task[]> = {
    todo: tasks.filter((t) => t.status === "todo"),
    waiting: tasks.filter(
      (t) => t.status === "waiting" || t.status === "in_attesa"
    ),
    in_corso: tasks.filter((t) => {
      const s = t.status?.toLowerCase();
      return s === "in_corso" || s === "in corso" || s === "incorso";
    }),
    done: tasks.filter(
      (t) =>
        (t.status === "done" || t.status === "completata") &&
        t.completedAt &&
        t.date.slice(0, 10) === selectedDate
    ),
  };

  // Nuova logica per il conteggio
  const incompleteTasks = tasks.filter(
    (t) =>
      (t.status === "in_attesa" ||
        t.status === "in_corso" ||
        t.status === "waiting" ||
        t.status === "in corso" ||
        t.status === "incorso") &&
      t.date.slice(0, 10) === selectedDate
  );
  const completedCount = tasksByStatus.done.length;
  const totalCount = incompleteTasks.length + completedCount;

  // Drag-and-drop handler
  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;
    const sourceCol = result.source.droppableId;
    const destCol = result.destination.droppableId;
    if (sourceCol === destCol) return;
    const taskId = result.draggableId;
    const task = tasks.find((t) => t._id === taskId);
    if (!task) return;
    let newStatus = task.status;
    let completedAt = task.completedAt;
    let newChecklist = [...task.checklist];
    if (destCol === "done") {
      newChecklist = task.checklist.map((item) => ({ ...item, done: true }));
      newStatus = "completata";
      completedAt = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (destCol === "in_corso") {
      newStatus = "in_corso";
      completedAt = undefined;
    } else if (destCol === "todo") {
      newStatus = "in_attesa";
      completedAt = undefined;
    }
    setTasks((prev) =>
      prev.map((t) =>
        t._id === taskId
          ? {
            ...t,
            checklist: newChecklist,
            status: newStatus,
            completedAt,
          }
          : t
      )
    );
    await api.put(`/tasks/${taskId}`, {
      checklist: newChecklist,
      status: newStatus,
      completedAt,
      type: task.type,
    });
  };

  // Funzione per gestire il check/uncheck della checklist
  const handleChecklistToggle = async (task: Task, idx: number) => {
    const newChecklist = [...task.checklist];
    newChecklist[idx].done = !newChecklist[idx].done;
    const allChecked =
      newChecklist.length > 0 && newChecklist.every((item) => item.done);
    let newStatus = allChecked
      ? "completata"
      : task.status === "completata"
        ? "in_corso"
        : task.status;
    let completedAt = allChecked
      ? new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
      : undefined;
    setTasks((prev) =>
      prev.map((t) =>
        t._id === task._id
          ? { ...t, checklist: newChecklist, status: newStatus, completedAt }
          : t
      )
    );
    await api.put(`/tasks/${task._id}`, {
      checklist: newChecklist,
      status: newStatus,
      completedAt,
      type: task.type,
    });
  };

  // Funzione per eliminare una task
  const handleDeleteTask = async (taskId: string) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      setSnackbar({
        open: true,
        message: "Attività eliminata",
        severity: "success",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Errore eliminazione attività",
        severity: "error",
      });
    }
  };

  // Card stile MUI
  const TaskCard = ({ task }: { task: Task }) => (
    <Paper
      sx={{
        mb: 2,
        p: 2,
        borderRadius: 2,
        boxShadow: 1,
        borderLeft: `4px solid ${task.status === "in_corso"
          ? "#ff9800" // arancione
          : "#1976d2" // blu default
          }`,
      }}
    >
      <Stack
        direction="row"
        alignItems="flex-start"
        justifyContent="space-between"
        spacing={2}
      >
        <Box sx={{ flex: 1, pr: 4 }}>
          <Typography fontWeight="bold">{task.description}</Typography>
          <Typography variant="body2">
            {task.startTime && task.endTime
              ? `${task.startTime} - ${task.endTime}`
              : ""}
            {task.assignedTo
              ? ` | ${typeof task.assignedTo === "object" &&
                task.assignedTo !== null
                ? task.assignedTo.fullName
                : task.assignedTo
              }`
              : ""}
          </Typography>
          {task.checklist && task.checklist.length > 0 && (
            <Box mt={1}>
              {task.checklist.map((item, idx) => (
                <FormControlLabel
                  key={idx}
                  control={
                    <Checkbox
                      checked={item.done}
                      onChange={() => handleChecklistToggle(task, idx)}
                    />
                  }
                  label={item.item}
                />
              ))}
            </Box>
          )}
        </Box>
        {canEdit && (
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              variant="text"
              color="inherit"
              sx={{ mt: 1, minWidth: 36, p: 0, color: '#888' }}
              onClick={() => handleOpenEdit(task)}
            >
              <EditIcon />
            </Button>
            {(task.status === "in_attesa" ||
              task.status === "in_corso" ||
              task.status === "waiting" ||
              task.status === "in corso" ||
              task.status === "incorso") && (
                <Button
                  size="small"
                  color="inherit"
                  variant="text"
                  sx={{ mt: 1, minWidth: 36, p: 0, color: '#888' }}
                  onClick={() => handleDeleteTask(task._id)}
                >
                  <DeleteIcon />
                </Button>
              )}
          </Stack>
        )}
      </Stack>
    </Paper>
  );

  const handleSaveSuccess = async () => {
    setOpenModal(false);
    setLoading(true);
    const res = await api.get("/tasks");
    setTasks(
      res.data.filter((t: Task) => t.date.slice(0, 10) === selectedDate)
    );
    setLoading(false);
  };

  const handleEditSaveSuccess = async () => {
    setOpenEditModal(false);
    setEditingTask(null);
    setLoading(true);
    const res = await api.get("/tasks");
    setTasks(
      res.data.filter((t: Task) => t.date.slice(0, 10) === selectedDate)
    );
    setLoading(false);
  };

  const handleOpenEdit = (task: Task) => {
    let assignedTo = task.assignedTo;
    if (
      typeof assignedTo === "object" &&
      assignedTo !== null &&
      "_id" in assignedTo &&
      users.length > 0
    ) {
      const user = users.find(
        (u) =>
          typeof assignedTo === "object" &&
          assignedTo !== null &&
          "_id" in assignedTo &&
          u._id === assignedTo._id
      );
      if (user) assignedTo = user;
    }
    setEditingTask({ ...task, assignedTo });
    setOpenEditModal(true);
  };

  return (
    <DashboardLayout>
      <Box p={1}>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Box
            display="flex"
            flexDirection={{ xs: "column", md: "row" }}
            gap={1}
            sx={{
              width: "100%",
              maxWidth: "100vw",
              overflowX: "hidden",
            }}
          >
            <Box
              sx={{
                width: { xs: "100%", md: "50%" },
                minWidth: 0,
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                maxWidth: "100%",
              }}
            >
              <Paper
                sx={{
                  p: 2,
                  borderRadius: 3,
                  boxShadow: 2,
                  mb: 2,
                  maxWidth: "100%",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                  <AssignmentIcon sx={{ color: "#1976d2" }} />
                  <Typography variant="h6" fontWeight={700}>
                    Pianificate
                  </Typography>
                  <Box flex={1} />
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
                  <Button
                    variant="contained"
                    onClick={() => {
                      setEditingTask(null);
                      setOpenModal(true);
                    }}
                  >
                    + Attività
                  </Button>
                </Stack>
                <Box
                  sx={{
                    maxHeight: "70vh",
                    pr: 1,
                    overflowY: "scroll",
                    scrollbarWidth: "none",
                    "&::-webkit-scrollbar": {
                      display: "none",
                    },
                  }}
                >
                  {/* Da Fare */}
                  <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    mb={1}
                  >
                    Da Fare
                  </Typography>
                  <Droppable droppableId="todo">
                    {(provided) => (
                      <Box
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                      >
                        {tasksByStatus.waiting.length === 0 ? (
                          <Typography color="text.secondary" mb={2}>
                            Nessuna attività da fare
                          </Typography>
                        ) : (
                          tasksByStatus.waiting.map((task, idx) => (
                            <Draggable
                              key={task._id}
                              draggableId={task._id}
                              index={idx}
                            >
                              {(provided) => (
                                <Box
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <TaskCard task={task} />
                                </Box>
                              )}
                            </Draggable>
                          ))
                        )}
                        {provided.placeholder}
                      </Box>
                    )}
                  </Droppable>
                  {/* In Corso (draggabile) */}
                  <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    mb={1}
                  >
                    In Corso
                  </Typography>
                  <Droppable droppableId="in_corso">
                    {(provided) => (
                      <Box
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                      >
                        {tasksByStatus.in_corso.length === 0 ? (
                          <Typography color="text.secondary" mb={2}>
                            Nessuna attività in corso
                          </Typography>
                        ) : (
                          tasksByStatus.in_corso.map((task, idx) => (
                            <Draggable
                              key={task._id}
                              draggableId={task._id}
                              index={idx}
                            >
                              {(provided) => (
                                <Box
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <TaskCard task={task} />
                                </Box>
                              )}
                            </Draggable>
                          ))
                        )}
                        {provided.placeholder}
                      </Box>
                    )}
                  </Droppable>
                </Box>
              </Paper>
            </Box>
            <Box
              sx={{
                width: { xs: "100%", md: "50%" },
                minWidth: 0,
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                maxWidth: "100%",
              }}
            >
              <Droppable droppableId="done">
                {(provided) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    sx={{ width: "100%", maxWidth: "100%" }}
                  >
                    <Paper
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        boxShadow: 2,
                        maxWidth: "100%",
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        mb={2}
                      >
                        <BarChartIcon sx={{ color: "#43a047" }} />
                        <Typography variant="h6" fontWeight={700}>
                          Completate
                        </Typography>
                      </Stack>
                      <Box sx={{ overflowY: "auto", maxHeight: "70vh", pr: 1 }}>
                        <Paper sx={{ p: 2, borderRadius: 2 }}>
                          <Typography fontWeight={700} fontSize={15} mb={1}>
                            Completate ({completedCount}/{totalCount})
                          </Typography>
                          {tasksByStatus.done.length === 0 ? (
                            <Typography color="text.secondary" mb={2}>
                              Nessuna attività completata
                            </Typography>
                          ) : (
                            tasksByStatus.done.map((task, idx) => (
                              <Paper
                                key={task._id}
                                sx={{
                                  mb: 1,
                                  p: 1.5,
                                  borderRadius: 2,
                                  boxShadow: 1,
                                  borderLeft: "4px solid #43a047",
                                }}
                              >
                                <Stack
                                  direction="row"
                                  alignItems="center"
                                  spacing={1}
                                >
                                  <Avatar
                                    sx={{
                                      bgcolor: "#43a047",
                                      width: 24,
                                      height: 24,
                                      fontSize: 16,
                                    }}
                                  >
                                    <CheckIcon
                                      sx={{ color: "#fff", fontSize: 18 }}
                                    />
                                  </Avatar>
                                  <Box>
                                    <Typography fontWeight={700} fontSize={15}>
                                      {task.description}
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                    >
                                      Completato alle{" "}
                                      {task.completedAt || "--:--"}
                                    </Typography>
                                  </Box>
                                </Stack>
                              </Paper>
                            ))
                          )}
                          {provided.placeholder}
                        </Paper>
                      </Box>
                    </Paper>
                  </Box>
                )}
              </Droppable>
            </Box>
          </Box>
        </DragDropContext>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
        <TaskModal
          open={openModal}
          handleClose={() => {
            setOpenModal(false);
          }}
          productionLines={productionLines}
          onSaveSuccess={handleSaveSuccess}
        />
        <EditTaskModal
          open={openEditModal}
          handleClose={() => {
            setOpenEditModal(false);
            setEditingTask(null);
          }}
          editingTask={editingTask as any}
          setEditingTask={setEditingTask as any}
          productionLines={productionLines}
          onSaveSuccess={handleEditSaveSuccess}
          currentUserRole={currentUserRole}
        />
      </Box>
    </DashboardLayout>
  );
};
