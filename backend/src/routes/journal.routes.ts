import express from 'express';
import {
    createJournalEntry,
    getPatientJournalEntries,
    getJournalEntry,
    updateJournalEntry,
    deleteJournalEntry,
    addJournalAttachment,
    getEntriesByType,
    getClinicianRecentEntries
} from '../controllers/journal.controller';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Journal CRUD
router.post('/', createJournalEntry);
router.get('/patient/:patientId', getPatientJournalEntries);
router.get('/clinician/recent', getClinicianRecentEntries);
router.get('/type/:entryType', getEntriesByType);
router.get('/:id', getJournalEntry);
router.put('/:id', updateJournalEntry);
router.delete('/:id', deleteJournalEntry);

// Attachments
router.post('/:id/attachments', addJournalAttachment);

export default router;
