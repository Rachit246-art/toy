import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../Navbar';
import AdminSidebar from './AdminSidebar';
import './AdminLayout.css';
import '../../pages/AdminShared.css'; // We will rename AdminPanel.css to AdminShared.css

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  // Close sidebar on navigation on mobile
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location]);

  return (
    <div className="admin-page-wrapper">
      <Navbar />
      <div className="admin-layout-container">
        {/* Mobile sidebar toggle */}
        <button 
          className="admin-sidebar-toggle btn-playful btn-primary d-md-none" 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? 'Close Menu' : 'Admin Menu'}
        </button>

        <div className={`admin-layout-sidebar ${isSidebarOpen ? 'open' : ''}`}>
          <AdminSidebar />
        </div>
        
        <div className="admin-layout-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
