require('dotenv').config({ path: '.env.local' });
const cloudinary = require('cloudinary').v2;
const path = require('path');

cloudinary.config({
  cloud_name: process.env.VITE_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.VITE_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const logoPath = path.join(__dirname, '..', 'logo.png');

async function uploadLogo() {
  try {
    console.log('Uploading logo to Cloudinary...');
    const result = await cloudinary.uploader.upload(logoPath, {
      public_id: 'website_watermark_logo',
      folder: 'branding'
    });
    console.log('Logo uploaded successfully!');
    console.log('Public ID:', result.public_id);
    console.log('URL:', result.secure_url);
  } catch (error) {
    console.error('Error uploading logo:', error);
  }
}

uploadLogo();
