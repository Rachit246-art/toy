import { ShoppingBag, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import './ProductCard.css';

interface ProductCardProps {
  _id?: string;
  name: string;
  price: string;
  imageColor: string;
  imageUrl?: string;
  badge?: string;
  emoji?: string;
  onAddToCart?: () => void;
}

const EMOJIS = ['🧸', '🚀', '🦕', '🤖', '🦄', '🎠', '🐉', '🎪', '🎡', '🎨'];

const ProductCard: React.FC<ProductCardProps> = ({
  _id, name, price, imageColor, imageUrl, badge, emoji, onAddToCart
}) => {
  const navigate = useNavigate();
  const displayEmoji = emoji || EMOJIS[Math.abs(name.charCodeAt(0)) % EMOJIS.length];

  // Wishlist logic
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const isWished = _id ? isInWishlist(_id) : false;

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!_id) return;
    if (isWished) {
      removeFromWishlist(_id);
    } else {
      addToWishlist({
        _id, name, price, imageColor, emoji: displayEmoji, imageUrl
      });
    }
  };

  const handleCardClick = () => {
    if (_id && name) {
      const slug = name.replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').toLowerCase();
      navigate(`/product/${slug}`);
    }
  };

  return (
    <div className="product-card">
      <div 
        className="product-image-wrapper" 
        style={{ backgroundColor: imageUrl ? '#f8f8f8' : imageColor, cursor: 'pointer' }}
        onClick={handleCardClick}
      >
        {badge && <span className="product-badge">{badge}</span>}
        
        {/* Heart Icon */}
        <button 
          className={`wishlist-heart-btn ${isWished ? 'wished' : ''}`} 
          onClick={handleHeartClick}
          aria-label="Toggle Wishlist"
        >
          <Heart size={20} fill={isWished ? "var(--color-pink)" : "none"} color={isWished ? "var(--color-pink)" : "#666"} />
        </button>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="product-real-img"
            onError={e => {
              // fallback to emoji if image fails
              const target = e.currentTarget;
              target.style.display = 'none';
              const fallback = target.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = 'flex';
            }}
          />
        ) : null}
        <div
          className="product-image-placeholder animate-bounce"
          style={{ display: imageUrl ? 'none' : 'flex' }}
        >
          {displayEmoji}
        </div>
      </div>
      <div className="product-info">
        <h3 className="product-name text-purple" style={{ cursor: 'pointer' }} onClick={handleCardClick}>{name}</h3>
        <p className="product-price text-pink">{price}</p>
        <button className="btn-playful btn-primary product-add-btn" onClick={onAddToCart}>
          <ShoppingBag size={18} style={{ marginRight: '0.5rem' }} /> Add to Box
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
