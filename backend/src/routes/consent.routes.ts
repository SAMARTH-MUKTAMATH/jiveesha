import express from 'express';
import {
    grantConsent,
    claimConsent,
    revokeConsent,
    getGrantedConsents,
    getReceivedConsents,
    updatePermissions,
    checkConsentStatus,
    resendInvitation
} from '../controllers/consent.controller';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Grant and claim
router.post('/grant', grantConsent);
router.post('/claim', claimConsent);

// Revoke
router.post('/:id/revoke', revokeConsent);

// List consents
router.get('/granted', getGrantedConsents);
router.get('/received', getReceivedConsents);

// Manage permissions
router.put('/:id/permissions', updatePermissions);

// Check status
router.get('/check/:patientId/:clinicianId', checkConsentStatus);

// Resend
router.post('/:id/resend', resendInvitation);

export default router;
