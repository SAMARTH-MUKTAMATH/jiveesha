import { Router } from 'express';
import {
    getStats,
    getRecentActivity,
    getTodaySchedule,
    getPendingTasks
} from '../controllers/dashboard.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/stats', getStats);
router.get('/recent-activity', getRecentActivity);
router.get('/today-schedule', getTodaySchedule);
router.get('/pending-tasks', getPendingTasks);

export default router;
