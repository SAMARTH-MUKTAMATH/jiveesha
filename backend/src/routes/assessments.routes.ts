import express from 'express';
import {
    createAssessment,
    getAssessment,
    getAssessments,
    updateAssessment,
    deleteAssessment
} from '../controllers/assessments.controller';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Assessment CRUD
router.post('/', createAssessment);
router.get('/', getAssessments);
router.get('/patient/:personId', getAssessments); // Uses same getAssessments with personId filter
router.get('/:id', getAssessment);
router.put('/:id', updateAssessment);
router.delete('/:id', deleteAssessment);

export default router;
