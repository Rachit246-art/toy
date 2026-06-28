import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import API_BASE from '../config';
import SEO from '../components/SEO';
import './ShopPage.css';

interface Product {
  _id: string;
  name: string;
  price: string;
  imageColor: string;
  imageUrl: string;
  badge: string;
  emoji: string;
  category?: string;
}

const ShopPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const { addToCart } = useCart();
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category') || 'Toys';

  useEffect(() => {
    axios.get(`${API_BASE}/api/products`).then(res => setProducts(res.data));
  }, []);

  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const productCat = p.category || 'Toys';
    const matchesCategory = productCat === category;
    return matchesSearch && matchesCategory;
  });

  const getTitle = () => {
    if (category === 'DIY Paint Kit') return 'Magical DIY Paint Kits';
    if (category === 'Home Decor') return 'Magical Home Decor';
    if (category === 'Collectible') return 'Magical Collectibles';
    return 'Magical Toy Shop';
  };

  return (
    <div className="shop-page">
      <SEO 
        title="Shop 3D Printed Toys | Pigglitz" 
        description="Browse our amazing collection of 3D printed toys. Use our filters to find the perfect articulated animals, robots, bundles, and custom collectibles."
        keywords="buy 3d printed toys, shop toys, pigglitz shop, articulated toys, custom 3d prints"
        url="https://pigglitz.com/shop"
      />
      <Navbar />
      <div className="shop-hero">
        <div className="floating-star star-a">⭐</div>
        <div className="floating-star star-b">🌟</div>
        <div className="floating-star star-c">✨</div>
        <h1>{getTitle()}</h1>
        <p>Every item is a 3D printed masterpiece, made with love!</p>
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
                _id={p._id}
                name={p.name}
                price={p.price}
                imageColor={p.imageColor}
                imageUrl={p.imageUrl}
                badge={p.badge}
                emoji={p.emoji}
                onAddToCart={() =>
                  addToCart({
                    _id: p._id,
                    name: p.name,
                    price: p.price,
                    imageColor: p.imageColor,
                    emoji: p.emoji || '',
                    imageUrl: p.imageUrl,
                  })
                }
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
