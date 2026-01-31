import express from 'express';
import { addTool, getTools } from '../controllers/toolController.js';

const router = express.Router();

router.post('/', addTool);
router.get('/', getTools);

export default router;