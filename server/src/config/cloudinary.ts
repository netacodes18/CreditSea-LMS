import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string
});

export const uploadToCloudinary = (buffer: Buffer, folder: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'auto', type: 'private' },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

export const getSignedUrl = (publicIdOrUrl: string): string => {
  let publicId = publicIdOrUrl;
  // If it's a URL, attempt to extract the public_id
  if (publicIdOrUrl.startsWith('http')) {
    const parts = publicIdOrUrl.split('/');
    const uploadIndex = parts.findIndex(p => p === 'upload');
    if (uploadIndex !== -1) {
      // Remove version (e.g. v123456789) and take the rest
      const relevantParts = parts.slice(uploadIndex + 1);
      if (relevantParts[0]?.match(/^v\d+$/)) {
        relevantParts.shift();
      }
      // Remove extension
      publicId = relevantParts.join('/').replace(/\.[^/.]+$/, "");
    }
  }

  return cloudinary.utils.private_download_url(
    publicId,
    'auto',
    { expires_at: Math.floor(Date.now() / 1000) + 60 * 15 } // 15 mins
  );
};
