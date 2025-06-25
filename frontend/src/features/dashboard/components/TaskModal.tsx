import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Button, IconButton, List, ListItem, ListItemText, ListItemSecondaryAction, Autocomplete, Checkbox, FormControlLabel, InputAdornment, useTheme, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { v4 as uuidv4 } from 'uuid';
import { useEffect, useState } from 'react';
import api from '../../../utils/axios';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

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

interface AutocompleteUser {
    _id: string;
    fullName: string;
    username: string;
    role: string;
}

function isAutocompleteUser(user: any): user is AutocompleteUser {
    return typeof user === 'object' && user !== null && '_id' in user && 'fullName' in user && 'username' in user;
}

interface TaskFormState {
    description: string;
    assignedTo: string;
    estimatedMinutes: string;
    status: string;
    checklist: string[];
    lineId: string;
    date: string;
    type: string;
    maintenanceStart: string;
    maintenanceEnd: string;
}

interface TaskModalProps {
    open: boolean;
    handleClose: () => void;
    productionLines: ProductionLine[];
    onSaveSuccess: () => Promise<void>;
}

export const TaskModal: React.FC<TaskModalProps> = ({
    open,
    handleClose,
    productionLines,
    onSaveSuccess,
}) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const [form, setForm] = useState<TaskFormState>({
        description: '',
        assignedTo: '',
        estimatedMinutes: '',
        status: 'in_attesa',
        checklist: [''],
        lineId: '',
        date: new Date().toISOString().slice(0, 10),
        type: 'standard',
        maintenanceStart: '',
        maintenanceEnd: '',
    });
    const [saving, setSaving] = useState(false);

    // Local states for Autocomplete
    const [users, setUsers] = useState<AutocompleteUser[]>([]);
    const [selectedAssignedUserLocal, setSelectedAssignedUserLocal] = useState<AutocompleteUser | null>(null);
    const [autocompleteInput, setAutocompleteInput] = useState<string>('');

    // Effect to fetch users for Autocomplete
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
                    setSelectedAssignedUserLocal(res.data.data.user);
                    console.log('Selected user updated for display:', res.data.data.user);
                } else {
                    console.warn('GraphQL response unexpected structure or no selected user:', res.data);
                    setSelectedAssignedUserLocal(null);
                }
            } catch (err) {
                console.error('Errore nel recupero utente selezionato per display GraphQL:', err);
                setSelectedAssignedUserLocal(null);
            }
        };

        if (autocompleteInput.trim() !== '') {
            // Only perform search if autocompleteInput is different from the currently selected user's full name
            if (!selectedAssignedUserLocal || autocompleteInput.toLowerCase() !== selectedAssignedUserLocal.fullName.toLowerCase()) {
                fetchUsersGraphQL(autocompleteInput);
            }
        } else {
            // If autocompleteInput is empty
            if (form.assignedTo) {
                // If a user is already assigned, fetch it for display if not already available
                if (!selectedAssignedUserLocal || selectedAssignedUserLocal._id !== form.assignedTo) {
                    fetchSelectedUserById(form.assignedTo);
                }
            } else {
                // If no autocompleteInput and no user assigned, clear options and selected display
                setUsers([]);
                setSelectedAssignedUserLocal(null);
            }
        }
    }, [autocompleteInput, form.assignedTo]);

    useEffect(() => {
        if (open) {
            setForm({
                description: '',
                assignedTo: '',
                estimatedMinutes: '',
                status: 'in_attesa',
                checklist: [''],
                lineId: '',
                date: new Date().toISOString().slice(0, 10),
                type: 'standard',
                maintenanceStart: '',
                maintenanceEnd: '',
            });
            setSelectedAssignedUserLocal(null);
            setAutocompleteInput('');
        }
    }, [open]);

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

    const handleEditChecklistTextChange = (idx: number, value: string) => {
        if (selectedAssignedUserLocal) {
            setSelectedAssignedUserLocal(prev => {
                if (!prev) return null;
                const updatedUser = { ...prev, fullName: value };
                return updatedUser;
            });
        }
    };

    const handleChecklistItemToggle = (idx: number) => {
        if (selectedAssignedUserLocal) {
            setSelectedAssignedUserLocal(prev => {
                if (!prev) return null;
                const updatedUser = { ...prev, done: !prev.done };
                return updatedUser;
            });
        }
    };

    const handleAddChecklist = () => {
        setForm((prev) => ({ ...prev, checklist: [...prev.checklist, ''] }));
    };

    const handleRemoveChecklist = (idx: number) => {
        setForm((prev) => {
            const checklist = prev.checklist.filter((_, i) => i !== idx);
            return { ...prev, checklist };
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSaving(true);
        try {
            const checklist = form.checklist.filter((item) => item.trim() !== '').map((item) => ({ item, done: false }));
            const payload: any = {
                date: form.date || new Date().toISOString().slice(0, 10),
                lineId: form.lineId,
                description: form.description,
                assignedTo: form.assignedTo,
                estimatedMinutes: Number(form.estimatedMinutes),
                status: form.status,
                checklist,
                type: form.type,
            };
            if (form.type === 'manutenzione') {
                payload.maintenanceStart = form.maintenanceStart;
                payload.maintenanceEnd = form.maintenanceEnd;
            }
            await api.post('/tasks', payload);
            await onSaveSuccess();
        } catch (err) {
            console.error('Errore creazione task:', err);
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Nuova Attività</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            label="Data"
                            value={form.date ? new Date(form.date) : null}
                            onChange={(newValue) => setForm(prev => ({ ...prev, date: newValue ? newValue.toISOString().slice(0, 10) : '' }))}
                            slotProps={{
                                textField: {
                                    size: 'small',
                                    fullWidth: true,
                                    required: true,
                                    InputLabelProps: { shrink: true }
                                }
                            }}
                        />
                    </LocalizationProvider>
                    <TextField
                        label="Descrizione"
                        name="description"
                        value={form.description}
                        onChange={handleFormChange}
                        required
                        fullWidth
                        multiline
                        minRows={3}
                    />
                    <TextField
                        select
                        label="Linea"
                        name="lineId"
                        value={form.lineId}
                        onChange={handleFormChange}
                        required
                        fullWidth
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
                        onChange={(_, value) => {
                            setForm(prev => ({ ...prev, assignedTo: value ? value._id : '' }));
                            setSelectedAssignedUserLocal(value as AutocompleteUser | null);
                            if (value) {
                                setAutocompleteInput(value.fullName);
                            } else {
                                setAutocompleteInput('');
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
                    />
                    <TextField
                        label="Durata stimata (min)"
                        name="estimatedMinutes"
                        type="number"
                        value={form.estimatedMinutes}
                        onChange={handleFormChange}
                        required
                        fullWidth
                    />
                    <TextField
                        select
                        label="Stato"
                        name="status"
                        value={form.status}
                        onChange={handleFormChange}
                        required
                        fullWidth
                    >
                        <MenuItem value="in_attesa">In attesa</MenuItem>
                        <MenuItem value="in_corso">In corso</MenuItem>
                    </TextField>
                    <TextField
                        select
                        label="Tipo"
                        name="type"
                        value={form.type}
                        onChange={handleFormChange}
                        required
                        fullWidth
                    >
                        <MenuItem value="standard">Standard</MenuItem>
                        <MenuItem value="manutenzione">Manutenzione</MenuItem>
                    </TextField>
                    {form.type === 'manutenzione' && (
                        <>
                            <TextField
                                label="Inizio manutenzione"
                                name="maintenanceStart"
                                type="datetime-local"
                                value={form.maintenanceStart}
                                onChange={handleFormChange}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                sx={{ mt: 1 }}
                            />
                            <TextField
                                label="Fine manutenzione"
                                name="maintenanceEnd"
                                type="datetime-local"
                                value={form.maintenanceEnd}
                                onChange={handleFormChange}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                sx={{ mt: 1 }}
                            />
                        </>
                    )}
                    <Typography variant="subtitle1" sx={{ mt: 1 }}>Sotto attività</Typography>
                    <List>
                        {form.checklist.map((item: string, idx: number) => (
                            <ListItem key={idx} disableGutters>
                                <TextField
                                    value={item}
                                    onChange={e => handleChecklistChange(idx, e.target.value)}
                                    placeholder={`Sotto attività ${idx + 1}`}
                                    size="small"
                                    sx={{ flex: 1 }}
                                />
                                <ListItemSecondaryAction>
                                    <IconButton edge="end" onClick={() => handleRemoveChecklist(idx)} disabled={form.checklist.length === 1}>
                                        <DeleteIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                    </List>
                    <Button startIcon={<AddIcon />} onClick={handleAddChecklist} sx={{ alignSelf: 'flex-start' }}>
                        Aggiungi sotto attività
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
    );
};
