import { Box, Paper, Stack } from '@mui/material';
import { Header } from '../components/Header.tsx';

export const GestioneUtenti = () => (
    <Box
        p={1}
        height={'100dvh'}
    >
        <Paper
            elevation={1}
            sx={{
                borderRadius: 11,
                p: 1,
                background: 'rgba(255, 255, 255, 0.07)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                height: '100%',
            }}
        >
            <Stack
                direction="column"
                gap={1}
                sx={{ height: '100%' }}
            >
                <Header />

            </Stack>
        </Paper>
    </Box>); 