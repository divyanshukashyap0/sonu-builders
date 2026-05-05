const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: '.env.local' });

cloudinary.config({
  cloud_name: process.env.VITE_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.VITE_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const logoPath = path.join(process.cwd(), 'logo.png');

cloudinary.uploader.upload(logoPath, {
  public_id: 'website_watermark_logo',
  folder: 'branding'
})
.then(result => {
  console.log('SUCCESS');
  console.log('Public ID:', result.public_id);
})
.catch(err => {
  console.error('FAILED');
  console.error(err);
});
