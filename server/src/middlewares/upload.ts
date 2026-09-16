import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import { detectFileType, MIME_BY_TYPE, TYPE_BY_EXTENSION } from '../utils/fileType';

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 MB, inclusive

const SIZE_MESSAGE = 'File size must be less than or equal to 5 MB.';
const TYPE_MESSAGE = 'Only PDF, JPG and PNG files are allowed.';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_UPLOAD_BYTES, files: 1 },
  // First gate: extension. Content is verified after the upload is buffered.
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (TYPE_BY_EXTENSION[ext]) cb(null, true);
    else cb(new Error(TYPE_MESSAGE));
  },
});

// Accepts one salary slip in field "file" and rejects oversized or disguised files with a 400
export const uploadSalarySlip = (req: Request, res: Response, next: NextFunction): void => {
  upload.single('file')(req, res, (err: unknown) => {
    if (err instanceof multer.MulterError) {
      const message = err.code === 'LIMIT_FILE_SIZE' ? SIZE_MESSAGE : `Upload failed: ${err.message}`;
      res.status(400).json({ success: false, message });
      return;
    }
    if (err) {
      res.status(400).json({ success: false, message: (err as Error).message || TYPE_MESSAGE });
      return;
    }

    const file = req.file;
    if (!file) {
      res.status(400).json({ success: false, message: 'No file uploaded' });
      return;
    }
    if (file.size === 0) {
      res.status(400).json({ success: false, message: 'The selected file is empty.' });
      return;
    }

    // Second gate: the bytes must really be a PDF/PNG/JPEG, and match the extension.
    // A .pptx or .docx renamed to .pdf starts with "PK", not "%PDF-", so it is rejected here.
    const detected = detectFileType(file.buffer);
    const expected = TYPE_BY_EXTENSION[path.extname(file.originalname).toLowerCase()];
    if (!detected || detected !== expected) {
      res.status(400).json({
        success: false,
        message: 'This file is not a genuine PDF, JPG or PNG. Renamed files (for example a PowerPoint saved as .pdf) are not accepted.',
      });
      return;
    }

    // Store the verified type rather than the browser-reported one
    file.mimetype = MIME_BY_TYPE[detected];
    next();
  });
};
