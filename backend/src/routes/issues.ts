import express from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  getAllIssues,
  getIssueById,
  createIssue,
  updateIssue,
  getAssignedIssues,
  markAssignedIssuesAsRead,
  getIssueByLineId,
} from '../controllers/issueController';

const router = express.Router();

router.get('/', authenticateToken, getAllIssues);
router.get('/assigned', authenticateToken, getAssignedIssues);
router.patch(
  '/assigned/mark-as-read',
  authenticateToken,
  markAssignedIssuesAsRead,
);

router.get('/line/:lineId', authenticateToken, getIssueByLineId);

router.get('/:id', authenticateToken, getIssueById);
router.post('/', authenticateToken, createIssue);
router.put('/:id', authenticateToken, updateIssue);

// TODO: implement DELETE with role check

export default router;
