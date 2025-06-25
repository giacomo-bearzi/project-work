import { useEffect, useState } from 'react';
import {
    Box, Paper, Stack, Typography, Button, Grid, Chip, Avatar, Snackbar, Alert, Checkbox, FormControlLabel
} from '@mui/material';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Header } from '../components/Header';
import api from '../../../utils/axios';
import { TaskModal } from '../components/TaskModal';
import { EditTaskModal } from '../components/EditTaskModal';
import { useAuth } from '../../log-in/context/AuthContext';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BarChartIcon from '@mui/icons-material/BarChart';
import CheckIcon from '@mui/icons-material/Check';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

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
    { id: 'todo', title: 'Da Fare' },
    { id: 'waiting', title: 'In Attesa' },
    { id: 'in_corso', title: 'In Corso' },
    { id: 'done', title: 'Completata' },
];

export const Planning = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [productionLines, setProductionLines] = useState<ProductionLine[]>([]);
    const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));
    const [loading, setLoading] = useState(true);
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });
    const [openModal, setOpenModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const { user } = useAuth();
    const currentUserRole = user?.role || '';
    const canEdit = currentUserRole === 'manager' || currentUserRole === 'admin';

    useEffect(() => {
        api.get('/users').then(res => setUsers(res.data));
        api.get('/production-lines').then(res => setProductionLines(res.data));
    }, []);

    useEffect(() => {
        setLoading(true);
        api.get('/tasks')
            .then(res => {
                // Filtro le task per la data selezionata
                setTasks(res.data.filter((t: Task) => t.date === selectedDate));
            })
            .finally(() => setLoading(false));
    }, [selectedDate]);

    // Raggruppa le task per stato
    const tasksByStatus: Record<string, Task[]> = {
        todo: tasks.filter(t => t.status === 'todo'),
        waiting: tasks.filter(t => t.status === 'waiting' || t.status === 'in_attesa'),
        in_corso: tasks.filter(t => {
            const s = t.status?.toLowerCase();
            return s === 'in_corso' || s === 'in corso' || s === 'incorso';
        }),
        done: tasks.filter(t => t.status === 'done' || t.status === 'completata'),
    };

    // Progress tracker
    const completedCount = tasksByStatus.done.length;
    const totalCount = tasks.length;

    // Drag-and-drop handler
    const handleDragEnd = async (result: any) => {
        if (!result.destination) return;
        const sourceCol = result.source.droppableId;
        const destCol = result.destination.droppableId;
        if (sourceCol === destCol) return;
        const taskId = result.draggableId;
        const task = tasks.find(t => t._id === taskId);
        if (!task) return;
        let newStatus = task.status;
        let completedAt = task.completedAt;
        let newChecklist = [...task.checklist];
        if (destCol === 'done') {
            newChecklist = task.checklist.map(item => ({ ...item, done: true }));
            newStatus = 'completata';
            completedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (destCol === 'in_corso') {
            newStatus = 'in_corso';
            completedAt = undefined;
        } else if (destCol === 'todo') {
            newStatus = 'in_attesa';
            completedAt = undefined;
        }
        setTasks(prev =>
            prev.map(t =>
                t._id === taskId
                    ? { ...t, checklist: newChecklist, status: newStatus, completedAt }
                    : t
            )
        );
        await api.put(`/tasks/${taskId}`, {
            checklist: newChecklist,
            status: newStatus,
            completedAt,
        });
    };

    // Funzione per gestire il check/uncheck della checklist
    const handleChecklistToggle = async (task: Task, idx: number) => {
        const newChecklist = [...task.checklist];
        newChecklist[idx].done = !newChecklist[idx].done;
        const allChecked = newChecklist.length > 0 && newChecklist.every(item => item.done);
        let newStatus = allChecked ? 'completata' : (task.status === 'completata' ? 'in_corso' : task.status);
        let completedAt = allChecked ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined;
        setTasks(prev =>
            prev.map(t =>
                t._id === task._id
                    ? { ...t, checklist: newChecklist, status: newStatus, completedAt }
                    : t
            )
        );
        await api.put(`/tasks/${task._id}`, {
            checklist: newChecklist,
            status: newStatus,
            completedAt,
        });
    };

    // Card stile MUI
    const TaskCard = ({ task }: { task: Task }) => (
        <Paper sx={{ mb: 2, p: 2, borderRadius: 2, boxShadow: 1, borderLeft: '4px solid #1976d2' }}>
            <Typography fontWeight="bold" fontSize={16} mb={0.5}>{task.description}</Typography>
            <Typography variant="body2" color="text.secondary" mb={0.5}>
                {task.startTime && task.endTime ? `${task.startTime} - ${task.endTime}` : ''}
                {task.assignedTo ? ` | ${typeof task.assignedTo === 'object' && task.assignedTo !== null ? task.assignedTo.fullName : task.assignedTo}` : ''}
            </Typography>
            {task.completedAt && (
                <Chip size="small" color="success" label={`Completato alle ${task.completedAt}`} icon={<span>✔️</span>} sx={{ mt: 0.5 }} />
            )}
        </Paper>
    );

    const handleSaveSuccess = async () => {
        setOpenModal(false);
        setLoading(true);
        const res = await api.get('/tasks');
        setTasks(res.data.filter((t: Task) => t.date === selectedDate));
        setLoading(false);
    };

    const handleEditSaveSuccess = async () => {
        setOpenEditModal(false);
        setEditingTask(null);
        setLoading(true);
        const res = await api.get('/tasks');
        setTasks(res.data.filter((t: Task) => t.date === selectedDate));
        setLoading(false);
    };

    const handleOpenEdit = (task: Task) => {
        let assignedTo = task.assignedTo;
        if (
            typeof assignedTo === 'object' &&
            assignedTo !== null &&
            '_id' in assignedTo &&
            users.length > 0
        ) {
            const user = users.find(u => typeof assignedTo === 'object' && assignedTo !== null && '_id' in assignedTo && u._id === assignedTo._id);
            if (user) assignedTo = user;
        }
        setEditingTask({ ...task, assignedTo });
        setOpenEditModal(true);
    };

    return (
        <Box p={2}>
            <Header />
            <DragDropContext onDragEnd={handleDragEnd}>
                <Box
                    display="flex"
                    flexDirection={{ xs: 'column', md: 'row' }}
                    gap={1}
                    sx={{ width: '100%', maxWidth: '100vw', overflowX: 'hidden', mt: 2 }}
                >
                    <Box
                        sx={{
                            width: { xs: '100%', md: '50%' },
                            minWidth: 0,
                            boxSizing: 'border-box',
                            display: 'flex',
                            flexDirection: 'column',
                            maxWidth: '100%',
                        }}
                    >
                        <Paper sx={{ p: 2, borderRadius: 3, boxShadow: 2, mb: 2, maxWidth: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                                <AssignmentIcon sx={{ color: '#1976d2' }} />
                                <Typography variant="h6" fontWeight={700}>Pianificate</Typography>
                                <Box flex={1} />
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        label="Data"
                                        value={selectedDate ? new Date(selectedDate) : null}
                                        onChange={(newValue) => setSelectedDate(newValue ? newValue.toISOString().slice(0, 10) : '')}
                                        slotProps={{
                                            textField: {
                                                size: 'small',
                                                sx: { minWidth: 140 }
                                            }
                                        }}
                                    />
                                </LocalizationProvider>
                                <Button variant="contained" onClick={() => { setEditingTask(null); setOpenModal(true); }}>Aggiungi Attività</Button>
                            </Stack>
                            <Box sx={{ overflowY: 'auto', maxHeight: '70vh', pr: 1 }}>
                                {/* Da Fare */}
                                <Typography variant="subtitle1" fontWeight={700} mb={1}>Da Fare</Typography>
                                <Droppable droppableId="todo">
                                    {(provided) => (
                                        <Box ref={provided.innerRef} {...provided.droppableProps}>
                                            {tasksByStatus.waiting.length === 0 ? (
                                                <Typography color="text.secondary" mb={2}>Nessuna attività da fare</Typography>
                                            ) : (
                                                tasksByStatus.waiting.map((task, idx) => (
                                                    <Draggable key={task._id} draggableId={task._id} index={idx}>
                                                        {(provided) => (
                                                            <Box ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                                <Paper sx={{ mb: 2, p: 2, borderRadius: 2, boxShadow: 1, borderLeft: '4px solid #1976d2', position: 'relative' }}>
                                                                    <Typography fontWeight="bold">{task.description}</Typography>
                                                                    <Typography variant="body2">
                                                                        {task.startTime && task.endTime ? `${task.startTime} - ${task.endTime}` : ''}
                                                                        {task.assignedTo ? ` | ${typeof task.assignedTo === 'object' && task.assignedTo !== null ? task.assignedTo.fullName : task.assignedTo}` : ''}
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
                                                                    {canEdit && (
                                                                        <Button size="small" variant="outlined" sx={{ position: 'absolute', top: 8, right: 8 }} onClick={() => handleOpenEdit(task)}>
                                                                            Modifica
                                                                        </Button>
                                                                    )}
                                                                </Paper>
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
                                <Typography variant="subtitle1" fontWeight={700} mb={1}>In Corso</Typography>
                                <Droppable droppableId="in_corso">
                                    {(provided) => (
                                        <Box ref={provided.innerRef} {...provided.droppableProps}>
                                            {tasksByStatus.in_corso.length === 0 ? (
                                                <Typography color="text.secondary" mb={2}>Nessuna attività in corso</Typography>
                                            ) : (
                                                tasksByStatus.in_corso.map((task, idx) => (
                                                    <Draggable key={task._id} draggableId={task._id} index={idx}>
                                                        {(provided) => (
                                                            <Box ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                                <Paper sx={{ mb: 2, p: 2, borderRadius: 2, boxShadow: 1, borderLeft: '4px solid #ffa726', position: 'relative' }}>
                                                                    <Typography fontWeight="bold">{task.description}</Typography>
                                                                    <Typography variant="body2">
                                                                        {task.startTime && task.endTime ? `${task.startTime} - ${task.endTime}` : ''}
                                                                        {task.assignedTo ? ` | ${typeof task.assignedTo === 'object' && task.assignedTo !== null ? task.assignedTo.fullName : task.assignedTo}` : ''}
                                                                        {typeof task.estimatedMinutes === 'number' ? ` | ${task.estimatedMinutes} min` : ''}
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
                                                                    {canEdit && (
                                                                        <Button size="small" variant="outlined" sx={{ position: 'absolute', top: 8, right: 8 }} onClick={() => handleOpenEdit(task)}>
                                                                            Modifica
                                                                        </Button>
                                                                    )}
                                                                </Paper>
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
                            width: { xs: '100%', md: '50%' },
                            minWidth: 0,
                            boxSizing: 'border-box',
                            display: 'flex',
                            flexDirection: 'column',
                            maxWidth: '100%',
                        }}
                    >
                        <Droppable droppableId="done">
                            {(provided) => (
                                <Box ref={provided.innerRef} {...provided.droppableProps} sx={{ width: '100%', maxWidth: '100%' }}>
                                    <Paper sx={{ p: 2, borderRadius: 3, boxShadow: 2, maxWidth: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                                        <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                                            <BarChartIcon sx={{ color: '#43a047' }} />
                                            <Typography variant="h6" fontWeight={700}>Completate</Typography>
                                        </Stack>
                                        <Box sx={{ overflowY: 'auto', maxHeight: '70vh', pr: 1 }}>
                                            <Paper sx={{ p: 2, borderRadius: 2 }}>
                                                <Typography fontWeight={700} fontSize={15} mb={1}>Completate ({completedCount}/{totalCount})</Typography>
                                                {tasksByStatus.done.map((task, idx) => (
                                                    <Paper key={task._id} sx={{ mb: 1, p: 1.5, borderRadius: 2, boxShadow: 1, borderLeft: '4px solid #43a047' }}>
                                                        <Stack direction="row" alignItems="center" spacing={1}>
                                                            <Avatar sx={{ bgcolor: '#43a047', width: 24, height: 24, fontSize: 16 }}>
                                                                <CheckIcon sx={{ color: '#fff', fontSize: 18 }} />
                                                            </Avatar>
                                                            <Box>
                                                                <Typography fontWeight={700} fontSize={15}>{task.description}</Typography>
                                                                <Typography variant="body2" color="text.secondary">Completato alle {task.completedAt || '--:--'}</Typography>
                                                            </Box>
                                                        </Stack>
                                                    </Paper>
                                                ))}
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
            <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
            <TaskModal
                open={openModal}
                handleClose={() => { setOpenModal(false); }}
                productionLines={productionLines}
                onSaveSuccess={handleSaveSuccess}
            />
            <EditTaskModal
                open={openEditModal}
                handleClose={() => { setOpenEditModal(false); setEditingTask(null); }}
                editingTask={editingTask as any}
                setEditingTask={setEditingTask as any}
                productionLines={productionLines}
                onSaveSuccess={handleEditSaveSuccess}
                currentUserRole={currentUserRole}
            />
        </Box>
    );
};