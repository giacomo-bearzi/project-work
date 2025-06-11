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
  const [newIssues, setNewIssues] = useState<Issue[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [latestIssue, setLatestIssue] = useState<Issue | null>(null);
  const previousIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const res = await axios.get<Issue[]>(
          'http://localhost:5000/api/issues',
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

        if (newOnes.length > 0) {
          setNewIssues((prev) => [...prev, ...newOnes]);
          setLatestIssue(newOnes[0]);
          setOpen(true);
        }

        previousIdsRef.current = currentIds;
      } catch (err) {
        console.error('Errore durante il polling delle issues:', err);
      }
    };

    fetchIssues(); // prima esecuzione
    const intervalId = setInterval(fetchIssues, 30000); // ogni 30 secondi

    return () => clearInterval(intervalId); // cleanup
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      {/* Notifica MUI */}
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        {(latestIssue && (
          <Alert
            onClose={handleClose}
            severity="info"
            sx={{ width: '100%' }}
          >
            <div className="font-semibold">
              Nuova issue: {latestIssue.description}
            </div>
            <div className="text-sm">{latestIssue.description}</div>
          </Alert>
        )) || <></>}
      </Snackbar>

      {/* Lista delle nuove issues */}
      {/* {newIssues.length > 0 && (
        <div className="bg-yellow-100 p-4 mt-4 rounded shadow-md">
          <h2 className="text-lg font-semibold mb-2">Nuove Issues:</h2>
          <ul className="list-disc pl-5 space-y-1">
            {newIssues.map((issue) => (
              <li key={issue._id}>
                <span className="font-medium">{issue.description}</span>:{" "}
                {issue.description}
              </li>
            ))}
          </ul>
        </div>
      )} */}
    </div>
  );
};

export default NotificationPoller;
