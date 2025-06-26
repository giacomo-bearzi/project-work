import express from 'express';
import { getAllCO2EmissionLogs } from '../controllers/co2EmissionLogController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.get('/', authenticateToken, getAllCO2EmissionLogs);

export default router; 