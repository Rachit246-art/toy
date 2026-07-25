import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE from '../../config';

interface Order {
  _id: string;
  customerInfo: { name: string; email: string; phone: string; alternatePhone?: string; address: string; locality?: string; landmark?: string; city: string; state?: string; pincode: string };
  items: { _id: string; name: string; price: string; quantity: number; imageUrl: string }[];
  totalAmount: number;
  status: string;
  trackingLink?: string;
  deliveryImageUrl?: string;
  orderId?: string;
  createdAt: string;
}

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [uploadingOrder, setUploadingOrder] = useState<string | null>(null);

  const token = () => localStorage.getItem('token');
  const authHeader = () => ({ headers: { Authorization: `Bearer ${token()}` } });

  const fetchOrders = async () => {
    try { const r = await axios.get(`${API_BASE}/api/orders`, authHeader()); setOrders(r.data); }
    catch (e) { console.error(e); }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (id: string, newStatus: string, order: Order) => {
    try { 
      await axios.patch(`${API_BASE}/api/orders/${id}/status`, { status: newStatus }, authHeader()); 
      fetchOrders(); 
      
      // Redirect to WhatsApp with pre-filled message
      let phone = order.customerInfo.phone.replace(/[^0-9+]/g, '');
      if (phone.length === 10 && !phone.startsWith('+')) {
        phone = '91' + phone; // Default to India code if just 10 digits
      } else if (phone.startsWith('+')) {
        phone = phone.substring(1); // wa.me requires phone number without +
      }
      
      const orderNumber = order.orderId || order._id.slice(-6).toUpperCase();
      const checkStatusLink = `${window.location.origin}/my-orders`;
      const message = `Hi ${order.customerInfo.name},\n\nThe status of your Pigglitz order #${orderNumber} has been updated to: *${newStatus}*.\n\nYou can check your order status here: ${checkStatusLink}`;
      
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
    } catch (e) { console.error(e); }
  };

  const updateTrackingLink = async (id: string, link: string) => {
    try {
      await axios.patch(`${API_BASE}/api/orders/${id}/tracking-link`, { trackingLink: link }, authHeader());
      alert('Tracking link updated successfully!');
      fetchOrders();
    } catch (e) {
      console.error(e);
      alert('Failed to update tracking link.');
    }
  };

  const uploadDeliveryImage = async (id: string, file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    setUploadingOrder(id);
    try {
      await axios.patch(`${API_BASE}/api/orders/${id}/delivery-image`, formData, {
        headers: {
          ...authHeader().headers,
          'Content-Type': 'multipart/form-data'
        }
      });
      fetchOrders();
    } catch (e) {
      console.error(e);
      alert('Failed to upload image.');
    } finally {
      setUploadingOrder(null);
    }
  };

  return (
    <div className="admin-page container">
      <div className="admin-section-title" style={{ marginTop: 0 }}><span>📦</span> Order Management</div>
      <div className="admin-list-container">
        <h2 className="text-purple" style={{ marginBottom: '1.5rem' }}>Recent Orders ({orders.length})</h2>
          
        {orders.length === 0 ? (
          <p style={{color:'#888', padding: '1rem 0'}}>No orders yet.</p>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID & Date</th>
                  <th>Customer Details</th>
                  <th>Items Ordered</th>
                  <th>Total Amount</th>
                  <th>Status Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o._id}>
                    <td>
                      <strong>#{o.orderId || o._id.slice(-6).toUpperCase()}</strong>
                      <div className="table-subtext">{new Date(o.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td>
                      <strong>{o.customerInfo.name}</strong>
                      <div className="table-subtext">
                        {o.customerInfo.phone}
                        {o.customerInfo.alternatePhone && ` / ${o.customerInfo.alternatePhone}`}
                      </div>
                      <div className="table-subtext">
                        {o.customerInfo.address}
                        {o.customerInfo.locality && `, ${o.customerInfo.locality}`}
                        {o.customerInfo.landmark && ` (Near ${o.customerInfo.landmark})`}
                        <br />
                        {o.customerInfo.city}
                        {o.customerInfo.state && `, ${o.customerInfo.state}`} - {o.customerInfo.pincode}
                      </div>
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
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                        <select 
                          className={`status-select status-${o.status.replace(/\s+/g, '-').toLowerCase()}`}
                          value={o.status} 
                          onChange={(e) => updateOrderStatus(o._id, e.target.value, o)}
                          style={{ padding: '0.4rem', borderRadius: '6px', border: '1px solid #ccc' }}
                        >
                          <option value="Order Placed">Order Placed</option>
                          <option value="In Transit">In Transit</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                          {/* Fallbacks for older data */}
                          {o.status === 'Pending' && <option value="Pending">Pending</option>}
                          {o.status === 'Shipped' && <option value="Shipped">Shipped</option>}
                        </select>
                        
                        <div style={{ fontSize: '0.85rem' }}>
                          <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Delivery Image</label>
                          {o.deliveryImageUrl ? (
                            <a href={o.deliveryImageUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--color-blue)', textDecoration: 'underline' }}>View Image</a>
                          ) : (
                            <span style={{ color: '#888' }}>Not uploaded</span>
                          )}
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                uploadDeliveryImage(o._id, e.target.files[0]);
                              }
                            }}
                            style={{ display: 'block', marginTop: '6px', fontSize: '0.8rem' }}
                            disabled={uploadingOrder === o._id}
                          />
                          {uploadingOrder === o._id && <span style={{ color: 'var(--color-pink)' }}>Uploading...</span>}
                        </div>

                        <div style={{ fontSize: '0.85rem' }}>
                          <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Tracking Link</label>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input 
                              type="text" 
                              placeholder="https://..." 
                              defaultValue={o.trackingLink || ''}
                              onBlur={(e) => {
                                if (e.target.value !== (o.trackingLink || '')) {
                                  updateTrackingLink(o._id, e.target.value);
                                }
                              }}
                              style={{ flex: 1, padding: '0.3rem', borderRadius: '4px', border: '1px solid #ccc', fontSize: '0.8rem' }}
                            />
                          </div>
                        </div>
                      </div>
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

export default OrderManagement;
