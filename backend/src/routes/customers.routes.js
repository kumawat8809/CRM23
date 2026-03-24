import { Router } from 'express';
import { prisma } from '../config/db.js';
import { auth } from '../middleware/auth.js';

const router = Router();
router.use(auth());

router.get('/', async (req, res) => {
  const q = req.query.q;
  const customers = await prisma.customer.findMany({
    where: q
      ? { OR: [{ phone: { contains: q } }, { name: { contains: q, mode: 'insensitive' } }] }
      : undefined,
    include: { jobs: true, invoices: true }
  });
  res.json(customers);
});

router.post('/', async (req, res) => {
  const customer = await prisma.customer.create({ data: req.body });
  res.status(201).json(customer);
});

export default router;
