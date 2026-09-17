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
  // If the file was uploaded publicly (legacy), it does not need a private signature
  if (publicIdOrUrl.includes('/upload/')) {
    return publicIdOrUrl;
  }

  let publicId = publicIdOrUrl;
  let format = '';
  let resourceType = 'image';

  // If it's a URL, attempt to extract the public_id
  if (publicIdOrUrl.startsWith('http')) {
    const parts = publicIdOrUrl.split('/');
    const privateIndex = parts.findIndex(p => p === 'private');
    if (privateIndex !== -1) {
      resourceType = parts[privateIndex - 1] || 'image';
      
      const relevantParts = parts.slice(privateIndex + 1);
      // Remove signature if present (e.g. s--1PBuED_n--)
      if (relevantParts[0]?.startsWith('s--')) {
        relevantParts.shift();
      }
      // Remove version if present (e.g. v1789604692)
      if (relevantParts[0]?.match(/^v\d+$/)) {
        relevantParts.shift();
      }
      
      const fullPath = relevantParts.join('/');
      const extMatch = fullPath.match(/\.([^/.]+)$/);
      if (extMatch && extMatch[1]) {
        format = extMatch[1];
      }
      // Remove extension for publicId
      publicId = fullPath.replace(/\.[^/.]+$/, "");
    }
  }

  return cloudinary.utils.private_download_url(
    publicId,
    format,
    { expires_at: Math.floor(Date.now() / 1000) + 60 * 15, resource_type: resourceType } // 15 mins
  );
};
