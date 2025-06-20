import {
  Popover,
  Typography,
  Box,
  Button,
  Divider,
} from '@mui/material';

interface Notification {
  id: string;
  message: string;
  read: boolean;
}

interface NotificationsPopoverProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  notifications: Notification[];
  onMarkAllAsRead: () => void;
}

export const NotificationsPopover = ({
  anchorEl,
  onClose,
  notifications,
  onMarkAllAsRead,
}: NotificationsPopoverProps) => {
  const open = Boolean(anchorEl);
  const unread = notifications.filter(n => !n.read);
  const read = notifications.filter(n => n.read);

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'center', horizontal: 'left' }}
      transformOrigin={{ vertical: 'center', horizontal: 'right' }}
      PaperProps={{ sx: { p: 2, width: 300, maxHeight: 400, overflowY: 'auto' } }}
    >
      <Typography variant="subtitle1" fontWeight={600}>
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
    </Popover>
  );
};