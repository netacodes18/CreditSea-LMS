"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/api';
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
      setError(err.response?.data?.message || 'Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const allRequiredUploaded = documents.length >= 1;

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <Loader2 className="w-7 h-7 animate-spin text-indigo-500" />
          <p className="text-sm">Loading documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <p className="text-xs font-semibold tracking-widest uppercase text-indigo-500 mb-1">Borrower Portal</p>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Document Upload</h1>
        <p className="mt-2 text-slate-500">Please upload your latest salary slip to verify your income.</p>
      </div>

      {error && (
        <div className="card-surface p-4 border-rose-100 bg-rose-50/60 text-rose-700 flex items-start gap-2 animate-scale-in">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}
      {success && (
        <div className="card-surface p-4 border-emerald-100 bg-emerald-50/60 text-emerald-700 flex items-start gap-2 animate-scale-in">
          <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
          <span className="text-sm">{success}</span>
        </div>
      )}

      {allRequiredUploaded && (
        <div className="card-surface p-4 border-indigo-100 bg-indigo-50/60 text-indigo-700 flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
          <span className="text-sm">All required documents are uploaded. You can now proceed to apply for a loan.</span>
        </div>
      )}

      <div className="card-surface p-6 sm:p-8">
        <form onSubmit={handleUpload} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Salary Slip (PDF/Image)</label>
            <label
              htmlFor="fileInput"
              className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-indigo-200 bg-indigo-50/40 px-6 py-10 text-center cursor-pointer hover:bg-indigo-50 transition-colors"
            >
              <UploadCloud className="w-7 h-7 text-indigo-400" />
              <p className="text-sm text-slate-600">
                {selectedFile ? (
                  <span className="font-semibold text-indigo-700">{selectedFile.name}</span>
                ) : (
                  <>Click to choose a file, or drag it here</>
                )}
              </p>
              <p className="text-xs text-slate-400">PDF, PNG or JPG</p>
              <input
                id="fileInput"
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="hidden"
                required
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={uploading || !selectedFile}
            className="btn-gradient px-6 py-2.5 text-sm inline-flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {uploading && <Loader2 className="w-4 h-4 animate-spin" />}
            {uploading ? 'Uploading...' : 'Upload Document'}
          </button>
        </form>
      </div>

      <div className="card-surface p-6 sm:p-8">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Uploaded Documents</h2>
        {documents.length === 0 ? (
          <div className="text-center py-10">
            <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-400">No documents uploaded yet.</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {documents.map((doc) => (
              <li key={doc._id} className="py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-indigo-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{doc.originalName}</p>
                    <p className="text-xs text-slate-500">State: {doc.state}</p>
                  </div>
                </div>
                <a
                  href={`http://localhost:5000${doc.storageKey}`} // Assume backend runs on port 5000 for local dev
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium inline-flex items-center gap-1 shrink-0"
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
