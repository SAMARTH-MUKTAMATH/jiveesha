# Daira Backend Setup Guide

Complete setup instructions for the Daira neurodevelopmental screening platform backend.

## Prerequisites

- **Node.js** 18+ 
- **PostgreSQL** 14+
- **npm** or **yarn**

## What's Included

| Component | Description |
|-----------|-------------|
| Express.js Backend | TypeScript REST API |
| Prisma ORM | Database access & migrations |
| JWT Authentication | Secure token-based auth |
| 25+ API Endpoints | Full CRUD for all resources |
| Seed Data | Demo clinician & patients |
| API Client | Frontend service layer |

---

## Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Database Setup

Create a PostgreSQL database:

```bash
createdb daira_dev
```

Update `.env` if needed (default settings should work):

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/daira_dev?schema=public"
```

### 3. Run Migrations

```bash
cd backend
npx prisma generate
npx prisma migrate dev --name init
```

### 4. Seed Database

```bash
npm run seed
```

### 5. Start Backend Server

```bash
npm run dev
```

Server runs at: **http://localhost:5000**  
API available at: **http://localhost:5000/api/v1**

### 6. Start Frontend

```bash
cd ../Frontend
npm install
npm run dev
```

Frontend runs at: **http://localhost:5173**

---

## Demo Login

| Field | Value |
|-------|-------|
| Email | `demo@daira.health` |
| Password | `Demo@123` |

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new clinician |
| POST | `/auth/login` | Login |
| POST | `/auth/logout` | Logout |
| POST | `/auth/refresh-token` | Refresh JWT |
| GET | `/auth/me` | Get current user |

### Patients
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/patients` | List patients (with search/filter) |
| POST | `/patients` | Create patient |
| GET | `/patients/:id` | Get patient details |
| PUT | `/patients/:id` | Update patient |
| DELETE | `/patients/:id` | Archive patient |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard/stats` | Dashboard metrics |
| GET | `/dashboard/today-schedule` | Today's appointments |
| GET | `/dashboard/recent-activity` | Activity log |

### Appointments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/appointments` | List appointments |
| POST | `/appointments` | Create appointment |
| GET | `/appointments/calendar` | Calendar view |
| GET | `/appointments/slots` | Available time slots |

---

## Project Structure

```
backend/
├── src/
│   ├── app.ts              # Express app entry
│   ├── config/             # Database config
│   ├── middleware/         # Auth, error handling
│   ├── routes/             # API routes
│   └── controllers/        # Request handlers
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Demo data
├── .env                    # Environment vars
└── package.json
```

---

## Production Deployment

### Required Environment Variables

Generate secure secrets:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Update `.env`:

```env
NODE_ENV=production
DATABASE_URL=<production-postgres-url>
JWT_SECRET=<generated-secret>
REFRESH_TOKEN_SECRET=<generated-secret>
FRONTEND_URL=<production-frontend-url>
```

### Build & Run

```bash
npm run build
npm start
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Database connection | Check `DATABASE_URL` in `.env` |
| CORS errors | Update `FRONTEND_URL` in `.env` |
| Token errors | Verify `JWT_SECRET` is set |
| Prisma errors | Run `npx prisma generate` |
