import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User';

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log('Login attempt for username:', username);
        console.log('Request body:', req.body);

        // Trova l'utente
        const user = await User.findOne({ username });
        console.log('Found user:', user ? {
            _id: user._id,
            username: user.username,
            role: user.role,
            hasPassword: !!user.password
        } : 'No user found');

        if (!user) {
            console.log('User not found:', username);
            return res.status(401).json({ message: 'Credenziali non valide' });
        }

        // Verifica la password
        const isValidPassword = await bcrypt.compare(password, user.password);
        console.log('Password validation result:', isValidPassword);

        if (!isValidPassword) {
            console.log('Invalid password for user:', username);
            return res.status(401).json({ message: 'Credenziali non valide' });
        }

        // Genera il token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        console.log('Login successful for user:', username);

        // Invia la risposta
        res.json({
            token,
            user: {
                _id: user._id,
                username: user.username,
                role: user.role,
                fullName: user.fullName
            }
        });
    } catch (error) {
        console.error('Login error details:', error);
        res.status(500).json({
            message: 'Errore durante il login',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

export default router; 