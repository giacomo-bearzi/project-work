import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Button,
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useThemeMode } from '../features/theme/context/ThemeContext';

interface NavbarProps {
  title: string;
  userFullName: string;
  onLogout: () => void;
}

const Navbar = ({ title, userFullName, onLogout }: NavbarProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { mode, toggleTheme } = useThemeMode();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          sx={{ flexGrow: 1 }}
        >
          {title}
        </Typography>
        <Typography sx={{ mr: 1 }}>{userFullName}</Typography>
        <Button
          color="inherit"
          onClick={toggleTheme}
          className="mr-2"
        >
          {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
        </Button>
        <IconButton
          size="large"
          color="inherit"
          onClick={handleMenu}
        >
          <AccountCircle />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem
            onClick={() => {
              handleClose();
              onLogout();
            }}
          >
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
