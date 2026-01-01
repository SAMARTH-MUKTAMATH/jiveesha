import express from 'express';
import {
    createPEP,
    getPEP,
    getChildPEPs,
    updatePEP,
    addGoal,
    addActivity,
    completeActivity,
    updateGoalProgress
} from '../controllers/pep.controller';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.use(authenticate);

// PEP CRUD
router.post('/', createPEP);
router.get('/child/:patientId', getChildPEPs);
router.get('/:id', getPEP);
router.put('/:id', updatePEP);

// Goals
router.post('/:id/goals', addGoal);
router.post('/goals/:goalId/progress', updateGoalProgress);

// Activities
router.post('/:id/activities', addActivity);
router.post('/activities/:activityId/complete', completeActivity);

export default router;
