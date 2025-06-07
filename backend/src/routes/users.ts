// routes/userRoutes.ts
import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { createUser, deleteUser, getAllUsers, getUserById, getUserProfile, updateUser } from '../controllers/userController';


const router = express.Router();

router.get('/', authenticateToken, getAllUsers);
router.get('/profile', authenticateToken, getUserProfile);
router.get('/:id', authenticateToken, getUserById);
router.post('/', authenticateToken, createUser);
router.put('/:id', authenticateToken, updateUser);
router.delete('/:id', authenticateToken, deleteUser);

export default router;
