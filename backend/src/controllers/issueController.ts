import { Request, Response } from 'express';
import Issue from '../models/Issue';

export const getAllIssues = async (req: Request, res: Response) => {
    try {
        const issues = await Issue.find({})
            .populate('reportedBy assignedTo', 'username fullName role');
        res.json(issues);
    } catch (error) {
        console.error('Error fetching issues:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const getIssueById = async (req: Request, res: Response) => {
    try {
        const issue = await Issue.findById(req.params.id)
            .populate('reportedBy assignedTo', 'username fullName role');

        if (!issue) {
            return res.status(404).json({ message: 'Issue not found' });
        }

        res.json(issue);
    } catch (error) {
        console.error('Error fetching issue by ID:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const createIssue = async (req: Request, res: Response) => {
    try {
        const newIssue = new Issue({
            ...req.body,
            reportedBy: (req as any).user.userId,
        });

        const issue = await newIssue.save();
        res.status(201).json(issue);
    } catch (error) {
        console.error('Error creating issue:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const updateIssue = async (req: Request, res: Response) => {
    try {
        const issue = await Issue.findById(req.params.id);

        if (!issue) {
            return res.status(404).json({ message: 'Issue not found' });
        }

        Object.assign(issue, req.body);

        if (req.body.status === 'risolta' && !issue.resolvedAt) {
            issue.resolvedAt = new Date();
        }
        if (issue.status !== 'risolta' && issue.resolvedAt) {
            issue.resolvedAt = undefined;
        }

        const updatedIssue = await issue.save();
        res.json(updatedIssue);
    } catch (error) {
        console.error('Error updating issue:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
