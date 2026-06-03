import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import API_BASE from '../config';
import './ShopPage.css';

interface Product {
  _id: string;
  name: string;
  price: string;
  imageColor: string;
  imageUrl: string;
  badge: string;
  emoji: string;
}

const ShopPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios.get(`${API_BASE}/api/products`).then(res => setProducts(res.data));
  }, []);

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="shop-page">
      <Navbar />
      <div className="shop-hero">
        <div className="floating-star star-a">⭐</div>
        <div className="floating-star star-b">🌟</div>
        <div className="floating-star star-c">✨</div>
        <h1>Magical Toy Shop</h1>
        <p>Every toy is a 3D printed masterpiece, made with love!</p>
        <div className="search-bar-wrapper">
          <input
            type="text"
            placeholder="🔍 Search for toys..."
            className="shop-search"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="container shop-grid-section">
        <div className="products-grid">
          {filtered.length > 0 ? (
            filtered.map(p => (
              <ProductCard
                key={p._id}
                name={p.name}
                price={p.price}
                imageColor={p.imageColor}
                imageUrl={p.imageUrl}
                badge={p.badge}
                emoji={p.emoji}
              />
            ))
          ) : (
            <p className="no-toys">No toys found! Try a different search 🧸</p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ShopPage;
