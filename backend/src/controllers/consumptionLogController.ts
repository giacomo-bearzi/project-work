import { Request, Response } from 'express';
import ConsumptionLog from '../models/ConsumptionLog';

export const getAllConsumptionLogs = async (req: Request, res: Response) => {
    try {
        const logs = await ConsumptionLog.find().populate('machineId');
        res.json(logs);
    } catch (error) {
        console.error('Error fetching consumption logs:', error);
        res.status(500).json({ message: 'Server Error' });
    }
}; 