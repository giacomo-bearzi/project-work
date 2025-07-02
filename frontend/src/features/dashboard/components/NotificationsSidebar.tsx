import {
  Drawer,
  Typography,
  Box,
  Button,
  Divider,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

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
  onClearRead?: () => void;
}

export const NotificationsSidebar = ({
  open,
  onClose,
  notifications,
  onMarkAllAsRead,
  onClearRead,
}: NotificationsSidebarProps) => {
  const unread = notifications.filter((n) => !n.read);
  const read = notifications.filter((n) => n.read);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: 400, maxWidth: '100vw', p: 3, m: 1 } }}
    >
      <IconButton
        onClick={onClose}
        sx={{ position: 'absolute', top: 8, right: 8 }}
        aria-label="close"
      >
        <CloseIcon />
      </IconButton>
      <Typography
        variant="h6"
        fontWeight={600}
        sx={{ mb: 2 }}
      >
        Notifiche
      </Typography>

      {unread.length > 0 && (
        <Box mt={2}>
          {unread.map((n) => (
            <Typography
              key={n.id}
              fontWeight={500}
              mb={1}
            >
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
          <Typography
            variant="subtitle2"
            fontWeight={500}
            sx={{ mb: 1 }}
          >
            Già lette
          </Typography>
          {read.map((n) => (
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

      {read.length > 0 && onClearRead && (
        <Box
          position="fixed"
          bottom={32}
          right={32}
          zIndex={1301}
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            width: 400,
            maxWidth: '100vw',
          }}
        >
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteOutlineIcon />}
            onClick={onClearRead}
          >
            Svuota lette
          </Button>
        </Box>
      )}
    </Drawer>
  );
};
