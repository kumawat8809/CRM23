import { Router } from 'express';
import multer from 'multer';
import { prisma } from '../config/db.js';
import { auth } from '../middleware/auth.js';
import { jobImageStorage } from '../config/cloudinary.js';
import { queueNotification } from '../services/notificationService.js';

const router = Router();
const upload = multer({ storage: jobImageStorage });
router.use(auth());

router.get('/', async (req, res) => {
  const jobs = await prisma.job.findMany({
    include: { customer: true, technician: true, images: true, history: true },
    orderBy: { createdAt: 'desc' }
  });
  res.json(jobs);
});

router.post('/', async (req, res) => {
  const job = await prisma.job.create({
    data: {
      customerId: req.body.customerId,
      deviceType: req.body.deviceType,
      imeiSerial: req.body.imeiSerial,
      problem: req.body.problem,
      estimatedCost: req.body.estimatedCost,
      technicianId: req.body.technicianId,
      notes: req.body.notes
    },
    include: { customer: true }
  });

  await prisma.jobHistory.create({
    data: { jobId: job.id, status: 'PENDING', note: 'Job created', changedById: req.user.id }
  });

  await queueNotification({
    channel: 'SMS',
    recipient: job.customer.phone,
    message: `Your service job #${job.jobNumber} has been created.`,
    referenceId: job.id
  });

  res.status(201).json(job);
});

router.patch('/:id/status', async (req, res) => {
  const { status, note } = req.body;
  const job = await prisma.job.update({
    where: { id: req.params.id },
    data: { status },
    include: { customer: true }
  });

  await prisma.jobHistory.create({
    data: { jobId: job.id, status, note, changedById: req.user.id }
  });

  if (status === 'COMPLETED') {
    await queueNotification({
      channel: 'WHATSAPP',
      recipient: job.customer.phone,
      message: `Job #${job.jobNumber} is completed and ready for delivery.`,
      referenceId: job.id
    });
  }

  res.json(job);
});

router.post('/:jobId/images', upload.array('images', 10), async (req, res) => {
  const type = req.body.type;
  const files = req.files || [];

  const saved = await prisma.$transaction(
    files.map((file) =>
      prisma.jobImage.create({
        data: {
          jobId: req.params.jobId,
          type,
          url: file.path,
          publicId: file.filename
        }
      })
    )
  );

  res.status(201).json(saved);
});

export default router;
