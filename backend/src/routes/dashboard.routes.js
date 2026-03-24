import { Router } from 'express';
import { prisma } from '../config/db.js';
import { auth } from '../middleware/auth.js';

const router = Router();
router.use(auth());

router.get('/', async (req, res) => {
  const [
    totalJobs,
    pendingRepairs,
    completedJobs,
    totalSales,
    totalRevenueAgg,
    lowStock,
    todayInvoices,
    monthlyInvoices
  ] = await Promise.all([
    prisma.job.count(),
    prisma.job.count({ where: { status: { in: ['PENDING', 'IN_PROGRESS'] } } }),
    prisma.job.count({ where: { status: 'COMPLETED' } }),
    prisma.sale.count(),
    prisma.invoice.aggregate({ _sum: { total: true } }),
    prisma.inventoryItem.count({ where: { quantity: { lte: 5 } } }),
    prisma.invoice.findMany({ where: { createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } } }),
    prisma.invoice.findMany({
      where: {
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }
    })
  ]);

  res.json({
    totalJobs,
    pendingRepairs,
    completedJobs,
    totalSales,
    totalRevenue: totalRevenueAgg._sum.total || 0,
    lowStock,
    dailyRevenue: todayInvoices.reduce((sum, i) => sum + Number(i.total), 0),
    monthlyRevenue: monthlyInvoices.reduce((sum, i) => sum + Number(i.total), 0)
  });
});

export default router;
