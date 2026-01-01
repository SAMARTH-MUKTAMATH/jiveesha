import express from 'express';
import {
    addChild,
    getChildren,
    getChild,
    updateRelationship,
    removeChild,
    verifyAccess,
    getChildActivity
} from '../controllers/parent-children.controller';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.post('/', addChild);
router.get('/', getChildren);
router.get('/:patientId', getChild);
router.put('/:patientId', updateRelationship);
router.delete('/:patientId', removeChild);
router.get('/:patientId/verify-access', verifyAccess);
router.get('/:patientId/activity', getChildActivity);

export default router;
