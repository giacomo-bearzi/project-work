// controllers/userController.ts
import { Request, Response } from 'express';
import User from '../models/User';

// Get all users (admin only)
export const getAllUsers = async (req: any, res: Response) => {
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
};

// Get user by ID (admin or self)
export const getUserById = async (req: any, res: Response) => {
    try {
        const { id } = req.params;

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
};

// Get current user profile
export const getUserProfile = async (req: any, res: Response) => {
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
};

// Create new user (admin only)
export const createUser = async (req: any, res: Response) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Accesso non autorizzato' });
        }

        const { username, fullName, password, role = 'operator' } = req.body;

        if (!username || !fullName || !password) {
            return res.status(400).json({
                message: 'Username, fullName e password sono obbligatori'
            });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ message: 'Username già esistente' });
        }

        const newUser = new User({ username, fullName, password, role });
        const savedUser = await newUser.save();

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
};

// Update user (admin only)
export const updateUser = async (req: any, res: Response) => {
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

        if (username) {
            const existingUser = await User.findOne({
                _id: { $ne: id },
                username
            });
            if (existingUser) {
                return res.status(409).json({ message: 'Username già in uso da un altro utente' });
            }
        }

        const updateData: any = {};
        if (username) updateData.username = username;
        if (fullName) updateData.fullName = fullName;
        if (role) updateData.role = role;
        if (password) updateData.password = password;

        const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true, select: '-password' });

        res.json({
            message: 'Utente aggiornato con successo',
            user: updatedUser
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Errore durante l\'aggiornamento dell\'utente' });
    }
};

// Delete user (admin only)
export const deleteUser = async (req: any, res: Response) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Accesso non autorizzato' });
        }

        const { id } = req.params;

        if (req.user.userId === id) {
            return res.status(400).json({ message: 'Non puoi cancellare il tuo stesso account' });
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
};
