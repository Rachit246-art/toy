import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2, Plus, Ticket } from 'lucide-react';
import API_BASE from '../../config';

interface Coupon {
  _id: string;
  code: string;
  discountAmount: number;
  discountType: 'fixed' | 'percentage';
  expiryDate?: string | null;
  maxUsers?: number | null;
  currentUses: number;
  isPublic: boolean;
  createdAt: string;
}

const CouponManagement: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  // Add form states
  const [couponCode, setCouponCode] = useState('');
  const [couponAmount, setCouponAmount] = useState('');
  const [couponType, setCouponType] = useState('fixed');
  const [couponExpiry, setCouponExpiry] = useState('');
  const [couponMaxUsers, setCouponMaxUsers] = useState('');
  const [couponIsPublic, setCouponIsPublic] = useState(false);
  const [couponMsg, setCouponMsg] = useState('');

  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const token = () => localStorage.getItem('token');
  const authHeader = () => ({ headers: { Authorization: `Bearer ${token()}` } });

  const fetchCoupons = async () => {
    try { const r = await axios.get(`${API_BASE}/api/coupons`, authHeader()); setCoupons(r.data); }
    catch (e) { console.error(e); }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleAddCoupon = async (e: React.FormEvent) => {
    e.preventDefault(); setCouponMsg('');
    try {
      await axios.post(`${API_BASE}/api/coupons`, {
        code: couponCode,
        discountAmount: Number(couponAmount),
        discountType: couponType,
        expiryDate: couponExpiry || null,
        maxUsers: couponMaxUsers ? Number(couponMaxUsers) : null,
        isPublic: couponIsPublic
      }, authHeader());
      setCouponCode(''); setCouponAmount(''); setCouponType('fixed'); 
      setCouponExpiry(''); setCouponMaxUsers(''); setCouponIsPublic(false);
      setCouponMsg('✅ Coupon added!');
      fetchCoupons();
    } catch (err: any) {
      setCouponMsg(err.response?.data?.message || '❌ Failed to add coupon.');
    }
  };

  return (
    <div className="admin-page container">
      <div className="admin-section-title" style={{ marginTop: 0 }}><span>🎟️</span> Coupon Management</div>
      <div className="admin-content">
        <div className="admin-form-container reel-form-container">
          <h3 className="text-pink" style={{marginBottom:'1.2rem',display:'flex',alignItems:'center',gap:'0.5rem'}}>
            <Plus size={18}/> Add New Coupon
          </h3>
          <form onSubmit={handleAddCoupon} className="admin-form">
            <input type="text" placeholder="Coupon Code (e.g. WELCOME10)" value={couponCode}
              onChange={e => setCouponCode(e.target.value.toUpperCase())} required className="playful-input" />
            <div style={{ display: 'flex', gap: '1rem' }}>
              <input type="number" placeholder="Discount Amount" value={couponAmount}
                onChange={e => setCouponAmount(e.target.value)} required className="playful-input" style={{ flex: 2 }} />
              <select value={couponType} onChange={e => setCouponType(e.target.value)} className="playful-input" style={{ flex: 1 }}>
                <option value="fixed">Fixed (₹)</option>
                <option value="percentage">Percentage (%)</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <label className="field-label" style={{ marginBottom: '0.2rem' }}>Expiry Date (Optional)</label>
                <input type="date" value={couponExpiry} onChange={e => setCouponExpiry(e.target.value)} className="playful-input" />
              </div>
              <div style={{ flex: 1 }}>
                <label className="field-label" style={{ marginBottom: '0.2rem' }}>Max Uses (Optional)</label>
                <input type="number" placeholder="Leave empty for unlimited" value={couponMaxUsers} onChange={e => setCouponMaxUsers(e.target.value)} className="playful-input" />
              </div>
            </div>
            
            <label className={`flag-toggle${couponIsPublic?' flag-toggle--on':''}`} style={{ marginTop: '0.5rem' }}>
              <input type="checkbox" checked={couponIsPublic} onChange={e => setCouponIsPublic(e.target.checked)} />
              <Ticket size={15} fill={couponIsPublic?'var(--color-pink)':'none'} color={couponIsPublic?'var(--color-pink)':'#aaa'} /> 
              Make Public (Visible in user cart)
            </label>

            <button type="submit" className="btn-playful btn-primary" style={{ marginTop: '1rem' }}>
              <Plus size={16} style={{marginRight:'0.4rem',verticalAlign:'middle'}}/> Add Coupon
            </button>
            {couponMsg && <p className="reel-msg">{couponMsg}</p>}
          </form>
        </div>

        <div className="admin-list-container reel-list-container">
          <h3 className="text-blue" style={{marginBottom:'1.2rem'}}>Active Coupons ({coupons.length})</h3>
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Discount</th>
                  <th>Visibility</th>
                  <th>Usage / Expiry</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {coupons.length === 0 ? (
                  <tr><td colSpan={5} style={{textAlign:'center', padding:'1.5rem', color:'#888'}}>No coupons found.</td></tr>
                ) : (
                  coupons.map(c => {
                    const isExpired = c.expiryDate && new Date(c.expiryDate) < new Date();
                    const isExhausted = typeof c.maxUsers === 'number' && c.currentUses >= c.maxUsers;
                    const isInactive = isExpired || isExhausted;
                    return (
                      <tr key={c._id} style={{ opacity: isInactive ? 0.6 : 1 }}>
                        <td><strong style={{ letterSpacing: '1px' }}>{c.code}</strong></td>
                        <td style={{ color: 'var(--color-pink)', fontWeight: 'bold' }}>
                          {c.discountType === 'percentage' ? `${c.discountAmount}%` : `₹${c.discountAmount}`} OFF
                        </td>
                        <td>
                          {c.isPublic ? <span className="flag-badge flag-featured">Public</span> : <span className="flag-badge" style={{background:'#eee', color:'#555'}}>Private</span>}
                        </td>
                        <td>
                          <div className="table-subtext">Uses: {c.currentUses} {c.maxUsers ? `/ ${c.maxUsers}` : '(unlimited)'}</div>
                          {c.expiryDate && <div className="table-subtext">Exp: {new Date(c.expiryDate).toLocaleDateString()}</div>}
                          {isInactive && <span style={{color:'red', fontSize:'0.75rem', fontWeight:'bold'}}>{isExpired ? 'EXPIRED' : 'EXHAUSTED'}</span>}
                        </td>
                        <td>
                          <button onClick={() => setDeleteConfirm(c._id)} className="btn-playful btn-danger" style={{padding:'0.4rem 0.8rem'}}>
                            <Trash2 size={15}/>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {deleteConfirm && (
        <div className="edit-modal-backdrop" onClick={() => setDeleteConfirm(null)}>
          <div className="edit-modal" style={{ maxWidth: '400px', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
            <div className="edit-modal-header" style={{ justifyContent: 'center' }}>
              <h3 className="text-pink" style={{ margin: 0 }}>🗑️ Confirm Deletion</h3>
            </div>
            <p style={{ margin: '1.5rem 0', color: '#555' }}>Are you sure you want to delete this coupon? This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button className="btn-playful btn-secondary" style={{ flex: 1 }} onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button 
                className="btn-playful btn-danger" 
                style={{ flex: 1 }} 
                onClick={async () => {
                  try {
                    await axios.delete(`${API_BASE}/api/coupons/${deleteConfirm}`, authHeader()); 
                    fetchCoupons(); 
                  } catch (e) { console.error(e); }
                  setDeleteConfirm(null);
                }}
              >Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponManagement;
