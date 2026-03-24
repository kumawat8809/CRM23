import { Router } from 'express';
import { prisma } from '../config/db.js';
import { auth } from '../middleware/auth.js';

const router = Router();
router.use(auth());

router.get('/', async (req, res) => {
  const items = await prisma.inventoryItem.findMany({ include: { supplier: true }, orderBy: { updatedAt: 'desc' } });
  res.json(items);
});

router.get('/alerts/low-stock', async (req, res) => {
  const low = await prisma.$queryRaw`
    SELECT * FROM "InventoryItem"
    WHERE quantity <= "reorderLevel"
    ORDER BY "updatedAt" DESC
  `;
  res.json(low);
});

router.post('/', async (req, res) => {
  const item = await prisma.inventoryItem.create({ data: req.body });
  res.status(201).json(item);
});

router.post('/:id/movement', async (req, res) => {
  const { quantity, movementType, note } = req.body;
  const qty = Number(quantity);

  const result = await prisma.$transaction(async (tx) => {
    const updated = await tx.inventoryItem.update({
      where: { id: req.params.id },
      data: {
        quantity: movementType === 'IN' ? { increment: qty } : { decrement: qty }
      }
    });

    const movement = await tx.stockMovement.create({
      data: {
        inventoryItemId: req.params.id,
        quantity: qty,
        movementType,
        note
      }
    });

    return { updated, movement };
  });

  res.status(201).json(result);
});

export default router;
