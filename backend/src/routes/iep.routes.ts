import express from 'express';
import {
    createIEP,
    getIEP,
    getPatientIEPs,
    updateIEP,
    deleteIEP,
    addGoal,
    updateGoal,
    deleteGoal,
    addGoalProgress,
    addAccommodation,
    deleteAccommodation,
    signIEP,
    getIEPSummary,
    addService,
    updateService,
    deleteService,
    recordServiceSession,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
    signTeamMember,
    createProgressReport,
    getProgressReports,
    getIEPStatistics
} from '../controllers/iep.controller';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// IEP CRUD
router.post('/', createIEP);
router.get('/patient/:patientId', getPatientIEPs);
router.get('/:id/summary', getIEPSummary);
router.get('/:id/statistics', getIEPStatistics);
router.get('/:id', getIEP);
router.put('/:id', updateIEP);
router.delete('/:id', deleteIEP);

// Goals
router.post('/:id/goals', addGoal);
router.put('/goals/:goalId', updateGoal);
router.delete('/goals/:goalId', deleteGoal);
router.post('/goals/:goalId/progress', addGoalProgress);

// Accommodations
router.post('/:id/accommodations', addAccommodation);
router.delete('/accommodations/:accommodationId', deleteAccommodation);

// Services
router.post('/:id/services', addService);
router.put('/services/:serviceId', updateService);
router.delete('/services/:serviceId', deleteService);
router.post('/services/:serviceId/session', recordServiceSession);

// Team members
router.post('/:id/team', addTeamMember);
router.put('/team/:memberId', updateTeamMember);
router.delete('/team/:memberId', deleteTeamMember);
router.post('/team/:memberId/sign', signTeamMember);

// Progress reports
router.post('/:id/progress-report', createProgressReport);
router.get('/:id/progress-reports', getProgressReports);

// Signatures
router.post('/:id/sign', signIEP);

export default router;
