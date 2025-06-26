import { query, Request, Response } from 'express';
import Issue from '../models/Issue';

export const getAllIssues = async (req: Request, res: Response) => {
  try {
    const issues = await Issue.find({}).populate(
      'reportedBy assignedTo',
      'username fullName role',
    );
    res.json(issues);
  } catch (error) {
    console.error('Error fetching issues:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getIssueById = async (req: Request, res: Response) => {
  try {
    const issue = await Issue.findById(req.params.id).populate(
      'reportedBy assignedTo',
      'username fullName role',
    );

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

    if (req.body.resolvedAt) {
      const newResolvedAt = new Date(req.body.resolvedAt);
      if (!isNaN(newResolvedAt.getTime())) {
        issue.resolvedAt = newResolvedAt;
      }
    }

    if (req.body.createdAt) {
      const newCreatedAt = new Date(req.body.createdAt);
      if (!isNaN(newCreatedAt.getTime())) {
        issue.createdAt = newCreatedAt;
      }
    }

    /*
    if (req.body.status && req.body.status !== 'risolta') {
      issue.resolvedAt = undefined;
    }
      */

    const updatedIssue = await issue.save();
    res.json(updatedIssue);
  } catch (error) {
    console.error('Error updating issue:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getAssignedIssues = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;

    const assignedIssues = await Issue.find({
      assignedTo: userId,
      hiddenFor: { $ne: userId }
    })
      .populate('reportedBy assignedTo', 'username fullName role')
      .sort({ createdAt: -1 });

    res.json(assignedIssues);
  } catch (error) {
    console.error('Error fetching assigned issues:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const markAssignedIssuesAsRead = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;

    await Issue.updateMany(
      {
        assignedTo: userId,
        readBy: { $ne: userId },
      },
      {
        $addToSet: { readBy: userId },
      },
    );

    res.status(200).json({ message: 'Notifiche segnate come lette' });
  } catch (error) {
    console.error('Errore nel marcare le notifiche come lette:', error);
    res.status(500).json({ message: 'Errore del server' });
  }
};

export const getIssueByLineId = async (req: Request, res: Response) => {
  try {
    const { lineId } = req.params;
    const { status } = req.query;

    const query: any = { lineId };

    if (status) {
      query.status = status;
    }

    const issues = await Issue.find(query).populate(
      'reportedBy assignedTo',
      'username fullName role',
    );

    if (!issues || issues.length === 0) {
      return res.status(404).json({ message: 'No issues found for this line' });
    }

    res.json(issues);
  } catch (error) {
    console.error('Error fetching issues by line ID:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};


export const deleteIssue = async (req: Request, res: Response) => {
  try {
    const issue = await Issue.findByIdAndDelete(req.params.id);
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }
    res.json({ message: 'Issue deleted successfully' });
  } catch (error) {
    console.error('Error deleting issue:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const hideReadAssignedIssues = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    await Issue.updateMany(
      {
        assignedTo: userId,
        readBy: userId,
        hiddenFor: { $ne: userId }
      },
      { $push: { hiddenFor: userId } }
    );
    res.status(200).json({ message: 'Notifiche lette archiviate' });
  } catch (error) {
    console.error('Errore nel nascondere le notifiche:', error);
    res.status(500).json({ message: 'Errore del server' });
  }
};