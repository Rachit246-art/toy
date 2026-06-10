import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import API_BASE from '../config';
import './UserDashboard.css';

interface Order {
  _id: string;
  customerInfo: { name: string; email: string; phone: string; address: string; city: string; pincode: string };
  items: { _id: string; name: string; price: string; quantity: number; imageUrl: string }[];
  totalAmount: number;
  status: 'Pending' | 'Shipped' | 'Delivered';
  createdAt: string;
}

const UserDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token || !user) {
      navigate('/login', { replace: true });
      return;
    }
    
    // Redirect admin to Admin Panel if they try to access User Dashboard
    if (user.role === 'admin') {
      navigate('/admin', { replace: true });
      return;
    }

    const fetchMyOrders = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/my-orders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(res.data);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, [navigate, token, user]);

  if (!user) return null;

  return (
    <div className="user-dashboard-page">
      <Navbar />
      
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div className="dashboard-header-icon">👋</div>
          <div>
            <h1 className="text-purple">Hello, {user.name}!</h1>
            <p className="dashboard-subtitle">Welcome to your personal Pigglitz space.</p>
          </div>
        </div>

        <div className="dashboard-content">
          <div className="dashboard-section profile-section">
            <h2 className="section-title text-pink">My Profile</h2>
            <div className="profile-details">
              <div className="profile-item">
                <span className="profile-label">Full Name:</span>
                <span className="profile-value">{user.name}</span>
              </div>
              <div className="profile-item">
                <span className="profile-label">Email Address:</span>
                <span className="profile-value">{user.email}</span>
              </div>
              <div className="profile-item">
                <span className="profile-label">Phone Number:</span>
                <span className="profile-value">{user.phone || 'Not provided'}</span>
              </div>
            </div>
          </div>

          <div className="dashboard-section orders-section">
            <h2 className="section-title text-blue">My Orders ({orders.length})</h2>
            
            {loading ? (
              <p className="loading-text">Loading your magical orders...</p>
            ) : orders.length === 0 ? (
              <div className="no-orders">
                <p>You haven't placed any orders yet!</p>
                <button className="btn-playful btn-primary" onClick={() => navigate('/shop')}>
                  Start Shopping 🛍️
                </button>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="user-orders-table">
                  <thead>
                    <tr>
                      <th>Order ID & Date</th>
                      <th>Items Ordered</th>
                      <th>Total Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(o => (
                      <tr key={o._id}>
                        <td>
                          <strong>#{o._id.slice(-6).toUpperCase()}</strong>
                          <div className="table-subtext">{new Date(o.createdAt).toLocaleDateString()}</div>
                        </td>
                        <td>
                          <div className="table-items-list">
                            {o.items.map(item => (
                              <div key={item._id} className="table-item-line">
                                {item.quantity}x {item.name}
                              </div>
                            ))}
                          </div>
                        </td>
                        <td style={{ fontWeight: 'bold', color: 'var(--color-pink)' }}>
                          ₹{o.totalAmount.toLocaleString()}
                        </td>
                        <td>
                          <span className={`status-badge status-${o.status.toLowerCase()}`}>
                            {o.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default UserDashboard;
