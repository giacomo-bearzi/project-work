import { useState } from 'react';
import { useGetAssignedIssues } from '../../../issues/hooks/useIssuesQueries';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import { NotificationsRounded } from '@mui/icons-material';
import { NotificationsSidebar } from '../NotificationsSidebar';
import { hideReadAssignedIssues, markAssignedIssuesAsRead } from '../../../issues/api/issuesApi';

export const Notifications = () => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const { data: assignedIssues, refetch } = useGetAssignedIssues();

  const notifications = (assignedIssues ?? []).map((issue: any) => ({
    id: issue._id,
    message: issue.description,
    read: issue.readBy?.includes(issue.assignedTo?._id),
  }));

  const handleOpenNotifications = () => setNotificationsOpen(true);
  const handleCloseNotifications = () => setNotificationsOpen(false);

  const handleMarkAllAsRead = async () => {
    await markAssignedIssuesAsRead();
    refetch();
  };

  const handleClearRead = async () => {
    await hideReadAssignedIssues();
    refetch();
  };

  return (
    <>
      <IconButton onClick={handleOpenNotifications}>
        <Badge badgeContent={notifications.filter((n) => !n.read).length} color="secondary">
          <NotificationsRounded />
        </Badge>
      </IconButton>
      <NotificationsSidebar
        open={notificationsOpen}
        onClose={handleCloseNotifications}
        notifications={notifications}
        onMarkAllAsRead={handleMarkAllAsRead}
        onClearRead={handleClearRead}
      />
    </>
  );
};
