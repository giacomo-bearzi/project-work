import { Request, Response } from 'express';
import Machine from '../models/Machine';

export const getAllMachines = async (req: Request, res: Response) => {
    try {
        const machines = await Machine.find();
        res.json(machines);
    } catch (error) {
        console.error('Error fetching machines:', error);
        res.status(500).json({ message: 'Server Error' });
    }
}; 