import Tool from '../models/Tool.js';

export const addTool = async (req, res) => {
    try {
        const { title, category, image, total_qty } = req.body;
        const tool = await Tool.create({
            title,
            category,
            image,
            total_qty,
            available_qty: total_qty 
        });
        res.status(201).json(tool);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getTools = async (req, res) => {
    try {
        const tools = await Tool.find({});
        res.json(tools);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};