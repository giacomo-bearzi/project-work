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

// Get user by ID (admin o stesso utente)
router.get('/:id', authenticateToken, async (req: any, res) => {
    try {
        const { id } = req.params;

        // Solo admin o stesso utente possono vedere i dettagli
        if (req.user.role !== 'admin' && req.user.userId !== id) {
            return res.status(403).json({ message: 'Accesso non autorizzato' });
        }

        const user = await User.findById(id, '-password');
        if (!user) {
            return res.status(404).json({ message: 'Utente non trovato' });
        }

        res.json(user);
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        res.status(500).json({ message: 'Errore durante il recupero dell\'utente' });
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

// Create new user (solo admin)
router.post('/', authenticateToken, async (req: any, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Accesso non autorizzato' });
        }

        const { username, fullName, password, role = 'operator' } = req.body;

        // Validazione input
        if (!username || !fullName || !password) {
            return res.status(400).json({
                message: 'Username, fullName e password sono obbligatori'
            });
        }

        // Verifica se username esiste già
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.status(409).json({
                message: 'Username già esistente'
            });
        }

        // Crea nuovo utente (il password viene hashato dal pre-save hook)
        const newUser = new User({
            username,
            fullName,
            password,
            role
        });

        const savedUser = await newUser.save();

        // Rimuovi password dalla risposta
        const userResponse: any = savedUser.toObject();
        delete userResponse.password;

        res.status(201).json({
            message: 'Utente creato con successo',
            user: userResponse
        });

    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Errore durante la creazione dell\'utente' });
    }
});

// Update user (solo admin)
router.put('/:id', authenticateToken, async (req: any, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Accesso non autorizzato' });
        }

        const { id } = req.params;
        const { username, fullName, role, password } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'Utente non trovato' });
        }

        // Verifica duplicati username (escluso utente corrente)
        if (username) {
            const existingUser = await User.findOne({
                _id: { $ne: id },
                username
            });

            if (existingUser) {
                return res.status(409).json({
                    message: 'Username già in uso da un altro utente'
                });
            }
        }

        // Prepara i dati per l'aggiornamento
        const updateData: any = {};
        if (username) updateData.username = username;
        if (fullName) updateData.fullName = fullName;
        if (role) updateData.role = role;

        // Se viene fornita una nuova password, viene hashata dal pre-save hook
        if (password) {
            updateData.password = password;
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            updateData,
            { new: true, select: '-password' }
        );

        res.json({
            message: 'Utente aggiornato con successo',
            user: updatedUser
        });

    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Errore durante l\'aggiornamento dell\'utente' });
    }
});

// Delete user (solo admin)
router.delete('/:id', authenticateToken, async (req: any, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Accesso non autorizzato' });
        }

        const { id } = req.params;

        // Impedisci auto-cancellazione
        if (req.user.userId === id) {
            return res.status(400).json({
                message: 'Non puoi cancellare il tuo stesso account'
            });
        }

        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'Utente non trovato' });
        }

        res.json({
            message: 'Utente eliminato con successo',
            deletedUser: {
                id: deletedUser._id,
                username: deletedUser.username,
                fullName: deletedUser.fullName
            }
        });

    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Errore durante l\'eliminazione dell\'utente' });
    }
});

export default router;