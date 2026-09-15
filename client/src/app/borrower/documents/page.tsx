"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/api';

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

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Document Upload</h1>
        <p className="mt-2 text-gray-600">Please upload your latest salary slip to verify your income.</p>
      </div>

      {error && <div className="p-4 bg-red-50 text-red-700 rounded-md border border-red-200">{error}</div>}
      {success && <div className="p-4 bg-green-50 text-green-700 rounded-md border border-green-200">{success}</div>}
      
      {allRequiredUploaded && (
        <div className="p-4 bg-blue-50 text-blue-700 rounded-md border border-blue-200">
          All required documents are uploaded. You can now proceed to apply for a loan.
        </div>
      )}

      <div className="bg-white p-6 shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
        <form onSubmit={handleUpload} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Salary Slip (PDF/Image)</label>
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              required
            />
          </div>

          <button
            type="submit"
            disabled={uploading || !selectedFile}
            className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Upload Document'}
          </button>
        </form>
      </div>

      <div className="bg-white p-6 shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Uploaded Documents</h2>
        {documents.length === 0 ? (
          <p className="text-sm text-gray-500">No documents uploaded yet.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {documents.map((doc) => (
              <li key={doc._id} className="py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{doc.originalName}</p>
                  <p className="text-sm text-gray-500">State: {doc.state}</p>
                </div>
                <div>
                  <a
                    href={`http://localhost:5000${doc.storageKey}`} // Assume backend runs on port 5000 for local dev
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                  >
                    View File
                  </a>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
