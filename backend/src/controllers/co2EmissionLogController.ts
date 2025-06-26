import { Request, Response } from 'express';
import CO2EmissionLog from '../models/CO2EmissionLog';

export const getAllCO2EmissionLogs = async (req: Request, res: Response) => {
    try {
        const logs = await CO2EmissionLog.find().populate('machineId');
        res.json(logs);
    } catch (error) {
        console.error('Error fetching CO2 emission logs:', error);
        res.status(500).json({ message: 'Server Error' });
    }
}; 