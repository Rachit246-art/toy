// In production (Vercel), requests to /api/* are proxied to the Render backend
// via vercel.json rewrites — no env var needed.
// In local dev, falls back to localhost:5000.
const API_BASE = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace(/\/$/, '')
  : (import.meta.env.PROD ? '' : 'http://localhost:5000');

export default API_BASE;
