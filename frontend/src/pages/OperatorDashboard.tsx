import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  useTheme
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import api from '../utils/axios'; // Import the axios instance
import moment from 'moment'; // To format dates

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

const OperatorDashboard = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user, logout } = useAuth();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const theme = useTheme(); // Get the current theme
  const [themeMode, setThemeMode] = useState('/background-light.svg');

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

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    // navigate('/login'); // Navigation handled by ProtectedRoute or App's default route
  };

  // Show loading indicator or null if user/issues are loading
  if (!user || loading) {
    // You might want a dedicated loading page or spinner component
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size={80} />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box
      sx={{
        backgroundImage: `url(${themeMode})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        width: '100dvw',
        minHeight: '100dvh', // Use minHeight to cover the whole page
        padding: 0,
        margin: 0,
      }}
    >
      <Navbar
        title="Dashboard Operatore"
        userFullName={user.fullName}
        onLogout={handleLogout}
      />
      <Container
        component="main"
        maxWidth="lg" // Adjusted max width for content table
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            py: 4, // Add some padding top/bottom
          }}
        >
          <Paper
            elevation={3}
            sx={{
              padding: 3, // Adjusted padding
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              backgroundColor: theme.palette.background.paper, // Use paper background color
            }}
          >
            <Typography variant="h5" gutterBottom>
              Issues Segnalate
            </Typography>

            {issues.length > 0 ? (
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table sx={{ minWidth: 650 }} aria-label="issues table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Linea</TableCell>
                      <TableCell>Tipo</TableCell>
                      <TableCell>Priorità</TableCell>
                      <TableCell>Stato</TableCell>
                      <TableCell>Descrizione</TableCell>
                      <TableCell>Segnalata Da</TableCell>
                      <TableCell>Assegnata A</TableCell>
                      <TableCell>Creata Il</TableCell>
                      <TableCell>Risolta Il</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {issues.map((issue) => (
                      <TableRow key={issue._id}>
                        <TableCell component="th" scope="row">
                          {issue.lineId}
                        </TableCell>
                        <TableCell>{issue.type}</TableCell>
                        <TableCell>{issue.priority}</TableCell>
                        <TableCell>{issue.status}</TableCell>
                        <TableCell>{issue.description}</TableCell>
                        <TableCell>{issue.reportedBy?.fullName || issue.reportedBy?.username || 'N/A'}</TableCell>
                        <TableCell>{issue.assignedTo?.fullName || issue.assignedTo?.username || 'N/A'}</TableCell>
                        <TableCell>{moment(issue.createdAt).format('YYYY-MM-DD HH:mm')}</TableCell>
                        <TableCell>{issue.resolvedAt ? moment(issue.resolvedAt).format('YYYY-MM-DD HH:mm') : '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography variant="body1" sx={{ mt: 2 }}>
                Nessuna issue trovata.
              </Typography>
            )}

          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default OperatorDashboard;
