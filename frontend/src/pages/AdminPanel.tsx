import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Trash2, Film, Plus, Star, Zap, CheckCircle, Circle, Upload, X, Home, Edit2, Save } from 'lucide-react';
import Navbar from '../components/Navbar';
import API_BASE from '../config';
import './AdminPanel.css';

interface Product {
  _id: string; name: string; price: string; imageColor: string;
  imageUrl: string; badge: string; emoji: string;
  isFeatured: boolean; isNewArrival: boolean;
}
interface Reel {
  _id: string;
  title: string;
  youtubeUrl: string;
  thumbnailUrl?: string;
  likes: number;
}

const EMOJI_OPTIONS = ['🧸','🚀','🦕','🤖','🦄','🎠','🐉','🎪','🎡','🎨','🦊','🐙','🦋','🐻','🦁','🐬','🦸','🌟'];

function extractId(url: string): string {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([^&?/\s]{11})/);
  return m ? m[1] : '';
}

const AdminPanel: React.FC = () => {
  const [dbStatus, setDbStatus] = useState<'checking'|'ok'|'error'>('checking');
  const [products, setProducts] = useState<Product[]>([]);
  const [reels, setReels] = useState<Reel[]>([]);

  // ── Add product form ──
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [imageColor, setImageColor] = useState('#FFC400');
  const [badge, setBadge] = useState('');
  const [emoji, setEmoji] = useState('🧸');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [imageFile, setImageFile] = useState<File|null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [productMsg, setProductMsg] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Edit product modal ──
  const [editingProduct, setEditingProduct] = useState<Product|null>(null);
  const [eName, setEName] = useState('');
  const [ePrice, setEPrice] = useState('');
  const [eColor, setEColor] = useState('#FFC400');
  const [eBadge, setEBadge] = useState('');
  const [eEmoji, setEEmoji] = useState('🧸');
  const [eFeatured, setEFeatured] = useState(false);
  const [eNewArrival, setENewArrival] = useState(false);
  const [eImageFile, setEImageFile] = useState<File|null>(null);
  const [eImagePreview, setEImagePreview] = useState('');
  const [editMsg, setEditMsg] = useState('');
  const [editUploading, setEditUploading] = useState(false);
  const editFileRef = useRef<HTMLInputElement>(null);

  // ── Add reel form ──
  const [reelTitle, setReelTitle] = useState('');
  const [reelUrl, setReelUrl] = useState('');
  const [reelLikes, setReelLikes] = useState('0');
  const [reelMsg, setReelMsg] = useState('');
  const [reelThumbFile, setReelThumbFile] = useState<File|null>(null);
  const [reelThumbPreview, setReelThumbPreview] = useState('');
  const reelThumbRef = useRef<HTMLInputElement>(null);

  // ── Edit reel inline ──
  const [editingReel, setEditingReel] = useState<Reel|null>(null);
  const [eReelTitle, setEReelTitle] = useState('');
  const [eReelUrl, setEReelUrl] = useState('');
  const [eReelLikes, setEReelLikes] = useState('0');
  const [eReelMsg, setEReelMsg] = useState('');
  const [eReelThumbFile, setEReelThumbFile] = useState<File|null>(null);
  const [eReelThumbPreview, setEReelThumbPreview] = useState('');

  const navigate = useNavigate();
  const token = () => localStorage.getItem('token');
  const authHeader = () => ({ headers: { Authorization: `Bearer ${token()}` } });

  const checkDb = async () => {
    try { await axios.get(`${API_BASE}/api/products`); setDbStatus('ok'); }
    catch { setDbStatus('error'); }
  };
  const fetchProducts = async () => {
    try { const r = await axios.get(`${API_BASE}/api/products`); setProducts(r.data); }
    catch (e) { console.error(e); }
  };
  const fetchReels = async () => {
    try { const r = await axios.get(`${API_BASE}/api/reels`); setReels(r.data); }
    catch (e) { console.error(e); }
  };

  // Persistent session — only redirect if no token at all
  useEffect(() => {
    if (!token()) { navigate('/login', { replace: true }); return; }
    checkDb(); fetchProducts(); fetchReels();
  }, [navigate]);

  // ── Add product ──
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault(); setProductMsg(''); setUploading(true);
    try {
      const fd = new FormData();
      fd.append('name', name); fd.append('price', price);
      fd.append('imageColor', imageColor); fd.append('badge', badge);
      fd.append('emoji', emoji);
      fd.append('isFeatured', String(isFeatured));
      fd.append('isNewArrival', String(isNewArrival));
      if (imageFile) fd.append('image', imageFile);
      await axios.post(`${API_BASE}/api/products`, fd, {
        headers: { Authorization: `Bearer ${token()}`, 'Content-Type': 'multipart/form-data' },
      });
      setName(''); setPrice(''); setImageColor('#FFC400'); setBadge(''); setEmoji('🧸');
      setIsFeatured(false); setIsNewArrival(false); setImageFile(null); setImagePreview('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      setProductMsg('✅ Toy added!'); fetchProducts();
    } catch (err) {
      setProductMsg('❌ Failed to add toy.');
      // Only force logout if login itself fails, not on product API errors
    } finally { setUploading(false); }
  };

  // ── Open edit modal ──
  const openEditProduct = (p: Product) => {
    setEditingProduct(p); setEName(p.name); setEPrice(p.price);
    setEColor(p.imageColor); setEBadge(p.badge); setEEmoji(p.emoji || '🧸');
    setEFeatured(p.isFeatured); setENewArrival(p.isNewArrival);
    setEImageFile(null); setEImagePreview(p.imageUrl || ''); setEditMsg('');
  };

  // ── Save edit ──
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault(); if (!editingProduct) return;
    setEditMsg(''); setEditUploading(true);
    try {
      const fd = new FormData();
      fd.append('name', eName); fd.append('price', ePrice);
      fd.append('imageColor', eColor); fd.append('badge', eBadge);
      fd.append('emoji', eEmoji);
      fd.append('isFeatured', String(eFeatured));
      fd.append('isNewArrival', String(eNewArrival));
      if (eImageFile) fd.append('image', eImageFile);
      await axios.put(`${API_BASE}/api/products/${editingProduct._id}`, fd, {
        headers: { Authorization: `Bearer ${token()}`, 'Content-Type': 'multipart/form-data' },
      });
      setEditMsg('✅ Saved!'); fetchProducts();
      setTimeout(() => setEditingProduct(null), 800);
    } catch { setEditMsg('❌ Save failed.'); }
    finally { setEditUploading(false); }
  };

  const toggleFlag = async (id: string, flag: 'isFeatured'|'isNewArrival', current: boolean) => {
    try { await axios.patch(`${API_BASE}/api/products/${id}`, { [flag]: !current }, authHeader()); fetchProducts(); }
    catch (e) { console.error(e); }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Delete this toy?')) return;
    try { await axios.delete(`${API_BASE}/api/products/${id}`, authHeader()); fetchProducts(); }
    catch (e) { console.error(e); }
  };

  // ── Add reel ──
  const handleAddReel = async (e: React.FormEvent) => {
    e.preventDefault(); setReelMsg('');
    try {
      const fd = new FormData();
      fd.append('title', reelTitle);
      fd.append('youtubeUrl', reelUrl);
      fd.append('likes', String(parseInt(reelLikes)||0));
      if (reelThumbFile) fd.append('thumbnail', reelThumbFile);
      await axios.post(`${API_BASE}/api/reels`, fd, {
        headers: {
          Authorization: `Bearer ${token()}`,
          // DO NOT set Content-Type — let browser set it with boundary for multipart
        },
      });
      setReelTitle(''); setReelUrl(''); setReelLikes('0');
      setReelThumbFile(null); setReelThumbPreview('');
      if (reelThumbRef.current) reelThumbRef.current.value = '';
      setReelMsg('✅ Reel added!'); fetchReels();
    } catch (err: any) {
      const detail = err?.response?.data?.detail || err?.response?.data?.message || '';
      setReelMsg(`❌ Failed to add reel. ${detail}`);
      console.error('Add reel error:', err?.response?.data);
    }
  };

  // ── Open edit reel ──
  const openEditReel = (r: Reel) => {
    setEditingReel(r); setEReelTitle(r.title);
    setEReelUrl(r.youtubeUrl); setEReelLikes(String(r.likes)); setEReelMsg('');
    setEReelThumbFile(null); setEReelThumbPreview(r.thumbnailUrl || '');
  };

  // ── Save edit reel ──
  const handleSaveReel = async (e: React.FormEvent) => {
    e.preventDefault(); if (!editingReel) return; setEReelMsg('');
    try {
      const fd = new FormData();
      fd.append('title', eReelTitle);
      fd.append('youtubeUrl', eReelUrl);
      fd.append('likes', String(parseInt(eReelLikes)||0));
      if (eReelThumbFile) fd.append('thumbnail', eReelThumbFile);
      await axios.put(`${API_BASE}/api/reels/${editingReel._id}`, fd, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      setEReelMsg('✅ Saved!'); fetchReels();
      setTimeout(() => setEditingReel(null), 600);
    } catch { setEReelMsg('❌ Save failed.'); }
  };

  const handleDeleteReel = async (id: string) => {
    if (!window.confirm('Delete this reel?')) return;
    try { await axios.delete(`${API_BASE}/api/reels/${id}`, authHeader()); fetchReels(); }
    catch (e) { console.error(e); }
  };

  const handleLogout = () => { localStorage.removeItem('token'); navigate('/login'); };

  const featuredCount   = products.filter(p => p.isFeatured).length;
  const newArrivalCount = products.filter(p => p.isNewArrival).length;

  return (
    <div className="admin-page-wrapper">
      <Navbar />
      <div className="admin-page container">

        {/* ── Header ── */}
        <div className="admin-header">
          <div>
            <h1 className="text-purple">Pigglitz Admin Pitara</h1>
            <div className={`db-status db-status--${dbStatus}`}>
              <span className="db-dot" />
              {dbStatus === 'checking' && 'Connecting to database…'}
              {dbStatus === 'ok'       && '✅ MongoDB Atlas connected'}
              {dbStatus === 'error'    && '❌ Database connection failed'}
            </div>
          </div>
          <div className="admin-header-actions">
            <button onClick={() => navigate('/')} className="btn-playful btn-secondary admin-home-btn">
              <Home size={16} style={{ marginRight: '0.4rem', verticalAlign: 'middle' }} /> Back to Home
            </button>
            <button onClick={handleLogout} className="btn-playful btn-danger">Logout</button>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="admin-stats-row">
          {[
            { icon: '🧸', num: products.length,  label: 'Total Toys' },
            { icon: '⭐', num: featuredCount,     label: 'Featured' },
            { icon: '🆕', num: newArrivalCount,   label: 'New Arrivals' },
            { icon: '🎬', num: reels.length,      label: 'Reels' },
          ].map(s => (
            <div key={s.label} className="admin-stat-card">
              <span className="admin-stat-icon">{s.icon}</span>
              <div><div className="admin-stat-num">{s.num}</div><div className="admin-stat-label">{s.label}</div></div>
            </div>
          ))}
        </div>

        {/* ══ EDIT PRODUCT MODAL ══ */}
        {editingProduct && (
          <div className="edit-modal-backdrop" onClick={() => setEditingProduct(null)}>
            <div className="edit-modal" onClick={e => e.stopPropagation()}>
              <div className="edit-modal-header">
                <h3 className="text-purple">✏️ Edit Toy</h3>
                <button className="edit-modal-close" onClick={() => setEditingProduct(null)}><X size={20} /></button>
              </div>
              <form onSubmit={handleSaveEdit} className="admin-form">
                <input type="text" placeholder="Toy Name" value={eName}
                  onChange={e => setEName(e.target.value)} required className="playful-input" />
                <input type="text" placeholder="Price (e.g. ₹499)" value={ePrice}
                  onChange={e => setEPrice(e.target.value)} required className="playful-input" />

                {/* Image */}
                <div className="image-upload-area">
                  <label className="field-label">Toy Image</label>
                  <div className="edit-image-row">
                    {(eImagePreview) && (
                      <img src={eImagePreview} alt="current"
                        style={{ width: 80, height: 80, objectFit: 'contain', borderRadius: 10, border: '2px solid #eee', padding: 4 }} />
                    )}
                    <label className="image-drop-zone" htmlFor="edit-toy-image" style={{ flex: 1, padding: '0.8rem' }}>
                      <Upload size={20} color="var(--color-purple)" />
                      <span style={{ fontSize: '0.82rem' }}>Replace image (optional)</span>
                    </label>
                    <input id="edit-toy-image" ref={editFileRef} type="file" accept="image/*" style={{ display:'none' }}
                      onChange={e => { const f = e.target.files?.[0]; if(f){ setEImageFile(f); setEImagePreview(URL.createObjectURL(f)); }}} />
                  </div>
                </div>

                {/* Emoji */}
                <div className="emoji-picker-row">
                  <label className="field-label">Fallback Emoji</label>
                  <div className="emoji-grid">
                    {EMOJI_OPTIONS.map(em => (
                      <button key={em} type="button"
                        className={`emoji-opt${eEmoji===em?' emoji-opt--active':''}`}
                        onClick={() => setEEmoji(em)}>{em}</button>
                    ))}
                  </div>
                </div>

                <div className="color-picker-container">
                  <label>Background Color:</label>
                  <input type="color" value={eColor} onChange={e => setEColor(e.target.value)} className="color-input" />
                  <span className="color-preview" style={{ background: eColor }} />
                </div>

                <input type="text" placeholder="Badge" value={eBadge}
                  onChange={e => setEBadge(e.target.value)} className="playful-input" />

                <div className="flag-toggles">
                  <label className={`flag-toggle${eFeatured?' flag-toggle--on':''}`}>
                    <input type="checkbox" checked={eFeatured} onChange={e => setEFeatured(e.target.checked)} />
                    <Star size={15} fill={eFeatured?'var(--color-yellow)':'none'} color={eFeatured?'var(--color-yellow)':'#aaa'} />
                    Featured
                  </label>
                  <label className={`flag-toggle${eNewArrival?' flag-toggle--on':''}`}>
                    <input type="checkbox" checked={eNewArrival} onChange={e => setENewArrival(e.target.checked)} />
                    <Zap size={15} fill={eNewArrival?'var(--color-orange)':'none'} color={eNewArrival?'var(--color-orange)':'#aaa'} />
                    New Arrival
                  </label>
                </div>

                <div style={{ display:'flex', gap:'0.8rem', marginTop:'0.5rem' }}>
                  <button type="submit" className="btn-playful btn-primary" disabled={editUploading} style={{ flex:1, backgroundColor:'var(--color-purple)', color:'white' }}>
                    {editUploading ? '⏳ Saving…' : <><Save size={15} style={{marginRight:'0.3rem',verticalAlign:'middle'}}/>Save Changes</>}
                  </button>
                  <button type="button" className="btn-playful btn-secondary" onClick={() => setEditingProduct(null)} style={{ flex:1 }}>
                    Cancel
                  </button>
                </div>
                {editMsg && <p className="reel-msg">{editMsg}</p>}
              </form>
            </div>
          </div>
        )}

        {/* ══ TOY MANAGEMENT ══ */}
        <div className="admin-section-title"><span>🧸</span> Toy Management</div>
        <div className="admin-content">

          {/* Add form */}
          <div className="admin-form-container">
            <h2 className="text-pink">Add Magic Toy</h2>
            <form onSubmit={handleAddProduct} className="admin-form">
              <input type="text" placeholder="Toy Name" value={name}
                onChange={e => setName(e.target.value)} required className="playful-input" />
              <input type="text" placeholder="Price (e.g. ₹499)" value={price}
                onChange={e => setPrice(e.target.value)} required className="playful-input" />

              <div className="image-upload-area">
                <label className="field-label">Toy Image (optional)</label>
                {imagePreview ? (
                  <div className="image-preview-box">
                    <img src={imagePreview} alt="Preview" className="image-preview" />
                    <button type="button" className="image-clear-btn" onClick={() => { setImageFile(null); setImagePreview(''); if(fileInputRef.current) fileInputRef.current.value=''; }}>
                      <X size={16} /> Remove
                    </button>
                  </div>
                ) : (
                  <label className="image-drop-zone" htmlFor="toy-image-input">
                    <Upload size={28} color="var(--color-purple)" />
                    <span>Click to upload image</span>
                    <span className="image-drop-hint">JPG, PNG, WEBP — max 5MB</span>
                  </label>
                )}
                <input id="toy-image-input" ref={fileInputRef} type="file" accept="image/*"
                  onChange={e => { const f=e.target.files?.[0]; if(f){setImageFile(f);setImagePreview(URL.createObjectURL(f));} }}
                  style={{ display:'none' }} />
              </div>

              <div className="emoji-picker-row">
                <label className="field-label">Fallback Emoji</label>
                <div className="emoji-grid">
                  {EMOJI_OPTIONS.map(em => (
                    <button key={em} type="button"
                      className={`emoji-opt${emoji===em?' emoji-opt--active':''}`}
                      onClick={() => setEmoji(em)}>{em}</button>
                  ))}
                </div>
              </div>

              <div className="color-picker-container">
                <label>Background Color:</label>
                <input type="color" value={imageColor} onChange={e => setImageColor(e.target.value)} className="color-input" />
                <span className="color-preview" style={{ background: imageColor }} />
              </div>

              <input type="text" placeholder="Badge (e.g. Best Seller)" value={badge}
                onChange={e => setBadge(e.target.value)} className="playful-input" />

              <div className="flag-toggles">
                <label className={`flag-toggle${isFeatured?' flag-toggle--on':''}`}>
                  <input type="checkbox" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} />
                  <Star size={15} fill={isFeatured?'var(--color-yellow)':'none'} color={isFeatured?'var(--color-yellow)':'#aaa'} /> Mark as Featured
                </label>
                <label className={`flag-toggle${isNewArrival?' flag-toggle--on':''}`}>
                  <input type="checkbox" checked={isNewArrival} onChange={e => setIsNewArrival(e.target.checked)} />
                  <Zap size={15} fill={isNewArrival?'var(--color-orange)':'none'} color={isNewArrival?'var(--color-orange)':'#aaa'} /> Mark as New Arrival
                </label>
              </div>

              <button type="submit" className="btn-playful btn-primary" disabled={uploading}>
                {uploading ? '⏳ Uploading…' : <><Plus size={16} style={{marginRight:'0.4rem',verticalAlign:'middle'}}/>Add to Pitara</>}
              </button>
              {productMsg && <p className="reel-msg">{productMsg}</p>}
            </form>
          </div>

          {/* Product list */}
          <div className="admin-list-container">
            <h2 className="text-blue">Current Toys ({products.length})</h2>
            <div className="admin-product-list">
              {products.map(p => (
                <div key={p._id} className="admin-product-item" style={{ borderLeftColor: p.imageColor }}>
                  <div className="product-swatch" style={{ background: p.imageUrl?'#f0f0f0':p.imageColor }}>
                    {p.imageUrl
                      ? <img src={p.imageUrl} alt={p.name} style={{width:'100%',height:'100%',objectFit:'contain',borderRadius:10,padding:2}} />
                      : (p.emoji||'🧸')}
                  </div>
                  <div className="product-details">
                    <h3>{p.name}</h3><p>{p.price}</p>
                    <div className="product-flags">
                      {p.isFeatured   && <span className="flag-badge flag-featured">⭐ Featured</span>}
                      {p.isNewArrival && <span className="flag-badge flag-new">🆕 New Arrival</span>}
                    </div>
                  </div>
                  <div className="product-actions">
                    <button className="toggle-btn edit-toggle-btn" onClick={() => openEditProduct(p)} title="Edit">
                      <Edit2 size={15} color="var(--color-purple)" /><span>Edit</span>
                    </button>
                    <button className={`toggle-btn${p.isFeatured?' toggle-btn--on-yellow':''}`}
                      onClick={() => toggleFlag(p._id,'isFeatured',p.isFeatured)} title="Toggle Featured">
                      {p.isFeatured?<CheckCircle size={16} color="var(--color-yellow)"/>:<Circle size={16} color="#ccc"/>}
                      <span>Featured</span>
                    </button>
                    <button className={`toggle-btn${p.isNewArrival?' toggle-btn--on-orange':''}`}
                      onClick={() => toggleFlag(p._id,'isNewArrival',p.isNewArrival)} title="Toggle New Arrival">
                      {p.isNewArrival?<CheckCircle size={16} color="var(--color-orange)"/>:<Circle size={16} color="#ccc"/>}
                      <span>New</span>
                    </button>
                    <button onClick={() => handleDeleteProduct(p._id)}
                      className="btn-playful btn-danger" style={{padding:'0.4rem 0.8rem'}}>
                      <Trash2 size={15}/>
                    </button>
                  </div>
                </div>
              ))}
              {products.length===0 && <p style={{color:'#888'}}>No toys yet. Add your first one!</p>}
            </div>
          </div>
        </div>

        {/* ══ VIDEO REELS ══ */}
        <div className="admin-reels-section">
          <div className="admin-reels-header">
            <Film size={26} color="var(--color-purple)" />
            <h2 className="text-purple">Video Reels</h2>
            <span className="reels-badge">{reels.length} reels</span>
          </div>
          <div className="admin-content">
            {/* Add reel form */}
            <div className="admin-form-container reel-form-container">
              <h3 className="text-pink" style={{marginBottom:'1.2rem',display:'flex',alignItems:'center',gap:'0.5rem'}}>
                <Plus size={18}/> Add New Reel
              </h3>
              <form onSubmit={handleAddReel} className="admin-form">
                <input type="text" placeholder="Reel title" value={reelTitle}
                  onChange={e => setReelTitle(e.target.value)} required className="playful-input" />
                <input type="url" placeholder="YouTube or Instagram Reel URL"
                  value={reelUrl} onChange={e => setReelUrl(e.target.value)} required className="playful-input" />
                <input type="number" placeholder="Likes count" value={reelLikes}
                  onChange={e => setReelLikes(e.target.value)} min="0" className="playful-input" />

                {/* Thumbnail upload — required for Instagram, optional for YouTube */}
                <div className="image-upload-area">
                  <label className="field-label">
                    Thumbnail Image
                    <span style={{fontWeight:400,color:'#999',marginLeft:'0.4rem'}}>(required for Instagram reels)</span>
                  </label>
                  {reelThumbPreview ? (
                    <div className="image-preview-box">
                      <img src={reelThumbPreview} alt="thumb" className="image-preview" style={{height:120}} />
                      <button type="button" className="image-clear-btn"
                        onClick={() => { setReelThumbFile(null); setReelThumbPreview(''); if(reelThumbRef.current) reelThumbRef.current.value=''; }}>
                        <X size={14}/> Remove
                      </button>
                    </div>
                  ) : (
                    <label className="image-drop-zone" htmlFor="reel-thumb-input" style={{padding:'0.8rem'}}>
                      <Upload size={22} color="var(--color-purple)" />
                      <span style={{fontSize:'0.82rem'}}>Upload thumbnail (JPG/PNG)</span>
                    </label>
                  )}
                  <input id="reel-thumb-input" ref={reelThumbRef} type="file" accept="image/*"
                    onChange={e => { const f=e.target.files?.[0]; if(f){setReelThumbFile(f);setReelThumbPreview(URL.createObjectURL(f));} }}
                    style={{display:'none'}} />
                </div>

                <button type="submit" className="btn-playful btn-primary">
                  <Film size={16} style={{marginRight:'0.4rem',verticalAlign:'middle'}}/> Add Reel
                </button>
                {reelMsg && <p className="reel-msg">{reelMsg}</p>}
              </form>
              <div className="reel-url-hint">
                <strong>YouTube:</strong> youtube.com/watch?v=… | youtu.be/… | youtube.com/shorts/…<br/>
                <strong>Instagram:</strong> instagram.com/reel/… | instagram.com/p/… (opens in new tab)
              </div>
            </div>

            {/* Reel list */}
            <div className="admin-list-container reel-list-container">
              <h3 className="text-blue" style={{marginBottom:'1.2rem'}}>Published Reels</h3>
              <div className="admin-product-list">
                {reels.map(r => (
                  <div key={r._id}>
                    {editingReel?._id === r._id ? (
                      /* ── Inline edit row ── */
                      <form onSubmit={handleSaveReel} className="reel-edit-row">
                        <input type="text" value={eReelTitle} onChange={e=>setEReelTitle(e.target.value)}
                          required className="playful-input reel-edit-input" placeholder="Title" />
                        <input type="url" value={eReelUrl} onChange={e=>setEReelUrl(e.target.value)}
                          required className="playful-input reel-edit-input" placeholder="YouTube or Instagram URL" />
                        <input type="number" value={eReelLikes} onChange={e=>setEReelLikes(e.target.value)}
                          min="0" className="playful-input reel-edit-input" placeholder="Likes" style={{width:90}} />
                        {/* Thumb replace */}
                        <label htmlFor={`reel-edit-thumb-${r._id}`} className="reel-thumb-upload-btn" title="Replace thumbnail">
                          <Upload size={14}/>
                          {eReelThumbFile ? '✅' : 'Thumb'}
                        </label>
                        <input id={`reel-edit-thumb-${r._id}`} type="file" accept="image/*" style={{display:'none'}}
                          onChange={e=>{const f=e.target.files?.[0];if(f){setEReelThumbFile(f);setEReelThumbPreview(URL.createObjectURL(f));}}} />
                        <button type="submit" className="btn-playful btn-primary" style={{padding:'0.5rem 0.9rem'}}>
                          <Save size={15}/>
                        </button>
                        <button type="button" className="btn-playful btn-secondary" style={{padding:'0.5rem 0.9rem'}}
                          onClick={() => setEditingReel(null)}><X size={15}/></button>
                        {eReelMsg && <span className="reel-msg">{eReelMsg}</span>}
                      </form>
                    ) : (
                      /* ── Normal reel row ── */
                      <div className="admin-reel-item">
                        <div className="reel-item-thumb">
                          {r.thumbnailUrl ? (
                            <img src={r.thumbnailUrl} alt={r.title} />
                          ) : extractId(r.youtubeUrl) ? (
                            <img src={`https://img.youtube.com/vi/${extractId(r.youtubeUrl)}/default.jpg`}
                              alt={r.title} onError={e=>{(e.target as HTMLImageElement).style.display='none';}} />
                          ) : (
                            <div style={{width:'100%',height:'100%',background:'linear-gradient(135deg,#f09433,#dc2743,#bc1888)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.4rem',borderRadius:'10px'}}>📸</div>
                          )}
                        </div>
                        <div className="reel-item-info">
                          <h4>{r.title}</h4>
                          <p className="reel-item-url">{r.youtubeUrl}</p>
                          <span className="reel-item-likes">❤️ {r.likes.toLocaleString()} likes</span>
                        </div>
                        <button className="toggle-btn edit-toggle-btn" onClick={() => openEditReel(r)} title="Edit">
                          <Edit2 size={15} color="var(--color-purple)"/><span>Edit</span>
                        </button>
                        <button onClick={() => handleDeleteReel(r._id)} className="btn-playful btn-danger reel-delete-btn">
                          <Trash2 size={16}/>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                {reels.length===0 && <p style={{color:'#888'}}>No reels yet.</p>}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminPanel;
