import express from 'express';
import { authenticateToken } from '../middleware/auth';
import {
    getAllIssues,
    getIssueById,
    createIssue,
    updateIssue
} from '../controllers/issueController';

const router = express.Router();

router.get('/', authenticateToken, getAllIssues);
router.get('/:id', authenticateToken, getIssueById);
router.post('/', authenticateToken, createIssue);
router.put('/:id', authenticateToken, updateIssue);

// TODO: implement DELETE with role check

export default router;
