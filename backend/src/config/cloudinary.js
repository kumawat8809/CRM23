import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { env } from './env.js';

cloudinary.config({
  cloud_name: env.cloudinary.cloudName,
  api_key: env.cloudinary.apiKey,
  api_secret: env.cloudinary.apiSecret
});

export const jobImageStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: 'data-migrator/jobs',
    public_id: `${req.params.jobId || 'unassigned'}-${Date.now()}-${file.originalname}`,
    resource_type: 'image'
  })
});

export { cloudinary };
