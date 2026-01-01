import express from 'express';
import {
    createReport,
    getReport,
    getPatientReports,
    updateReport,
    deleteReport,
    shareReport,
    finalizeReport
} from '../controllers/reports.controller';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.use(authenticate);

router.post('/', createReport);
router.get('/patient/:patientId', getPatientReports);
router.get('/:id', getReport);
router.put('/:id', updateReport);
router.delete('/:id', deleteReport);
router.post('/:id/share', shareReport);
router.post('/:id/finalize', finalizeReport);

export default router;
