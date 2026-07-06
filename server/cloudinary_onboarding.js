import { v2 as cloudinary } from 'cloudinary';

// Inline Cloudinary credentials for the onboarding flow.
cloudinary.config({
  cloud_name: 'dlh0o3f8e',
  api_key: '236755849723764',
  api_secret: 'VdeYXorwXIN6gMhM6iJuNCR0g7k'
});

async function main() {
  const sampleImageUrl = 'https://res.cloudinary.com/demo/image/upload/sample.jpg';

  console.log('Uploading sample image...');

  const uploadResult = await cloudinary.uploader.upload(sampleImageUrl, {
    resource_type: 'image'
  });

  console.log('Uploaded secure URL:', uploadResult.secure_url);
  console.log('Uploaded public ID:', uploadResult.public_id);

  const details = await cloudinary.api.resource(uploadResult.public_id, {
    resource_type: 'image'
  });

  console.log('Image width:', details.width);
  console.log('Image height:', details.height);
  console.log('Image format:', details.format);
  console.log('Image file size (bytes):', details.bytes);

  // f_auto chooses the best output format automatically.
  // q_auto chooses an optimized quality setting automatically.
  const transformedUrl = cloudinary.url(uploadResult.public_id, {
    resource_type: 'image',
    secure: true,
    transformation: [
      { fetch_format: 'auto', quality: 'auto' }
    ]
  });

  console.log('Done! Click link below to see optimized version of the image. Check the size and the format.');
  console.log('Transformed URL:', transformedUrl);
}

main().catch((error) => {
  console.error('Cloudinary onboarding failed:');
  console.error('name:', error?.name);
  console.error('message:', error?.message);
  console.error('http_code:', error?.http_code);
  console.error('details:', error);
  process.exit(1);
});
