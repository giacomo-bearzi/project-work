import express from 'express';
import { authenticateToken } from '../middleware/auth';
import {
    getAllProductionLines,
    getProductionLineById,
    getProductionLineByLineId,
    getTotalStoppedTime,
    getProductionStats,
    getLineProductionStats,
    getOEEData,
    getCurrentShiftInfo,
    getLineHourlyProduction,
    getCombinedHourlyProduction
} from '../controllers/productionLineController';

const router = express.Router();

router.get('/', authenticateToken, getAllProductionLines);
router.get('/:id', authenticateToken, getProductionLineById);
router.get('/by-line-id/:lineId', authenticateToken, getProductionLineByLineId);
router.get('/stopped-time/total', authenticateToken, getTotalStoppedTime);
router.get('/shift/info', authenticateToken, getCurrentShiftInfo);
router.get('/production/stats', authenticateToken, getProductionStats);
router.get('/:lineId/production/stats', authenticateToken, getLineProductionStats);
router.get('/oee/data', authenticateToken, getOEEData);
router.get('/:lineId/production/hourly', authenticateToken, getLineHourlyProduction);
router.get('/production/hourly/combined', authenticateToken, getCombinedHourlyProduction);

export default router; 