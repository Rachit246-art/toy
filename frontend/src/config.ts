// Set VITE_API_URL in environment variables (e.g., Hostinger panel or .env):
const API_BASE = (import.meta.env.VITE_API_URL as string || (import.meta.env.PROD ? '' : 'http://localhost:5000')).replace(/\/$/, '');
export default API_BASE;
