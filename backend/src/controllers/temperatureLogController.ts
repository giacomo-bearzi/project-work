import { Request, Response } from 'express';
import TemperatureLog from '../models/TemperatureLog';

export const getAllTemperatureLogs = async (req: Request, res: Response) => {
    try {
        const logs = await TemperatureLog.find().populate('machineId');
        res.json(logs);
    } catch (error) {
        console.error('Error fetching temperature logs:', error);
        res.status(500).json({ message: 'Server Error' });
    }
}; 