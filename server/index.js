import express from 'express';
import cors from 'cors';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.VITE_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.VITE_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Generate a signature for client-side signed uploads
 * This is more secure than unsigned uploads
 */
app.post('/api/cloudinary/sign', (req, res) => {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const { folder, public_id } = req.body;
  const api_secret = process.env.CLOUDINARY_API_SECRET;

  if (!api_secret) {
    console.error('ERROR: CLOUDINARY_API_SECRET is missing from .env.local');
    return res.status(500).json({ error: 'Server configuration error' });
  }
  
  const paramsToSign = {
    timestamp,
  };

  if (public_id) {
    paramsToSign.public_id = public_id;
  } else if (folder) {
    paramsToSign.folder = folder;
  } else {
    paramsToSign.folder = 'sonu_builders_media';
  }

  // Generate signature using explicit secret
  const signature = cloudinary.utils.api_sign_request(paramsToSign, api_secret);

  res.json({
    signature,
    timestamp,
    cloud_name: process.env.VITE_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.VITE_CLOUDINARY_API_KEY,
    folder: paramsToSign.folder,
    public_id: paramsToSign.public_id
  });
});

/**
 * Securely delete an image from Cloudinary
 */
app.post('/api/cloudinary/delete', async (req, res) => {
  const { public_id, resource_type } = req.body;

  if (!public_id) {
    return res.status(400).json({ error: 'public_id is required' });
  }

  try {
    console.log('Attempting Cloudinary delete:', { public_id, resource_type: resource_type || 'image' });
    const result = await cloudinary.uploader.destroy(public_id, {
      resource_type: resource_type || 'image'
    });
    console.log('Cloudinary delete result:', result);
    res.json(result);
  } catch (error) {
    console.error('Cloudinary delete error details:', error);
    res.status(500).json({ error: 'Failed to delete image', details: error.message });
  }
});

app.listen(port, () => {
  console.log(`Cloudinary Backend running on port ${port}`);
});
