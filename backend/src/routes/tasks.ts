import express from 'express';
import { authenticateToken } from '../middleware/auth';
import {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
} from '../controllers/taskController';

const router = express.Router();

router.get('/', authenticateToken, getAllTasks);
router.get('/:id', authenticateToken, getTaskById);
router.post('/', authenticateToken, createTask);
router.put('/:id', authenticateToken, updateTask);
router.delete('/:id', authenticateToken, deleteTask);

export default router; 