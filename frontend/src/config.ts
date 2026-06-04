// Central API base URL
// In Vercel: set VITE_API_URL = https://toy-backend-rsua.onrender.com
// In local: falls back to localhost
const raw = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_BASE = raw.replace(/\/$/, ''); // strip trailing slash
export default API_BASE;
