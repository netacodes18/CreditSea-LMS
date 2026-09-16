import axios from 'axios';

// Defaults to the same-origin proxy in next.config.ts, so the auth cookie stays first-party
const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// Uploaded files are served from the server root, not under /api.
// If the key is already a full URL (like from Firebase), return it directly.
export const fileUrl = (storageKey: string) => {
  if (storageKey.startsWith('http://') || storageKey.startsWith('https://')) {
    return storageKey;
  }
  return `${API_URL.replace(/\/api\/?$/, '')}${storageKey}`;
};

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // required for cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
