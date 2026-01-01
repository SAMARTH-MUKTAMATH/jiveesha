import express from 'express';
import {
    createIntervention,
    getIntervention,
    getPatientInterventions,
    updateIntervention,
    deleteIntervention,
    addStrategy,
    updateStrategy,
    deleteStrategy,
    addProgressUpdate,
    getProgressTimeline,
    updateStatus,
    getInterventionStatistics
} from '../controllers/interventions.controller';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Intervention CRUD
router.post('/', createIntervention);
router.get('/patient/:patientId', getPatientInterventions);
router.get('/:id/statistics', getInterventionStatistics);
router.get('/:id', getIntervention);
router.put('/:id', updateIntervention);
router.delete('/:id', deleteIntervention);

// Status management
router.put('/:id/status', updateStatus);

// Strategies
router.post('/:id/strategies', addStrategy);
router.put('/strategies/:strategyId', updateStrategy);
router.delete('/strategies/:strategyId', deleteStrategy);

// Progress tracking
router.post('/:id/progress', addProgressUpdate);
router.get('/:id/progress', getProgressTimeline);

export default router;
