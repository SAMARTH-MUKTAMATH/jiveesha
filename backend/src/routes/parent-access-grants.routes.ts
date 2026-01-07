import express from 'express';
import {
    getAllAccessGrants,
    getAccessGrantById,
    createAccessGrant,
    revokeAccessGrant
} from '../controllers/parent-access-grants.controller';
import { validateConsentTokenForParent, claimChildAccess } from '../controllers/parent-claim.controller';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Access grants CRUD
router.get('/', getAllAccessGrants);
router.get('/:id', getAccessGrantById);
router.post('/', createAccessGrant);
router.delete('/:id', revokeAccessGrant);

// Access grants validation and claiming
router.post('/validate', validateConsentTokenForParent);
router.post('/claim', claimChildAccess);

export default router;
