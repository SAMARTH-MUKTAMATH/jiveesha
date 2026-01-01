import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';

import authRoutes from './routes/auth.routes';
import credentialRoutes from './routes/credentials.routes';
import clinicianRoutes from './routes/clinician.routes';
import patientRoutes from './routes/patients.routes';
import appointmentRoutes from './routes/appointments.routes';
import dashboardRoutes from './routes/dashboard.routes';
import settingsRoutes from './routes/settings.routes';
import sessionRoutes from './routes/sessions.routes';
import journalRoutes from './routes/journal.routes';
import assessmentRoutes from './routes/assessments.routes';
import iepRoutes from './routes/iep.routes';
import interventionRoutes from './routes/interventions.routes';
import reportRoutes from './routes/reports.routes';
import messageRoutes from './routes/messages.routes';
import parentAuthRoutes from './routes/parent-auth.routes';
import parentChildrenRoutes from './routes/parent-children.routes';
import consentRoutes from './routes/consent.routes';
import parentScreeningRoutes from './routes/parent-screening.routes';
import pepRoutes from './routes/pep.routes';
import resourceRoutes from './routes/resources.routes';
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';

dotenv.config();

const app: Application = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Logging
if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
}

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
});

// API Routes
const API_PREFIX = '/api/v1';
app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/credentials`, credentialRoutes);
app.use(`${API_PREFIX}/clinician`, clinicianRoutes);
app.use(`${API_PREFIX}/patients`, patientRoutes);
app.use(`${API_PREFIX}/appointments`, appointmentRoutes);
app.use(`${API_PREFIX}/dashboard`, dashboardRoutes);
app.use(`${API_PREFIX}/settings`, settingsRoutes);
app.use(`${API_PREFIX}/sessions`, sessionRoutes);
app.use(`${API_PREFIX}/journal`, journalRoutes);
app.use(`${API_PREFIX}/assessments`, assessmentRoutes);
app.use(`${API_PREFIX}/iep`, iepRoutes);
app.use(`${API_PREFIX}/interventions`, interventionRoutes);
app.use(`${API_PREFIX}/reports`, reportRoutes);
app.use(`${API_PREFIX}/messages`, messageRoutes);
app.use(`${API_PREFIX}/parent/auth`, parentAuthRoutes);
app.use(`${API_PREFIX}/parent/children`, parentChildrenRoutes);
app.use(`${API_PREFIX}/consent`, consentRoutes);
app.use(`${API_PREFIX}/parent/screening`, parentScreeningRoutes);
app.use(`${API_PREFIX}/parent/pep`, pepRoutes);
app.use(`${API_PREFIX}/parent/resources`, resourceRoutes);

// Error handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`\n🚀 Daira Backend Server running on port ${PORT}`);
        console.log(`📍 API available at http://localhost:${PORT}/api/v1`);
        console.log(`🔗 Health check: http://localhost:${PORT}/health`);
        console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL}\n`);
    });
}

export default app;
