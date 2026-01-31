import express from 'express';
import { issueTool, getMyTools, returnTool, getIssuedReport } from '../controllers/issueController.js';

const router = express.Router();

router.post('/', issueTool);
router.get('/report', getIssuedReport);
router.get('/my-tools/:mechanicId', getMyTools);
router.put('/:id/return', returnTool);

export default router;