import express from 'express';
import {
    getResources,
    getResource,
    getFeaturedResources,
    getResourcesByCategory
} from '../controllers/resources.controller';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.use(authenticate);

router.get('/', getResources);
router.get('/featured', getFeaturedResources);
router.get('/category/:category', getResourcesByCategory);
router.get('/:id', getResource);

export default router;
