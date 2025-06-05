import express from 'express';
import User from '../models/User';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Get all users (solo admin)
router.get('/', authenticateToken, async (req: any, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Accesso non autorizzato' });
        }

        const users = await User.find({}, '-password');
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Errore durante il recupero degli utenti' });
    }
});

// Get user profile
router.get('/profile', authenticateToken, async (req: any, res) => {
    try {
        const user = await User.findById(req.user.userId, '-password');
        if (!user) {
            return res.status(404).json({ message: 'Utente non trovato' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Errore durante il recupero del profilo' });
    }
});

export default router; 