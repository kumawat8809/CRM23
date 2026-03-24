import { Router } from 'express';
import ExcelJS from 'exceljs';
import { prisma } from '../config/db.js';
import { auth } from '../middleware/auth.js';

const router = Router();
router.use(auth(['ADMIN']));

router.get('/analytics', async (req, res) => {
  const [repairs, sales, invoices] = await Promise.all([
    prisma.job.groupBy({ by: ['status'], _count: true }),
    prisma.sale.aggregate({ _sum: { salePrice: true, profitMargin: true }, _count: true }),
    prisma.invoice.groupBy({ by: ['type'], _sum: { gstAmount: true, total: true } })
  ]);

  res.json({ repairs, sales, invoices });
});

router.get('/gst/export', async (req, res) => {
  const invoices = await prisma.invoice.findMany({ where: { type: 'GST' }, include: { customer: true } });
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('GST Report');

  sheet.columns = [
    { header: 'Invoice #', key: 'invoiceNumber', width: 12 },
    { header: 'Customer', key: 'customer', width: 20 },
    { header: 'GSTIN', key: 'gstin', width: 20 },
    { header: 'GST Amount', key: 'gstAmount', width: 12 },
    { header: 'Total', key: 'total', width: 12 }
  ];

  invoices.forEach((inv) => {
    sheet.addRow({
      invoiceNumber: inv.invoiceNumber,
      customer: inv.customer.name,
      gstin: inv.gstin || '-',
      gstAmount: Number(inv.gstAmount),
      total: Number(inv.total)
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=gst-report.xlsx');
  res.send(buffer);
});

export default router;
