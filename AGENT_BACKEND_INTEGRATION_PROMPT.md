# AGENT PROMPT: DAIRA BACKEND DEVELOPMENT & INTEGRATION
## Autonomous Backend Creation, Testing, and Frontend Integration

---

# MISSION OVERVIEW

You are an AI agent tasked with building a complete backend API for the Daira neurodevelopmental screening platform and integrating it with an existing React frontend. Your goal is to:

1. **Build a production-ready backend** (Node.js + Express + PostgreSQL)
2. **Integrate with existing frontend** (49 React components already built)
3. **Test thoroughly with dummy data**
4. **Document everything** for human developer handoff
5. **Create setup guide** for production deployment

---

# WHAT YOU HAVE

## Frontend (Already Built)
- **Location:** `/home/claude/daira---neurodevelopmental-screening-2/`
- **Stack:** React 19 + TypeScript + Vite
- **Components:** 49 components (all screens complete)
- **Routing:** State-based navigation in App.tsx
- **Status:** Fully functional UI, needs backend connection

## Documentation (Already Created)
- **Backend API Spec:** `/mnt/user-data/outputs/BACKEND_API_SPECIFICATION.md`
- **Route Mapping:** `/mnt/user-data/outputs/FRONTEND_BACKEND_ROUTE_MAPPING.md`
- **Integration Roadmap:** `/mnt/user-data/outputs/BACKEND_INTEGRATION_ROADMAP.md`

---

# WHAT YOU NEED TO BUILD

## Technology Stack

### Backend
```
Framework: Node.js 18+ with Express.js
Language: TypeScript
Database: PostgreSQL 14+
ORM: Prisma (recommended) or TypeORM
Auth: JWT (jsonwebtoken + bcrypt)
File Upload: Multer + AWS SDK (S3) or local storage
Validation: Zod or Joi
Testing: Jest + Supertest
```

### Project Structure
```
/backend/
├── src/
│   ├── config/
│   │   ├── database.ts
│   │   └── env.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── errorHandler.ts
│   │   └── validation.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── patients.routes.ts
│   │   ├── appointments.routes.ts
│   │   └── ... (one file per resource)
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── patients.controller.ts
│   │   └── ...
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── patients.service.ts
│   │   └── ...
│   ├── models/ (if using TypeORM)
│   ├── schema/ (if using Prisma)
│   │   └── schema.prisma
│   ├── utils/
│   │   ├── jwt.ts
│   │   ├── password.ts
│   │   └── fileUpload.ts
│   ├── types/
│   │   └── index.ts
│   └── app.ts
├── tests/
│   ├── auth.test.ts
│   ├── patients.test.ts
│   └── ...
├── prisma/ (if using Prisma)
│   ├── migrations/
│   └── schema.prisma
├── uploads/ (local file storage)
├── .env.example
├── .env
├── package.json
├── tsconfig.json
└── README.md
```

---

# PHASE-BY-PHASE IMPLEMENTATION

## PHASE 0: FOUNDATION (DO THIS FIRST) ⭐

### Step 0.1: Project Setup

```bash
# Create backend directory
mkdir -p backend
cd backend

# Initialize Node.js project
npm init -y

# Install dependencies
npm install express cors dotenv bcryptjs jsonwebtoken
npm install pg prisma @prisma/client
npm install multer uuid
npm install express-validator
npm install morgan helmet

# Install dev dependencies
npm install -D typescript @types/node @types/express @types/cors
npm install -D @types/bcryptjs @types/jsonwebtoken @types/multer
npm install -D ts-node-dev nodemon
npm install -D jest @types/jest ts-jest supertest @types/supertest
npm install -D eslint prettier

# Initialize TypeScript
npx tsc --init

# Initialize Prisma
npx prisma init
```

### Step 0.2: Database Schema Setup

