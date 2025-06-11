import { useEffect, useState } from 'react';
import { Box, Paper, Stack, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Header } from '../components/Header';
import api from '../../../utils/axios';

interface Task {
    _id: string;
    date: string;
    lineId: string;
    description: string;
    assignedTo: { username: string; fullName: string; role: string } | string;
    estimatedMinutes: number;
    status: string;
    checklist: { item: string; done: boolean }[];
}

export const Tasks = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const res = await api.get('/tasks');
                setTasks(res.data);
            } catch (err) {
                console.error('Errore nel recupero delle task:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchTasks();
    }, []);

    return (
        <Box p={1} height={'100dvh'}>
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
                <Stack direction="column" gap={1} sx={{ height: '100%' }}>
                    <Header />
                    <Typography variant="h5" sx={{ mb: 2 }}>Task</Typography>
                    {loading ? (
                        <Typography>Caricamento...</Typography>
                    ) : (
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Data</TableCell>
                                        <TableCell>Linea</TableCell>
                                        <TableCell>Descrizione</TableCell>
                                        <TableCell>Assegnata a</TableCell>
                                        <TableCell>Durata stimata (min)</TableCell>
                                        <TableCell>Stato</TableCell>
                                        <TableCell>Checklist</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {tasks.map((task) => (
                                        <TableRow key={task._id}>
                                            <TableCell>{task.date}</TableCell>
                                            <TableCell>{task.lineId}</TableCell>
                                            <TableCell>{task.description}</TableCell>
                                            <TableCell>{typeof task.assignedTo === 'object' ? task.assignedTo.fullName : task.assignedTo}</TableCell>
                                            <TableCell>{task.estimatedMinutes}</TableCell>
                                            <TableCell>{task.status}</TableCell>
                                            <TableCell>
                                                <ul style={{ margin: 0, paddingLeft: 16 }}>
                                                    {task.checklist.map((item, idx) => (
                                                        <li key={idx} style={{ textDecoration: item.done ? 'line-through' : 'none' }}>
                                                            {item.item}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </TableCell>
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