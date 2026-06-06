// In production (Vercel), /api/* is proxied to Render backend via vercel.json rewrites.
// So API_BASE is '' in production — all calls go to /api/... (same origin, no CORS).
// In local dev, falls back to localhost:5000.
const API_BASE = import.meta.env.PROD
  ? ''
  : (import.meta.env.VITE_API_URL || 'http://localhost:5000');

export default API_BASE;
