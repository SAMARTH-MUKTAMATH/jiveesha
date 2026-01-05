import { Router } from 'express';
import {
    getProfile,
    updateProfile,
    uploadPhoto,
    getLocations,
    createLocation,
    updateLocation,
    deleteLocation,
    getAvailability,
    updateAvailability,
    getTimeOff,
    createTimeOff,
    deleteTimeOff
} from '../controllers/clinician.controller';
import { validateConsentToken } from '../controllers/clinician-access.controller';
import { authenticate } from '../middleware/auth';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDir = process.env.UPLOAD_DIR || './uploads';
const photosDir = path.join(uploadDir, 'photos');

if (!fs.existsSync(photosDir)) {
    fs.mkdirSync(photosDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, photosDir),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.'));
        }
    }
});

const router = Router();

router.use(authenticate);

// Access Grants
router.post('/access-grants/validate', validateConsentToken);

// Profile
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/profile/photo', upload.single('photo'), uploadPhoto);

// Locations
router.get('/locations', getLocations);
router.post('/locations', createLocation);
router.put('/locations/:id', updateLocation);
router.delete('/locations/:id', deleteLocation);

// Availability
router.get('/availability', getAvailability);
router.put('/availability', updateAvailability);

// Time off
router.get('/time-off', getTimeOff);
router.post('/time-off', createTimeOff);
router.delete('/time-off/:id', deleteTimeOff);

export default router;
