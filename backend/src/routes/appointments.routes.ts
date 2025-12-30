import { Router } from 'express';
import {
    createAppointment,
    getAppointments,
    getCalendarAppointments,
    getAppointment,
    updateAppointment,
    cancelAppointment,
    getAvailableSlots
} from '../controllers/appointments.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/', createAppointment);
router.get('/', getAppointments);
router.get('/calendar', getCalendarAppointments);
router.get('/slots', getAvailableSlots);
router.get('/:id', getAppointment);
router.put('/:id', updateAppointment);
router.put('/:id/cancel', cancelAppointment);

export default router;
