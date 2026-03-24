import { Router } from 'express';
import { prisma } from '../config/db.js';
import { auth } from '../middleware/auth.js';

const router = Router();
router.use(auth());

router.get('/', async (req, res) => {
  const sales = await prisma.sale.findMany({ include: { customer: true }, orderBy: { createdAt: 'desc' } });
  res.json(sales);
});

router.post('/', async (req, res) => {
  const purchasePrice = Number(req.body.purchasePrice || 0);
  const salePrice = Number(req.body.salePrice || 0);
  const sale = await prisma.sale.create({
    data: {
      ...req.body,
      purchasePrice,
      salePrice,
      profitMargin: salePrice - purchasePrice
    }
  });
  res.status(201).json(sale);
});

export default router;
