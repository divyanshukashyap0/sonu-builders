import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.VITE_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.VITE_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { public_id, resource_type } = req.body;

  if (!public_id) {
    return res.status(400).json({ error: 'public_id is required' });
  }

  try {
    const result = await cloudinary.uploader.destroy(public_id, {
      resource_type: resource_type || 'image'
    });
    return res.status(200).json(result);
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return res.status(500).json({ error: 'Failed to delete asset', details: error.message });
  }
}
