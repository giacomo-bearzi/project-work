import { useEffect, useState } from 'react';
import { Box, Paper, Stack, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Header } from '../components/Header.tsx';
import api from '../../../utils/axios';

interface ProductionLine {
    _id: string;
    lineId: string;
    name: string;
    status: string;
    lastUpdated: string;
}

export const Planning = () => {
    const [lines, setLines] = useState<ProductionLine[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLines = async () => {
            try {
                const res = await api.get('/production-lines');
                setLines(res.data);
            } catch (err) {
                console.error('Errore nel recupero delle linee di produzione:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchLines();
    }, []);

    return (
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
                    <Typography variant="h5" sx={{ mb: 2 }}>Linee di Produzione</Typography>
                    {loading ? (
                        <Typography>Caricamento...</Typography>
                    ) : (
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID Linea</TableCell>
                                        <TableCell>Nome</TableCell>
                                        <TableCell>Stato</TableCell>
                                        <TableCell>Ultimo Aggiornamento</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {lines.map((line) => (
                                        <TableRow key={line._id}>
                                            <TableCell>{line.lineId}</TableCell>
                                            <TableCell>{line.name}</TableCell>
                                            <TableCell>{line.status}</TableCell>
                                            <TableCell>{new Date(line.lastUpdated).toLocaleString()}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Stack>
            </Paper>
        </Box>
    );
};