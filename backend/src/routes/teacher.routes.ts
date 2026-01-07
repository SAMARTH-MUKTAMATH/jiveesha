import express from 'express';
import { getDashboardData, getStudents, addStudent, getStudentById } from '../controllers/teacher.controller';
// import { protect } from '../middleware/auth'; // Uncomment when auth is ready

const router = express.Router();

// Public for now, will be protected later
router.get('/dashboard', getDashboardData);
router.get('/students', getStudents);
router.post('/students', addStudent);
router.get('/students/:id', getStudentById);

export default router;
