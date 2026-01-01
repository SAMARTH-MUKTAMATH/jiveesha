import express from 'express';
import {
    createSession,
    getPatientSessions,
    getSession,
    updateSession,
    deleteSession,
    getSessionTemplates,
    createSessionTemplate,
    addSessionAttachment,
    getClinicianSessions
} from '../controllers/sessions.controller';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Session CRUD
router.post('/', createSession);
router.get('/patient/:patientId', getPatientSessions);
router.get('/clinician/me', getClinicianSessions);
router.get('/:id', getSession);
router.put('/:id', updateSession);
router.delete('/:id', deleteSession);

// Templates
router.get('/templates/list', getSessionTemplates);
router.post('/templates', createSessionTemplate);

// Attachments
router.post('/:id/attachments', addSessionAttachment);

export default router;
