import { LogoutRounded, MenuOpenRounded } from '@mui/icons-material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import { red } from '@mui/material/colors';
import { CustomPaper } from '../../../components/CustomPaper.tsx';
import { useAuth } from '../../log-in/context/AuthContext.tsx';
import { Logo } from './Logo.tsx';
import { NavbarDesktop } from './Navbar/NavbarDesktop.tsx';
import { UserInfo } from './UserInfo.tsx';

interface CustomHeaderDrawerProps {
  toggleDrawer: boolean;
  setToggleDrawer: (value: boolean) => void;
}

export const CustomHeaderDrawer = ({
  toggleDrawer,
  setToggleDrawer,
}: CustomHeaderDrawerProps) => {
  const { logout } = useAuth();

  return (
    <Drawer
      open={toggleDrawer}
      onClose={() => setToggleDrawer(false)}
      slotProps={{
        paper: {
          sx: {
            m: 1,
            background: 'rgba(255, 255, 255, 0.0)',
            boxShadow: 'none',
          },
        },
      }}
    >
      <CustomPaper
        sx={{
          p: 1,
          borderRadius: 10,
          height: 'calc(100% - 1rem)',
          minWidth: '20rem',
        }}
      >
        <Stack
          direction={'column'}
          display={'flex'}
          height={'100%'}
          justifyContent={'space-between'}
        >
          <Stack gap={2}>
            <Box
              display={'flex'}
              alignItems={'center'}
              justifyContent={'space-between'}
            >
              <Logo />
              <IconButton
                onClick={() => setToggleDrawer(false)}
                sx={{ p: 1, m: 1 }}
              >
                <MenuOpenRounded />
              </IconButton>
            </Box>
            <UserInfo />
            <NavbarDesktop />
          </Stack>
          <Button
            onClick={() => logout()}
            variant="contained"
            size="large"
            sx={{
              backgroundColor: red[500],
              color: 'white',
              borderRadius: 9,
              m: 1,
            }}
            startIcon={<LogoutRounded />}
          >
            Esci
          </Button>
        </Stack>
      </CustomPaper>
    </Drawer>
  );
};
