import { Router } from 'express';
import { prisma } from '../config/db.js';
import { auth } from '../middleware/auth.js';
import { calculateInvoice } from '../utils/calculations.js';
import { generateInvoicePdf } from '../services/pdfService.js';
import { queueNotification } from '../services/notificationService.js';

const router = Router();
router.use(auth());

router.get('/', async (req, res) => {
  const data = await prisma.invoice.findMany({
    include: { customer: true, items: true },
    orderBy: { createdAt: 'desc' }
  });
  res.json(data);
});

router.post('/', async (req, res) => {
  const {
    customerId,
    jobId,
    items,
    type,
    gstEnabled,
    gstPercent,
    businessName,
    gstin,
    businessLogo,
    businessAddr
  } = req.body;

  const calc = calculateInvoice(items, gstEnabled, gstPercent);
  const invoice = await prisma.invoice.create({
    data: {
      customerId,
      jobId,
      type,
      subtotal: calc.subtotal,
      gstPercent: calc.gstPercent,
      gstAmount: calc.gstAmount,
      total: calc.total,
      businessName,
      gstin,
      businessLogo,
      businessAddr,
      items: {
        create: calc.normalizedItems
      }
    },
    include: { customer: true, items: true }
  });

  await queueNotification({
    channel: 'EMAIL',
    recipient: invoice.customer.phone,
    message: `Invoice #${invoice.invoiceNumber} generated for ₹${invoice.total}`,
    referenceId: invoice.id
  });

  res.status(201).json(invoice);
});

router.get('/:id/pdf', async (req, res) => {
  const invoice = await prisma.invoice.findUnique({
    where: { id: req.params.id },
    include: { customer: true, items: true }
  });

  const pdf = await generateInvoicePdf(invoice);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=invoice-${invoice.invoiceNumber}.pdf`);
  res.send(pdf);
});

export default router;
