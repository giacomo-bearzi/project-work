import { useEffect, useState } from 'react';
import { Box, Paper, Stack, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Header } from '../components/Header.tsx';
import api from '../../../utils/axios';

interface Issue {
    _id: string;
    lineId: string;
    type: string;
    priority: string;
    status: string;
    description: string;
    reportedBy: { username: string; fullName: string; role: string } | string;
    assignedTo?: { username: string; fullName: string; role: string } | string;
    createdAt: string;
    updatedAt: string;
    resolvedAt?: string;
}

export const Issues = () => {
    const [issues, setIssues] = useState<Issue[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchIssues = async () => {
            try {
                const res = await api.get('/issues');
                setIssues(res.data);
            } catch (err) {
                console.error('Errore nel recupero delle issues:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchIssues();
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
                    <Typography variant="h5" sx={{ mb: 2 }}>Segnalazioni (Issues)</Typography>
                    {loading ? (
                        <Typography>Caricamento...</Typography>
                    ) : (
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Linea</TableCell>
                                        <TableCell>Tipo</TableCell>
                                        <TableCell>Priorità</TableCell>
                                        <TableCell>Stato</TableCell>
                                        <TableCell>Descrizione</TableCell>
                                        <TableCell>Segnalata Da</TableCell>
                                        <TableCell>Assegnata A</TableCell>
                                        <TableCell>Creata Il</TableCell>
                                        <TableCell>Risolta Il</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {issues.map((issue) => (
                                        <TableRow key={issue._id}>
                                            <TableCell>{issue.lineId}</TableCell>
                                            <TableCell>{issue.type}</TableCell>
                                            <TableCell>{issue.priority}</TableCell>
                                            <TableCell>{issue.status}</TableCell>
                                            <TableCell>{issue.description}</TableCell>
                                            <TableCell>{typeof issue.reportedBy === 'object' ? issue.reportedBy.fullName : issue.reportedBy}</TableCell>
                                            <TableCell>{issue.assignedTo && typeof issue.assignedTo === 'object' ? issue.assignedTo.fullName : issue.assignedTo || '-'}</TableCell>
                                            <TableCell>{new Date(issue.createdAt).toLocaleString()}</TableCell>
                                            <TableCell>{issue.resolvedAt ? new Date(issue.resolvedAt).toLocaleString() : '-'}</TableCell>
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