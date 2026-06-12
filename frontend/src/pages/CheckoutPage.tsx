import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, Truck, Package, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import API_BASE from '../config';
import './CheckoutPage.css';

const CheckoutPage: React.FC = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const appliedCoupon = location.state?.appliedCoupon || null;
  const discountAmount = location.state?.discountAmount || 0;
  const finalTotal = location.state?.finalTotal || cartTotal;

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const [formData, setFormData] = useState({
    name: user?.name || '', 
    email: user?.email || '', 
    phone: user?.phone || '', 
    address: '', city: '', pincode: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    setLoading(true);
    setErrorMsg('');

    try {
      await axios.post(`${API_BASE}/api/orders`, {
        customerInfo: formData,
        items: cartItems.map(item => ({
          _id: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          imageUrl: item.imageUrl,
          isBundle: item.isBundle || false,
          bundleDetails: item.bundleDetails || undefined
        })),
        totalAmount: finalTotal
      });

      // Send email notification to admin via Web3Forms
      const orderDetails = cartItems.map(item => `${item.quantity}x ${item.name} (₹${item.price})`).join('\n');
      
      await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: '5e01a1fa-2a30-407f-a768-4021d397dccf',
          subject: `New Order Placed by ${formData.name}`,
          from_name: 'Pinaka Toys',
          name: formData.name,
          email: formData.email,
          message: `New Order Details:\nName: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nAddress: ${formData.address}, ${formData.city}, ${formData.pincode}\n\nItems:\n${orderDetails}\n\nTotal Amount: ₹${finalTotal}\nPayment Method: Cash on Delivery`
        })
      }).catch(err => console.error('Failed to send email notification:', err));

      setOrderSuccess(true);
      clearCart();
    } catch (err) {
      console.error(err);
      setErrorMsg('❌ Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="checkout-page">
        <Navbar />
        <div className="container success-container">
          <div className="success-icon">
            <CheckCircle size={80} color="var(--color-green)" />
          </div>
          <h1 className="text-purple">Order Placed Successfully! 🎉</h1>
          <p>Thank you for your purchase. We are getting your magical toys ready for shipment!</p>
          <div className="success-actions">
            <button className="btn-playful btn-primary" onClick={() => navigate('/shop')}>
              Continue Shopping 🌟
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="checkout-page">
        <Navbar />
        <div className="container empty-checkout">
          <h2>Your cart is empty!</h2>
          <button className="btn-playful btn-primary" onClick={() => navigate('/shop')}>
            Back to Shop
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <Navbar />
      
      <div className="container checkout-container">
        
        <div className="checkout-main">
          <button className="back-btn" onClick={() => navigate('/cart')}>
            <ArrowLeft size={18} /> Back to Cart
          </button>
          
          <h1 className="checkout-title text-purple">Secure Checkout</h1>
          <p className="checkout-subtitle">Please enter your shipping details below.</p>
          
          <form className="checkout-form" onSubmit={handlePlaceOrder}>
            <div className="form-section">
              <h3><Truck size={20}/> Delivery Information</h3>
              
              <div className="input-row">
                <div className="input-group">
                  <label>Full Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Papa Bear" />
                </div>
                <div className="input-group">
                  <label>Email Address</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="papa@bear.com" />
                </div>
              </div>
              
              <div className="input-group">
                <label>Phone Number</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="10-digit mobile number" />
              </div>
              
              <div className="input-group">
                <label>Shipping Address</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} required placeholder="House No, Street, Landmark" />
              </div>
              
              <div className="input-row">
                <div className="input-group">
                  <label>City</label>
                  <input type="text" name="city" value={formData.city} onChange={handleChange} required placeholder="e.g. Kanpur" />
                </div>
                <div className="input-group">
                  <label>Pincode</label>
                  <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} required placeholder="e.g. 208001" />
                </div>
              </div>
            </div>

            <div className="form-section payment-section">
              <h3><Package size={20}/> Payment Method</h3>
              <div className="payment-option selected">
                <input type="radio" checked readOnly />
                <span>Cash on Delivery (COD)</span>
              </div>
              <p className="payment-note">Pay conveniently with cash when your toys arrive!</p>
            </div>

            {errorMsg && <div className="error-msg">{errorMsg}</div>}

            <button type="submit" className="btn-playful btn-primary place-order-btn" disabled={loading}>
              {loading ? 'Processing...' : 'Place Order Now'}
            </button>
          </form>
        </div>

        <div className="checkout-sidebar">
          <div className="order-summary-box">
            <h3 className="text-purple">Order Summary</h3>
            <div className="summary-items">
              {cartItems.map(item => (
                <div key={item._id} className="summary-item">
                  <div className="summary-item-img" style={{ backgroundColor: item.imageUrl ? '#f8f8f8' : item.imageColor }}>
                    {item.imageUrl ? <img src={item.imageUrl} alt={item.name} /> : <span>{item.emoji}</span>}
                  </div>
                  <div className="summary-item-info">
                    <h4>{item.name}</h4>
                    {item.isBundle && item.bundleDetails && (
                      <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '4px' }}>
                        {item.bundleDetails.type} ({item.bundleDetails.packSize})
                      </div>
                    )}
                    <span>Qty: {item.quantity}</span>
                  </div>
                  <div className="summary-item-price">
                    ₹{(parseFloat(item.price.replace(/[^\d.]/g, '')) * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="summary-calc">
              <div className="calc-row">
                <span>Subtotal</span>
                <span>₹{cartTotal.toLocaleString()}</span>
              </div>
              {appliedCoupon && (
                <div className="calc-row text-orange">
                  <span>Discount ({appliedCoupon.code})</span>
                  <span>- ₹{discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="calc-row">
                <span>Shipping</span>
                <span className="text-pink">FREE</span>
              </div>
              <div className="calc-divider" />
              <div className="calc-row total">
                <span>Total</span>
                <span>₹{finalTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
};

export default CheckoutPage;
