import express from 'express';
import { loginUser, registerMechanic } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', loginUser);
router.post('/register-mechanic', registerMechanic);

export default router;