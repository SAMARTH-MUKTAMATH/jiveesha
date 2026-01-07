import express from 'express';
import {
    createJournalEntry,
    getPatientJournalEntries,
    getJournalEntry,
    updateJournalEntry,
    deleteJournalEntry,
    addJournalAttachment,
    getEntriesByType,
    getClinicianRecentEntries,
    getParentTimeline
} from '../controllers/journal.controller';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Journal CRUD
router.post('/', createJournalEntry);
router.get('/patient/:patientId', getPatientJournalEntries); // For clinician view mostly
router.get('/parent/timeline/:personId', getParentTimeline); // New unified parent view
router.get('/clinician/recent', getClinicianRecentEntries);
router.get('/type/:entryType', getEntriesByType);
router.get('/:id', getJournalEntry);
router.put('/:id', updateJournalEntry);
router.delete('/:id', deleteJournalEntry);

// Attachments
router.post('/:id/attachments', addJournalAttachment);

export default router;
