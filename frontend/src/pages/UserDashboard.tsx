import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, X, RotateCcw } from 'lucide-react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import API_BASE from '../config';
import { useCart } from '../context/CartContext';
import './UserDashboard.css';

interface Order {
  _id: string;
  customerInfo: { name: string; email: string; phone: string; address: string; city: string; pincode: string };
  items: { _id: string; name: string; price: string; quantity: number; imageUrl: string; isBundle?: boolean }[];
  totalAmount: number;
  status: string;
  createdAt: string;
  deliveryImageUrl?: string;
  trackingLink?: string;
  orderId?: string;
}

const ORDER_STAGES = ['Order Placed', 'In Transit', 'Out for Delivery', 'Delivered'];

const OrderProgressTracker: React.FC<{ status: string }> = ({ status }) => {
  let normalizedStatus = status;
  if (status === 'Pending') normalizedStatus = 'Order Placed';
  if (status === 'Shipped') normalizedStatus = 'In Transit';

  const currentIndex = ORDER_STAGES.indexOf(normalizedStatus);
  const activeIndex = currentIndex === -1 ? 0 : currentIndex;

  return (
    <div className="order-tracker-container">
      <div className="tracker-line-bg"></div>
      <div 
        className="tracker-line-fill" 
        style={{ width: `${(activeIndex / (ORDER_STAGES.length - 1)) * 100}%` }}
      ></div>
      
      <div className="tracker-stages">
        {ORDER_STAGES.map((stage, idx) => {
          const isCompleted = idx <= activeIndex;
          const isActive = idx === activeIndex;
          return (
            <div key={stage} className={`tracker-stage ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}>
              <div className="stage-dot">
                {isCompleted ? '✓' : ''}
              </div>
              <div className="stage-label">{stage}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface AddressType {
  name: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  phone: string;
  email: string;
}

const emptyAddress: AddressType = {
  name: '', addressLine1: '', addressLine2: '', city: '', state: '', pincode: '', country: 'India', phone: '', email: ''
};

const UserDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  
  const [editProfile, setEditProfile] = useState({ name: '', phone: '' });
  
  // Modals for editing addresses
  const [editingBilling, setEditingBilling] = useState(false);
  const [editingShipping, setEditingShipping] = useState(false);
  
  const [billingAddress, setBillingAddress] = useState<AddressType>(emptyAddress);
  const [shippingAddress, setShippingAddress] = useState<AddressType>(emptyAddress);
  
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);

  // State for order details modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Review State
  const [reviewItem, setReviewItem] = useState<{productId: string, productName: string} | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const { addToCart } = useCart();

  const handleReorder = (order: Order) => {
    order.items.forEach(item => {
      addToCart({
        _id: item._id,
        name: item.name,
        price: item.price,
        imageColor: '#f5f5f5',
        emoji: '🧸',
        imageUrl: item.imageUrl,
        isBundle: item.isBundle,
      });
    });
    navigate('/cart');
  };

  const handleReorderItem = (item: any) => {
    addToCart({
      _id: item._id,
      name: item.name,
      price: item.price,
      imageColor: '#f5f5f5',
      emoji: '🧸',
      imageUrl: item.imageUrl,
      isBundle: item.isBundle,
    });
    navigate('/cart');
  };

  useEffect(() => {
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.data.role === 'admin') {
          navigate('/admin', { replace: true });
          return;
        }

        setUserData(res.data);
        setEditProfile({ name: res.data.name || '', phone: res.data.phone || '' });
        if (res.data.billingAddress) setBillingAddress(res.data.billingAddress);
        if (res.data.shippingAddress) setShippingAddress(res.data.shippingAddress);
      } catch (err) {
        console.error('Failed to fetch profile', err);
        navigate('/login');
      }
    };

    const fetchMyOrders = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/my-orders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(res.data);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchProfile();
    fetchMyOrders();
  }, [navigate, token]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await axios.put(`${API_BASE}/api/users/profile`, editProfile, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserData(res.data.user);
      localStorage.setItem('user', JSON.stringify(res.data.user)); // keep local storage in sync
      alert('Profile updated successfully!');
    } catch (err) {
      alert('Failed to update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUpdateBilling = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingAddress(true);
    try {
      const res = await axios.put(`${API_BASE}/api/users/profile`, { billingAddress }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserData(res.data.user);
      setEditingBilling(false);
    } catch (err) {
      alert('Failed to update billing address.');
    } finally {
      setSavingAddress(false);
    }
  };

  const handleUpdateShipping = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingAddress(true);
    try {
      const res = await axios.put(`${API_BASE}/api/users/profile`, { shippingAddress }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserData(res.data.user);
      setEditingShipping(false);
    } catch (err) {
      alert('Failed to update shipping address.');
    } finally {
      setSavingAddress(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewItem || !userData) return;
    setSubmittingReview(true);
    try {
      await axios.post(`${API_BASE}/api/products/${reviewItem.productId}/reviews`, {
        name: userData.name,
        rating,
        comment
      });
      alert('Review submitted successfully! Thank you.');
      setReviewItem(null);
      setRating(5);
      setComment('');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (!userData) return <div style={{padding: '5rem', textAlign: 'center'}}>Loading...</div>;

  return (
    <div className="user-dashboard-page">
      <Navbar />
      
      <div className="dashboard-layout">
        
        {/* SIDEBAR */}
        <div className="dashboard-sidebar">
          <button 
            className={`sidebar-link ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={`sidebar-link ${activeTab === 'addresses' ? 'active' : ''}`}
            onClick={() => setActiveTab('addresses')}
          >
            Addresses
          </button>
          <button 
            className={`sidebar-link ${activeTab === 'account' ? 'active' : ''}`}
            onClick={() => setActiveTab('account')}
          >
            Account details
          </button>
          <button 
            className={`sidebar-link ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            Orders
          </button>
          <button 
            className={`sidebar-link ${activeTab === 'invoices' ? 'active' : ''}`}
            onClick={() => setActiveTab('invoices')}
          >
            Order Invoices
          </button>
          
          <button 
            className="sidebar-link logout-link"
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              navigate('/login');
            }}
          >
            Logout
          </button>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="dashboard-main-content">
          
          {/* TAB: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="tab-content dashboard-tab">
              <div className="dashboard-welcome">
                <div className="dashboard-header-icon">👋</div>
                <div>
                  <h1 className="text-purple">Hello, {userData.name}!</h1>
                  <p className="dashboard-subtitle">From your account dashboard you can view your recent orders, manage your shipping addresses, and edit your password and account details.</p>
                </div>
              </div>
              <div className="dashboard-stats">
                <div className="stat-card">
                  <h3>{orders.length}</h3>
                  <p>Total Orders</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB: ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="tab-content">
              
              <div className="address-section-header">
                <h2 className="section-title">Billing Addresses</h2>
                <button className="btn-playful btn-primary" onClick={() => setEditingBilling(true)}>Add Billing Address</button>
              </div>

              {userData.billingAddress?.name ? (
                <div className="address-card">
                  <div className="address-card-header">
                    <strong>{userData.billingAddress.name}</strong>
                    <div className="address-actions">
                      <button onClick={() => setEditingBilling(true)}>Edit</button>
                      <button onClick={() => {
                        setBillingAddress(emptyAddress);
                        // Optional: submit immediately to delete
                      }}>Delete</button>
                    </div>
                  </div>
                  <div className="address-card-body">
                    <p>{userData.billingAddress.addressLine1}</p>
                    {userData.billingAddress.addressLine2 && <p>{userData.billingAddress.addressLine2}</p>}
                    <p>{userData.billingAddress.city}, {userData.billingAddress.state}, {userData.billingAddress.pincode}</p>
                    <p>{userData.billingAddress.country}</p>
                    <p>Phone: {userData.billingAddress.phone}</p>
                    <p>Email: {userData.billingAddress.email}</p>
                  </div>
                </div>
              ) : (
                <p className="no-address-text">No billing address added yet.</p>
              )}

              <div className="address-section-header" style={{ marginTop: '3rem' }}>
                <h2 className="section-title">Shipping Addresses</h2>
                <button className="btn-playful btn-primary" onClick={() => setEditingShipping(true)}>Add Shipping Address</button>
              </div>

              {userData.shippingAddress?.name ? (
                <div className="address-card">
                  <div className="address-card-header">
                    <strong>{userData.shippingAddress.name}</strong>
                    <div className="address-actions">
                      <button onClick={() => setEditingShipping(true)}>Edit</button>
                      <button onClick={() => {
                        setShippingAddress(emptyAddress);
                      }}>Delete</button>
                    </div>
                  </div>
                  <div className="address-card-body">
                    <p>{userData.shippingAddress.addressLine1}</p>
                    {userData.shippingAddress.addressLine2 && <p>{userData.shippingAddress.addressLine2}</p>}
                    <p>{userData.shippingAddress.city}, {userData.shippingAddress.state}, {userData.shippingAddress.pincode}</p>
                    <p>{userData.shippingAddress.country}</p>
                    <p>Phone: {userData.shippingAddress.phone}</p>
                    <p>Email: {userData.shippingAddress.email}</p>
                  </div>
                </div>
              ) : (
                <p className="no-address-text">No shipping address added yet.</p>
              )}

            </div>
          )}

          {/* TAB: ACCOUNT DETAILS */}
          {activeTab === 'account' && (
            <div className="tab-content">
              <h2 className="section-title text-pink">Account Details</h2>
              
              <form onSubmit={handleUpdateProfile} className="profile-form">
                <div className="form-group">
                  <label>Email Address (Cannot be changed)</label>
                  <input type="email" value={userData.email} disabled className="disabled-input" />
                </div>
                <div className="form-group">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    value={editProfile.name} 
                    onChange={e => setEditProfile({...editProfile, name: e.target.value})} 
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input 
                    type="tel" 
                    value={editProfile.phone} 
                    onChange={e => setEditProfile({...editProfile, phone: e.target.value})} 
                  />
                </div>
                
                <button type="submit" className="btn-playful btn-primary" disabled={savingProfile}>
                  {savingProfile ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
          )}

          {/* TAB: ORDERS */}
          {activeTab === 'orders' && (
            <div className="tab-content">
              
              {loadingOrders ? (
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
                        <th>Order</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Total</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(o => {
                        const totalItems = o.items.reduce((sum, item) => sum + item.quantity, 0);
                        const isFailed = o.status === 'Failed' || o.status === 'Cancelled';
                        const isCompleted = o.status === 'Delivered';
                        return (
                          <tr key={o._id}>
                            <td style={{ fontWeight: '500' }}>#{o.orderId || o._id.slice(-6).toUpperCase()}</td>
                            <td>{new Date(o.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</td>
                            <td>
                              <span className={`status-text ${isFailed ? 'text-red' : (isCompleted ? 'text-green' : 'text-blue')}`}>
                                {o.status}
                              </span>
                            </td>
                            <td style={{ fontWeight: '500' }}>
                              ₹{o.totalAmount.toLocaleString()} for {totalItems} items
                            </td>
                            <td style={{ minWidth: '220px' }}>
                              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
                                <button 
                                  className="action-btn-eye" 
                                  onClick={() => setSelectedOrder(o)}
                                  title="View Order"
                                >
                                  <Eye size={18} />
                                </button>
                                
                                {isCompleted && (
                                  <button
                                    className="btn-playful btn-primary"
                                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                                    onClick={() => {
                                      if (o.items.length === 1 && !o.items[0].isBundle) {
                                        setReviewItem({ productId: o.items[0]._id, productName: o.items[0].name });
                                      } else {
                                        setSelectedOrder(o);
                                      }
                                    }}
                                  >
                                    Review
                                  </button>
                                )}

                                {o.trackingLink ? (
                                  <a 
                                    href={o.trackingLink.startsWith('http') ? o.trackingLink : `https://${o.trackingLink}`} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="btn-playful btn-primary"
                                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', display: 'inline-block', textDecoration: 'none' }}
                                  >
                                    Track
                                  </a>
                                ) : !isCompleted ? (
                                  <button
                                    className="btn-playful btn-primary"
                                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', opacity: 0.5, cursor: 'not-allowed' }}
                                    disabled
                                    title="Tracking link not added yet"
                                  >
                                    Track
                                  </button>
                                ) : null}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ORDER DETAILS MODAL */}
          {selectedOrder && (
            <div className="order-modal-overlay" onClick={() => setSelectedOrder(null)}>
              <div className="order-modal-content" onClick={e => e.stopPropagation()}>
                <div className="order-modal-header">
                  <h3>Order #{selectedOrder.orderId || selectedOrder._id.slice(-6).toUpperCase()}</h3>
                  <button className="close-btn" onClick={() => setSelectedOrder(null)}><X size={24}/></button>
                </div>
                <div className="order-modal-body" style={{ maxHeight: '70vh', overflowY: 'auto', padding: '20px' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f5f0ff', borderRadius: '12px', border: '1px solid #e2d2ff' }}>
                    <div style={{ flex: '1 1 45%' }}>
                      <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#666' }}>Order Date</p>
                      <p style={{ margin: 0, fontWeight: '600' }}>{new Date(selectedOrder.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                    <div style={{ flex: '1 1 45%' }}>
                      <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#666' }}>Order Status</p>
                      <p style={{ margin: 0, fontWeight: '600' }} className={`status-text ${selectedOrder.status === 'Failed' || selectedOrder.status === 'Cancelled' ? 'text-red' : (selectedOrder.status === 'Delivered' ? 'text-green' : 'text-blue')}`}>
                        {selectedOrder.status}
                      </p>
                    </div>
                    <div style={{ flex: '1 1 45%' }}>
                      <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#666' }}>Total Amount</p>
                      <p style={{ margin: 0, fontWeight: '600', color: 'var(--color-purple)' }}>₹{selectedOrder.totalAmount.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="order-items" style={{ marginBottom: '2rem' }}>
                    <h4 style={{ marginBottom: '1rem', color: '#333', borderBottom: '2px dashed #eee', paddingBottom: '0.5rem' }}>Items Ordered</h4>
                    <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {selectedOrder.items.map(item => (
                        <li key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid #eee', borderRadius: '12px', backgroundColor: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                          <div 
                            style={{ display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer' }}
                            onClick={() => {
                              const slug = item.name.replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').toLowerCase();
                              navigate(`/product/${slug}`);
                            }}
                          >
                            {item.imageUrl ? (
                              <img src={item.imageUrl} alt={item.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #eee' }} />
                            ) : (
                              <div style={{ width: '60px', height: '60px', backgroundColor: '#f0f0f0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>🧸</div>
                            )}
                            <div>
                              <div style={{ fontWeight: '600', color: '#333', marginBottom: '4px' }}>{item.name}</div>
                              <div style={{ fontSize: '0.85rem', color: '#666' }}>Qty: <span style={{ fontWeight: '600', color: '#444' }}>{item.quantity}</span></div>
                            </div>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                            <div style={{ fontWeight: '600', color: '#333' }}>₹{item.price}</div>
                            {selectedOrder.status === 'Delivered' && (
                              <button 
                                className="btn-playful btn-primary"
                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleReorderItem(item);
                                }}
                              >
                                <RotateCcw size={12} /> Reorder
                              </button>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ marginBottom: '2rem', padding: '1.2rem', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #eee' }}>
                    <h4 style={{ margin: '0 0 1rem 0', color: '#333', borderBottom: '2px dashed #eee', paddingBottom: '0.5rem' }}>Shipping Details</h4>
                    <p style={{ margin: '0 0 0.4rem 0', fontWeight: '600' }}>{selectedOrder.customerInfo.name}</p>
                    <p style={{ margin: '0 0 0.4rem 0', color: '#666', lineHeight: '1.4' }}>
                      {selectedOrder.customerInfo.address}<br />
                      {selectedOrder.customerInfo.city} - {selectedOrder.customerInfo.pincode}
                    </p>
                    <p style={{ margin: '0.5rem 0 0.2rem 0', color: '#555', fontSize: '0.9rem' }}>📞 {selectedOrder.customerInfo.phone}</p>
                    <p style={{ margin: '0', color: '#555', fontSize: '0.9rem' }}>✉️ {selectedOrder.customerInfo.email}</p>
                  </div>

                  <div className="order-tracking-section" style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #eee' }}>
                    <h4 style={{ margin: '0 0 1.5rem 0', textAlign: 'center', color: '#333' }}>Tracking Status</h4>
                    <OrderProgressTracker status={selectedOrder.status} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: ORDER INVOICES */}
          {activeTab === 'invoices' && (
            <div className="tab-content">
              <h2 className="section-title text-purple">Order Invoices</h2>
              
              {loadingOrders ? (
                <p className="loading-text">Loading...</p>
              ) : orders.length === 0 ? (
                <div className="no-orders">
                  <p>No invoices available yet.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="user-orders-table invoices-table">
                    <thead>
                      <tr>
                        <th>Order Number</th>
                        <th>Order Placed Date</th>
                        <th>Order Status</th>
                        <th>View Details</th>
                        <th>Download Invoice</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(o => {
                        const isFailed = o.status === 'Failed' || o.status === 'Cancelled';
                        const isCompleted = o.status === 'Delivered';
                        return (
                          <tr key={o._id}>
                            <td style={{ fontWeight: '600', color: '#111' }}>#{o.orderId || o._id.slice(-6).toUpperCase()}</td>
                            <td>{new Date(o.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                            <td>
                              <span className={`status-text ${isFailed ? 'text-red' : (isCompleted ? 'text-green' : 'text-blue')}`}>
                                {o.status}
                              </span>
                            </td>
                            <td>
                              <button 
                                className="btn-view-details" 
                                onClick={() => {
                                  const printWindow = window.open('', '_blank');
                                  if (printWindow) {
                                    printWindow.document.write(`
                                      <html>
                                        <head>
                                          <title>Invoice #${o.orderId || o._id.slice(-6).toUpperCase()}</title>
                                          <style>
                                            body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
                                            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 20px; }
                                            .invoice-title { font-size: 28px; color: #3b1085; }
                                            .bill-to { margin-bottom: 30px; }
                                            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
                                            th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
                                            th { background-color: #f9f9f9; }
                                            .total-row { font-weight: bold; font-size: 18px; }
                                            .footer { text-align: center; color: #888; margin-top: 50px; font-size: 12px; }
                                          </style>
                                        </head>
                                        <body>
                                          <div class="header">
                                            <div>
                                              <p>Order #${o.orderId || o._id.slice(-6).toUpperCase()}<br/>Date: ${new Date(o.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <div style="text-align: right;">
                                              <h2>Pigglitz 3D Printing</h2>
                                              <p>pigglits3d@gmail.com</p>
                                            </div>
                                          </div>
                                          
                                          <div class="bill-to">
                                            <h3>Order To:</h3>
                                            <p>${o.customerInfo.name}<br/>${o.customerInfo.address}<br/>${o.customerInfo.city}, ${o.customerInfo.pincode}<br/>${o.customerInfo.phone}<br/>${o.customerInfo.email}</p>
                                          </div>

                                          <table>
                                            <thead>
                                              <tr>
                                                <th>Item</th>
                                                <th>Qty</th>
                                                <th>Price</th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              ${o.items.map(item => `
                                                <tr>
                                                  <td>${item.name}</td>
                                                  <td>${item.quantity}</td>
                                                  <td>${item.price?.includes('₹') ? item.price : `₹${item.price}`}</td>
                                                </tr>
                                              `).join('')}
                                              <tr class="total-row">
                                                <td colspan="2" style="text-align: right;">Total Amount:</td>
                                                <td>₹${o.totalAmount.toLocaleString()}</td>
                                              </tr>
                                            </tbody>
                                          </table>
                                          
                                          <div class="footer">
                                            <p>Thank you for shopping with Pigglitz!</p>
                                            <p>This is a computer-generated invoice and does not require a physical signature.</p>
                                          </div>
                                        </body>
                                      </html>
                                    `);
                                    printWindow.document.close();
                                  }
                                }}
                              >
                                View Details
                              </button>
                            </td>
                            <td>
                              <button 
                                className="btn-request-invoice"
                                onClick={() => {
                                  if (o.deliveryImageUrl) {
                                    window.open(o.deliveryImageUrl, '_blank');
                                  } else {
                                    alert('Delivery image is not available yet.');
                                  }
                                }}
                              >
                                Request Invoice
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* REVIEW MODAL */}
      {reviewItem && (
        <div className="order-modal-overlay" onClick={() => setReviewItem(null)}>
          <div className="order-modal-content address-modal" onClick={e => e.stopPropagation()}>
            <div className="order-modal-header">
              <h3>Review {reviewItem.productName}</h3>
              <button className="close-btn" onClick={() => setReviewItem(null)}><X size={24}/></button>
            </div>
            <form onSubmit={handleSubmitReview} className="order-modal-body">
              <div className="form-group">
                <label>Rating (1-5)</label>
                <select 
                  value={rating} 
                  onChange={e => setRating(Number(e.target.value))}
                  style={{ padding: '0.8rem', borderRadius: '12px', border: '2px solid #ddd', width: '100%', fontFamily: 'var(--font-body)' }}
                >
                  <option value={5}>5 - Excellent</option>
                  <option value={4}>4 - Very Good</option>
                  <option value={3}>3 - Average</option>
                  <option value={2}>2 - Poor</option>
                  <option value={1}>1 - Terrible</option>
                </select>
              </div>
              <div className="form-group">
                <label>Your Review</label>
                <textarea 
                  required 
                  value={comment} 
                  onChange={e => setComment(e.target.value)} 
                  rows={4}
                  placeholder="Tell us what you liked (or didn't like)..."
                  style={{ padding: '0.8rem', borderRadius: '12px', border: '2px solid #ddd', width: '100%', resize: 'vertical', fontFamily: 'var(--font-body)' }}
                />
              </div>
              <button type="submit" className="btn-playful btn-primary" disabled={submittingReview}>
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* BILLING ADDRESS MODAL */}
      {editingBilling && (
        <div className="order-modal-overlay" onClick={() => setEditingBilling(false)}>
          <div className="order-modal-content address-modal" onClick={e => e.stopPropagation()}>
            <div className="order-modal-header">
              <h3>Edit Billing Address</h3>
              <button className="close-btn" onClick={() => setEditingBilling(false)}><X size={24}/></button>
            </div>
            <form onSubmit={handleUpdateBilling} className="order-modal-body">
              <div className="form-group">
                <label>Name</label>
                <input required type="text" value={billingAddress.name} onChange={e => setBillingAddress({...billingAddress, name: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Address Line 1</label>
                <input required type="text" value={billingAddress.addressLine1} onChange={e => setBillingAddress({...billingAddress, addressLine1: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Address Line 2</label>
                <input type="text" value={billingAddress.addressLine2} onChange={e => setBillingAddress({...billingAddress, addressLine2: e.target.value})} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input required type="text" value={billingAddress.city} onChange={e => setBillingAddress({...billingAddress, city: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input required type="text" value={billingAddress.state} onChange={e => setBillingAddress({...billingAddress, state: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Pincode</label>
                  <input required type="text" value={billingAddress.pincode} onChange={e => setBillingAddress({...billingAddress, pincode: e.target.value})} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Phone</label>
                  <input required type="tel" value={billingAddress.phone} onChange={e => setBillingAddress({...billingAddress, phone: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input required type="email" value={billingAddress.email} onChange={e => setBillingAddress({...billingAddress, email: e.target.value})} />
                </div>
              </div>
              <button type="submit" className="btn-playful btn-primary" disabled={savingAddress}>
                {savingAddress ? 'Saving...' : 'Save Address'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SHIPPING ADDRESS MODAL */}
      {editingShipping && (
        <div className="order-modal-overlay" onClick={() => setEditingShipping(false)}>
          <div className="order-modal-content address-modal" onClick={e => e.stopPropagation()}>
            <div className="order-modal-header">
              <h3>Edit Shipping Address</h3>
              <button className="close-btn" onClick={() => setEditingShipping(false)}><X size={24}/></button>
            </div>
            <form onSubmit={handleUpdateShipping} className="order-modal-body">
              <div className="form-group">
                <label>Name</label>
                <input required type="text" value={shippingAddress.name} onChange={e => setShippingAddress({...shippingAddress, name: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Address Line 1</label>
                <input required type="text" value={shippingAddress.addressLine1} onChange={e => setShippingAddress({...shippingAddress, addressLine1: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Address Line 2</label>
                <input type="text" value={shippingAddress.addressLine2} onChange={e => setShippingAddress({...shippingAddress, addressLine2: e.target.value})} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input required type="text" value={shippingAddress.city} onChange={e => setShippingAddress({...shippingAddress, city: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input required type="text" value={shippingAddress.state} onChange={e => setShippingAddress({...shippingAddress, state: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Pincode</label>
                  <input required type="text" value={shippingAddress.pincode} onChange={e => setShippingAddress({...shippingAddress, pincode: e.target.value})} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Phone</label>
                  <input required type="tel" value={shippingAddress.phone} onChange={e => setShippingAddress({...shippingAddress, phone: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input required type="email" value={shippingAddress.email} onChange={e => setShippingAddress({...shippingAddress, email: e.target.value})} />
                </div>
              </div>
              <button type="submit" className="btn-playful btn-primary" disabled={savingAddress}>
                {savingAddress ? 'Saving...' : 'Save Address'}
              </button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default UserDashboard;
