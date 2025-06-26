import { Request, Response } from 'express';
import PowerLog from '../models/PowerLog';

export const getAllPowerLogs = async (req: Request, res: Response) => {
    try {
        const logs = await PowerLog.find().populate('machineId');
        res.json(logs);
    } catch (error) {
        console.error('Error fetching power logs:', error);
        res.status(500).json({ message: 'Server Error' });
    }
}; 