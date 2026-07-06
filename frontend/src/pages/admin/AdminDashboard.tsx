import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE from '../../config';

interface Product { _id: string; }
interface Order { _id: string; totalAmount: number; }
interface UserAccount { _id: string; }

const AdminDashboard: React.FC = () => {
  const [dbStatus, setDbStatus] = useState<'checking'|'ok'|'error'>('checking');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<UserAccount[]>([]);

  const token = () => localStorage.getItem('token');
  const authHeader = () => ({ headers: { Authorization: `Bearer ${token()}` } });

  useEffect(() => {
    const checkDb = async () => {
      try { await axios.get(`${API_BASE}/api/products`); setDbStatus('ok'); }
      catch { setDbStatus('error'); }
    };
    const fetchProducts = async () => {
      try { const r = await axios.get(`${API_BASE}/api/products`); setProducts(r.data); }
      catch (e) { console.error(e); }
    };
    const fetchOrders = async () => {
      try { const r = await axios.get(`${API_BASE}/api/orders`, authHeader()); setOrders(r.data); }
      catch (e) { console.error(e); }
    };
    const fetchUsers = async () => {
      try { const r = await axios.get(`${API_BASE}/api/users`, authHeader()); setUsers(r.data); }
      catch (e) { console.error(e); }
    };

    checkDb();
    fetchProducts();
    fetchOrders();
    fetchUsers();
  }, []);

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className="admin-page">
      <div className="admin-header" style={{ borderBottom: 'none', paddingBottom: 0 }}>
        <div>
          <h1 className="text-purple">Admin Dashboard</h1>
          <div className={`db-status db-status--${dbStatus}`}>
            <span className="db-dot" />
            {dbStatus === 'checking' && 'Connecting to database…'}
            {dbStatus === 'ok'       && '✅ MongoDB Atlas connected'}
            {dbStatus === 'error'    && '❌ Database connection failed'}
          </div>
        </div>
      </div>

      <div className="admin-stats-row" style={{ marginTop: '2rem' }}>
        {[
          { icon: '🧸', num: products.length,  label: 'Total Toys' },
          { icon: '💰', num: `₹${totalRevenue.toLocaleString()}`, label: 'Total Revenue' },
          { icon: '📦', num: orders.length,     label: 'Total Orders' },
          { icon: '👥', num: users.length,      label: 'Total Users' },
        ].map(s => (
          <div key={s.label} className="admin-stat-card">
            <span className="admin-stat-icon">{s.icon}</span>
            <div>
              <div className="admin-stat-num">{s.num}</div>
              <div className="admin-stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
