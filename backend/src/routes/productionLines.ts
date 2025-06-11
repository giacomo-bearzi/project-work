import express from 'express';
import { authenticateToken } from '../middleware/auth';
import {
    getAllProductionLines,
    getProductionLineById,
} from '../controllers/productionLineController';

const router = express.Router();

router.get('/', authenticateToken, getAllProductionLines);
router.get('/:id', authenticateToken, getProductionLineById);

export default router; 