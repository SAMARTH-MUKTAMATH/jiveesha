import { Router } from 'express';
import { getDashboardStats, getSchoolTeachers, createTeacher, getTeacherById } from '../controllers/school.controller';

const router = Router();

router.get('/dashboard-stats', getDashboardStats);
router.get('/teachers-activity', getSchoolTeachers);
router.post('/teachers', createTeacher);
router.get('/teachers/:id', getTeacherById);

export default router;
