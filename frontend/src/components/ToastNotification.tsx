import { useEffect, useRef, useState } from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useGetAssignedIssues } from '../features/issues/hooks/useIssuesQueries';

const ToastNotification = () => {
  const { data: assignedIssues } = useGetAssignedIssues();
  const [open, setOpen] = useState(false);
  const [latestIssue, setLatestIssue] = useState<any>(null);
  const prevIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!assignedIssues) return;
    const currentIds = new Set(assignedIssues.map((issue: any) => issue._id));
    const newOnes = assignedIssues.filter((issue: any) => !prevIds.current.has(issue._id));
    if (newOnes.length > 0) {
      setLatestIssue(newOnes[0]);
      setOpen(true);
    }
    prevIds.current = currentIds;
  }, [assignedIssues]);

  const handleClose = () => setOpen(false);

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      onClose={handleClose}
    >
      {latestIssue && (
        <Alert onClose={handleClose} severity="info" sx={{ width: '100%' }}>
          <div className="font-semibold">
            Nuova task assegnata: {latestIssue.description || 'Nessuna descrizione'}
          </div>
          <div className="text-sm">Apri le notifiche per visualizzarla.</div>
        </Alert>
      )}
    </Snackbar>
  );
};

export default ToastNotification;