**Create Prisma Schema:** `prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// PHASE 0: Authentication & Users
model User {
  id                          String    @id @default(uuid())
  email                       String    @unique
  passwordHash                String    @map("password_hash")
  role                        String    @default("clinician")
  status                      String    @default("pending_verification")
  emailVerified               Boolean   @default(false) @map("email_verified")
  emailVerificationToken      String?   @map("email_verification_token")
  emailVerificationExpires    DateTime? @map("email_verification_expires")
  passwordResetToken          String?   @map("password_reset_token")
  passwordResetExpires        DateTime? @map("password_reset_expires")
  createdAt                   DateTime  @default(now()) @map("created_at")
  updatedAt                   DateTime  @updatedAt @map("updated_at")
  lastLoginAt                 DateTime? @map("last_login_at")
  deletedAt                   DateTime? @map("deleted_at")

  profile                     ClinicianProfile?
  credentials                 Credential[]
  refreshTokens               RefreshToken[]
  patients                    Patient[]
  appointments                Appointment[]
  sessions                    ConsultationSession[]
  auditLogs                   AuditLog[]
  
  @@map("users")
}

model ClinicianProfile {
  id                    String    @id @default(uuid())
  userId                String    @unique @map("user_id")
  firstName             String    @map("first_name")
  middleName            String?   @map("middle_name")
  lastName              String    @map("last_name")
  professionalTitle     String?   @map("professional_title")
  designation           String?
  specializations       Json      @default("[]")
  languages             Json      @default("[]")
  phone                 String?
  alternatePhone        String?   @map("alternate_phone")
  dateOfBirth           DateTime? @map("date_of_birth") @db.Date
  yearsOfPractice       Int?      @map("years_of_practice")
  bio                   String?   @db.Text
  photoUrl              String?   @map("photo_url")
  verificationStatus    String    @default("pending") @map("verification_status")
  verifiedAt            DateTime? @map("verified_at")
  verifiedBy            String?   @map("verified_by")
  createdAt             DateTime  @default(now()) @map("created_at")
  updatedAt             DateTime  @updatedAt @map("updated_at")

  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("clinician_profiles")
}

model Credential {
  id                    String    @id @default(uuid())
  userId                String    @map("user_id")
  credentialType        String    @map("credential_type")
  credentialNumber      String?   @map("credential_number")
  issuingAuthority      String?   @map("issuing_authority")
  issueDate             DateTime? @map("issue_date") @db.Date
  expiryDate            DateTime? @map("expiry_date") @db.Date
  documentUrl           String?   @map("document_url")
  verificationStatus    String    @default("pending") @map("verification_status")
  verificationNotes     String?   @map("verification_notes") @db.Text
  verifiedBy            String?   @map("verified_by")
  verifiedAt            DateTime? @map("verified_at")
  rejectionReason       String?   @map("rejection_reason") @db.Text
  createdAt             DateTime  @default(now()) @map("created_at")
  updatedAt             DateTime  @updatedAt @map("updated_at")

  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("credentials")
}

model RefreshToken {
  id                    String    @id @default(uuid())
  userId                String    @map("user_id")
  token                 String    @unique
  expiresAt             DateTime  @map("expires_at")
  createdAt             DateTime  @default(now()) @map("created_at")
  revokedAt             DateTime? @map("revoked_at")
  ipAddress             String?   @map("ip_address")
  userAgent             String?   @map("user_agent") @db.Text

  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("refresh_tokens")
}

model AuditLog {
  id                    String    @id @default(uuid())
  userId                String?   @map("user_id")
  action                String
  resourceType          String?   @map("resource_type")
  resourceId            String?   @map("resource_id")
  ipAddress             String?   @map("ip_address")
  userAgent             String?   @map("user_agent") @db.Text
  details               Json?
  createdAt             DateTime  @default(now()) @map("created_at")

  user                  User?     @relation(fields: [userId], references: [id])
  
  @@index([userId])
  @@index([createdAt])
  @@index([resourceType, resourceId])
  @@map("audit_logs")
}

// PHASE 1: Settings & Locations
model PracticeLocation {
  id                    String    @id @default(uuid())
  clinicianId           String    @map("clinician_id")
  name                  String
  addressLine1          String?   @map("address_line1")
  addressLine2          String?   @map("address_line2")
  city                  String?
  state                 String?
  pinCode               String?   @map("pin_code")
  country               String    @default("India")
  roomInfo              String?   @map("room_info")
  isPrimary             Boolean   @default(false) @map("is_primary")
  createdAt             DateTime  @default(now()) @map("created_at")
  updatedAt             DateTime  @updatedAt @map("updated_at")

  availability          ClinicianAvailability[]
  appointments          Appointment[]
  
  @@map("practice_locations")
}

model ClinicianAvailability {
  id                    String    @id @default(uuid())
  clinicianId           String    @map("clinician_id")
  dayOfWeek             Int       @map("day_of_week")
  startTime             String    @map("start_time")
  endTime               String    @map("end_time")
  locationId            String?   @map("location_id")
  isActive              Boolean   @default(true) @map("is_active")
  createdAt             DateTime  @default(now()) @map("created_at")
  updatedAt             DateTime  @updatedAt @map("updated_at")

  location              PracticeLocation? @relation(fields: [locationId], references: [id])
  
  @@unique([clinicianId, dayOfWeek, startTime, locationId])
  @@map("clinician_availability")
}

model ClinicianTimeOff {
  id                    String    @id @default(uuid())
  clinicianId           String    @map("clinician_id")
  startDate             DateTime  @map("start_date") @db.Date
  endDate               DateTime  @map("end_date") @db.Date
  reason                String?
  allDay                Boolean   @default(true) @map("all_day")
  startTime             String?   @map("start_time")
  endTime               String?   @map("end_time")
  createdAt             DateTime  @default(now()) @map("created_at")
  updatedAt             DateTime  @updatedAt @map("updated_at")

  @@index([clinicianId, startDate, endDate])
  @@map("clinician_time_off")
}

model UserPreferences {
  userId                String    @id @map("user_id")
  language              String    @default("en")
  timezone              String    @default("Asia/Kolkata")
  dateFormat            String    @default("DD/MM/YYYY") @map("date_format")
  timeFormat            String    @default("12-hour") @map("time_format")
  theme                 String    @default("light")
  notificationEmail     Boolean   @default(true) @map("notification_email")
  notificationSms       Boolean   @default(true) @map("notification_sms")
  notificationPush      Boolean   @default(true) @map("notification_push")
  notificationSettings  Json      @default("{}") @map("notification_settings")
  createdAt             DateTime  @default(now()) @map("created_at")
  updatedAt             DateTime  @updatedAt @map("updated_at")

  @@map("user_preferences")
}

// PHASE 2: Patient Management
model Patient {
  id                    String    @id @default(uuid())
  clinicianId           String    @map("clinician_id")
  
  firstName             String    @map("first_name")
  middleName            String?   @map("middle_name")
  lastName              String    @map("last_name")
  dateOfBirth           DateTime  @map("date_of_birth") @db.Date
  gender                String?
  placeOfBirth          String?   @map("place_of_birth")
  
  addressLine1          String?   @map("address_line1")
  addressLine2          String?   @map("address_line2")
  city                  String?
  state                 String?
  pinCode               String?   @map("pin_code")
  country               String    @default("India")
  
  primaryLanguage       String?   @map("primary_language")
  languagesSpoken       Json      @default("[]") @map("languages_spoken")
  udidNumber            String?   @map("udid_number")
  aadhaarEncrypted      String?   @map("aadhaar_encrypted")
  schoolId              String?   @map("school_id")
  
  primaryConcerns       String?   @map("primary_concerns") @db.Text
  existingDiagnosis     String?   @map("existing_diagnosis")
  diagnosisCodes        Json      @default("[]") @map("diagnosis_codes")
  developmentalMilestones Json?   @map("developmental_milestones")
  medicalHistory        Json?     @map("medical_history")
  currentMedications    Json      @default("[]") @map("current_medications")
  allergies             String?   @db.Text
  familyHistory         String?   @map("family_history") @db.Text
  
  status                String    @default("active")
  referralSource        String?   @map("referral_source")
  referralDetails       String?   @map("referral_details") @db.Text
  
  createdAt             DateTime  @default(now()) @map("created_at")
  updatedAt             DateTime  @updatedAt @map("updated_at")
  deletedAt             DateTime? @map("deleted_at")

  clinician             User      @relation(fields: [clinicianId], references: [id])
  contacts              PatientContact[]
  documents             PatientDocument[]
  tags                  PatientTag[]
  activityLog           PatientActivityLog[]
  appointments          Appointment[]
  sessions              ConsultationSession[]
  assessments           Assessment[]
  
  @@index([clinicianId])
  @@index([status])
  @@index([dateOfBirth])
  @@map("patients")
}

model PatientContact {
  id                    String    @id @default(uuid())
  patientId             String    @map("patient_id")
  contactType           String    @map("contact_type")
  relationship          String?
  firstName             String    @map("first_name")
  lastName              String    @map("last_name")
  phone                 String?
  alternatePhone        String?   @map("alternate_phone")
  email                 String?
  whatsappNumber        String?   @map("whatsapp_number")
  occupation            String?
  addressLine1          String?   @map("address_line1")
  addressLine2          String?   @map("address_line2")
  city                  String?
  state                 String?
  pinCode               String?   @map("pin_code")
  isPrimaryContact      Boolean   @default(false) @map("is_primary_contact")
  canReceiveUpdates     Boolean   @default(true) @map("can_receive_updates")
  preferredContactMethod String?  @map("preferred_contact_method")
  languagePreference    String?   @map("language_preference")
  createdAt             DateTime  @default(now()) @map("created_at")
  updatedAt             DateTime  @updatedAt @map("updated_at")

  patient               Patient   @relation(fields: [patientId], references: [id], onDelete: Cascade)
  
  @@index([patientId])
  @@map("patient_contacts")
}

model PatientDocument {
  id                    String    @id @default(uuid())
  patientId             String    @map("patient_id")
  documentType          String?   @map("document_type")
  fileName              String    @map("file_name")
  fileUrl               String    @map("file_url")
  fileSize              Int?      @map("file_size")
  mimeType              String?   @map("mime_type")
  uploadedBy            String    @map("uploaded_by")
  uploadedAt            DateTime  @default(now()) @map("uploaded_at")
  notes                 String?   @db.Text

  patient               Patient   @relation(fields: [patientId], references: [id], onDelete: Cascade)
  
  @@index([patientId])
  @@map("patient_documents")
}

model PatientTag {
  patientId             String    @map("patient_id")
  tag                   String
  createdAt             DateTime  @default(now()) @map("created_at")

  patient               Patient   @relation(fields: [patientId], references: [id], onDelete: Cascade)
  
  @@id([patientId, tag])
  @@map("patient_tags")
}

model PatientActivityLog {
  id                    String    @id @default(uuid())
  patientId             String    @map("patient_id")
  activityType          String    @map("activity_type")
  description           String?   @db.Text
  metadata              Json?
  createdBy             String    @map("created_by")
  createdAt             DateTime  @default(now()) @map("created_at")

  patient               Patient   @relation(fields: [patientId], references: [id], onDelete: Cascade)
  
  @@index([patientId, createdAt])
  @@map("patient_activity_log")
}

// PHASE 3: Scheduling
model Appointment {
  id                    String    @id @default(uuid())
  patientId             String    @map("patient_id")
  clinicianId           String    @map("clinician_id")
  date                  DateTime  @db.Date
  startTime             String    @map("start_time")
  endTime               String    @map("end_time")
  appointmentType       String    @map("appointment_type")
  format                String
  locationId            String?   @map("location_id")
  status                String    @default("scheduled")
  seriesId              String?   @map("series_id")
  notes                 String?   @db.Text
  createdAt             DateTime  @default(now()) @map("created_at")
  updatedAt             DateTime  @updatedAt @map("updated_at")

  patient               Patient   @relation(fields: [patientId], references: [id])
  clinician             User      @relation(fields: [clinicianId], references: [id])
  location              PracticeLocation? @relation(fields: [locationId], references: [id])
  participants          AppointmentParticipant[]
  reminders             AppointmentReminder[]
  history               AppointmentHistory[]
  
  @@index([clinicianId, date])
  @@index([patientId])
  @@map("appointments")
}

model AppointmentParticipant {
  id                    String    @id @default(uuid())
  appointmentId         String    @map("appointment_id")
  participantType       String    @map("participant_type")
  participantId         String?   @map("participant_id")
  participantName       String?   @map("participant_name")
  createdAt             DateTime  @default(now()) @map("created_at")

  appointment           Appointment @relation(fields: [appointmentId], references: [id], onDelete: Cascade)
  
  @@map("appointment_participants")
}

model AppointmentReminder {
  id                    String    @id @default(uuid())
  appointmentId         String    @map("appointment_id")
  reminderType          String    @map("reminder_type")
  sentAt                DateTime? @map("sent_at")
  createdAt             DateTime  @default(now()) @map("created_at")

  appointment           Appointment @relation(fields: [appointmentId], references: [id], onDelete: Cascade)
  
  @@map("appointment_reminders")
}

model AppointmentHistory {
  id                    String    @id @default(uuid())
  appointmentId         String    @map("appointment_id")
  changeType            String    @map("change_type")
  oldValue              String?   @map("old_value") @db.Text
  newValue              String?   @map("new_value") @db.Text
  reason                String?   @db.Text
  changedBy             String    @map("changed_by")
  changedAt             DateTime  @default(now()) @map("changed_at")

  appointment           Appointment @relation(fields: [appointmentId], references: [id], onDelete: Cascade)
  
  @@map("appointment_history")
}

// PHASE 4: Consultation Sessions
model ConsultationSession {
  id                    String    @id @default(uuid())
  patientId             String    @map("patient_id")
  clinicianId           String    @map("clinician_id")
  sessionDate           DateTime  @map("session_date") @db.Date
  duration              Int
  sessionType           String    @map("session_type")
  format                String
  location              String?
  notes                 String?   @db.Text
  createdAt             DateTime  @default(now()) @map("created_at")
  updatedAt             DateTime  @updatedAt @map("updated_at")

  patient               Patient   @relation(fields: [patientId], references: [id])
  clinician             User      @relation(fields: [clinicianId], references: [id])
  attachments           SessionAttachment[]
  
  @@index([patientId])
  @@index([clinicianId])
  @@map("consultation_sessions")
}

model SessionAttachment {
  id                    String    @id @default(uuid())
  sessionId             String    @map("session_id")
  fileType              String    @map("file_type")
  fileUrl               String    @map("file_url")
  uploadedAt            DateTime  @default(now()) @map("uploaded_at")

  session               ConsultationSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  
  @@map("session_attachments")
}

// PHASE 5: Assessments
model Assessment {
  id                    String    @id @default(uuid())
  patientId             String    @map("patient_id")
  assessmentType        String    @map("assessment_type")
  status                String    @default("in_progress")
  responses             Json      @default("{}")
  currentQuestion       Int?      @map("current_question")
  totalScore            Int?      @map("total_score")
  domainScores          Json?     @map("domain_scores")
  interpretation        String?   @db.Text
  completedAt           DateTime? @map("completed_at")
  createdAt             DateTime  @default(now()) @map("created_at")
  updatedAt             DateTime  @updatedAt @map("updated_at")

  patient               Patient   @relation(fields: [patientId], references: [id])
  
  @@index([patientId])
  @@index([assessmentType])
  @@map("assessments")
}
```

