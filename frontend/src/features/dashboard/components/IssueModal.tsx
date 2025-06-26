import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Stack,
  FormControl,
  InputLabel,
  Select,
  Autocomplete,
  Typography,
} from '@mui/material';
import { CustomPaper } from '../../../components/CustomPaper';
import api from '../../../utils/axios';

interface User {
  _id: string;
  fullName: string;
  username: string;
  role: string;
}

interface OptionType {
  value: string;
  label: string;
}

interface IssueModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  lineOptions: OptionType[];
  typeOptions: OptionType[];
  priorityOptions: OptionType[];
  statusOptions: OptionType[];
  currentUser: {
    _id: string;
    fullName: string;
    username: string;
    role: string;
  };
  initialValues?: Partial<{
    _id: string;
    lineId: string;
    type: string;
    priority: string;
    status: string;
    description: string;
    reportedBy: User | null;
    assignedTo: User | null;
    createdAt: string;
    resolvedAt: string;
  }>;
}

export const statusOptions = [
  { value: 'aperta', label: 'Aperta' },
  { value: 'in lavorazione', label: 'In lavorazione' },
  { value: 'risolta', label: 'Risolta' }
];

// Funzione per ottenere la stringa locale compatibile con datetime-local
function getLocalDateTimeString(date = new Date()) {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return (
    date.getFullYear() +
    '-' +
    pad(date.getMonth() + 1) +
    '-' +
    pad(date.getDate()) +
    'T' +
    pad(date.getHours()) +
    ':' +
    pad(date.getMinutes())
  );
}

export const IssueModal: React.FC<IssueModalProps> = ({ open, onClose, onSave, lineOptions, typeOptions, priorityOptions, statusOptions, currentUser, initialValues }) => {
  const [description, setDescription] = useState('');
  const [line, setLine] = useState('');
  const [type, setType] = useState('');
  const [priority, setPriority] = useState('');
  const [status, setStatus] = useState('');
  const [assignedTo, setAssignedTo] = useState<User | null>(null);
  const [reportedBy, setReportedBy] = useState<User | null>(null);
  const [createdAt, setCreatedAt] = useState('');
  const [resolvedAt, setResolvedAt] = useState('');
  const [userOptions, setUserOptions] = useState<User[]>([]);
  const [searchAssigned, setSearchAssigned] = useState('');
  const [searchReported, setSearchReported] = useState('');

  useEffect(() => {
    if (open) {
      if (initialValues) {
        setDescription(initialValues.description || '');
        setLine(initialValues.lineId || '');
        setType(initialValues.type || '');
        setPriority(initialValues.priority || '');
        setStatus(initialValues.status || '');
        setAssignedTo(initialValues.assignedTo || null);
        setReportedBy(initialValues.reportedBy || null);
        setCreatedAt(initialValues.createdAt ? getLocalDateTimeString(new Date(initialValues.createdAt)) : '');
        setResolvedAt(initialValues.resolvedAt ? getLocalDateTimeString(new Date(initialValues.resolvedAt)) : '');
      } else {
        setDescription('');
        setLine('');
        setType('');
        setPriority('');
        setStatus('');
        setAssignedTo(null);
        setReportedBy(null);
        setCreatedAt(getLocalDateTimeString());
        setResolvedAt('');
      }
      setUserOptions([]);
      setSearchAssigned('');
      setSearchReported('');
    }
  }, [open, initialValues]);

  // Funzione per cercare utenti via GraphQL
  const fetchUsers = async (queryTerm: string) => {
    if (!queryTerm) {
      setUserOptions([]);
      return;
    }
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
        setUserOptions(res.data.data.users);
      } else {
        setUserOptions([]);
      }
    } catch (err) {
      setUserOptions([]);
    }
  };

  useEffect(() => {
    fetchUsers(searchAssigned);
  }, [searchAssigned]);

  useEffect(() => {
    fetchUsers(searchReported);
  }, [searchReported]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    let createdAtISO = createdAt ? new Date(createdAt).toISOString() : undefined;
    let resolvedAtISO = resolvedAt ? new Date(resolvedAt).toISOString() : undefined;
    const payload = {
      description,
      lineId: line,
      type,
      priority,
      status,
      assignedTo: assignedTo ? assignedTo._id : null,
      reportedBy: reportedBy ? reportedBy._id : null,
      createdAt: createdAtISO,
      resolvedAt: resolvedAtISO,
    };
    onSave(payload);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <CustomPaper sx={{ p: 2 }}>
        <DialogTitle sx={{ fontWeight: 600, fontSize: 22 }}>Nuova Issue</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSave}>
            <Stack spacing={2}>
              <TextField
                label="Descrizione"
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
                fullWidth
              />
              <FormControl fullWidth required>
                <InputLabel>Linea</InputLabel>
                <Select
                  value={line}
                  label="Linea"
                  onChange={e => setLine(e.target.value)}
                >
                  {lineOptions.map(opt => (
                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth required>
                <InputLabel>Tipo</InputLabel>
                <Select
                  value={type}
                  label="Tipo"
                  onChange={e => setType(e.target.value)}
                >
                  {typeOptions.map(opt => (
                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth required>
                <InputLabel>Priorità</InputLabel>
                <Select
                  value={priority}
                  label="Priorità"
                  onChange={e => setPriority(e.target.value)}
                >
                  {priorityOptions.map(opt => (
                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth required>
                <InputLabel>Stato</InputLabel>
                <Select
                  value={status}
                  label="Stato"
                  onChange={e => setStatus(e.target.value)}
                >
                  {statusOptions.map(opt => (
                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              {currentUser.role === 'operator' ? (
                <TextField
                  label="Segnalata da"
                  value={currentUser.fullName + ' (' + currentUser.username + ')'}
                  disabled
                  fullWidth
                  required
                />
              ) : (
                <Autocomplete
                  options={userOptions}
                  getOptionLabel={(option) => option && typeof option === 'object' ? `${option.fullName} (${option.username})` : ''}
                  value={reportedBy}
                  onInputChange={(_, newInputValue) => setSearchReported(newInputValue)}
                  onChange={(_, value) => setReportedBy(value as User || null)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Segnalata da"
                      required
                      fullWidth
                    />
                  )}
                  isOptionEqualToValue={(option, value) => option?._id === value?._id}
                />
              )}
              <Autocomplete
                options={userOptions}
                getOptionLabel={(option) => option && typeof option === 'object' ? `${option.fullName} (${option.username})` : ''}
                value={assignedTo}
                onInputChange={(_, newInputValue) => setSearchAssigned(newInputValue)}
                onChange={(_, value) => setAssignedTo(value as User || null)}
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
                label="Creata il"
                type="datetime-local"
                value={createdAt}
                onChange={e => setCreatedAt(e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
                required
              />
              <TextField
                label="Risolta il"
                type="datetime-local"
                value={resolvedAt}
                onChange={e => setResolvedAt(e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Stack>
            <DialogActions sx={{ justifyContent: 'flex-end', gap: 2 }}>
              <Button onClick={onClose} color="inherit">Annulla</Button>
              <Button type="submit" variant="contained" color="primary">Salva</Button>
            </DialogActions>
          </form>
        </DialogContent>
      </CustomPaper>
    </Dialog>
  );
}; 