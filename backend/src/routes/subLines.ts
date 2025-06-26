import express from 'express';
import { getAllSubLines } from '../controllers/subLineController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.get('/', authenticateToken, getAllSubLines);

export default router; 