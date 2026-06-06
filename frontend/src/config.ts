// Set VITE_API_URL in Vercel environment variables:
// VITE_API_URL = https://toy-backend-rsua.onrender.com
const API_BASE = (import.meta.env.VITE_API_URL as string || 'http://localhost:5000').replace(/\/$/, '');
export default API_BASE;
