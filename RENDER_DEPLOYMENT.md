# Render Deployment Guide

Deploy the Daira Clinical Platform on Render with these steps.

## Prerequisites

- GitHub/GitLab repository with your code
- Render account ([sign up free](https://render.com))

---

## Quick Deploy with Blueprint

1. Push your code to GitHub/GitLab
2. Go to [Render Dashboard](https://dashboard.render.com/)
3. Click **New** → **Blueprint**
4. Connect your repository
5. Render will detect `render.yaml` and create all services

---

## Manual Deployment

### Step 1: Create PostgreSQL Database

1. **New** → **PostgreSQL**
2. Configure:
   - Name: `daira-db`
   - Database: `daira_production`
   - User: `daira_user`
3. Copy the **Internal Database URL**

### Step 2: Deploy Backend

1. **New** → **Web Service**
2. Connect repository
3. Configure:

| Setting | Value |
|---------|-------|
| Name | `daira-backend` |
| Root Directory | `backend` |
| Runtime | Node |
| Build Command | `npm install && npx prisma generate && npm run build` |
| Start Command | `npx prisma migrate deploy && npm run start` |

4. Add Environment Variables:

| Variable | Value |
|----------|-------|
| `NODE_ENV` | `production` |
| `PORT` | `10000` |
| `DATABASE_URL` | *(paste Internal Database URL)* |
| `JWT_SECRET` | *(generate 32+ char secret)* |
| `JWT_EXPIRES_IN` | `2h` |
| `REFRESH_TOKEN_SECRET` | *(generate another secret)* |
| `REFRESH_TOKEN_EXPIRES_IN` | `30d` |
| `FRONTEND_URL` | *(add after frontend deploys)* |

### Step 3: Deploy Frontend

1. **New** → **Static Site**
2. Connect repository
3. Configure:

| Setting | Value |
|---------|-------|
| Name | `daira-frontend` |
| Root Directory | `Frontend` |
| Build Command | `npm install && npm run build` |
| Publish Directory | `dist` |

4. Add Environment Variable:

| Variable | Value |
|----------|-------|
| `VITE_API_URL` | `https://daira-backend.onrender.com/api/v1` |

### Step 4: Update CORS

Go back to backend service and set:
- `FRONTEND_URL` = `https://daira-frontend.onrender.com`

---

## Post-Deployment

### Seed Database (Optional)

If you need initial data, run in backend service shell:

```bash
npx prisma db seed
```

### Verify Deployment

1. Check backend health: `https://your-backend.onrender.com/health`
2. Open frontend and test login

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Build fails | Check build logs for missing dependencies |
| Database connection error | Verify DATABASE_URL is correct |
| CORS errors | Ensure FRONTEND_URL matches exactly |
| 404 on refresh | SPA routing should work with `_redirects` file |

---

## Environment Variables Reference

### Backend

```env
NODE_ENV=production
PORT=10000
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=your-super-secret-key-min-32-chars
JWT_EXPIRES_IN=2h
REFRESH_TOKEN_SECRET=another-super-secret-key
REFRESH_TOKEN_EXPIRES_IN=30d
FRONTEND_URL=https://your-frontend.onrender.com
```

### Frontend

```env
VITE_API_URL=https://your-backend.onrender.com/api/v1
```
