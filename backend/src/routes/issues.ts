import express from 'express';
import Issue from '../models/Issue';
import { authenticateToken } from '../middleware/auth'; // Import the authentication middleware

const router = express.Router();

// @route   GET /api/issues
// @desc    Get all issues
// @access  Private (accessible by any authenticated user)
router.get('/', authenticateToken, async (req, res) => {
    try {
        // Fetch all issues from the database
        const issues = await Issue.find({}).populate('reportedBy assignedTo', 'username fullName role'); // Populate user details
        res.json(issues);
    } catch (error) {
        console.error('Error fetching issues:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   GET /api/issues/:id
// @desc    Get single issue by ID
// @access  Private (accessible by any authenticated user)
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const issue = await Issue.findById(req.params.id).populate('reportedBy assignedTo', 'username fullName role');

        if (!issue) {
            return res.status(404).json({ message: 'Issue not found' });
        }

        res.json(issue);
    } catch (error) {
        console.error('Error fetching issue by ID:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   POST /api/issues
// @desc    Create a new issue
// @access  Private (requires specific role, e.g., Operator)
// TODO: Add checkRole middleware for specific roles (e.g., ['operator', 'manager', 'admin'])
router.post('/', authenticateToken, async (req, res) => {
    try {
        const newIssue = new Issue({
            ...req.body,
            reportedBy: (req as any).user.userId, // Assuming user ID is attached by authenticateToken middleware
        });

        const issue = await newIssue.save();
        res.status(201).json(issue);
    } catch (error) {
        console.error('Error creating issue:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   PUT /api/issues/:id
// @desc    Update an issue
// @access  Private (requires specific role, e.g., Manager or Admin)
// TODO: Add checkRole middleware for specific roles (e.g., ['manager', 'admin']) and ownership check
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const issue = await Issue.findById(req.params.id);

        if (!issue) {
            return res.status(404).json({ message: 'Issue not found' });
        }

        // Update issue fields based on req.body
        Object.assign(issue, req.body);

        // If status is set to 'risolta' and resolvedAt is not set, set it
        if (req.body.status === 'risolta' && !issue.resolvedAt) {
            issue.resolvedAt = new Date();
        }
        // If status is changed from 'risolta' and resolvedAt is set, clear it
        if (issue.status !== 'risolta' && issue.resolvedAt) {
            issue.resolvedAt = undefined;
        }

        const updatedIssue = await issue.save();
        res.json(updatedIssue);
    } catch (error) {
        console.error('Error updating issue:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   DELETE /api/issues/:id
// @desc    Delete an issue
// @access  Private (requires specific role, e.g., Admin)
// TODO: Implement delete route and add checkRole middleware for admin
// router.delete('/:id', authenticateToken, checkRole(['admin']), async (req, res) => { ... });

export default router; 