import express from 'express';
import { authenticateToken } from '../middleware/auth';
import {
    getAllProductionLines,
    getProductionLineById,
    getProductionLineByLineId
} from '../controllers/productionLineController';

const router = express.Router();

router.get('/', authenticateToken, getAllProductionLines);
router.get('/:id', authenticateToken, getProductionLineById);
router.get('/by-line-id/:lineId', authenticateToken, getProductionLineByLineId);

export default router; 