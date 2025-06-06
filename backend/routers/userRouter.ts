import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User';

const router = express.Router();

// Get all users
router.get('/', async (_req: Request, res: Response) => {
    try {
        const users = await User.find().select('-passwordHash');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
});

// Get user by ID
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.id).select('-passwordHash');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error });
    }
});

// Create new user
router.post('/', async (req: Request, res: Response) => {
    try {
        const { username, password, role, fullName } = req.body;

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const user = new User({
            username,
            passwordHash,
            role,
            fullName
        });

        const savedUser = await user.save();
        res.status(201).json({
            _id: savedUser._id,
            username: savedUser.username,
            role: savedUser.role,
            fullName: savedUser.fullName
        });
    } catch (error) {
        res.status(400).json({ message: 'Error creating user', error });
    }
});

// Update user
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const { username, password, role, fullName } = req.body;
        const updateData: any = { username, role, fullName };

        if (password) {
            const salt = await bcrypt.genSalt(10);
            updateData.passwordHash = await bcrypt.hash(password, salt);
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        ).select('-passwordHash');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(400).json({ message: 'Error updating user', error });
    }
});

// Delete user
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }
});

export default router; 