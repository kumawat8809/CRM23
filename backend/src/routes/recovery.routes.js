import { Router } from 'express';
import { prisma } from '../config/db.js';
import { auth } from '../middleware/auth.js';
import { calculateRecoveryPrice } from '../utils/calculations.js';

const router = Router();
router.use(auth());

router.get('/', async (req, res) => {
  const cases = await prisma.dataRecoveryCase.findMany({ include: { customer: true }, orderBy: { createdAt: 'desc' } });
  res.json(cases);
});

router.post('/', async (req, res) => {
  const dataSizeGb = Number(req.body.dataSizeGb);
  const price = req.body.price || calculateRecoveryPrice(dataSizeGb);
  const recoveryCase = await prisma.dataRecoveryCase.create({
    data: {
      ...req.body,
      dataSizeGb,
      price
    }
  });

  res.status(201).json(recoveryCase);
});

router.patch('/:id/status', async (req, res) => {
  const recoveryCase = await prisma.dataRecoveryCase.update({
    where: { id: req.params.id },
    data: {
      status: req.body.status,
      success: req.body.success,
      notes: req.body.notes
    }
  });

  res.json(recoveryCase);
});

export default router;
