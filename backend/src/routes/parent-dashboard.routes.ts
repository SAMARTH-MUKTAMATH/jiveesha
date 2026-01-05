import express from 'express';
import {
    getDashboardStats,
    getSkillProgress,
    getRecentActivities
} from '../controllers/parent-dashboard.controller';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.use(authenticate);

// Dashboard endpoints
router.get('/stats', getDashboardStats);
router.get('/skills', getSkillProgress);
router.get('/activities', getRecentActivities);

export default router;
