import express from 'express';
import { getAllMachines } from '../controllers/machineController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.get('/', authenticateToken, getAllMachines);

export default router; 