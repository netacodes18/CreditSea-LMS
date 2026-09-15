import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Uploaded files are served from the server root, not under /api
export const fileUrl = (storageKey: string) => `${API_URL.replace(/\/api\/?$/, '')}${storageKey}`;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // required for cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
