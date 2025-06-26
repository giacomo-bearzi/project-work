import express from 'express';
import { getAllTemperatureLogs } from '../controllers/temperatureLogController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.get('/', authenticateToken, getAllTemperatureLogs);

export default router; 