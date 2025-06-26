import {
  KeyboardArrowDownRounded,
  KeyboardArrowUpRounded,
  LogoutRounded,
  NotificationsRounded,
} from '@mui/icons-material';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useState, useRef, useEffect, type MouseEvent } from 'react';
import { useAuth } from '../../../log-in/context/AuthContext.tsx';
import { NotificationsSidebar } from '../NotificationsSidebar.tsx';
import { clearReadIssues, markAssignedIssuesAsRead } from '../../../issues/api/api.ts';
import { useGetAssignedIssues } from '../../../issues/hooks/useIssueQueries.tsx';
import { ToggleThemeModeButton } from '../../../theme/components/ToggleThemeModeButton.tsx';
import { Button, Dialog, DialogActions, DialogTitle, Avatar } from '@mui/material';

export const UserMenuDesktop = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [menuWidth, setMenuWidth] = useState<number | undefined>(undefined);

  const { logout, user } = useAuth();
  const buttonRef = useRef<HTMLDivElement>(null);

  const handleOpenNotifications = () => setNotificationsOpen(true);
  const handleCloseNotifications = () => setNotificationsOpen(false);

  const { data: assignedIssues, refetch } = useGetAssignedIssues();

  const notifications = (assignedIssues ?? []).map((issue: any) => ({
    id: issue._id,
    message: issue.description,
    read: issue.readBy?.includes(issue.assignedTo?._id),
  }));

  const handleMarkAllAsRead = async () => {
    await markAssignedIssuesAsRead();
    refetch();
  };

  const handleClearRead = async () => {
  await clearReadIssues();
  refetch();
};

  const open = Boolean(anchorEl);

  const icon = open ? <KeyboardArrowUpRounded /> : <KeyboardArrowDownRounded />;

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    if (buttonRef.current) {
      setMenuWidth(buttonRef.current.clientWidth);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogoutClick = () => {
    handleClose();
    setDialogOpen(true);
  };

  const confirmLogout = () => {
    setDialogOpen(false);
    logout();
  };

  useEffect(() => {
    if (!buttonRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setMenuWidth(entry.contentRect.width);
      }
    });
    observer.observe(buttonRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Box display="flex" alignItems="center" gap={2}>
        <IconButton onClick={handleOpenNotifications}>
          <Badge
            badgeContent={notifications.filter((n) => !n.read).length}
            color="secondary"
          >
            <NotificationsRounded />
          </Badge>
        </IconButton>

        <Paper
          ref={buttonRef}
          onClick={handleClick}
          sx={{
            cursor: 'pointer',
            background: 'rgba(255, 255, 255, 0.07)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
            borderRadius: open ? '32px 32px 0 0' : 8,
            userSelect: 'none',
            display: 'flex',
            alignItems: 'center',
            px: 2,
            py: 1,
            gap: 2,
            minWidth: 180,
          }}
        >
          <Avatar>{user?.fullName?.[0] ?? 'U'}</Avatar>
          <Box display="flex" flexDirection="column" flex={1}>
            <Typography variant="body2" fontWeight={600}>
              {user?.fullName ?? 'Utente'}
            </Typography>
            <Typography
              variant="body2"
              fontWeight={500}
              sx={{ opacity: 0.8 }}
            >
              {user?.role ?? ''}
            </Typography>
          </Box>
          {icon}
        </Paper>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            borderRadius: '0 0 8px 8px',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            width: menuWidth,
          },
        }}
        disableAutoFocusItem
      >
        <ToggleThemeModeButton asMenuItem />

        <MenuItem
          onClick={handleLogoutClick}
          sx={{ padding: '10px 20px' }}
        >
          <LogoutRounded fontSize="small" sx={{ mr: 1 }} />
          Logout
        </MenuItem>
      </Menu>

      <NotificationsSidebar
        open={notificationsOpen}
        onClose={handleCloseNotifications}
        notifications={notifications}
        onMarkAllAsRead={handleMarkAllAsRead}
        onClearRead={handleClearRead}
      />

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      >
        <DialogTitle>Sei sicuro di voler effettuare il logout?</DialogTitle>
        <DialogActions sx={{ justifyContent: 'center', gap: 2 }}>
          <Button
            onClick={() => setDialogOpen(false)}
            color="inherit"
            variant="outlined"
          >
            Annulla
          </Button>
          <Button
            onClick={confirmLogout}
            color="error"
            variant="contained"
          >
            Conferma
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

// @TODO: suddividere in altri componenti.
// @TODO: sistemare lo stile.
