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
} from '@mui/material';
import { Header } from '../components/Header.tsx';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment'; // To format dates
import api from '../../../utils/axios.ts';
import { useAuth } from '../../log-in/context/AuthContext.tsx';

import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';

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

// Funzione di mapping da "Linea 1" a "LINE-1"
const mapLineFilterToDb = (filterValue: string) => {
  // Esempio: "Linea 1" -> "LINE-1"
  const match = filterValue.match(/Linea (\d+)/i);
  if (match) {
    return `LINE-${match[1]}`;
  }
  return filterValue;
};

export const Issues = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const theme = useTheme(); // Get the current theme
  const [themeMode, setThemeMode] = useState('/background-light.svg');
  const { user, logout } = useAuth();
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedPriority, setSelectedPriority] = useState<string[]>([]);
  const [selectedLine, setSelectedLine] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string[]>([]);
  const [searchId, setSearchId] = useState('');

  const statusOptions = ['Aperta', 'Risolta', 'Chiusa'];
  const priorityOptions = ['Bassa', 'Media', 'Alta'];
  const lineOptions = ['Linea 1', 'Linea 2', 'Linea 3'];
  const typeOptions = ['Meccanico', 'Eletttrico', 'Qualità', 'Sicurezza'];

  useEffect(() => {
    // Set background image based on theme mode
    if (theme.palette.mode === 'light') {
      setThemeMode('/background-light.svg');
    } else {
      setThemeMode('/background-dark.svg');
    }

    const fetchIssues = async () => {
      try {
        const response = await api.get<Issue[]>('/issues');
        setIssues(response.data);
      } catch (err) {
        console.error('Error fetching issues:', err);
        setError('Failed to load issues');
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();

    // Optional: Set up polling for real-time updates (e.g., every 30 seconds)
    // const pollingInterval = setInterval(fetchIssues, 30000); // Poll every 30 seconds
    // return () => clearInterval(pollingInterval); // Cleanup interval on component unmount
  }, [theme.palette.mode]); // Rerun effect if theme mode changes

  if (!user || loading) {
    // You might want a dedicated loading page or spinner component
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress size={80} />
      </Box>
    );
  }

  const filteredIssues = issues.filter((issue) => {
    // Normalizza l'input e l'id (rimuove # e spazi, case-insensitive)
    const normalizedSearch = searchId.trim().replace(/^#/, '').toLowerCase();
    const normalizedId = issue._id.replace(/^#/, '').toLowerCase();

    if (normalizedSearch && !normalizedId.includes(normalizedSearch)) {
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
    return true;
  });

  return (
    <Box
      p={1}
      height={'100dvh'}
    >
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
        <Stack
          direction="column"
          gap={1}
          sx={{ height: '100%' }}
        >
          <Header />
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
            sx={{ mb: 2, mt: 2, p: 2 }}
          >
            {/* Titolo a sinistra */}
            <Box
              fontWeight="bold"
              fontSize={18}
              letterSpacing={1}
            >
              ISSUES
            </Box>
            {/* Filtri e bottone a destra */}
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
            >
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
                  'minWidth': 160,
                  '& .MuiInputBase-input::placeholder': {
                    color: theme.palette.mode === 'dark' ? '#B0B3B8' : '#888',
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
                    typeof e.target.value === 'string'
                      ? e.target.value.split(',')
                      : e.target.value,
                  )
                }
                renderValue={() => 'Stato'}
                size="small"
                sx={{ minWidth: 120 }}
              >
                {statusOptions.map((option) => (
                  <MenuItem
                    key={option}
                    value={option}
                  >
                    <Checkbox checked={selectedStatus.indexOf(option) > -1} />
                    <ListItemText primary={option} />
                  </MenuItem>
                ))}
              </Select>
              <Select
                multiple
                displayEmpty
                value={selectedPriority}
                onChange={(e) =>
                  setSelectedPriority(
                    typeof e.target.value === 'string'
                      ? e.target.value.split(',')
                      : e.target.value,
                  )
                }
                renderValue={() => 'Priorità'}
                size="small"
                sx={{ minWidth: 120 }}
              >
                {priorityOptions.map((option) => (
                  <MenuItem
                    key={option}
                    value={option}
                  >
                    <Checkbox checked={selectedPriority.indexOf(option) > -1} />
                    <ListItemText primary={option} />
                  </MenuItem>
                ))}
              </Select>
              <Select
                multiple
                displayEmpty
                value={selectedLine}
                onChange={(e) =>
                  setSelectedLine(
                    typeof e.target.value === 'string'
                      ? e.target.value.split(',')
                      : e.target.value,
                  )
                }
                renderValue={() => 'Linea'}
                size="small"
                sx={{ minWidth: 120 }}
              >
                {lineOptions.map((option) => (
                  <MenuItem
                    key={option}
                    value={option}
                  >
                    <Checkbox checked={selectedLine.indexOf(option) > -1} />
                    <ListItemText primary={option} />
                  </MenuItem>
                ))}
              </Select>
              <Select
                multiple
                displayEmpty
                value={selectedType}
                onChange={(e) =>
                  setSelectedType(
                    typeof e.target.value === 'string'
                      ? e.target.value.split(',')
                      : e.target.value,
                  )
                }
                renderValue={() => 'Tipo'}
                size="small"
                sx={{ minWidth: 120 }}
              >
                {typeOptions.map((option) => (
                  <MenuItem
                    key={option}
                    value={option}
                  >
                    <Checkbox checked={selectedType.indexOf(option) > -1} />
                    <ListItemText primary={option} />
                  </MenuItem>
                ))}
              </Select>
              <TextField
                type="date"
                size="small"
                variant="outlined"
                sx={{ minWidth: 140 }}
                InputLabelProps={{ shrink: true }}
              />
              <Button
                variant="contained"
                startIcon={<AddIcon />}
              >
                Segnala
              </Button>
            </Stack>
          </Stack>
          {/* Tabella delle issues */}
          <TableContainer
            component={Paper}
            sx={{ mt: 2, boxShadow: 'none', background: 'transparent' }}
          >
            <Table
              sx={{
                '& td, & th': {
                  verticalAlign: 'middle',
                },
              }}
            >
              <TableHead>
                <TableRow
                  sx={{
                    'background':
                      theme.palette.mode === 'dark' ? '#23272F' : '#F6F6F6',
                    '& th': {
                      borderBottom: 'none',
                      color:
                        theme.palette.mode === 'dark' ? '#B0B3B8' : '#7D7D7D',
                    },
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
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredIssues.map((issue, idx) => (
                  <TableRow key={issue._id}>
                    {/* <TableCell>{`#${String(idx + 1).padStart(3, '0')}`}</TableCell> */}
                    <TableCell>{issue.description}</TableCell>
                    <TableCell>{issue.lineId}</TableCell>
                    <TableCell>{issue.type}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <span
                          style={{
                            color:
                              issue.priority === 'alta'
                                ? '#FF3B3B'
                                : issue.priority === 'media'
                                ? '#FFB800'
                                : '#00B67A',
                            fontWeight: 600,
                            marginRight: 6,
                            fontSize: 30,
                            lineHeight: 1,
                            display: 'inline-block',
                          }}
                        >
                          •
                        </span>
                        <span style={{ fontSize: 16 }}>{issue.priority}</span>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {issue.status === 'aperta' ? (
                        <Chip
                          label="Aperta"
                          sx={{
                            background: '#E6FAF0',
                            color: '#00B67A',
                            fontWeight: 600,
                            borderColor: '#00B67A',
                            borderWidth: 1,
                            borderStyle: 'solid',
                          }}
                        />
                      ) : (
                        <Chip
                          label="Risolta"
                          sx={{
                            background: '#E6F0FA',
                            color: '#3B82F6',
                            fontWeight: 600,
                            borderColor: '#3B82F6',
                            borderWidth: 1,
                            borderStyle: 'solid',
                          }}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      {issue.reportedBy?.fullName ? (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar
                            sx={{
                              width: 24,
                              height: 24,
                              fontSize: 14,
                              mr: 1,
                              backgroundColor:
                                theme.palette.mode === 'dark'
                                  ? '#fff'
                                  : 'black',
                              color:
                                theme.palette.mode === 'dark'
                                  ? 'black'
                                  : '#fff',
                            }}
                          >
                            {issue.reportedBy.fullName[0]}
                          </Avatar>
                          {issue.reportedBy.fullName}
                        </Box>
                      ) : null}
                    </TableCell>
                    <TableCell>
                      {issue.assignedTo?.fullName ? (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar
                            sx={{
                              width: 24,
                              height: 24,
                              fontSize: 14,
                              mr: 1,
                              backgroundColor:
                                theme.palette.mode === 'dark'
                                  ? '#fff'
                                  : 'black',
                              color:
                                theme.palette.mode === 'dark'
                                  ? 'black'
                                  : '#fff',
                            }}
                          >
                            {issue.assignedTo.fullName[0]}
                          </Avatar>
                          {issue.assignedTo.fullName}
                        </Box>
                      ) : null}
                    </TableCell>
                    <TableCell>
                      {moment(issue.createdAt).format('YYYY-MM-DD HH:mm')}
                    </TableCell>
                    <TableCell>
                      {issue.resolvedAt
                        ? moment(issue.resolvedAt).format('YYYY-MM-DD HH:mm')
                        : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      </Paper>
    </Box>
  );
};
