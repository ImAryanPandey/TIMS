import Issue from '../models/Issue.js';
import Tool from '../models/Tool.js';

export const issueTool = async (req, res) => {
    try {
        const { mechanic_id, tool_id, qty_issued } = req.body;

        const tool = await Tool.findById(tool_id);
        if (!tool) return res.status(404).json({ message: 'Tool not found' });
        
        if (tool.available_qty < qty_issued) {
            return res.status(400).json({ message: `Only ${tool.available_qty} available` });
        }

        const issue = await Issue.create({
            mechanic: mechanic_id,
            tool: tool_id,
            qty_issued
        });

        tool.available_qty -= qty_issued;
        await tool.save();

        res.status(201).json(issue);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getMyTools = async (req, res) => {
    try {
        const issues = await Issue.find({ 
            mechanic: req.params.mechanicId, 
            status: 'Issued' 
        }).populate('tool', 'title category image');

        res.json(issues);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const returnTool = async (req, res) => {
    try {
        const issue = await Issue.findById(req.params.id);
        if (!issue) return res.status(404).json({ message: 'Transaction not found' });

        if (issue.status === 'Returned') {
            return res.status(400).json({ message: 'Tool already returned' });
        }

        issue.status = 'Returned';
        await issue.save();

        const tool = await Tool.findById(issue.tool);
        tool.available_qty += issue.qty_issued;
        await tool.save();

        res.json({ message: 'Tool returned successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getIssuedReport = async (req, res) => {
    try {
        const report = await Issue.aggregate([
            { $match: { status: 'Issued' } },
            {
                $group: {
                    _id: "$mechanic",
                    totalIssued: { $sum: "$qty_issued" }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "mechanicDetails"
                }
            },
            {
                $project: {
                    name: { $arrayElemAt: ["$mechanicDetails.name", 0] },
                    email: { $arrayElemAt: ["$mechanicDetails.email", 0] },
                    totalIssued: 1
                }
            }
        ]);
        res.json(report);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};