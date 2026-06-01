import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './CartPage.css';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQty, clearCart, cartTotal } = useCart();
  const navigate = useNavigate();

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
                  <div className="cart-item-img" style={{ backgroundColor: item.imageColor }}>
                    <span className="cart-item-emoji">{item.emoji}</span>
                  </div>
                  <div className="cart-item-details">
                    <h3 className="text-purple">{item.name}</h3>
                    <p className="cart-item-price text-pink">{item.price}</p>
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
          <div className="cart-summary">
            <h2 className="text-purple">Order Summary</h2>
            <div className="summary-line">
              <span>Items ({cartItems.reduce((s, i) => s + i.quantity, 0)})</span>
              <span>₹{cartTotal.toLocaleString()}</span>
            </div>
            <div className="summary-line">
              <span>Delivery</span>
              <span className="text-pink">FREE 🎉</span>
            </div>
            <div className="summary-divider" />
            <div className="summary-line total">
              <span>Total</span>
              <span className="text-purple">₹{cartTotal.toLocaleString()}</span>
            </div>
            <button className="btn-playful btn-primary checkout-btn"
              style={{ backgroundColor: 'var(--color-pink)', color: 'white', width: '100%', display: 'block', marginTop: '1.5rem' }}>
              <ShoppingBag size={20} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
              Checkout Now!
            </button>
            <p className="secure-note">🔒 Safe & Secure Checkout</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CartPage;
