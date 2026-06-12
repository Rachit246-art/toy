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

const BundlePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
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

  const calculateTotalBundlePrice = () => {
    let total = 0;
    Object.keys(selectedItems).forEach(id => {
      const p = products.find(x => x._id === id);
      if (p) {
        const pPrice = parseInt(p.price.replace(/[^0-9]/g, '')) || 0;
        total += pPrice * selectedItems[id];
      }
    });
    return total;
  };

  const handleUpdateItem = (product: Product, delta: number) => {
    setSelectedItems(prev => {
      const currentQty = prev[product._id] || 0;
      const newQty = currentQty + delta;
      
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
    if (totalSelected < 2) return; // Needs more than one item

    let totalPrice = 0;
    const itemsForBundle = Object.keys(selectedItems).map(id => {
      const p = products.find(x => x._id === id);
      const qty = selectedItems[id];
      if (p) {
        const pPrice = parseInt(p.price.replace(/[^0-9]/g, '')) || 0;
        totalPrice += pPrice * qty;
      }
      return {
        name: p?.name || 'Unknown Item',
        qty: qty,
        imageUrl: p?.imageUrl
      };
    });

    const bundleItem = {
      _id: '', // Will be generated in CartContext
      name: 'Custom Bundle',
      price: `₹${totalPrice}.00`,
      imageColor: '#f0f0f0',
      emoji: '🎁',
      imageUrl: itemsForBundle[0]?.imageUrl || '',
      isBundle: true,
      bundleDetails: {
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
          <p>Add 2 or more items to create a custom bundle!</p>
        </div>

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
                      <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', color: '#555' }}>{p.price}</p>
                      
                      {qty > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                          <div className="bundle-qty-control">
                            <button className="bundle-qty-btn minus" onClick={() => handleUpdateItem(p, -1)}><Minus size={14}/></button>
                            <span style={{ fontWeight: 'bold' }}>{qty}</span>
                            <button className="bundle-qty-btn plus" onClick={() => handleUpdateItem(p, 1)}><Plus size={14}/></button>
                          </div>
                          <span style={{ fontSize: '0.8rem', color: '#666' }}>In your bag: {qty}</span>
                        </div>
                      ) : (
                        <button 
                          className="bundle-card-add-btn"
                          onClick={() => handleUpdateItem(p, 1)}
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
                Your Custom Bundle
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
                        <button className="bundle-qty-btn plus" style={{ width: 24, height: 24 }} onClick={() => handleUpdateItem(p, 1)}><Plus size={12}/></button>
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

              {totalSelected < 2 && (
                <div className="bundle-size-warning">
                  Add at least {2 - totalSelected} more {2 - totalSelected === 1 ? 'item' : 'items'}
                </div>
              )}

              <div className="bundle-total">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span>Total Items:</span>
                  <span>{totalSelected}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-purple)' }}>
                  <span>Bundle Value:</span>
                  <span>₹{calculateTotalBundlePrice()}</span>
                </div>
              </div>

              <button 
                className="bundle-add-to-cart"
                disabled={totalSelected < 2}
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
