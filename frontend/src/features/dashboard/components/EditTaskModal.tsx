import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Button, IconButton, List, ListItem, ListItemText, ListItemSecondaryAction, Autocomplete, Checkbox, FormControlLabel, InputAdornment, useTheme, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { v4 as uuidv4 } from 'uuid';
import { useEffect, useState } from 'react';
import api from '../../../utils/axios';

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
    type: 'standard' | 'manutenzione';
    maintenanceStart?: string;
    maintenanceEnd?: string;
}

interface ProductionLine {
    _id: string;
    name: string;
    description?: string;
    lineId: string;
}

interface AutocompleteUser {
    _id: string;
    fullName: string;
    username: string;
    role: string;
}

function isAutocompleteUser(user: any): user is AutocompleteUser {
    return typeof user === 'object' && user !== null && '_id' in user && 'fullName' in user && 'username' in user;
}

interface EditTaskModalProps {
    open: boolean;
    handleClose: () => void;
    editingTask: Task | null;
    setEditingTask: React.Dispatch<React.SetStateAction<Task | null>>;
    productionLines: ProductionLine[];
    onSaveSuccess: () => Promise<void>;
    currentUserRole: string;
}

export const EditTaskModal: React.FC<EditTaskModalProps> = ({
    open,
    handleClose,
    editingTask,
    setEditingTask,
    productionLines,
    onSaveSuccess,
    currentUserRole,
}) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const [saving, setSaving] = useState(false);
    const [users, setUsers] = useState<AutocompleteUser[]>([]);
    const [selectedAssignedUserLocal, setSelectedAssignedUserLocal] = useState<AutocompleteUser | null>(null);
    const [autocompleteInput, setAutocompleteInput] = useState<string>('');

    useEffect(() => {
        const fetchUsersGraphQL = async (queryTerm: string) => {
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
                if (res.data && res.data.data && res.data.data.users) {
                    setUsers(res.data.data.users);
                } else {
                    setUsers([]);
                }
            } catch (err) {
                setUsers([]);
            }
        };

        const fetchSelectedUserById = async (userId: string) => {
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
                if (res.data && res.data.data && res.data.data.user) {
                    setSelectedAssignedUserLocal(res.data.data.user);
                } else {
                    setSelectedAssignedUserLocal(null);
                }
            } catch (err) {
                setSelectedAssignedUserLocal(null);
            }
        };

        if (autocompleteInput.trim() !== '') {
            if (!selectedAssignedUserLocal || autocompleteInput.toLowerCase() !== selectedAssignedUserLocal.fullName.toLowerCase()) {
                fetchUsersGraphQL(autocompleteInput);
            }
        } else {
            if (editingTask && editingTask.assignedTo) {
                if (!selectedAssignedUserLocal || (isAutocompleteUser(editingTask.assignedTo) && selectedAssignedUserLocal._id !== editingTask.assignedTo._id)) {
                    const userId = isAutocompleteUser(editingTask.assignedTo) ? editingTask.assignedTo._id : editingTask.assignedTo;
                    fetchSelectedUserById(userId);
                }
            } else {
                setUsers([]);
                setSelectedAssignedUserLocal(null);
            }
        }
    }, [autocompleteInput, editingTask, editingTask?.assignedTo]);

    useEffect(() => {
        if (open && editingTask) {
            if (isAutocompleteUser(editingTask.assignedTo)) {
                setSelectedAssignedUserLocal(editingTask.assignedTo);
                setAutocompleteInput(editingTask.assignedTo.fullName);
            } else {
                setSelectedAssignedUserLocal(null);
                setAutocompleteInput('');
            }
        }
    }, [open, editingTask]);

    const canEditCurrentTask = editingTask && (currentUserRole === 'manager' || currentUserRole === 'admin');

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
        }
    };

    const handleRemoveChecklist = (idx: number) => {
        if (editingTask) {
            setEditingTask(prev => {
                if (!prev) return null;
                const updatedChecklist = prev.checklist.filter((_, i) => i !== idx);
                return { ...prev, checklist: updatedChecklist };
            });
        }
    };

    const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | React.ChangeEvent<{ name?: string; value: unknown }>) => {
        const { name, value } = e.target as HTMLInputElement;
        if (editingTask) {
            setEditingTask(prev => prev ? { ...prev, [name!]: value } : null);
        }
    };

    const handleAssignedToChange = (user: AutocompleteUser | null) => {
        if (editingTask) {
            setEditingTask(prev => prev ? { ...prev, assignedTo: user ? user : '' } : null);
            setSelectedAssignedUserLocal(user);
            setAutocompleteInput(user ? user.fullName : '');
        }
    };

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editingTask) return;
        setSaving(true);
        try {
            const payload: any = {
                date: editingTask.date,
                lineId: editingTask.lineId,
                description: editingTask.description,
                assignedTo: isAutocompleteUser(editingTask.assignedTo) ? editingTask.assignedTo._id : editingTask.assignedTo,
                estimatedMinutes: Number(editingTask.estimatedMinutes),
                status: editingTask.status,
                checklist: editingTask.checklist,
                type: editingTask.type,
            };
            if (editingTask.type === 'manutenzione') {
                payload.maintenanceStart = editingTask.maintenanceStart;
                payload.maintenanceEnd = editingTask.maintenanceEnd;
            }
            await api.put(`/tasks/${editingTask._id}`, payload);
            await onSaveSuccess();
        } catch (err) {
            console.error('Errore aggiornamento task:', err);
        } finally {
            setSaving(false);
        }
    };

    if (!editingTask) return null;

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Modifica Attività</DialogTitle>
            <form onSubmit={handleUpdate}>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        label="Data"
                        name="date"
                        type="date"
                        value={editingTask.date}
                        onChange={handleFieldChange}
                        required
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        disabled={!canEditCurrentTask}
                    />
                    <TextField
                        label="Descrizione"
                        name="description"
                        value={editingTask.description}
                        onChange={handleFieldChange}
                        required
                        fullWidth
                        multiline
                        minRows={3}
                        disabled={!canEditCurrentTask}
                    />
                    <TextField
                        select
                        label="Linea"
                        name="lineId"
                        value={editingTask.lineId}
                        onChange={handleFieldChange}
                        required
                        fullWidth
                        disabled={!canEditCurrentTask}
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
                        value={selectedAssignedUserLocal}
                        onInputChange={(_, newInputValue, reason) => {
                            if (reason === 'input' || reason === 'clear') {
                                setAutocompleteInput(newInputValue);
                            }
                        }}
                        onChange={(_, value) => handleAssignedToChange(value as AutocompleteUser | null)}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Assegnata a"
                                required
                                fullWidth
                                disabled={!canEditCurrentTask}
                            />
                        )}
                        isOptionEqualToValue={(option, value) => option?._id === value?._id}
                        disabled={!canEditCurrentTask}
                    />
                    <TextField
                        label="Durata stimata (min)"
                        name="estimatedMinutes"
                        type="number"
                        value={editingTask.estimatedMinutes}
                        onChange={handleFieldChange}
                        required
                        fullWidth
                        disabled={!canEditCurrentTask}
                    />
                    <TextField
                        select
                        label="Stato"
                        name="status"
                        value={editingTask.status}
                        onChange={handleFieldChange}
                        required
                        fullWidth
                        disabled={!canEditCurrentTask}
                    >
                        <MenuItem value="in_attesa">In attesa</MenuItem>
                        <MenuItem value="in_corso">In corso</MenuItem>
                        <MenuItem value="completata">Completata</MenuItem>
                    </TextField>
                    <TextField
                        select
                        label="Tipo"
                        name="type"
                        value={editingTask.type}
                        onChange={handleFieldChange}
                        required
                        fullWidth
                        disabled={!canEditCurrentTask}
                    >
                        <MenuItem value="standard">Standard</MenuItem>
                        <MenuItem value="manutenzione">Manutenzione</MenuItem>
                    </TextField>
                    {editingTask.type === 'manutenzione' && (
                        <>
                            <TextField
                                label="Inizio manutenzione"
                                name="maintenanceStart"
                                type="datetime-local"
                                value={editingTask.maintenanceStart || ''}
                                onChange={handleFieldChange}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                sx={{ mt: 1 }}
                                disabled={!canEditCurrentTask}
                            />
                            <TextField
                                label="Fine manutenzione"
                                name="maintenanceEnd"
                                type="datetime-local"
                                value={editingTask.maintenanceEnd || ''}
                                onChange={handleFieldChange}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                sx={{ mt: 1 }}
                                disabled={!canEditCurrentTask}
                            />
                        </>
                    )}
                    <Typography variant="subtitle1" sx={{ mt: 1 }}>Sotto attività</Typography>
                    <List>
                        {editingTask.checklist.map((item: ChecklistItem, idx: number) => (
                            <ListItem key={item.id || idx} disableGutters>
                                <TextField
                                    value={item.item}
                                    onChange={e => handleEditChecklistTextChange(idx, e.target.value)}
                                    placeholder={`Sotto attività ${idx + 1}`}
                                    size="small"
                                    fullWidth
                                    disabled={!canEditCurrentTask}
                                />
                                <ListItemSecondaryAction>
                                    <IconButton edge="end" onClick={() => handleRemoveChecklist(idx)} disabled={editingTask.checklist.length === 1 || !canEditCurrentTask}>
                                        <DeleteIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                    </List>
                    <Button startIcon={<AddIcon />} onClick={handleAddChecklist} sx={{ alignSelf: 'flex-start' }} disabled={!canEditCurrentTask}>
                        Aggiungi sotto attività
                    </Button>
                </DialogContent>
                {canEditCurrentTask && (
                    <DialogActions>
                        <Button onClick={handleClose}>Annulla</Button>
                        <Button type="submit" variant="contained" disabled={saving}>
                            {saving ? 'Salvataggio...' : 'Salva'}
                        </Button>
                    </DialogActions>
                )}
            </form>
        </Dialog>
    );
};
