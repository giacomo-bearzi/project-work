import {
    Avatar,
    Box,
    Typography,
    Paper,
    Menu,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogActions,
    Button,
    Badge,
    IconButton,
} from '@mui/material';
import { KeyboardArrowDownRounded, KeyboardArrowUpRounded, LogoutRounded, NotificationsRounded } from '@mui/icons-material';
import { useEffect, useRef, useState } from 'react';
import { ToggleThemeModeButton } from '../../theme/components/ToggleThemeModeButton';
import { markAssignedIssuesAsRead } from '../../issues/api/api';
import { NotificationsPopover } from './NotificationsPopover';
import { useGetAssignedIssues } from '../../issues/hooks/useIssueQueries';

interface UserDropdownProps {
    fullName: string;
    role: string;
    onLogout: () => void;
}

export const UserDropdown = ({ fullName, role, onLogout }: UserDropdownProps) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [menuWidth, setMenuWidth] = useState<number | undefined>(undefined);
    const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);

    const handleOpenNotifications = (event: React.MouseEvent<HTMLElement>) => {
        setNotificationAnchorEl(event.currentTarget);
    };
    const handleCloseNotifications = () => setNotificationAnchorEl(null);

    const { data: assignedIssues } = useGetAssignedIssues();

    const notifications = (assignedIssues ?? []).map((issue: any) => ({
        id: issue._id,
        message: issue.description,
        read: issue.readBy?.includes(issue.assignedTo?._id),
    }));

    const handleMarkAllAsRead = async () => {
        await markAssignedIssuesAsRead();
    };

    const buttonRef = useRef<HTMLDivElement>(null);

    const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
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
        onLogout();
    };

    useEffect(() => {
        if (!buttonRef.current) return;

        const observer = new ResizeObserver(entries => {
            for (let entry of entries) {
                setMenuWidth(entry.contentRect.width);
            }
        });

        observer.observe(buttonRef.current);

        return () => observer.disconnect();
    }, []);

    return (
        <>
            <Paper
                ref={buttonRef}
                onClick={handleOpen}
                sx={{
                    cursor: 'pointer',
                    background: 'rgba(255, 255, 255, 0.07)',
                    backdropFilter: 'blur(20px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                    borderRadius: anchorEl ? '32px 32px 0 0' : 8,
                    userSelect: 'none',
                }}
            >
                <Box p={1} gap={2} display="flex" alignItems="center" flexDirection="row">
                    <Avatar>{fullName[0]}</Avatar>
                    <Box display="flex" flexDirection="column">
                        <Typography variant="body2" fontWeight={600}>
                            {fullName}
                        </Typography>
                        <Typography variant="body2" fontWeight={500} sx={{ opacity: 0.8 }}>
                            {role}
                        </Typography>
                    </Box>
                    {anchorEl ? <KeyboardArrowUpRounded /> : <KeyboardArrowDownRounded />}
                </Box>
            </Paper>

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

                <MenuItem onClick={handleOpenNotifications}>
                    <IconButton sx={{ mr: 1, padding: '8px 0' }}>
                        <Badge
                            badgeContent={notifications.filter(n => !n.read).length}
                            color="primary"
                            overlap="circular"
                            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                            sx={{
                                '& .MuiBadge-badge': {
                                    fontSize: '0.65rem',
                                    minWidth: 16,
                                    height: 16,
                                    padding: '0 4px',
                                },
                            }}
                        >
                            <NotificationsRounded fontSize='small' />
                        </Badge>
                    </IconButton>
                    Notifiche
                </MenuItem>

                <MenuItem onClick={handleLogoutClick} sx={{ padding: '10px 20px' }}>
                    <LogoutRounded fontSize="small" sx={{ mr: 1 }} />
                    Logout
                </MenuItem>
            </Menu>

            <NotificationsPopover
                anchorEl={notificationAnchorEl}
                onClose={handleCloseNotifications}
                notifications={notifications}
                onMarkAllAsRead={handleMarkAllAsRead}
            />

            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle>Sei sicuro di voler effettuare il logout?</DialogTitle>
                <DialogActions sx={{ justifyContent: 'center', gap: 2 }}>
                    <Button onClick={() => setDialogOpen(false)} color="inherit" variant="outlined">
                        Annulla
                    </Button>
                    <Button onClick={confirmLogout} color="error" variant="contained">
                        Conferma
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
