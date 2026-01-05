import express from 'express';
import {
    addChild,
    getChildren,
    getChild,
    updateChild,
    deleteChild
} from '../controllers/parent-children.controller';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Parent-child relationship management
router.post('/', addChild);
router.get('/', getChildren);
router.get('/:personId', getChild);
router.put('/:id', updateChild);
router.delete('/:id', deleteChild);

export default router;
