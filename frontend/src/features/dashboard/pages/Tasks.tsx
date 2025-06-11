import { useEffect, useState } from 'react';
import { Box, Paper, Stack, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Avatar, Chip, useTheme, colors, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, IconButton, List, ListItem, ListItemText, ListItemSecondaryAction, Autocomplete, Checkbox, FormControlLabel } from '@mui/material';
import { Header } from '../components/Header';
import api from '../../../utils/axios';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useAuth } from '../../log-in/context/AuthContext';
import { v4 as uuidv4 } from 'uuid';

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
    assignedTo: AutocompleteUser | string;
    estimatedMinutes: number;
    status: string;
    checklist: ChecklistItem[];
}

interface ProductionLine {
    _id: string;
    name: string;
    description?: string;
    lineId: string;
}

// Define the User type as it's returned by GraphQL (excluding password)
interface AutocompleteUser {
    _id: string;
    fullName: string;
    username: string;
    role: string;
}

// Type guard for AutocompleteUser
function isAutocompleteUser(user: any): user is AutocompleteUser {
    return typeof user === 'object' && user !== null && '_id' in user && 'fullName' in user && 'username' in user;
}

export const Tasks = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const [users, setUsers] = useState<AutocompleteUser[]>([]);
    const [productionLines, setProductionLines] = useState<ProductionLine[]>([]);
    const [form, setForm] = useState({
        description: '',
        assignedTo: '',
        estimatedMinutes: '',
        status: 'in_attesa',
        checklist: [''],
        lineId: '',
    });
    const [saving, setSaving] = useState(false);
    const { token, user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');

    // State to hold the currently selected user object for Autocomplete display
    const [selectedAssignedUser, setSelectedAssignedUser] = useState<AutocompleteUser | null>(null);

    // Nuovo stato per la task in modifica
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    // Funzione per verificare se l'utente ha i permessi necessari
    const canManageTasks = () => {
        return user?.role === 'manager' || user?.role === 'admin';
    };

    // Colori dinamici
    const isDark = theme.palette.mode === 'dark';
    const headerBg = isDark ? '#232323' : '#222';
    const headerColor = '#fff';
    const cellColor = isDark ? '#fff' : '#222';
    const borderColor = isDark ? '#444' : '#e0e0e0';
    const avatarBg = isDark ? '#fff' : '#222';
    const avatarColor = isDark ? '#222' : '#fff';
    const checklistDone = '#B0B0B0';
    const checklistColor = cellColor;
    const chipStyles = {
        attesa: { bgcolor: isDark ? '#393' : '#43a047', color: '#fff' },
        corso: { bgcolor: isDark ? '#FFA726' : '#FFD54F', color: isDark ? '#222' : '#222' },
        completata: { bgcolor: isDark ? '#1976d2' : '#1976d2', color: '#fff' },
        default: { bgcolor: isDark ? '#444' : '#e0e0e0', color: cellColor },
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true); // Ensure loading is true before fetching
            try {
                // Fetch tasks
                const tasksRes = await api.get('/tasks');
                setTasks(tasksRes.data);

                // Fetch production lines
                const linesRes = await api.get('/production-lines');
                setProductionLines(linesRes.data);

            } catch (err) {
                console.error('Errore nel recupero dei dati:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []); // Empty dependency array means this runs once on mount

    // Effect for GraphQL user search (no debounce)
    useEffect(() => {
        const fetchUsersGraphQL = async (queryTerm: string) => {
            console.log('Attempting GraphQL search for:', queryTerm);
            const query = `
                query GetUsersByName($name: String!) {
                    users(name: $name) {
                        _id
                        fullName
                        username
                        role
                    }
                }
            `;
            try {
                const res = await api.post('/graphql', { query, variables: { name: queryTerm } });
                console.log('GraphQL raw response:', res.data);
                if (res.data && res.data.data && res.data.data.users) {
                    setUsers(res.data.data.users);
                    console.log('Users updated from search:', res.data.data.users);
                } else {
                    console.warn('GraphQL response unexpected structure or empty users from search:', res.data);
                    setUsers([]);
                }
            } catch (err) {
                console.error('Errore nella ricerca utenti GraphQL:', err);
                setUsers([]);
            }
        };

        // Effect for fetching selected user if needed
        const fetchSelectedUserById = async (userId: string) => {
            console.log('Fetching selected user by ID for display:', userId);
            const query = `
                query GetUserById($id: ID!) {
                    user(_id: $id) {
                        _id
                        fullName
                        username
                        role
                    }
                }
            `;
            try {
                const res = await api.post('/graphql', { query, variables: { id: userId } });
                console.log('GraphQL selected user response:', res.data);
                if (res.data && res.data.data && res.data.data.user) {
                    setSelectedAssignedUser(res.data.data.user);
                    console.log('Selected user updated for display:', res.data.data.user);
                } else {
                    console.warn('GraphQL response unexpected structure or no selected user:', res.data);
                    setSelectedAssignedUser(null);
                }
            } catch (err) {
                console.error('Errore nel recupero utente selezionato per display GraphQL:', err);
                setSelectedAssignedUser(null);
            }
        };

        // Main logic for user search/display
        if (searchQuery.trim() !== '') {
            // Only perform search if searchQuery is different from the currently selected user's full name
            if (!selectedAssignedUser || searchQuery.toLowerCase() !== selectedAssignedUser.fullName.toLowerCase()) {
                fetchUsersGraphQL(searchQuery);
            }
        } else {
            // If search query is empty
            if (form.assignedTo) {
                // If a user is already assigned, fetch it for display if not already available
                if (!selectedAssignedUser || selectedAssignedUser._id !== form.assignedTo) {
                    fetchSelectedUserById(form.assignedTo);
                }
            } else {
                // If no search query and no user assigned, clear options and selected display
                setUsers([]);
                setSelectedAssignedUser(null);
            }
        }
    }, [searchQuery, form.assignedTo]); // Removed selectedAssignedUser from dependencies for simpler control flow

    const handleOpen = () => {
        setOpen(true);
        setSearchQuery('');
        setForm({ description: '', assignedTo: '', estimatedMinutes: '', status: 'in_attesa', checklist: [''], lineId: '' });
        setSelectedAssignedUser(null);
    };
    const handleClose = () => {
        setOpen(false);
        setForm({ description: '', assignedTo: '', estimatedMinutes: '', status: 'in_attesa', checklist: [''], lineId: '' });
        setSelectedAssignedUser(null);
        setEditingTask(null);
    };

    // Nuova funzione per aprire il form in modalità modifica
    const handleOpenEdit = (task: Task) => {
        const checklistWithIds = task.checklist.map(item => ({ ...item, id: item.id || uuidv4() }));
        setEditingTask({ ...task, checklist: checklistWithIds });
        setForm({
            description: task.description,
            assignedTo: isAutocompleteUser(task.assignedTo) ? task.assignedTo._id : task.assignedTo,
            estimatedMinutes: String(task.estimatedMinutes),
            status: task.status,
            checklist: task.checklist.map(item => item.item),
            lineId: task.lineId,
        });
        if (isAutocompleteUser(task.assignedTo)) {
            setSelectedAssignedUser(task.assignedTo);
            setSearchQuery(task.assignedTo.fullName);
        } else {
            setSelectedAssignedUser(null);
            setSearchQuery('');
        }
        setOpen(true);
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | React.ChangeEvent<{ name?: string; value: unknown }>) => {
        const { name, value } = e.target as HTMLInputElement;
        setForm((prev) => ({ ...prev, [name!]: value }));
    };

    const handleChecklistChange = (idx: number, value: string) => {
        setForm((prev) => {
            const checklist = [...prev.checklist];
            checklist[idx] = value;
            return { ...prev, checklist };
        });
    };

    // Nuova funzione per gestire il cambiamento del testo della checklist in modalità modifica
    const handleEditChecklistTextChange = (idx: number, value: string) => {
        if (editingTask) {
            setEditingTask(prev => {
                if (!prev) return null;
                const updatedChecklist = [...prev.checklist];
                updatedChecklist[idx] = { ...updatedChecklist[idx], item: value };
                return { ...prev, checklist: updatedChecklist };
            });
        }
    };

    // Nuova funzione per gestire il checkbox della checklist (solo in modifica)
    const handleChecklistItemToggle = (idx: number) => {
        if (editingTask) {
            setEditingTask(prev => {
                if (!prev) return null;
                const updatedChecklist = [...prev.checklist];
                updatedChecklist[idx] = { ...updatedChecklist[idx], done: !updatedChecklist[idx].done };
                return { ...prev, checklist: updatedChecklist };
            });
        }
    };

    const handleAddChecklist = () => {
        if (editingTask) {
            setEditingTask(prev => {
                if (!prev) return null;
                return { ...prev, checklist: [...prev.checklist, { id: uuidv4(), item: '', done: false }] };
            });
        } else {
            setForm((prev) => ({ ...prev, checklist: [...prev.checklist, ''] }));
        }
    };

    const handleRemoveChecklist = (idx: number) => {
        if (editingTask) {
            setEditingTask(prev => {
                if (!prev) return null;
                const updatedChecklist = prev.checklist.filter((_, i) => i !== idx);
                return { ...prev, checklist: updatedChecklist };
            });
        } else {
            setForm((prev) => {
                const checklist = prev.checklist.filter((_, i) => i !== idx);
                return { ...prev, checklist };
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSaving(true);
        try {
            const today = new Date();
            const date = today.toISOString().slice(0, 10);
            const checklist = form.checklist.filter((item) => item.trim() !== '').map((item) => ({ item, done: false }));
            const payload = {
                date,
                lineId: form.lineId,
                description: form.description,
                assignedTo: form.assignedTo,
                estimatedMinutes: Number(form.estimatedMinutes),
                status: form.status,
                checklist,
            };
            await api.post('/tasks', payload);
            setOpen(false);
            setForm({ description: '', assignedTo: '', estimatedMinutes: '', status: 'in_attesa', checklist: [''], lineId: '' });
            setSelectedAssignedUser(null);

            // Ricarica tasks
            const res = await api.get('/tasks');
            setTasks(res.data);
        } catch (err) {
            console.error('Errore creazione task:', err);
        } finally {
            setSaving(false);
        }
    };

    // Nuova funzione per gestire l'aggiornamento della task
    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editingTask) return; // Non ci dovrebbe essere, ma per sicurezza

        setSaving(true);
        try {
            // I campi da inviare per l'update sono solo stato e checklist
            const payload = {
                status: editingTask.status,
                checklist: editingTask.checklist,
            };
            await api.put(`/tasks/${editingTask._id}`, payload);
            setOpen(false);
            setEditingTask(null); // Resetta la task in modifica

            // Ricarica tasks
            const res = await api.get('/tasks');
            setTasks(res.data);
        } catch (err) {
            console.error('Errore aggiornamento task:', err);
        } finally {
            setSaving(false);
        }
    };

    return (
        <Box p={1} height={'100dvh'}>
            <Paper
                elevation={1}
                sx={{
                    borderRadius: 11,
                    p: 1,
                    background: 'rgba(255, 255, 255, 0.07)',
                    backdropFilter: 'blur(20px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                    height: '100%',
                }}
            >
                <Stack direction="column" gap={1} sx={{ height: '100%' }}>
                    <Header />
                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2, mt: 1 }}>
                        <Typography variant="h5" sx={{ fontWeight: 700 }}>ATTIVITÁ</Typography>
                        {canManageTasks() && (
                            <Button variant="contained" sx={{ borderRadius: 8, background: '#FF4F8B', fontWeight: 700, textTransform: 'none', px: 3 }} onClick={handleOpen}>
                                AGGIUNGI ATTIVITÁ
                            </Button>
                        )}
                    </Stack>
                    {loading ? (
                        <Typography>Caricamento...</Typography>
                    ) : (
                        <TableContainer component={Paper} sx={{ boxShadow: 'none', background: 'transparent' }}>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ background: isDark ? '#333' : '#f1f1f1' }}>
                                        <TableCell sx={{ fontWeight: 700, color: isDark ? '#fff' : '#000' }}>Data</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: isDark ? '#fff' : '#000' }}>Linea</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: isDark ? '#fff' : '#000' }}>Descrizione</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: isDark ? '#fff' : '#000' }}>Assegnata a</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: isDark ? '#fff' : '#000' }}>Durata stimata (min)</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: isDark ? '#fff' : '#000' }}>Stato</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: isDark ? '#fff' : '#000' }}>Checklist</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: isDark ? '#fff' : '#000' }}>Azioni</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {tasks.map((task) => (
                                        <TableRow key={task._id} sx={{ '&:last-child td, &:last-child th': { border: 0 }, borderBottom: `1px solid ${borderColor}` }}>
                                            <TableCell sx={{ color: cellColor }}>{task.date}</TableCell>
                                            <TableCell sx={{ color: cellColor }}>
                                                {productionLines.find(l => l.lineId === task.lineId)?.name || task.lineId}
                                            </TableCell>
                                            <TableCell sx={{ color: cellColor }}>{task.description}</TableCell>
                                            <TableCell>
                                                <Stack direction="row" alignItems="center" gap={1}>
                                                    <Avatar sx={{ width: 32, height: 32, bgcolor: avatarBg, color: avatarColor, fontWeight: 700, fontSize: 16 }}>
                                                        {typeof task.assignedTo === 'object' && task.assignedTo.fullName
                                                            ? task.assignedTo.fullName.charAt(0)
                                                            : (typeof task.assignedTo === 'string' ? task.assignedTo.charAt(0) : '?')}
                                                    </Avatar>
                                                    <Typography fontWeight={700} fontSize={15} sx={{ color: cellColor }}>
                                                        {typeof task.assignedTo === 'object'
                                                            ? `${task.assignedTo.fullName}`
                                                            : task.assignedTo}
                                                    </Typography>
                                                </Stack>
                                            </TableCell>
                                            <TableCell sx={{ color: cellColor }}>{task.estimatedMinutes}</TableCell>
                                            <TableCell>
                                                {task.status === 'Aperta' || task.status === 'in_attesa' ? (
                                                    <Chip label={task.status === 'Aperta' ? 'Aperta' : 'in attesa'} sx={{ bgcolor: '#77c3fe', color: isDark ? '#fff' : '#000', fontWeight: 700, px: 2, fontSize: 15, borderRadius: 3 }} />
                                                ) : task.status === 'Risolta' || task.status === 'completata' ? (
                                                    <Chip label={task.status === 'Risolta' ? 'Risolta' : 'completata'} sx={{ bgcolor: '#67ff88', color: isDark ? '#fff' : '#000', fontWeight: 700, px: 2, fontSize: 15, borderRadius: 3 }} />
                                                ) : task.status === 'in_corso' ? (
                                                    <Chip label="in corso" sx={{ bgcolor: '#d8dcb8', color: isDark ? '#fff' : '#000', fontWeight: 700, px: 2, fontSize: 15, borderRadius: 3 }} />
                                                ) : (
                                                    <Chip label={task.status} sx={{ bgcolor: '#9e9e9e', color: isDark ? '#fff' : '#000', fontWeight: 700, px: 2, fontSize: 15, borderRadius: 3 }} />
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <ul style={{ margin: 0, paddingLeft: 16, listStyle: 'disc', fontSize: 14, color: checklistColor }}>
                                                    {task.checklist.map((item, idx) => (
                                                        <li key={item.id || idx} style={{ textDecoration: item.done ? 'line-through' : 'none', color: item.done ? checklistDone : checklistColor }}>
                                                            {item.item}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </TableCell>
                                            <TableCell>
                                                <IconButton onClick={() => handleOpenEdit(task)} className="no-focus-ring">
                                                    <EditIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Stack>
            </Paper>
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>{editingTask ? 'Modifica Attività' : 'Nuova Attività'}</DialogTitle>
                <form onSubmit={editingTask ? handleUpdate : handleSubmit}>
                    <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="Descrizione"
                            name="description"
                            value={form.description}
                            onChange={handleFormChange}
                            required
                            fullWidth
                            disabled={!!editingTask}
                        />
                        <TextField
                            select
                            label="Linea"
                            name="lineId"
                            value={form.lineId}
                            onChange={handleFormChange}
                            required
                            fullWidth
                            disabled={!!editingTask}
                        >
                            {productionLines.map((line) => (
                                <MenuItem key={line._id} value={line.lineId}>
                                    {line.name}
                                </MenuItem>
                            ))}
                        </TextField>
                        <Autocomplete
                            options={users}
                            getOptionLabel={(option) =>
                                option && typeof option === 'object'
                                    ? `${option.fullName} (${option.username})`
                                    : ''
                            }
                            value={selectedAssignedUser}
                            onInputChange={(_, newInputValue, reason) => {
                                if (reason === 'input' || reason === 'clear') {
                                    setSearchQuery(newInputValue);
                                }
                            }}
                            onChange={(_, value) => {
                                setForm(prev => ({ ...prev, assignedTo: value ? value._id : '' }));
                                setSelectedAssignedUser(value as AutocompleteUser | null);
                                if (value) {
                                    setSearchQuery(value.fullName);
                                } else {
                                    setSearchQuery('');
                                }
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Assegnata a"
                                    required
                                    fullWidth
                                />
                            )}
                            isOptionEqualToValue={(option, value) => option?._id === value?._id}
                            disabled={!!editingTask}
                        />
                        <TextField
                            label="Durata stimata (min)"
                            name="estimatedMinutes"
                            type="number"
                            value={form.estimatedMinutes}
                            onChange={handleFormChange}
                            required
                            fullWidth
                            disabled={!!editingTask}
                        />
                        <TextField
                            select
                            label="Stato"
                            name="status"
                            value={editingTask ? editingTask.status : form.status}
                            onChange={e => {
                                if (editingTask) {
                                    setEditingTask(prev => prev ? { ...prev, status: e.target.value } : null);
                                } else {
                                    handleFormChange(e);
                                }
                            }}
                            required
                            fullWidth
                        >
                            <MenuItem value="in_attesa">In attesa</MenuItem>
                            <MenuItem value="in_corso">In corso</MenuItem>
                            <MenuItem value="completata">Completata</MenuItem>
                        </TextField>
                        <Typography variant="subtitle1" sx={{ mt: 1 }}>Checklist</Typography>
                        <List>
                            {editingTask ? (
                                editingTask.checklist.map((item: ChecklistItem, idx: number) => (
                                    <ListItem key={item.id || idx} disableGutters>
                                        <Stack direction="row" alignItems="center" flex={1} gap={1}>
                                            <Checkbox
                                                checked={item.done}
                                                onChange={() => handleChecklistItemToggle(idx)}
                                            />
                                            <TextField
                                                value={item.item}
                                                onChange={e => handleEditChecklistTextChange(idx, e.target.value)}
                                                placeholder={`Item ${idx + 1}`}
                                                size="small"
                                                fullWidth
                                            />
                                        </Stack>
                                        <ListItemSecondaryAction>
                                            <IconButton edge="end" onClick={() => handleRemoveChecklist(idx)} disabled={editingTask.checklist.length === 1}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                ))
                            ) : (
                                form.checklist.map((item: string, idx: number) => (
                                    <ListItem key={idx} disableGutters>
                                        <TextField
                                            value={item}
                                            onChange={e => handleChecklistChange(idx, e.target.value)}
                                            placeholder={`Item ${idx + 1}`}
                                            size="small"
                                            sx={{ flex: 1 }}
                                        />
                                        <ListItemSecondaryAction>
                                            <IconButton edge="end" onClick={() => handleRemoveChecklist(idx)} disabled={form.checklist.length === 1}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                ))
                            )}
                        </List>
                        <Button startIcon={<AddIcon />} onClick={handleAddChecklist} sx={{ alignSelf: 'flex-start' }}>
                            Aggiungi item
                        </Button>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Annulla</Button>
                        <Button type="submit" variant="contained" disabled={saving}>
                            {saving ? 'Salvataggio...' : 'Salva'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    );
}; 