import express from 'express';
import multer from 'multer';
import {
    createPEP,
    getAllPEPs,
    getPEP,
    getChildPEPs,
    updatePEP,
    addGoal,
    addActivity,
    updateActivity,
    deleteActivity,
    toggleActivityCompletion,
    getActivities,
    getActivityDetails,
    addActivityNote,
    deleteActivityNote,
    uploadActivityMedia,
    deleteActivityMedia,
    completeActivity,
    updateGoalProgress
} from '../controllers/pep.controller';
import { authenticate } from '../middleware/auth';

const router = express.Router();
const upload = multer();

router.use(authenticate);

// PEP CRUD
router.get('/', getAllPEPs);
router.post('/', createPEP);
router.get('/child/:patientId', getChildPEPs);
router.get('/:id', getPEP);
router.put('/:id', updatePEP);

// Goals
router.post('/:id/goals', addGoal);
router.post('/goals/:goalId/progress', updateGoalProgress);

// Activities
router.get('/:pepId/activities', getActivities);
router.get('/:pepId/activities/:activityId/details', getActivityDetails);
router.post('/:id/activities', addActivity);
router.put('/:pepId/activities/:activityId', updateActivity);
router.delete('/:pepId/activities/:activityId', deleteActivity);
router.post('/:pepId/activities/:activityId/toggle-completion', toggleActivityCompletion);
router.post('/activities/:activityId/complete', completeActivity);

// Activity Notes & Media
router.post('/:pepId/activities/:activityId/notes', addActivityNote);
router.delete('/:pepId/activities/:activityId/notes/:noteId', deleteActivityNote);
router.post('/:pepId/activities/:activityId/media', upload.any(), uploadActivityMedia);
router.delete('/:pepId/activities/:activityId/media/:mediaId', deleteActivityMedia);

export default router;
