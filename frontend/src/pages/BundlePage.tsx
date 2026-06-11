import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Eye, Plus, Minus } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import API_BASE from '../config';
import { useCart } from '../context/CartContext';
import './BundlePage.css';

interface Product {
  _id: string;
  name: string;
  price: string;
  imageColor: string;
  imageUrl?: string;
  emoji: string;
}

const BUNDLE_PRICING: Record<number, number> = {
  2: 299,
  6: 799,
  12: 1499
};

const BundlePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [bundleType, setBundleType] = useState('ANIMAL VINGLITS');
  const [packSize, setPackSize] = useState<number>(2);
  const [animalSize, setAnimalSize] = useState<string>('');
  
  // productId -> quantity
  const [selectedItems, setSelectedItems] = useState<Record<string, number>>({});
  
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    axios.get(`${API_BASE}/api/products`)
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  const totalSelected = Object.values(selectedItems).reduce((sum, qty) => sum + qty, 0);

  const handleUpdateItem = (product: Product, delta: number) => {
    setSelectedItems(prev => {
      const currentQty = prev[product._id] || 0;
      const newQty = currentQty + delta;
      
      if (delta > 0 && totalSelected >= packSize) {
        return prev; // cannot exceed pack size
      }
      
      if (newQty <= 0) {
        const next = { ...prev };
        delete next[product._id];
        return next;
      }
      
      return { ...prev, [product._id]: newQty };
    });
  };

  const handleRemoveAll = () => {
    setSelectedItems({});
  };

  const handleAddBundleToCart = () => {
    if (totalSelected !== packSize) return;
    if (bundleType === 'ANIMAL VINGLITS' && !animalSize) return;

    const itemsForBundle = Object.keys(selectedItems).map(id => {
      const p = products.find(x => x._id === id);
      return {
        name: p?.name || 'Unknown Item',
        qty: selectedItems[id],
        imageUrl: p?.imageUrl
      };
    });

    const bundleItem = {
      _id: '', // Will be generated in CartContext
      name: 'Create Your Bundle',
      price: `₹${BUNDLE_PRICING[packSize] || 399}.00`,
      imageColor: '#f0f0f0',
      emoji: '🎁',
      imageUrl: itemsForBundle[0]?.imageUrl || '',
      isBundle: true,
      bundleDetails: {
        type: bundleType,
        packSize: packSize,
        size: bundleType === 'ANIMAL VINGLITS' ? animalSize : undefined,
        items: itemsForBundle
      }
    };

    addToCart(bundleItem);
    handleRemoveAll();
    navigate('/cart');
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      
      <div className="bundle-page">
        <div className="bundle-header">
          <h1>Create your bundle</h1>
          <p>Starting ₹399/- onwards</p>
        </div>

        {/* ── Selections ── */}
        <div className="bundle-selection-group">
          <h2>Choose Type</h2>
          <div className="bundle-options">
            <button 
              className={`bundle-opt-btn ${bundleType === 'ANIMAL VINGLITS' ? 'active' : ''}`}
              onClick={() => { setBundleType('ANIMAL VINGLITS'); handleRemoveAll(); }}
            >
              ANIMAL VINGLITS
            </button>
            <button 
              className={`bundle-opt-btn ${bundleType === 'MYSTERY EGGS' ? 'active' : ''}`}
              onClick={() => { setBundleType('MYSTERY EGGS'); handleRemoveAll(); }}
            >
              MYSTERY EGGS
            </button>
          </div>
        </div>

        <div className="bundle-selection-group">
          <h2>Choose Pack</h2>
          <div className="bundle-options">
            {[2, 6, 12].map(size => (
              <button 
                key={size}
                className={`bundle-opt-btn ${packSize === size ? 'active' : ''}`}
                onClick={() => { setPackSize(size); handleRemoveAll(); }}
              >
                PACK OF {size}
              </button>
            ))}
          </div>
        </div>

        {bundleType === 'ANIMAL VINGLITS' && (
          <div className="bundle-selection-group">
            <h2>Choose Size (Animal Only)</h2>
            <div className="bundle-options">
              {['MEDIUM', 'LARGE'].map(size => (
                <button 
                  key={size}
                  className={`bundle-opt-btn ${animalSize === size ? 'active' : ''}`}
                  onClick={() => setAnimalSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
            
            {!animalSize && selectedItems && Object.keys(selectedItems).length > 0 && (
              <p style={{ color: '#d9534f', marginTop: '15px', fontWeight: 'bold' }}>
                Pack of {packSize} selected. Now choose size (Medium/Large).
              </p>
            )}
          </div>
        )}

        {/* ── Main Section ── */}
        <div className="bundle-main">
          
          <div className="bundle-products-section">
            <h3>Pick Your Products</h3>
            <p className="bundle-warning">Warning: Choking hazard. Not suitable for children under 3 years old.</p>
            
            <div className="bundle-grid">
              {products.map(p => {
                const qty = selectedItems[p._id] || 0;
                return (
                  <div key={p._id} className="bundle-card">
                    <div 
                      className="bundle-eye-icon" 
                      onClick={() => navigate(`/product/${p._id}`)}
                      title="View Details"
                    >
                      <Eye size={18} />
                    </div>
                    {p.imageUrl ? (
                      <img 
                        src={p.imageUrl} 
                        alt={p.name} 
                        className="bundle-card-img" 
                        onClick={() => navigate(`/product/${p._id}`)}
                        style={{ cursor: 'pointer' }}
                      />
                    ) : (
                      <div 
                        className="bundle-card-img" 
                        onClick={() => navigate(`/product/${p._id}`)}
                        style={{ backgroundColor: p.imageColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem', cursor: 'pointer' }}
                      >
                        {p.emoji || '🧸'}
                      </div>
                    )}
                    <div className="bundle-card-info">
                      <h4 
                        onClick={() => navigate(`/product/${p._id}`)}
                        style={{ cursor: 'pointer' }}
                        title="View Details"
                      >
                        {p.name}
                      </h4>
                      
                      {qty > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                          <div className="bundle-qty-control">
                            <button className="bundle-qty-btn minus" onClick={() => handleUpdateItem(p, -1)}><Minus size={14}/></button>
                            <span style={{ fontWeight: 'bold' }}>{qty}</span>
                            <button className="bundle-qty-btn plus" onClick={() => handleUpdateItem(p, 1)} disabled={totalSelected >= packSize}><Plus size={14}/></button>
                          </div>
                          <span style={{ fontSize: '0.8rem', color: '#666' }}>In your bag: {qty}</span>
                        </div>
                      ) : (
                        <button 
                          className="bundle-card-add-btn"
                          onClick={() => handleUpdateItem(p, 1)}
                          disabled={totalSelected >= packSize}
                          style={{ opacity: totalSelected >= packSize ? 0.5 : 1 }}
                        >
                          Add to Bag
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bundle-sidebar-wrapper">
            <div className="bundle-sidebar">
              <div className="bundle-sidebar-header">
                {bundleType} selected — please fill Pack of {packSize}.
              </div>
              
              <div className="bundle-sidebar-items">
                {Object.keys(selectedItems).map(id => {
                  const p = products.find(x => x._id === id);
                  if (!p) return null;
                  const qty = selectedItems[id];
                  return (
                    <div key={id} className="bundle-sidebar-item">
                      <div className="bundle-sidebar-item-info">
                        {p.imageUrl ? (
                          <img src={p.imageUrl} alt={p.name} />
                        ) : (
                          <div style={{ width: 40, height: 40, borderRadius: 6, backgroundColor: p.imageColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {p.emoji}
                          </div>
                        )}
                        <span className="bundle-sidebar-item-name">{p.name}</span>
                      </div>
                      <div className="bundle-qty-control" style={{ marginBottom: 0 }}>
                        <button className="bundle-qty-btn minus" style={{ width: 24, height: 24 }} onClick={() => handleUpdateItem(p, -1)}><Minus size={12}/></button>
                        <span style={{ fontSize: '0.9rem' }}>{qty}</span>
                        <button className="bundle-qty-btn plus" style={{ width: 24, height: 24 }} onClick={() => handleUpdateItem(p, 1)} disabled={totalSelected >= packSize}><Plus size={12}/></button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {totalSelected > 0 && (
                <button className="bundle-remove-all" onClick={handleRemoveAll}>
                  Remove All
                </button>
              )}

              {bundleType === 'ANIMAL VINGLITS' && !animalSize && (
                <div className="bundle-size-warning">
                  Please select size (Medium/Large)
                </div>
              )}

              <div className="bundle-total">
                Bag total: {totalSelected} {totalSelected === 1 ? 'item' : 'items'}
              </div>

              <button 
                className="bundle-add-to-cart"
                disabled={totalSelected < packSize || (bundleType === 'ANIMAL VINGLITS' && !animalSize)}
                onClick={handleAddBundleToCart}
              >
                ADD BUNDLE TO CART
              </button>
            </div>
          </div>

        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default BundlePage;
