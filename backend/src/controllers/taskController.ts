import { Request, Response } from 'express';
import Task from '../models/Task';

export const getAllTasks = async (req: Request, res: Response) => {
    try {
        const tasks = await Task.find({}).populate('assignedTo', 'username fullName role');
        res.json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const getTaskById = async (req: Request, res: Response) => {
    try {
        const task = await Task.findById(req.params.id).populate('assignedTo', 'username fullName role');
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(task);
    } catch (error) {
        console.error('Error fetching task by ID:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const createTask = async (req: Request, res: Response) => {
    try {
        const newTask = new Task(req.body);
        const task = await newTask.save();
        res.status(201).json(task);
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const updateTask = async (req: Request, res: Response) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        Object.assign(task, req.body);
        const updatedTask = await task.save();
        res.json(updatedTask);
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const deleteTask = async (req: Request, res: Response) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json({ message: 'Task deleted' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ message: 'Server Error' });
    }
}; 