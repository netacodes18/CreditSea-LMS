"use client";

import { useState, useEffect } from 'react';
import api, { fileUrl } from '@/lib/api';
import { AlertCircle, CheckCircle2, FileText, UploadCloud, ExternalLink, Loader2 } from 'lucide-react';

interface Document {
  _id: string;
  originalName: string;
  storageKey: string;
  state: string;
  createdAt: string;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await api.get('/borrower/documents');
      if (res.data.success) {
        setDocuments(res.data.data);
      }
    } catch (err: any) {
      setError('Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  };

  // instant feedback; server re-checks anyway
  const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
  const SIZE_MESSAGE = 'File size must be less than or equal to 5 MB.';

  const detectType = async (file: File): Promise<'pdf' | 'png' | 'jpeg' | null> => {
    const b = new Uint8Array(await file.slice(0, 8).arrayBuffer());
    const starts = (sig: number[]) => b.length >= sig.length && sig.every((v, i) => b[i] === v);
    if (starts([0x25, 0x50, 0x44, 0x46, 0x2d])) return 'pdf';
    if (starts([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return 'png';
    if (starts([0xff, 0xd8, 0xff])) return 'jpeg';
    return null;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    e.target.value = ''; // allow re-picking the same file
    setError('');
    setSuccess('');
    setSelectedFile(null);
    if (!file) return;

    if (file.size > MAX_UPLOAD_BYTES) {
      setError(`${SIZE_MESSAGE} The selected file is ${(file.size / (1024 * 1024)).toFixed(2)} MB.`);
      return;
    }
    const ext = file.name.toLowerCase().split('.').pop();
    const expected = ext === 'pdf' ? 'pdf' : ext === 'png' ? 'png' : ext === 'jpg' || ext === 'jpeg' ? 'jpeg' : null;
    const actual = await detectType(file);
    if (!expected || actual !== expected) {
      setError('This file is not a genuine PDF, JPG or PNG. Renamed files (for example a PowerPoint saved as .pdf) are not accepted.');
      return;
    }
    setSelectedFile(file);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const res = await api.post('/borrower/documents', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data.success) {
        setSuccess('Document uploaded successfully.');
        setSelectedFile(null);
        fetchDocuments();
      }
    } catch (err: any) {
      // a proxy can send 413 before our own check runs
      setError(
        err.response?.status === 413
          ? SIZE_MESSAGE
          : err.response?.data?.message || 'Failed to upload document'
      );
    } finally {
      setUploading(false);
    }
  };

  const allRequiredUploaded = documents.length >= 1;

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto flex items-center justify-center py-24">
        <div className="neo-card flex flex-col items-center gap-3 px-10 py-8">
          <Loader2 className="w-7 h-7 animate-spin text-[var(--ink)]" />
          <p className="text-sm font-bold uppercase tracking-wide text-[var(--ink)]">Loading documents…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <p className="text-xs font-bold tracking-widest uppercase text-[var(--ink)]/50 mb-1">Borrower Portal</p>
        <h1 className="text-3xl font-bold text-[var(--ink)] tracking-tight">Document Upload</h1>
        <p className="mt-2 text-[var(--ink)]/60 font-medium">Please upload your latest salary slip to verify your income.</p>
      </div>

      {error && (
        <div className="neo-card p-4 flex items-start gap-2 animate-scale-in" style={{ backgroundColor: 'var(--danger)', color: '#fff' }}>
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span className="text-sm font-bold">{error}</span>
        </div>
      )}
      {success && (
        <div className="neo-card p-4 flex items-start gap-2 animate-scale-in" style={{ backgroundColor: '#059669', color: 'var(--ink)' }}>
          <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
          <span className="text-sm font-bold">{success}</span>
        </div>
      )}

      {allRequiredUploaded && (
        <div className="neo-card p-4 flex items-start gap-2" style={{ backgroundColor: 'var(--primary)', color: 'var(--ink)' }}>
          <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
          <span className="text-sm font-bold">All required documents are uploaded. You can now proceed to apply for a loan.</span>
        </div>
      )}

      <div className="neo-card p-6 sm:p-8">
        <form onSubmit={handleUpload} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-[var(--ink)] mb-2">Salary Slip (PDF/Image)</label>
            <label
              htmlFor="fileInput"
              className="flex flex-col items-center justify-center gap-2 rounded-xl border-[3px] border-dashed border-[var(--ink)] bg-[var(--paper)] px-6 py-10 text-center cursor-pointer hover:bg-white transition-colors"
            >
              <UploadCloud className="w-7 h-7" style={{ color: '#2563eb' }} />
              <p className="text-sm text-[var(--ink)] font-medium">
                {selectedFile ? (
                  <span className="font-bold">{selectedFile.name}</span>
                ) : (
                  <>Click to choose a file, or drag it here</>
                )}
              </p>
              <p className="text-xs text-[var(--ink)]/50 font-bold">PDF, PNG or JPG · max 5 MB</p>
              <input
                id="fileInput"
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={uploading || !selectedFile}
            className="neo-btn px-6 py-2.5 text-sm disabled:opacity-50"
          >
            {uploading && <Loader2 className="w-4 h-4 animate-spin" />}
            {uploading ? 'Uploading...' : 'Upload Document'}
          </button>
        </form>
      </div>

      <div className="neo-card p-6 sm:p-8">
        <h2 className="text-lg font-bold text-[var(--ink)] mb-4">Uploaded Documents</h2>
        {documents.length === 0 ? (
          <div className="text-center py-10">
            <FileText className="w-8 h-8 text-[var(--ink)]/30 mx-auto mb-2" />
            <p className="text-sm text-[var(--ink)]/50 font-bold">No documents uploaded yet.</p>
          </div>
        ) : (
          <ul className="divide-y divide-[var(--line)]">
            {documents.map((doc) => (
              <li key={doc._id} className="py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg border border-[var(--line)] flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--paper)' }}>
                    <FileText className="w-4 h-4" style={{ color: '#2563eb' }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-[var(--ink)] truncate">{doc.originalName}</p>
                    <p className="text-xs text-[var(--ink)]/60 font-medium">State: {doc.state}</p>
                  </div>
                </div>
                <a
                  href={fileUrl(doc.storageKey)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--ink)] hover:underline text-sm font-bold inline-flex items-center gap-1 shrink-0"
                >
                  View File <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
