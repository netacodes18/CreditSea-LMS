// Identifies a file by its leading "magic bytes" instead of trusting the filename or the
// browser-reported MIME type, both of which come from the extension and are easy to fake.

export type AllowedFileType = 'pdf' | 'png' | 'jpeg';

export const MIME_BY_TYPE: Record<AllowedFileType, string> = {
  pdf: 'application/pdf',
  png: 'image/png',
  jpeg: 'image/jpeg',
};

export const TYPE_BY_EXTENSION: Record<string, AllowedFileType> = {
  '.pdf': 'pdf',
  '.png': 'png',
  '.jpg': 'jpeg',
  '.jpeg': 'jpeg',
};

const startsWith = (buf: Buffer, bytes: number[]) =>
  buf.length >= bytes.length && bytes.every((b, i) => buf[i] === b);

export const detectFileType = (buf: Buffer): AllowedFileType | null => {
  if (startsWith(buf, [0x25, 0x50, 0x44, 0x46, 0x2d])) return 'pdf'; // %PDF-
  if (startsWith(buf, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return 'png';
  if (startsWith(buf, [0xff, 0xd8, 0xff])) return 'jpeg';
  return null; // e.g. .pptx/.docx (PK zip), .ppt/.doc (D0 CF 11 E0), executables, text
};
