# Data Migrator CRM + Billing System

Full-stack CRM and billing app for **Data Migrator** (mobile repair, sale/purchase, and data recovery).

## Stack
- Frontend: React + Vite (mobile-first responsive admin panel)
- Backend: Node.js + Express
- Database: PostgreSQL + Prisma ORM
- Cloud storage: Cloudinary for pre/post repair images
- Auth: JWT with role-based access (Admin/Staff)

## Features Implemented
- **Dashboard**: total jobs, sales, revenue, pending/completed, low stock, daily/monthly revenue.
- **Job Management**: create jobs, status tracking, technician assignment, notes/history, pre/post image upload.
- **Billing**: GST/NON-GST invoices, auto calculations, invoice numbering, PDF download.
- **Sales Module**: new/old device sale tracking, condition capture, profit margin.
- **Inventory**: products, stock movement in/out, low-stock highlighting, supplier-ready schema.
- **Data Recovery**: case number generation, size capture, dynamic pricing helper, success/failure tracking.
- **Customers**: search by phone/name with job and invoice history.
- **Notifications**: queue logs for SMS/WhatsApp/email events (provider hooks ready).
- **Reports**: analytics endpoint + GST Excel export.
- **Security**: JWT auth, role middleware, helmet/cors, environment-based config.
- **Exports**: GST Excel export and invoice PDF generation.

## Project Structure
- `backend/` Express API, Prisma schema, services
- `frontend/` React admin app

## Setup
1. Start PostgreSQL:
   ```bash
   docker compose up -d
   ```
2. Install dependencies:
   ```bash
   npm run install:all
   ```
3. Configure backend env:
   ```bash
   cp backend/.env.example backend/.env
   ```
4. Run DB migrations and seed:
   ```bash
   cd backend
   npx prisma migrate dev --name init
   npm run seed
   ```
5. Run apps in separate terminals:
   ```bash
   npm run dev:backend
   npm run dev:frontend
   ```

## Default Login
- Email: `admin@datamigrator.com`
- Password: `admin123`

## Vercel Deployment (Fix for `NOT_FOUND`)
This repo is a monorepo, so deployment can fail with `NOT_FOUND` if Vercel is pointed at the wrong output.

### Option A (Recommended): deploy only frontend app
1. In Vercel project settings, set **Root Directory** to `frontend`.
2. Build command: `npm run build`
3. Output directory: `dist`
4. Set env var `VITE_API_BASE_URL` to your deployed backend URL.
5. Keep `frontend/vercel.json` rewrite so React routes like `/jobs` and `/inventory` resolve to `index.html`.

### Option B: deploy from repository root
- Use the root `vercel.json` included in this repo.
- It builds frontend from root and outputs `frontend/dist`.
- It also rewrites all non-file routes to `index.html`.

## Why `NOT_FOUND` happened
- If Vercel deploys from root without correct build/output settings, no static files are served for your app route.
- For SPA routes (`/jobs`, `/customers`), Vercel looks for a physical file unless rewrite fallback is configured.
- Both are addressed by the added `vercel.json` files.

## Deployment
- Frontend deployable on **Vercel**.
- Backend deployable to Node hosts (Render/Railway/Fly) with PostgreSQL and Cloudinary env vars.
- Set `VITE_API_BASE_URL` in frontend env to point to backend API URL.

## Important API Endpoints
- `POST /api/auth/login`
- `GET /api/dashboard`
- `POST /api/jobs`
- `POST /api/jobs/:jobId/images`
- `POST /api/invoices`
- `GET /api/invoices/:id/pdf`
- `POST /api/sales`
- `POST /api/inventory/:id/movement`
- `POST /api/recovery`
- `GET /api/reports/gst/export`

## Notes
- Barcode/IMEI scanner support can be added on frontend by integrating camera scanner libraries (e.g. html5-qrcode) and posting to existing IMEI fields.
- Backup strategy: schedule PostgreSQL dumps + Cloudinary backup policy.
