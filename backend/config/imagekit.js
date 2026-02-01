import ImageKit from 'imagekit';
import dotenv from 'dotenv';

dotenv.config({ path: './.env.local' });

let imagekit;

if (process.env.IMAGEKIT_PUBLIC_KEY && process.env.IMAGEKIT_PRIVATE_KEY && process.env.IMAGEKIT_URL_ENDPOINT) {
  imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
  });
  console.log("ImageKit connected successfully!");
} else {
  // Fallback stub for development when ImageKit is not configured
  console.warn('ImageKit credentials not found. Using fallback uploader that returns placeholder URLs.');
  imagekit = {
    upload: async ({ fileName }) => ({ url: `https://placehold.co/1200x800?text=${encodeURIComponent(fileName || 'image')}` })
  };
}

export default imagekit;