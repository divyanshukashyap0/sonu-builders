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

  const timestamp = Math.round(new Date().getTime() / 1000);
  const { folder, public_id } = req.body;
  const api_secret = process.env.CLOUDINARY_API_SECRET;

  if (!api_secret) {
    return res.status(500).json({ error: 'Server configuration error: Secret missing' });
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

  const signature = cloudinary.utils.api_sign_request(paramsToSign, api_secret);

  return res.status(200).json({
    signature,
    timestamp,
    cloud_name: process.env.VITE_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.VITE_CLOUDINARY_API_KEY,
    folder: paramsToSign.folder,
    public_id: paramsToSign.public_id
  });
}
