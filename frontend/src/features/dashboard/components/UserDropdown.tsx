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
} from '@mui/material';
import { KeyboardArrowDownRounded, KeyboardArrowUpRounded, LogoutRounded } from '@mui/icons-material';
import { useEffect, useRef, useState } from 'react';

interface UserDropdownProps {
    fullName: string;
    role: string;
    onLogout: () => void;
}

export const UserDropdown = ({ fullName, role, onLogout }: UserDropdownProps) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [menuWidth, setMenuWidth] = useState<number | undefined>(undefined);

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
                <MenuItem onClick={handleLogoutClick}>
                    <LogoutRounded fontSize="small" sx={{ mr: 1 }} />
                    Logout
                </MenuItem>
            </Menu>

            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle>Sei sicuro di voler effettuare il logout?</DialogTitle>
                <DialogActions sx={{ justifyContent: 'center', gap: 2 }}>
                    <Button onClick={() => setDialogOpen(false)} color="primary" variant="outlined">
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
