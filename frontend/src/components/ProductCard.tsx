import { ShoppingBag } from 'lucide-react';
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
  name, price, imageColor, imageUrl, badge, emoji, onAddToCart
}) => {
  const displayEmoji = emoji || EMOJIS[Math.abs(name.charCodeAt(0)) % EMOJIS.length];

  return (
    <div className="product-card">
      <div className="product-image-wrapper" style={{ backgroundColor: imageUrl ? '#f8f8f8' : imageColor }}>
        {badge && <span className="product-badge">{badge}</span>}
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
        <h3 className="product-name text-purple">{name}</h3>
        <p className="product-price text-pink">{price}</p>
        <button className="btn-playful btn-primary product-add-btn" onClick={onAddToCart}>
          <ShoppingBag size={18} style={{ marginRight: '0.5rem' }} /> Add to Box
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
