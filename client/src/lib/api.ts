import axios from 'axios';

// defaults to the same-origin proxy so the cookie stays first-party
const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// Cloudinary URLs are already full links; local uploads need the API prefix
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