### Step 0.3: Environment Configuration

**Create `.env` file:**
```env
# Server
NODE_ENV=development
PORT=5000
API_VERSION=v1

# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/daira_dev?schema=public"

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=2h
REFRESH_TOKEN_SECRET=your-super-secret-refresh-token-key
REFRESH_TOKEN_EXPIRES_IN=30d

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760

# AWS S3 (optional - leave empty to use local storage)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
AWS_S3_BUCKET=

# Email (for verification - can mock for now)
EMAIL_FROM=noreply@daira.health
EMAIL_SERVICE=mock

# CORS
FRONTEND_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Create `.env.example`:**
```
(Same as above but with placeholder values)
```

### Step 0.4: Run Database Migrations

```bash
# Generate Prisma client
npx prisma generate

# Create and run migrations
npx prisma migrate dev --name init

# Seed database with dummy data (you'll create this)
npm run seed
```

---

## YOUR IMPLEMENTATION TASKS

### Task 1: Create Express Server

**File:** `src/app.ts`
```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import patientRoutes from './routes/patients.routes';
import appointmentRoutes from './routes/appointments.routes';
import sessionRoutes from './routes/sessions.routes';
import settingsRoutes from './routes/settings.routes';
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/patients', patientRoutes);
app.use('/api/v1/appointments', appointmentRoutes);
app.use('/api/v1/sessions', sessionRoutes);
app.use('/api/v1/settings', settingsRoutes);

