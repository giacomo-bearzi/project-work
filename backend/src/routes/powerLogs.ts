import express from 'express';
import { getAllPowerLogs } from '../controllers/powerLogController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.get('/', authenticateToken, getAllPowerLogs);

export default router; 