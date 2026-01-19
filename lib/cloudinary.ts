import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

export async function uploadImage(base64Image: string): Promise<string> {
  try {
    const result = await cloudinary.uploader.upload(base64Image, {
      folder: 'nupurbakery/products',
      transformation: [
        { width: 800, height: 800, crop: 'limit' }, // Max dimensions
        { quality: 'auto' }, // Auto optimize quality
        { fetch_format: 'auto' } // Auto format (webp, etc.)
      ]
    });
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image');
  }
}

export async function deleteImage(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Cloudinary delete error:', error);
  }
}

// Extract public ID from Cloudinary URL for deletion
export function getPublicIdFromUrl(url: string): string | null {
  try {
    const matches = url.match(/\/nupurbakery\/products\/([^.]+)/);
    return matches ? `nupurbakery/products/${matches[1]}` : null;
  } catch {
    return null;
  }
}
