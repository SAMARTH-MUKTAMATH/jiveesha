import { Router } from 'express';
import {
    createPatient,
    getPatients,
    getPatient,
    updatePatient,
    deletePatient,
    reactivatePatient
} from '../controllers/patients.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Patient CRUD
router.post('/', createPatient);
router.get('/', getPatients);
router.get('/:id', getPatient);
router.put('/:id', updatePatient);
router.delete('/:id', deletePatient);
router.post('/:id/reactivate', reactivatePatient);

export default router;
