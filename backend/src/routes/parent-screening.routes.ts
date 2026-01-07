import express from 'express';
import {
    startScreening,
    getQuestions,
    saveResponse,
    completeScreening,
    getResults,
    getChildScreenings,
    getMyScreenings,
    deleteScreening
} from '../controllers/parent-screening.controller';
import { getScreeningTypes } from '../controllers/screening-types.controller';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get available screening types
router.get('/types', getScreeningTypes);

// Screening lifecycle
router.post('/', startScreening);
router.get('/:id/questions', getQuestions);
router.post('/:id/response', saveResponse);
router.post('/:id/complete', completeScreening);

// Results
router.get('/:id/results', getResults);

// List screenings
router.get('/child/:patientId', getChildScreenings);
router.get('/my', getMyScreenings);

// Delete
router.delete('/:id', deleteScreening);

export default router;
