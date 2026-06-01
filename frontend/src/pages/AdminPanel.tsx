import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Trash2, Film, Plus } from 'lucide-react';
import './AdminPanel.css';

interface Product {
  _id: string;
  name: string;
  price: string;
  imageColor: string;
  badge: string;
}

interface Reel {
  _id: string;
  title: string;
  youtubeUrl: string;
  likes: number;
}

const AdminPanel: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [imageColor, setImageColor] = useState('#FFC400');
  const [badge, setBadge] = useState('');

  const [reels, setReels] = useState<Reel[]>([]);
  const [reelTitle, setReelTitle] = useState('');
  const [reelUrl, setReelUrl] = useState('');
  const [reelLikes, setReelLikes] = useState('0');
  const [reelMsg, setReelMsg] = useState('');

  const navigate = useNavigate();

  const token = () => localStorage.getItem('token');
  const authHeader = () => ({ headers: { Authorization: `Bearer ${token()}` } });

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchReels = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/reels');
      setReels(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    if (!token()) { navigate('/login'); return; }
    fetchProducts();
    fetchReels();
  }, [navigate]);

  /* ── Products ── */
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/products', { name, price, imageColor, badge }, authHeader());
      setName(''); setPrice(''); setImageColor('#FFC400'); setBadge('');
      fetchProducts();
    } catch (err) {
      if ((err as any).response?.status === 401 || (err as any).response?.status === 403) {
        localStorage.removeItem('token'); navigate('/login');
      }
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, authHeader());
      fetchProducts();
    } catch (err) { console.error(err); }
  };

  /* ── Reels ── */
  const handleAddReel = async (e: React.FormEvent) => {
    e.preventDefault();
    setReelMsg('');
    try {
      await axios.post(
        'http://localhost:5000/api/reels',
        { title: reelTitle, youtubeUrl: reelUrl, likes: parseInt(reelLikes) || 0 },
        authHeader()
      );
      setReelTitle(''); setReelUrl(''); setReelLikes('0');
      setReelMsg('✅ Reel added!');
      fetchReels();
    } catch (err) {
      setReelMsg('❌ Failed to add reel.');
    }
  };

  const handleDeleteReel = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/reels/${id}`, authHeader());
      fetchReels();
    } catch (err) { console.error(err); }
  };

  const handleLogout = () => { localStorage.removeItem('token'); navigate('/login'); };

  return (
    <div className="admin-page container">
      <div className="admin-header">
        <h1 className="text-purple">Pigglitz Admin Pitara</h1>
        <button onClick={handleLogout} className="btn-playful btn-secondary">Logout</button>
      </div>

      {/* ── Products section ── */}
      <div className="admin-content">
        <div className="admin-form-container">
          <h2 className="text-pink">Add Magic Toy</h2>
          <form onSubmit={handleAddProduct} className="admin-form">
            <input type="text" placeholder="Toy Name" value={name} onChange={e => setName(e.target.value)} required className="playful-input" />
            <input type="text" placeholder="Price (e.g. ₹499)" value={price} onChange={e => setPrice(e.target.value)} required className="playful-input" />
            <div className="color-picker-container">
              <label>Toy Background Color:</label>
              <input type="color" value={imageColor} onChange={e => setImageColor(e.target.value)} className="color-input" />
            </div>
            <input type="text" placeholder="Badge (e.g. New!, Best Seller)" value={badge} onChange={e => setBadge(e.target.value)} className="playful-input" />
            <button type="submit" className="btn-playful btn-primary">Add to Pitara</button>
          </form>
        </div>

        <div className="admin-list-container">
          <h2 className="text-blue">Current Toys</h2>
          <div className="admin-product-list">
            {products.map(p => (
              <div key={p._id} className="admin-product-item" style={{ borderLeftColor: p.imageColor }}>
                <div className="product-details">
                  <h3>{p.name}</h3>
                  <p>{p.price}</p>
                </div>
                <button onClick={() => handleDeleteProduct(p._id)} className="btn-playful btn-danger">Delete</button>
              </div>
            ))}
            {products.length === 0 && <p>No toys in the Pitara yet!</p>}
          </div>
        </div>
      </div>

      {/* ── Video Reels section ── */}
      <div className="admin-reels-section">
        <div className="admin-reels-header">
          <Film size={26} color="var(--color-purple)" />
          <h2 className="text-purple">Video Reels</h2>
          <span className="reels-badge">{reels.length} reels</span>
        </div>

        <div className="admin-content">
          {/* Add reel form */}
          <div className="admin-form-container reel-form-container">
            <h3 className="text-pink" style={{ marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Plus size={18} /> Add New Reel
            </h3>
            <form onSubmit={handleAddReel} className="admin-form">
              <input
                type="text"
                placeholder="Reel title (e.g. Kids unboxing Dino Rex!)"
                value={reelTitle}
                onChange={e => setReelTitle(e.target.value)}
                required
                className="playful-input"
              />
              <input
                type="url"
                placeholder="YouTube URL (e.g. https://youtu.be/abc123)"
                value={reelUrl}
                onChange={e => setReelUrl(e.target.value)}
                required
                className="playful-input"
              />
              <input
                type="number"
                placeholder="Likes count (e.g. 326)"
                value={reelLikes}
                onChange={e => setReelLikes(e.target.value)}
                min="0"
                className="playful-input"
              />
              <button type="submit" className="btn-playful btn-primary">
                <Film size={16} style={{ marginRight: '0.4rem', verticalAlign: 'middle' }} />
                Add Reel
              </button>
              {reelMsg && <p className="reel-msg">{reelMsg}</p>}
            </form>
            <div className="reel-url-hint">
              <strong>Supported URLs:</strong><br />
              youtube.com/watch?v=… &nbsp;|&nbsp; youtu.be/… &nbsp;|&nbsp; youtube.com/shorts/…
            </div>
          </div>

          {/* Reel list */}
          <div className="admin-list-container reel-list-container">
            <h3 className="text-blue" style={{ marginBottom: '1.2rem' }}>Published Reels</h3>
            <div className="admin-product-list">
              {reels.map(r => (
                <div key={r._id} className="admin-reel-item">
                  <div className="reel-item-thumb">
                    <img
                      src={`https://img.youtube.com/vi/${extractId(r.youtubeUrl)}/default.jpg`}
                      alt={r.title}
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  </div>
                  <div className="reel-item-info">
                    <h4>{r.title}</h4>
                    <p className="reel-item-url">{r.youtubeUrl}</p>
                    <span className="reel-item-likes">❤️ {r.likes.toLocaleString()} likes</span>
                  </div>
                  <button onClick={() => handleDeleteReel(r._id)} className="btn-playful btn-danger reel-delete-btn">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              {reels.length === 0 && <p style={{ color: '#888' }}>No reels yet. Add your first one!</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* Helper — extract YouTube ID for thumbnail preview */
function extractId(url: string): string {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([^&?/\s]{11})/);
  return m ? m[1] : '';
}

export default AdminPanel;
