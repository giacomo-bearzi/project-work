import express from 'express';
import { getAllConsumptionLogs } from '../controllers/consumptionLogController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.get('/', authenticateToken, getAllConsumptionLogs);

export default router; 