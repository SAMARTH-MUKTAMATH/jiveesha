import express from 'express';
import {
    startAssessment,
    saveAssessmentProgress,
    completeAssessment,
    getAssessment,
    getPatientAssessments,
    getPatientAssessmentsSummary,
    uploadEvidence,
    deleteAssessment,
    getClinicianRecentAssessments,
    compareAssessments,
    getAssessmentProgress,
    getAssessmentInsights,
    updateInterpretation
} from '../controllers/assessments.controller';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Assessment lifecycle
router.post('/', startAssessment);
router.put('/:id/progress', saveAssessmentProgress);
router.post('/:id/complete', completeAssessment);

// Get assessments
router.get('/patient/:patientId', getPatientAssessments);
router.get('/patient/:patientId/summary', getPatientAssessmentsSummary);
router.get('/patient/:patientId/progress', getAssessmentProgress);
router.get('/clinician/recent', getClinicianRecentAssessments);
router.get('/:id', getAssessment);
router.get('/:id/insights', getAssessmentInsights);
router.get('/:id/compare/:baselineId', compareAssessments);

// Evidence
router.post('/:id/evidence', uploadEvidence);

// Update
router.put('/:id/interpretation', updateInterpretation);

// Delete
router.delete('/:id', deleteAssessment);

export default router;
