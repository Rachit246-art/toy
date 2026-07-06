import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './AdminLayout.css';
import { 
  Home, 
  Settings, 
  Users, 
  Package, 
  Video, 
  Image as ImageIcon, 
  MessageSquare, 
  Ticket, 
  ShoppingCart,
  LogOut
} from 'lucide-react';

const AdminSidebar: React.FC = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const navItems = [
    { to: '/admin', icon: <Home size={18} />, label: 'Dashboard', end: true },
    { to: '/admin/toys', icon: <Package size={18} />, label: 'Toys' },
    { to: '/admin/orders', icon: <ShoppingCart size={18} />, label: 'Orders' },
    { to: '/admin/users', icon: <Users size={18} />, label: 'Users' },
    { to: '/admin/coupons', icon: <Ticket size={18} />, label: 'Coupons' },
    { to: '/admin/reels', icon: <Video size={18} />, label: 'Reels' },
    { to: '/admin/hero-banners', icon: <ImageIcon size={18} />, label: 'Hero Banners' },
    { to: '/admin/partner-banners', icon: <ImageIcon size={18} />, label: 'Partner Banners' },
    { to: '/admin/site-settings', icon: <Settings size={18} />, label: 'Site Settings' },
    { to: '/admin/leads', icon: <MessageSquare size={18} />, label: 'Chatbot Leads' },
  ];

  return (
    <div className="admin-sidebar">
      <div className="admin-sidebar-header">
        <h2 className="text-purple">Admin Menu</h2>
      </div>
      <nav className="admin-sidebar-nav">
        {navItems.map(item => (
          <NavLink 
            key={item.to} 
            to={item.to} 
            end={item.end}
            className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="admin-sidebar-footer">
        <button onClick={handleLogout} className="btn-playful btn-danger" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
