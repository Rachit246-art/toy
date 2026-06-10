import { useNavigate } from 'react-router-dom';
import { Trash2, ArrowLeft } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './WishlistPage.css';

const WishlistPage = () => {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  return (
    <div className="wishlist-page">
      <Navbar />

      <div className="wishlist-hero">
        <div className="floating-star star-a">❤️</div>
        <div className="floating-star star-b">✨</div>
        <h1>Your Wishlist</h1>
        <p>Your favorite magical toys, saved just for you!</p>
      </div>

      <div className="container wishlist-layout">
        <div className="wishlist-header-row">
          <button className="back-btn" onClick={() => navigate('/shop')}>
            <ArrowLeft size={18} /> Keep Shopping
          </button>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="empty-wishlist">
            <div className="empty-icon">💔</div>
            <h2 className="text-purple">Your Wishlist is Empty!</h2>
            <p>Find some magical toys you love and tap the heart to save them here.</p>
            <button className="btn-playful btn-primary" onClick={() => navigate('/shop')}
              style={{ marginTop: '1.5rem', backgroundColor: 'var(--color-pink)', color: 'white' }}>
              Discover Toys 🌟
            </button>
          </div>
        ) : (
          <div className="wishlist-items-list">
            {wishlistItems.map(item => (
              <div key={item._id} className="wishlist-item" style={{ borderLeftColor: item.imageColor }}>
                <div className="wishlist-item-img" style={{ backgroundColor: item.imageUrl ? '#f8f8f8' : item.imageColor }}>
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '15px' }} />
                  ) : (
                    <span className="wishlist-item-emoji">{item.emoji}</span>
                  )}
                </div>
                <div className="wishlist-item-details">
                  <h3 className="text-purple">{item.name}</h3>
                  <p className="wishlist-item-price text-pink">{item.price}</p>
                </div>
                <div className="wishlist-actions">
                  <button className="btn-playful btn-primary add-to-box-btn" onClick={() => {
                    addToCart({
                      _id: item._id,
                      name: item.name,
                      price: item.price,
                      imageColor: item.imageColor,
                      emoji: item.emoji,
                      imageUrl: item.imageUrl
                    });
                    removeFromWishlist(item._id); // Optional: remove from wishlist after adding to cart
                  }}>
                    Move to Box
                  </button>
                  <button className="delete-btn" onClick={() => removeFromWishlist(item._id)} title="Remove">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default WishlistPage;
