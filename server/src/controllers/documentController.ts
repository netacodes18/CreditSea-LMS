import { Request, Response } from 'express';
import { DocumentModel, DocumentState } from '../models/Document';
import { uploadToCloudinary } from '../config/cloudinary';
import path from 'path';

export const uploadDocument = async (req: Request, res: Response): Promise<void> => {
  try {
    const file = req.file;

    if (!file) {
      res.status(400).json({ success: false, message: 'No file uploaded' });
      return;
    }

    const folder = `lms/documents/${req.user!.id}`;
    
    // Upload to Cloudinary
    const result = await uploadToCloudinary(file.buffer, folder);

    const doc = await DocumentModel.create({
      borrowerId: req.user!.id,
      originalName: file.originalname,
      mimeType: file.mimetype,
      sizeBytes: file.size,
      storageKey: result.secure_url, // Save the secure URL from Cloudinary
      state: DocumentState.CURRENT,
    });

    res.status(201).json({ success: true, data: doc });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyDocuments = async (req: Request, res: Response): Promise<void> => {
  try {
    const documents = await DocumentModel.find({ borrowerId: req.user!.id, state: DocumentState.CURRENT });
    res.status(200).json({ success: true, data: documents });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
