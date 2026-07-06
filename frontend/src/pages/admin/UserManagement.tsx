import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE from '../../config';

interface UserAccount {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserAccount[]>([]);

  const token = () => localStorage.getItem('token');
  const authHeader = () => ({ headers: { Authorization: `Bearer ${token()}` } });

  const fetchUsers = async () => {
    try { const r = await axios.get(`${API_BASE}/api/users`, authHeader()); setUsers(r.data); }
    catch (e) { console.error(e); }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="admin-page container">
      <div className="admin-section-title" style={{ marginTop: 0 }}><span>👥</span> User Management</div>
      <div className="admin-list-container">
        <h2 className="text-blue" style={{ marginBottom: '1.5rem' }}>Registered Users ({users.length})</h2>
          
        {users.length === 0 ? (
          <p style={{color:'#888', padding: '1rem 0'}}>No users found.</p>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id}>
                    <td><strong>{u.name}</strong></td>
                    <td>{u.email}</td>
                    <td>{u.phone || '-'}</td>
                    <td>
                      <span className={`role-badge role-${u.role}`}>
                        {u.role.toUpperCase()}
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
  );
};

export default UserManagement;
