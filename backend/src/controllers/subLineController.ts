import { Request, Response } from 'express';
import SubLine from '../models/SubLine';

export const getAllSubLines = async (req: Request, res: Response) => {
    try {
        const subLines = await SubLine.find().populate('machine');
        res.json(subLines);
    } catch (error) {
        console.error('Error fetching sublines:', error);
        res.status(500).json({ message: 'Server Error' });
    }
}; 