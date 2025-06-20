import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useAuth } from '../features/log-in/context/AuthContext';

// ✅ Tipo per una issue
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

const NotificationPoller: React.FC = () => {
  const { token } = useAuth();
  const [open, setOpen] = useState<boolean>(false);
  const [latestIssue, setLatestIssue] = useState<Issue | null>(null);
  const previousIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const fetchAssignedIssues = async () => {
      try {
        const res = await axios.get<Issue[]>(
          'http://localhost:5000/api/issues/assigned',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const issues = res.data;

        const currentIds = new Set(issues.map((issue) => issue._id));
        const newOnes = issues.filter(
          (issue) => !previousIdsRef.current.has(issue._id),
        );

        if (previousIdsRef.current.size && newOnes.length > 0) {
          setLatestIssue(newOnes[0]);
          setOpen(true);
        }

        previousIdsRef.current = currentIds;
      } catch (err) {
        console.error('Errore durante il polling delle assigned issues:', err);
      }
    };

    fetchAssignedIssues();
    const intervalId = setInterval(fetchAssignedIssues, 30000);

    return () => clearInterval(intervalId);
  }, [token]);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      onClose={handleClose}
    >
      {latestIssue ? (
        <Alert
          onClose={handleClose}
          severity="info"
          sx={{ width: '100%' }}
        >
          <div className="font-semibold">
            Nuova task assegnata: {latestIssue.description}
          </div>
          <div className="text-sm">
            Apri le notifiche per visualizzarla.
          </div>
        </Alert>
      ) : undefined}
    </Snackbar>
  );
};

export default NotificationPoller;
