import { Router } from 'express';
import {
    createPatient,
    getPatients,
    getPatient,
    updatePatient,
    deletePatient,
    reactivatePatient,
    addContact,
    updateContact,
    deleteContact,
    getTimeline,
    addTimelineEntry
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

// Patient contacts
router.post('/:id/contacts', addContact);
router.put('/:id/contacts/:contactId', updateContact);
router.delete('/:id/contacts/:contactId', deleteContact);

// Patient timeline/activity
router.get('/:id/timeline', getTimeline);
router.post('/:id/timeline', addTimelineEntry);

export default router;
