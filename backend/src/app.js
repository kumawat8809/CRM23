import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import authRoutes from './routes/auth.routes.js';
import customerRoutes from './routes/customers.routes.js';
import jobRoutes from './routes/jobs.routes.js';
import invoiceRoutes from './routes/invoices.routes.js';
import salesRoutes from './routes/sales.routes.js';
import inventoryRoutes from './routes/inventory.routes.js';
import recoveryRoutes from './routes/recovery.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import reportsRoutes from './routes/reports.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: env.clientUrl }));
app.use(express.json({ limit: '15mb' }));
app.use(morgan('dev'));

app.get('/api/health', (_, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/recovery', recoveryRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports', reportsRoutes);

app.use(errorHandler);

export default app;
