import express from 'express';
import {
    getAllAccessGrants,
    getAccessGrantById,
    createAccessGrant,
    revokeAccessGrant
} from '../controllers/parent-access-grants.controller';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Access grants CRUD
router.get('/', getAllAccessGrants);
router.get('/:id', getAccessGrantById);
router.post('/', createAccessGrant);
router.delete('/:id', revokeAccessGrant);

export default router;
