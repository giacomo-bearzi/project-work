import { Request, Response } from 'express';
import ProductionLine from '../models/ProductionLine';

export const getAllProductionLines = async (req: Request, res: Response) => {
  try {
    const lines = await ProductionLine.find({});
    res.json(lines);
  } catch (error) {
    console.error('Error fetching production lines:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getProductionLineById = async (req: Request, res: Response) => {
  try {
    const line = await ProductionLine.findById(req.params.id);
    if (!line) {
      return res.status(404).json({ message: 'Production line not found' });
    }
    res.json(line);
  } catch (error) {
    console.error('Error fetching production line by ID:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