// Error handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 API available at http://localhost:${PORT}/api/v1`);
});

export default app;
```

### Task 2: Implement Authentication

**File:** `src/controllers/auth.controller.ts`
```typescript
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, professionalTitle, phone } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: {
          code: 'USER_EXISTS',
          message: 'User with this email already exists'
        }
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user with profile
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        profile: {
          create: {
            firstName,
            lastName,
            professionalTitle,
            phone
          }
        }
      },
      include: {
        profile: true
      }
    });

    // Create user preferences
    await prisma.userPreferences.create({
      data: {
        userId: user.id
      }
    });

    // Log activity
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'USER_REGISTERED',
        resourceType: 'user',
        resourceId: user.id,
        ipAddress: req.ip,
        userAgent: req.get('user-agent')
      }
    });

    res.status(201).json({
      success: true,
      data: {
        user_id: user.id,
        email: user.email,
        status: user.status,
        message: 'Registration successful. Please verify your email.'
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'REGISTRATION_FAILED',
        message: 'Failed to register user'
      }
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        profile: true,
        credentials: {
          where: { verificationStatus: 'verified' }
        }
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password'
        }
      });
    }

    // Check password
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password'
        }
      });
    }

    // Generate tokens
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '2h' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '30d' }
    );

    // Store refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);
    
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt,
        ipAddress: req.ip,
        userAgent: req.get('user-agent')
      }
    });

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    // Log activity
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'USER_LOGIN',
        ipAddress: req.ip,
        userAgent: req.get('user-agent')
      }
    });

    res.json({
      success: true,
      data: {
        access_token: accessToken,
        refresh_token: refreshToken,
        token_type: 'Bearer',
        expires_in: 7200,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          status: user.status,
          profile: {
            first_name: user.profile?.firstName,
            last_name: user.profile?.lastName,
            professional_title: user.profile?.professionalTitle,
            verification_status: user.profile?.verificationStatus,
            photo_url: user.profile?.photoUrl
          }
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'LOGIN_FAILED',
        message: 'Failed to login'
      }
    });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId; // Set by auth middleware

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        credentials: {
          where: { verificationStatus: 'verified' }
        }
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
        email_verified: user.emailVerified,
        profile: user.profile,
        credentials: user.credentials
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'GET_USER_FAILED',
        message: 'Failed to get user'
      }
    });
  }
};
```

### Task 3: Create Seed Data

**File:** `prisma/seed.ts`
```typescript
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create demo clinician
  const password = await bcrypt.hash('Demo@123', 10);
  
  const clinician = await prisma.user.create({
    data: {
      email: 'demo@daira.health',
      passwordHash: password,
      role: 'clinician',
      status: 'active',
      emailVerified: true,
      profile: {
        create: {
          firstName: 'Jane',
          lastName: 'Rivera',
          professionalTitle: 'Clinical Psychologist',
          designation: 'Clinical Psychologist',
          specializations: ['ASD', 'ADHD', 'Speech Delays'],
          languages: ['English', 'Hindi', 'Marathi'],
          phone: '+91 98765 43210',
          yearsOfPractice: 8,
          bio: 'Dr. Jane Rivera is a licensed clinical psychologist specializing in autism spectrum disorders and developmental delays in children.',
          verificationStatus: 'verified',
          verifiedAt: new Date()
        }
      }
    }
  });

  // Create verified credential
  await prisma.credential.create({
    data: {
      userId: clinician.id,
      credentialType: 'RCI',
      credentialNumber: 'RCI/12345/2020',
      issuingAuthority: 'Rehabilitation Council of India',
      issueDate: new Date('2020-01-15'),
      expiryDate: new Date('2025-01-15'),
      verificationStatus: 'verified',
      verifiedAt: new Date()
    }
  });

  // Create practice location
  const location = await prisma.practiceLocation.create({
    data: {
      clinicianId: clinician.id,
      name: 'Rivera Clinic - Main Branch',
      addressLine1: '123 MG Road',
      city: 'Mumbai',
      state: 'Maharashtra',
      pinCode: '400001',
      roomInfo: 'Room 3',
      isPrimary: true
    }
  });

  // Create availability (Mon-Fri 9-5)
  for (let day = 1; day <= 5; day++) {
    await prisma.clinicianAvailability.create({
      data: {
        clinicianId: clinician.id,
        dayOfWeek: day,
        startTime: '09:00',
        endTime: '17:00',
        locationId: location.id
      }
    });
  }

  // Create user preferences
  await prisma.userPreferences.create({
    data: {
      userId: clinician.id
    }
  });

  // Create demo patients
  const patient1 = await prisma.patient.create({
    data: {
      clinicianId: clinician.id,
      firstName: 'Aarav',
      lastName: 'Kumar',
      dateOfBirth: new Date('2017-03-15'),
      gender: 'Male',
      primaryLanguage: 'Hindi',
      languagesSpoken: ['Hindi', 'English'],
      addressLine1: '456 Park Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      pinCode: '400002',
      udidNumber: 'MH-01-2024-012345',
      primaryConcerns: 'Speech delay, social interaction difficulties',
      referralSource: 'School referral',
      status: 'active',
      contacts: {
        create: {
          contactType: 'primary_parent',
          relationship: 'Mother',
          firstName: 'Priya',
          lastName: 'Kumar',
          phone: '+91 98765 43210',
          email: 'priya.kumar@email.com',
          isPrimaryContact: true,
          canReceiveUpdates: true,
          preferredContactMethod: 'email'
        }
      },
      tags: {
        create: [
          { tag: 'ASD' },
          { tag: 'Speech Delay' }
        ]
      }
    }
  });

  const patient2 = await prisma.patient.create({
    data: {
      clinicianId: clinician.id,
      firstName: 'Priya',
      lastName: 'Sharma',
      dateOfBirth: new Date('2016-07-22'),
      gender: 'Female',
      primaryLanguage: 'Hindi',
      languagesSpoken: ['Hindi', 'English'],
      addressLine1: '789 Lake Road',
      city: 'Mumbai',
      state: 'Maharashtra',
      pinCode: '400003',
      primaryConcerns: 'ADHD symptoms, attention difficulties',
      referralSource: 'Parent self-referral',
      status: 'active',
      contacts: {
        create: {
          contactType: 'primary_parent',
          relationship: 'Father',
          firstName: 'Rajesh',
          lastName: 'Sharma',
          phone: '+91 98765 43211',
          email: 'rajesh.sharma@email.com',
          isPrimaryContact: true
        }
      },
      tags: {
        create: [
          { tag: 'ADHD' }
        ]
      }
    }
  });

  // Create some appointments
  await prisma.appointment.create({
    data: {
      patientId: patient1.id,
      clinicianId: clinician.id,
      date: new Date('2024-12-31'),
      startTime: '10:30',
      endTime: '11:15',
      appointmentType: 'Speech Therapy',
      format: 'In-Person',
      locationId: location.id,
      status: 'scheduled',
      notes: 'Focus on sentence construction'
    }
  });

  // Create consultation session
  await prisma.consultationSession.create({
    data: {
      patientId: patient1.id,
      clinicianId: clinician.id,
      sessionDate: new Date('2024-12-20'),
      duration: 45,
      sessionType: 'Speech Therapy',
      format: 'In-Person',
      location: 'Room 3',
      notes: 'Good progress on expressive language. Patient using 3-4 word phrases consistently.'
    }
  });

  // Create assessment
  await prisma.assessment.create({
    data: {
      patientId: patient1.id,
      assessmentType: 'ISAA',
      status: 'completed',
      responses: {},
      totalScore: 72,
      domainScores: {
        social: 18,
        motor: 56,
        communication: 20,
        self_help: 28
      },
      interpretation: 'Mild ASD indicators. Level 1 - Requiring Support.',
      completedAt: new Date('2024-10-20')
    }
  });

  console.log('✅ Seed data created successfully!');
  console.log('\n📧 Demo Login Credentials:');
  console.log('Email: demo@daira.health');
  console.log('Password: Demo@123\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Add to `package.json`:
```json
{
  "scripts": {
    "seed": "ts-node prisma/seed.ts"
  },
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  }
}
```

### Task 4: Frontend Integration

**Update Frontend API Calls**

**File:** `frontend/src/services/api.ts` (create this)
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any[];
  };
}

