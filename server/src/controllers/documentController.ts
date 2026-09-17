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

export const getDocumentDownloadUrl = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const document = await DocumentModel.findById(id);

    if (!document) {
      res.status(404).json({ success: false, message: 'Document not found' });
      return;
    }

    // Role check: If not admin/sanction/etc, it must belong to the user
    if (req.user!.role === 'BORROWER' && String(document.borrowerId) !== req.user!.id) {
      res.status(403).json({ success: false, message: 'Forbidden' });
      return;
    }

    const { getSignedUrl } = require('../config/cloudinary');
    const signedUrl = getSignedUrl(document.storageKey);

    // Redirect to the signed URL
    res.redirect(signedUrl);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
