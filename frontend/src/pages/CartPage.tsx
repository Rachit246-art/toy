import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Ticket } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import API_BASE from '../config';
import './CartPage.css';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQty, clearCart, cartTotal } = useCart();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{code: string, discountAmount: number, discountType: string} | null>(null);
  const [couponMsg, setCouponMsg] = useState('');
  const [couponError, setCouponError] = useState(false);
  const [publicCoupons, setPublicCoupons] = useState<any[]>([]);

  useEffect(() => {
    axios.get(`${API_BASE}/api/coupons`)
      .then(res => setPublicCoupons(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setCouponMsg(''); setCouponError(false);
    try {
      const res = await axios.post(`${API_BASE}/api/coupons/validate`, { code: couponCode });
      setAppliedCoupon(res.data);
      setCouponMsg(`✅ ${res.data.code} applied successfully!`);
    } catch (err: any) {
      setCouponError(true);
      setCouponMsg(err.response?.data?.message || '❌ Invalid coupon');
      setAppliedCoupon(null);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponMsg('');
  };

  const discountAmount = appliedCoupon 
    ? (appliedCoupon.discountType === 'percentage' 
        ? (cartTotal * appliedCoupon.discountAmount) / 100 
        : appliedCoupon.discountAmount) 
    : 0;

  const totalAfterDiscount = Math.max(0, cartTotal - discountAmount);
  const shippingFee = totalAfterDiscount > 999 || totalAfterDiscount === 0 ? 0 : 99;
  const finalTotal = totalAfterDiscount + shippingFee;

  return (
    <div className="cart-page">
      <Navbar />

      <div className="cart-hero">
        <div className="floating-star star-a">🛒</div>
        <div className="floating-star star-b">⭐</div>
        <h1>Your Toy Box</h1>
        <p>Review your magical picks before checkout!</p>
      </div>

      <div className="container cart-layout">
        <div className="cart-items-section">
          <div className="cart-header-row">
            <button className="back-btn" onClick={() => navigate('/shop')}>
              <ArrowLeft size={18} /> Keep Shopping
            </button>
            {cartItems.length > 0 && (
              <button className="clear-btn" onClick={clearCart}>Clear All 🗑️</button>
            )}
          </div>

          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-icon">🧸</div>
              <h2 className="text-purple">Your Toy Box is Empty!</h2>
              <p>Go discover some magical toys and add them here.</p>
              <button className="btn-playful btn-primary" onClick={() => navigate('/shop')}
                style={{ marginTop: '1.5rem', backgroundColor: 'var(--color-pink)', color: 'white' }}>
                Shop Toys 🌟
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {cartItems.map(item => (
                <div key={item._id} className="cart-item" style={{ borderLeftColor: item.imageColor }}>
                  <div className="cart-item-img" style={{ backgroundColor: item.imageUrl ? '#f8f8f8' : item.imageColor }}>
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '15px' }} />
                    ) : (
                      <span className="cart-item-emoji">{item.emoji}</span>
                    )}
                  </div>
                  <div className="cart-item-details">
                    <h3 className="text-purple">{item.name}</h3>
                    {item.isBundle && item.bundleDetails && (
                      <div className="cart-bundle-details" style={{ fontSize: '0.85rem', color: '#555', marginTop: '5px' }}>
                        {item.bundleDetails.type && <div><strong>Type:</strong> {item.bundleDetails.type}</div>}
                        {item.bundleDetails.packSize && <div><strong>Pack:</strong> Pack of {item.bundleDetails.packSize}</div>}
                        {item.bundleDetails.size && <div><strong>Size:</strong> {item.bundleDetails.size}</div>}
                        <div style={{ marginTop: '5px', paddingLeft: '10px', borderLeft: '2px solid #eee' }}>
                          {item.bundleDetails.items.map((bItem, idx) => (
                            <div key={idx}>{bItem.name} (x{bItem.qty})</div>
                          ))}
                        </div>
                      </div>
                    )}
                    <p className="cart-item-price text-pink" style={{ marginTop: '5px' }}>{item.price}</p>
                  </div>
                  <div className="cart-qty-controls">
                    <button className="qty-btn" onClick={() => updateQty(item._id, item.quantity - 1)}>
                      <Minus size={16} />
                    </button>
                    <span className="qty-value">{item.quantity}</span>
                    <button className="qty-btn" onClick={() => updateQty(item._id, item.quantity + 1)}>
                      <Plus size={16} />
                    </button>
                  </div>
                  <div className="cart-item-subtotal text-purple">
                    ₹{(parseFloat(item.price.replace(/[^\d.]/g, '')) * item.quantity).toLocaleString()}
                  </div>
                  <button className="delete-btn" onClick={() => removeFromCart(item._id)}>
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-sidebar">
            <div className="coupon-section">
              <h3 className="text-purple" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem' }}>
                <Ticket size={20} /> Apply Coupon
              </h3>
              <div className="coupon-input-group">
                <input 
                  type="text" 
                  placeholder="Enter code" 
                  value={couponCode} 
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  disabled={!!appliedCoupon}
                />
                {!appliedCoupon ? (
                  <button onClick={handleApplyCoupon} className="btn-playful btn-primary" style={{ padding: '0.6rem 1rem' }}>Apply</button>
                ) : (
                  <button onClick={handleRemoveCoupon} className="btn-playful btn-danger" style={{ padding: '0.6rem 1rem' }}>Remove</button>
                )}
              </div>
              {couponMsg && (
                <div className={`coupon-msg ${couponError ? 'error' : 'success'}`}>{couponMsg}</div>
              )}
              
              {publicCoupons.length > 0 && !appliedCoupon && (
                <div className="public-coupons">
                  <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>Available Coupons:</p>
                  <div className="public-coupons-list">
                    {publicCoupons.map(c => (
                      <div key={c._id} className="public-coupon-card" onClick={() => setCouponCode(c.code)}>
                        <strong>{c.code}</strong>
                        <span>{c.discountType === 'percentage' ? `${c.discountAmount}%` : `₹${c.discountAmount}`} OFF</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="cart-summary">
              <h2 className="text-purple">Order Summary</h2>
              <div className="summary-line">
                <span>Items ({cartItems.reduce((s, i) => s + i.quantity, 0)})</span>
                <span>₹{cartTotal.toLocaleString()}</span>
              </div>
              {appliedCoupon && (
                <div className="summary-line text-orange">
                  <span>Discount ({appliedCoupon.code})</span>
                  <span>- ₹{discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="summary-line">
                <span>Delivery</span>
                {shippingFee === 0 ? (
                  <span className="text-pink">FREE 🎉</span>
                ) : (
                  <span className="text-orange">₹{shippingFee}</span>
                )}
              </div>
              <div className="summary-divider" />
              <div className="summary-line total">
                <span>Total</span>
                <span className="text-purple">₹{finalTotal.toLocaleString()}</span>
              </div>
              <button className="btn-playful btn-primary checkout-btn"
                onClick={() => navigate('/checkout', { state: { appliedCoupon, discountAmount, finalTotal, shippingFee } })}
                style={{ backgroundColor: 'var(--color-pink)', color: 'white', width: '100%', display: 'block', marginTop: '1.5rem' }}>
                <ShoppingBag size={20} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
                Checkout Now!
              </button>
              <p className="secure-note">🔒 Safe & Secure Checkout</p>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CartPage;