class ApiClient {
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const token = localStorage.getItem('access_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw data;
      }

      return data;
    } catch (error: any) {
      if (error.error) {
        throw error;
      }
      throw {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: 'Failed to connect to server',
        },
      };
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(data: any) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMe() {
    return this.request('/auth/me');
  }

  // Patient endpoints
  async getPatients(params?: any) {
    const queryString = params ? `?${new URLSearchParams(params)}` : '';
    return this.request(`/patients${queryString}`);
  }

  async getPatient(id: string) {
    return this.request(`/patients/${id}`);
  }

  async createPatient(data: any) {
    return this.request('/patients', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Add more endpoints as needed...
}

export const apiClient = new ApiClient();
```

**Update LoginPage.tsx:**
```typescript
import { apiClient } from '../services/api';

// Inside component
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  try {
    const response = await apiClient.login(email, password);
    
    if (response.success && response.data) {
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      setView('dashboard');
    }
  } catch (error: any) {
    setError(error.error?.message || 'Login failed');
  } finally {
    setLoading(false);
  }
};
```

### Task 5: Testing

**File:** `tests/auth.test.ts`
```typescript
import request from 'supertest';
import app from '../src/app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Authentication', () => {
  beforeAll(async () => {
    // Clean up test data
    await prisma.user.deleteMany({
      where: { email: 'test@example.com' }
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Test@123',
          firstName: 'Test',
          lastName: 'User',
          professionalTitle: 'Psychologist'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('user_id');
    });

    it('should reject duplicate email', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Test@123',
          firstName: 'Test',
          lastName: 'User'
        });

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'demo@daira.health',
          password: 'Demo@123'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('access_token');
      expect(response.body.data).toHaveProperty('refresh_token');
    });

    it('should reject invalid credentials', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'demo@daira.health',
          password: 'WrongPassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});
```

Run tests:
```bash
npm test
```

---

## FINAL DELIVERABLES

When you're done, create these documentation files:

### 1. SETUP.md

```markdown
# Daira Backend Setup Guide

## Prerequisites Installed
- Node.js 18+
- PostgreSQL 14+
- npm/yarn

## What's Been Done
✅ Backend built with Express + TypeScript
✅ Database schema created with Prisma
✅ Authentication implemented (JWT)
✅ 50+ API endpoints created
✅ Dummy data seeded
✅ Frontend integrated
✅ Tests written and passing

## Quick Start

### 1. Clone and Install
\`\`\`bash
cd backend
npm install
\`\`\`

### 2. Database Setup
\`\`\`bash
# Create PostgreSQL database
createdb daira_dev

# Run migrations
npx prisma migrate dev

# Seed dummy data
npm run seed
\`\`\`

### 3. Start Server
\`\`\`bash
npm run dev
\`\`\`

Server runs on: http://localhost:5000
API available at: http://localhost:5000/api/v1

### 4. Start Frontend
\`\`\`bash
cd ../daira---neurodevelopmental-screening-2
npm install
npm run dev
\`\`\`

Frontend runs on: http://localhost:5173

### 5. Login with Demo Account
Email: demo@daira.health
Password: Demo@123

## What YOU Need to Provide for Production

### Environment Variables
Create `.env` file with:
\`\`\`
DATABASE_URL=<your-production-postgres-url>
JWT_SECRET=<generate-strong-secret>
REFRESH_TOKEN_SECRET=<generate-strong-secret>
AWS_ACCESS_KEY_ID=<for-file-uploads>
AWS_SECRET_ACCESS_KEY=<for-file-uploads>
AWS_S3_BUCKET=<your-bucket-name>
\`\`\`

Generate secrets:
\`\`\`bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
\`\`\`

### Production Database
- PostgreSQL instance
- Run migrations: \`npx prisma migrate deploy\`
- Do NOT seed in production

### File Storage
- Configure AWS S3 bucket OR
- Set up local storage with backups

### Email Service
- Set up SendGrid/AWS SES
- Update email configuration in code

### Deployment
- Set NODE_ENV=production
- Use PM2 or similar for process management
- Set up SSL/HTTPS
- Configure CORS for production domain

## API Documentation
Full API docs available at: /api/v1/docs (if Swagger configured)
Or see: BACKEND_API_SPECIFICATION.md

## Testing
\`\`\`bash
npm test
\`\`\`

## Troubleshooting
- Database connection: Check DATABASE_URL
- CORS errors: Update FRONTEND_URL in .env
- Token errors: Check JWT_SECRET is set
\`\`\`

### 2. API_ENDPOINTS.md

List all endpoints with examples

### 3. DATABASE_SCHEMA.md

Document all tables and relationships

---

## SUCCESS CRITERIA

Your implementation is complete when:

✅ Backend server starts without errors
✅ All database migrations run successfully
✅ Seed data creates demo account and patients
✅ Frontend can:
  - Register new user
  - Login with demo@daira.health
  - See dashboard with dummy data
  - View patient list
  - View patient profile
  - Create new patient
  - Book appointment
  - All 49 components load without errors
✅ API returns proper JSON responses
✅ Authentication works (JWT tokens)
✅ File uploads work (credentials, documents)
✅ Tests pass (at least auth and patient CRUD)
✅ Documentation complete

---

## AUTOMATION CHECKLIST

As an AI agent, you should:

1. ✅ Create all backend files
2. ✅ Implement all Phase 0 + Phase 1 endpoints
3. ✅ Set up database schema
4. ✅ Create seed data
5. ✅ Write frontend API integration layer
6. ✅ Update frontend components to use real API
7. ✅ Write basic tests
8. ✅ Create documentation
9. ✅ Test end-to-end flow
10. ✅ Generate SETUP.md with instructions

---

## NOTES

- Use TypeScript throughout
- Follow RESTful conventions
- Implement proper error handling
- Add request validation
- Log all actions to audit_log
- Use transactions for multi-step operations
- Implement rate limiting
- Add API documentation comments
- Follow security best practices
- Make code production-ready

---

Ready to start? Begin with Phase 0: Foundation and work through each task systematically. Good luck! 🚀
