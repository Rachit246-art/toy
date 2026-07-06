import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, Truck, Package, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import API_BASE from '../config';
import './CheckoutPage.css';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const CheckoutPage: React.FC = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const appliedCoupon = location.state?.appliedCoupon || null;
  const discountAmount = location.state?.discountAmount || 0;

  const totalAfterDiscount = Math.max(0, cartTotal - discountAmount);
  const calculatedShippingFee = totalAfterDiscount > 999 || totalAfterDiscount === 0 ? 0 : 99;
  const shippingFee = location.state?.shippingFee ?? calculatedShippingFee;
  const amountNeededForFreeShipping = 1000 - totalAfterDiscount;

  const finalTotal = location.state?.finalTotal || (totalAfterDiscount + shippingFee);

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const [formData, setFormData] = useState({
    name: user?.name || '', 
    email: user?.email || '', 
    phone: user?.phone || '', 
    address: '', 
    city: '', 
    pincode: ''
  });

  const handleUseSavedAddress = () => {
    if (user?.shippingAddress) {
      setFormData({
        name: user.shippingAddress.name || user.name || '',
        email: user.shippingAddress.email || user.email || '',
        phone: user.shippingAddress.phone || user.phone || '',
        address: user.shippingAddress.addressLine1 || '',
        city: user.shippingAddress.city || '',
        pincode: user.shippingAddress.pincode || ''
      });
    }
  };
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [paymentMethod] = useState<'Razorpay'>('Razorpay');

  // Load Razorpay Script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    setLoading(true);
    setErrorMsg('');

    try {
      const token = localStorage.getItem('token');
      const authHeader = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

      if (paymentMethod === 'Razorpay') {
        // 1. Create order on backend
        const orderRes = await axios.post(`${API_BASE}/api/payment/create-order`, { amount: finalTotal }, authHeader);
        const { id: order_id, amount, currency } = orderRes.data;

        // 2. Open Razorpay modal
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder_key_id',
          amount,
          currency,
          name: 'Pigglitz',
          description: 'Toy Purchase',
          order_id,
          handler: async function (response: any) {
            try {
              // 3. Verify payment
              const verifyRes = await axios.post(`${API_BASE}/api/payment/verify`, {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              }, authHeader);

              if (verifyRes.data.success) {
                // 4. Save order
                await saveOrderToDB('Razorpay', 'Paid', response.razorpay_order_id, response.razorpay_payment_id);
              }
            } catch (err) {
              console.error('Verification error', err);
              setErrorMsg('❌ Payment verification failed. Please contact support.');
              setLoading(false);
            }
          },
          prefill: {
            name: formData.name,
            email: formData.email,
            contact: formData.phone
          },
          theme: {
            color: '#FF69B4'
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function () {
          setErrorMsg('❌ Payment failed. Please try again.');
          setLoading(false);
        });
        rzp.open();
      } else {
        // COD
        await saveOrderToDB('COD', 'Pending');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('❌ Failed to place order. Please try again.');
      setLoading(false);
    }
  };

  const saveOrderToDB = async (method: string, status: string, rzpOrderId?: string, rzpPaymentId?: string) => {
    try {
      const token = localStorage.getItem('token');
      const authHeader = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

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
        totalAmount: finalTotal,
        paymentMethod: method,
        paymentStatus: status,
        razorpayOrderId: rzpOrderId,
        razorpayPaymentId: rzpPaymentId
      }, authHeader);

      // Save address to user profile if logged in
      if (token) {
        try {
          const shippingAddress = {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            addressLine1: formData.address,
            city: formData.city,
            pincode: formData.pincode,
            country: 'India'
          };
          await axios.put(`${API_BASE}/api/users/profile`, { shippingAddress }, authHeader);
          
          if (user) {
            user.shippingAddress = shippingAddress;
            localStorage.setItem('user', JSON.stringify(user));
          }
        } catch (e) {
          console.error('Could not save address to profile', e);
        }
      }

      // Send email notification to admin via Web3Forms
      const orderDetails = cartItems.map(item => `${item.quantity}x ${item.name} (${item.price?.includes('₹') ? item.price : `₹${item.price}`})`).join('\n');
      
      await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: '8aa80828-cad0-4815-bc89-2026e2eaa6db',
          subject: `New Order Placed by ${formData.name}`,
          from_name: 'Pinaka Toys',
          name: formData.name,
          email: formData.email,
          message: `New Order Details:\nName: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nAddress: ${formData.address}, ${formData.city}, ${formData.pincode}\n\nItems:\n${orderDetails}\n\nTotal Amount: ₹${finalTotal}\nPayment Method: ${method}`
        })
      }).catch(err => console.error('Failed to send email notification:', err));

      setOrderSuccess(true);
      clearCart();
    } catch (err) {
      console.error('Failed to save order to DB', err);
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
            <div className="form-section address-card-style">
              <div className="address-section-header" style={{ marginBottom: '1.5rem', borderBottom: '1px solid #eaeaea', paddingBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#333' }}>
                  <Truck size={20}/> Delivery Information
                </h3>
                {user?.shippingAddress?.addressLine1 && (
                  <button 
                    type="button" 
                    onClick={handleUseSavedAddress}
                    style={{ background: '#f0f0f0', border: '1px solid #ccc', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    Use Saved Address
                  </button>
                )}
              </div>
              
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
              
              <div 
                className="payment-option selected"
                style={{ cursor: 'default', marginBottom: '10px' }}
              >
                <input type="radio" checked={true} readOnly />
                <span>Online Payment (UPI, Cards, Wallets)</span>
              </div>

              <p className="payment-note">
                Secure online payment powered by Razorpay.
              </p>
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
            
            {shippingFee > 0 && totalAfterDiscount > 0 && (
              <div style={{ backgroundColor: '#e6f4ff', color: 'var(--color-blue)', padding: '10px', borderRadius: '8px', marginBottom: '15px', fontSize: '0.85rem', textAlign: 'center', fontWeight: 'bold', border: '1px dashed var(--color-blue)' }}>
                Add ₹{amountNeededForFreeShipping} more for FREE Delivery! 🚚
              </div>
            )}

            <div className="summary-items">
              {cartItems.map(item => (
                <div key={item._id} className="summary-item">
                  <div className="summary-item-img" style={{ backgroundColor: item.imageUrl ? '#f8f8f8' : item.imageColor }}>
                    {item.imageUrl ? <img src={item.imageUrl} alt={item.name} /> : <span>{item.emoji}</span>}
                  </div>
                  <div className="summary-item-info">
                    <h4>{item.name}</h4>
                    {item.isBundle && item.bundleDetails && item.bundleDetails.type && item.bundleDetails.packSize && (
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
                {shippingFee === 0 ? (
                  <span className="text-pink">FREE</span>
                ) : (
                  <span className="text-orange">₹{shippingFee}</span>
                )}
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
