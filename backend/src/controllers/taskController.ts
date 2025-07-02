import { Request, Response } from 'express';
import Task from '../models/Task';
import ProductionLine from '../models/ProductionLine';
import { updateProductionLineStatus } from './productionLineController';

export const getAllTasks = async (req: Request, res: Response) => {
    try {
        const tasks = await Task.find({}).populate(
            'assignedTo',
            'username fullName role',
        );
        res.json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const getTaskById = async (req: Request, res: Response) => {
    try {
        const task = await Task.findById(req.params.id).populate(
            'assignedTo',
            'username fullName role',
        );
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(task);
    } catch (error) {
        console.error('Error fetching task by ID:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Updated helper function to update production line status based on tasks
const updateProductionLineStatusFromTasks = async (lineId: string) => {
    try {
        // Get all active tasks for this line (not completed)
        const activeTasks = await Task.find({
            lineId,
            status: { $in: ['in_attesa', 'in_corso'] }
        });

        if (activeTasks.length === 0) {
            // No active tasks, set status to 'stopped'
            await updateProductionLineStatus(lineId, 'stopped');
        } else {
            // Check if there are any tasks in progress
            const tasksInProgress = activeTasks.filter(task => task.status === 'in_corso');
            
            if (tasksInProgress.length === 0) {
                // No tasks in progress, check if there are maintenance tasks waiting
                const maintenanceTasks = activeTasks.filter(task => task.type === 'manutenzione');
                
                if (maintenanceTasks.length > 0) {
                    // Has maintenance tasks waiting, set status to 'maintenance'
                    await updateProductionLineStatus(lineId, 'maintenance');
                } else {
                    // Has standard tasks waiting, set status to 'stopped' (not active since none are in progress)
                    await updateProductionLineStatus(lineId, 'stopped');
                }
            } else {
                // Has tasks in progress, check if any are maintenance
                const maintenanceTasksInProgress = tasksInProgress.filter(task => task.type === 'manutenzione');
                
                if (maintenanceTasksInProgress.length > 0) {
                    // Has maintenance tasks in progress, set status to 'maintenance'
                    await updateProductionLineStatus(lineId, 'maintenance');
                } else {
                    // Has standard tasks in progress, set status to 'active' (will be forced to stopped if outside shifts)
                    await updateProductionLineStatus(lineId, 'active');
                }
            }
        }
    } catch (error) {
        console.error(`Error updating production line ${lineId} status from tasks:`, error);
    }
};

export const createTask = async (req: Request, res: Response) => {
    try {
        const newTask = new Task(req.body);
        const task = await newTask.save();
        
        // Update production line status based on tasks
        if (task.lineId) {
            await updateProductionLineStatusFromTasks(task.lineId);
        }
        
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
        
        const previousStatus = task.status;
        const previousType = task.type;
        
        if (!req.body.type && task.type) {
            req.body.type = task.type;
        }
        if (req.body.assignedTo && typeof req.body.assignedTo === 'object' && req.body.assignedTo._id) {
            req.body.assignedTo = req.body.assignedTo._id;
        }
        
        Object.assign(task, req.body);
        const updatedTask = await task.save();
        
        // Update production line status if task status or type changed
        if (task.lineId && (previousStatus !== updatedTask.status || previousType !== updatedTask.type)) {
            await updateProductionLineStatusFromTasks(task.lineId);
        }
        
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
        
        // Update production line status after task deletion
        if (task.lineId) {
            await updateProductionLineStatusFromTasks(task.lineId);
        }
        
        res.json({ message: 'Task deleted' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const updateUncompletedTasksToToday = async () => {
    const today = new Date().toISOString().slice(0, 10);
    await Task.updateMany(
        { status: { $ne: 'completata' }, date: { $lt: today } },
        { $set: { date: today } }
    );
};

export const getTaskByLineId = async (req: Request, res: Response) => {
    try {
        const { lineId } = req.params;
        const { status, type } = req.query;

        const filter: any = { lineId };

        // Filter by status
        if (
            status &&
            ['in_attesa', 'in_corso', 'completata'].includes(String(status))
        ) {
            filter.status = status;
        }

        // Filter by type
        if (
            type &&
            ['standard', 'manutenzione'].includes(String(type))
        ) {
            filter.type = type;
        }

        const tasks = await Task.find(filter)
            .populate('assignedTo', 'username fullName role')
            .sort({ date: -1, createdAt: -1 }); // Sort by date and creation time

        if (!tasks || tasks.length === 0) {
            return res.status(404).json({ message: 'No tasks found for this line' });
        }

        res.json(tasks);
    } catch (error) {
        console.error('Error fetching tasks by line ID:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};