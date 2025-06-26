import {
  Drawer,
  Typography,
  Box,
  Button,
  Divider,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface Notification {
  id: string;
  message: string;
  read: boolean;
}

interface NotificationsSidebarProps {
  open: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAllAsRead: () => void;
}

export const NotificationsSidebar = ({
  open,
  onClose,
  notifications,
  onMarkAllAsRead,
}: NotificationsSidebarProps) => {
  const unread = notifications.filter(n => !n.read);
  const read = notifications.filter(n => n.read);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: 400, maxWidth: '100vw', p: 3 } }}
    >
      <IconButton
        onClick={onClose}
        sx={{ position: 'absolute', top: 8, right: 8 }}
        aria-label="close"
      >
        <CloseIcon />
      </IconButton>
      <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
        Notifiche
      </Typography>

      {unread.length > 0 && (
        <Box mt={2}>
          {unread.map(n => (
            <Typography key={n.id} fontWeight={500} mb={1}>
              {n.message}
            </Typography>
          ))}
          <Button
            onClick={onMarkAllAsRead}
            size="small"
            sx={{ mt: 1 }}
          >
            Segna tutte come lette
          </Button>
        </Box>
      )}

      {read.length > 0 && unread.length > 0 && <Divider sx={{ my: 2 }} />}

      {read.length > 0 && (
        <Box>
          <Typography variant="subtitle2" fontWeight={500} sx={{ mb: 1 }}>
            Già lette
          </Typography>
          {read.map(n => (
            <Typography
              key={n.id}
              variant="body2"
              sx={{ color: 'text.secondary', mb: 1 }}
            >
              {n.message}
            </Typography>
          ))}
        </Box>
      )}

      {unread.length === 0 && read.length === 0 && (
        <Typography sx={{ mt: 2, opacity: 0.6 }}>Nessuna notifica</Typography>
      )}
    </Drawer>
  );
};