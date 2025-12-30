import { Router } from 'express';
import {
    getPreferences,
    updatePreferences,
    getNotificationSettings,
    updateNotificationSettings
} from '../controllers/settings.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/preferences', getPreferences);
router.put('/preferences', updatePreferences);
router.get('/notifications', getNotificationSettings);
router.put('/notifications', updateNotificationSettings);

export default router;
