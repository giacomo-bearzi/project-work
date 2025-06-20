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
}

export const IssueModal: React.FC<IssueModalProps> = ({ open, onClose, onSave, lineOptions, typeOptions, priorityOptions, statusOptions, currentUser }) => {
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
      setDescription('');
      setLine('');
      setType('');
      setPriority('');
      setStatus('');
      setAssignedTo(null);
      setReportedBy(null);
      const today = new Date().toISOString().slice(0, 10);
      setCreatedAt(today);
      setResolvedAt('');
      setUserOptions([]);
      setSearchAssigned('');
      setSearchReported('');
    }
  }, [open]);

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

  const handleSave = () => {
    onSave({
      description,
      lineId: line,
      type,
      priority,
      status,
      assignedTo: assignedTo ? { _id: assignedTo._id, fullName: assignedTo.fullName } : null,
      reportedBy: reportedBy ? { _id: reportedBy._id, fullName: reportedBy.fullName } : null,
      createdAt,
      resolvedAt: resolvedAt ? resolvedAt : null,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <CustomPaper sx={{ p: 2 }}>
        <DialogTitle sx={{ fontWeight: 600, fontSize: 22 }}>Nuova Issue</DialogTitle>
        <DialogContent>
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
              type="date"
              value={createdAt}
              onChange={e => setCreatedAt(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />
            <TextField
              label="Risolta il"
              type="date"
              value={resolvedAt}
              onChange={e => setResolvedAt(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'flex-end', gap: 2 }}>
          <Button onClick={onClose} color="inherit">Annulla</Button>
          <Button onClick={handleSave} variant="contained" color="primary">Salva</Button>
        </DialogActions>
      </CustomPaper>
    </Dialog>
  );
}; 