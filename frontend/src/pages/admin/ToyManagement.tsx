import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Trash2, Plus, Star, Zap, Upload, X, Edit2, Save, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import API_BASE from '../../config';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'size': ['small', false, 'large', 'huge'] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'indent': '-1'}, { 'indent': '+1' }],
    [{ 'align': [] }],
    ['link', 'image', 'video'],
    ['clean']
  ]
};

interface Product {
  _id: string; name: string; price: string; imageColor: string;
  imageUrl: string; badge: string; emoji: string; category?: string;
  isFeatured: boolean; isNewArrival: boolean;
  description?: string; features?: string; additionalInfo?: string; models?: string;
  galleryUrls?: string[]; seoKeywords?: string;
}

const EMOJI_OPTIONS = ['🧸','🚀','🦕','🤖','🦄','🎠','🐉','🎪','🎡','🎨','🦊','🐙','🦋','🐻','🦁','🐬','🦸','🌟'];

const ToyManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  
  // Form states
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [imageColor, setImageColor] = useState('#FFC400');
  const [badge, setBadge] = useState('');
  const [emoji, setEmoji] = useState('🧸');
  const [category, setCategory] = useState('Toys');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [description, setDescription] = useState('');
  const [features, setFeatures] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [models, setModels] = useState('');
  const [seoKeywords, setSeoKeywords] = useState('');
  const [imageFile, setImageFile] = useState<File|null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [productMsg, setProductMsg] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit states
  const [editingProduct, setEditingProduct] = useState<Product|null>(null);
  const [eName, setEName] = useState('');
  const [ePrice, setEPrice] = useState('');
  const [eColor, setEColor] = useState('#FFC400');
  const [eBadge, setEBadge] = useState('');
  const [eEmoji, setEEmoji] = useState('🧸');
  const [eCategory, setECategory] = useState('Toys');
  const [eFeatured, setEFeatured] = useState(false);
  const [eNewArrival, setENewArrival] = useState(false);
  const [eDescription, setEDescription] = useState('');
  const [eFeatures, setEFeatures] = useState('');
  const [eAdditionalInfo, setEAdditionalInfo] = useState('');
  const [editModels, setEditModels] = useState('');
  const [editSeoKeywords, setEditSeoKeywords] = useState('');
  const [editImageFile, setEditImageFile] = useState<File|null>(null);
  const [eImagePreview, setEImagePreview] = useState('');
  const [eGalleryFiles, setEGalleryFiles] = useState<File[]>([]);
  const [editMsg, setEditMsg] = useState('');
  const [editUploading, setEditUploading] = useState(false);
  const editFileRef = useRef<HTMLInputElement>(null);

  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('All');

  const token = () => localStorage.getItem('token');
  const authHeader = () => ({ headers: { Authorization: `Bearer ${token()}` } });

  const fetchProducts = async () => {
    try { const r = await axios.get(`${API_BASE}/api/products`); setProducts(r.data); }
    catch (e) { console.error(e); }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault(); setProductMsg(''); setUploading(true);
    try {
      const fd = new FormData();
      fd.append('name', name); fd.append('price', price);
      fd.append('imageColor', imageColor); fd.append('badge', badge);
      fd.append('emoji', emoji); fd.append('category', category);
      fd.append('isFeatured', String(isFeatured));
      fd.append('isNewArrival', String(isNewArrival));
      fd.append('description', description);
      fd.append('features', features);
      fd.append('additionalInfo', additionalInfo);
      fd.append('models', models);
      fd.append('seoKeywords', seoKeywords);
      if (imageFile) fd.append('image', imageFile);
      galleryFiles.forEach(f => fd.append('gallery', f));

      await axios.post(`${API_BASE}/api/products`, fd, {
        headers: { Authorization: `Bearer ${token()}`, 'Content-Type': 'multipart/form-data' },
      });
      setName(''); setPrice(''); setImageColor('#FFC400'); setBadge(''); setEmoji('🧸'); setCategory('Toys');
      setIsFeatured(false); setIsNewArrival(false); 
      setDescription('');      setFeatures(''); setAdditionalInfo(''); setModels(''); setSeoKeywords('');
      setImageFile(null); setImagePreview(''); setGalleryFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setProductMsg('✅ Toy added!'); fetchProducts();
    } catch (err) {
      setProductMsg('❌ Failed to add toy.');
    } finally { setUploading(false); }
  };

  const openEditProduct = (p: Product) => {
    setEditingProduct(p); setEName(p.name); setEPrice(p.price);
    setEColor(p.imageColor); setEBadge(p.badge); setEEmoji(p.emoji || '🧸'); setECategory(p.category || 'Toys');
    setEFeatured(p.isFeatured); setENewArrival(p.isNewArrival);
    setEDescription(p.description || ''); setEFeatures(p.features || '');
    setEAdditionalInfo(p.additionalInfo || '');    setEditModels(p.models || '');
    setEditSeoKeywords(p.seoKeywords || '');
    setEImagePreview(p.imageUrl || ''); setEGalleryFiles([]); setEditMsg('');
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault(); if (!editingProduct) return;
    setEditMsg(''); setEditUploading(true);
    try {
      const fd = new FormData();
      fd.append('name', eName); fd.append('price', ePrice);
      fd.append('imageColor', eColor); fd.append('badge', eBadge);
      fd.append('emoji', eEmoji); fd.append('category', eCategory);
      fd.append('isFeatured', String(eFeatured));
      fd.append('isNewArrival', String(eNewArrival));
      fd.append('description', eDescription);
      fd.append('features', eFeatures);
      fd.append('additionalInfo', eAdditionalInfo);
      fd.append('models', editModels);
      fd.append('seoKeywords', editSeoKeywords);
      if (editImageFile) fd.append('image', editImageFile);
      eGalleryFiles.forEach(f => fd.append('gallery', f));

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

  const exportToExcel = () => {
    if (products.length === 0) return;
    const dataToExport = products.map(p => ({
      ID: p._id,
      Name: p.name,
      Price: p.price,
      Category: p.category || 'Toys',
      Featured: p.isFeatured ? 'Yes' : 'No',
      'New Arrival': p.isNewArrival ? 'Yes' : 'No'
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');
    XLSX.writeFile(workbook, 'products_list.xlsx');
  };

  const filteredProducts = products.filter(p => filterCategory === 'All' || (p.category || 'Toys') === filterCategory);

  return (
    <div className="admin-page container">
      <div className="admin-section-title" style={{ marginTop: 0 }}><span>🧸</span> Toy Management</div>
      <div className="admin-content toy-management-content">

        {/* Add form */}
        <div className="admin-form-container">
          <h2 className="text-pink">Add Magic Toy</h2>
          <form onSubmit={handleAddProduct} className="admin-form">
            <label className="field-label">Toy Name</label>
            <input type="text" placeholder="Toy Name" value={name} onChange={e => setName(e.target.value)} required className="playful-input" />
            
            <label className="field-label">Price</label>
            <input type="text" placeholder="Price (e.g. ₹499)" value={price} onChange={e => setPrice(e.target.value)} required className="playful-input" />
            
            <label className="field-label">Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)} className="playful-input">
              <option value="Toys">Toys</option>
              <option value="DIY Paint Kit">DIY Paint Kit</option>
              <option value="Home Decor">Home Decor</option>
              <option value="Collectible">Collectible</option>
            </select>

            <label className="field-label">Description</label>
            <div style={{ marginBottom: '1rem' }}>
              <ReactQuill theme="snow" modules={quillModules} value={description} onChange={setDescription} className="quill-editor" />
            </div>
            
            <label className="field-label">Features (one per line)</label>
            <textarea placeholder="Features (one per line)" value={features} onChange={e => setFeatures(e.target.value)} className="playful-input" style={{minHeight:'80px'}} />
            
            <label className="field-label">Additional Info</label>
            <div style={{ marginBottom: '1rem' }}>
              <ReactQuill theme="snow" modules={quillModules} value={additionalInfo} onChange={setAdditionalInfo} className="quill-editor" />
            </div>
            
            <label className="field-label">3D Print Models / Dimensions</label>
            <textarea placeholder="3D Print Models / Dimensions" value={models} onChange={e => setModels(e.target.value)} className="playful-input" style={{ minHeight:'60px' }}/>
            
            <label className="field-label">SEO Keywords (Comma separated)</label>
            <input type="text" placeholder="e.g. custom toy, dinosaur, kids gift" value={seoKeywords} onChange={e => setSeoKeywords(e.target.value)} className="playful-input" />

            <div className="image-upload-area">
              <label className="field-label">Main Toy Image</label>
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
                  <span>Click to upload main image</span>
                </label>
              )}
              <input id="toy-image-input" ref={fileInputRef} type="file" accept="image/*"
                onChange={e => { const f=e.target.files?.[0]; if(f){setImageFile(f);setImagePreview(URL.createObjectURL(f));} }}
                style={{ display:'none' }} />
            </div>

            <div className="image-upload-area">
              <label className="field-label">Gallery Images (up to 4)</label>
              <input type="file" multiple accept="image/*" onChange={e => setGalleryFiles(Array.from(e.target.files || []).slice(0, 4))} />
              <div style={{fontSize:'0.8rem', color:'#666', marginTop:'0.3rem'}}>{galleryFiles.length} files selected</div>
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

            <label className="field-label">Badge</label>
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
        <div className="admin-list-container toy-management-list">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h2 className="text-blue" style={{ fontSize: '1.4rem', margin: 0 }}>Products Management ({filteredProducts.length} items)</h2>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <select 
                value={filterCategory} 
                onChange={e => setFilterCategory(e.target.value)}
                className="playful-input"
                style={{ padding: '0.4rem', margin: 0, minWidth: '150px' }}
              >
                <option value="All">All Categories</option>
                <option value="Toys">Toys</option>
                <option value="DIY Paint Kit">DIY Paint Kit</option>
                <option value="Home Decor">Home Decor</option>
                <option value="Collectible">Collectible</option>
              </select>
              <button onClick={exportToExcel} className="btn-playful btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
                <Download size={16} /> Export to Excel
              </button>
            </div>
          </div>
          <div className="admin-product-list">
            {filteredProducts.map(p => (
              <div key={p._id} className="admin-product-item-card">
                <div className="admin-card-image-wrapper">
                  <div className="admin-card-actions-top">
                    <button className="admin-icon-btn edit-btn" onClick={() => openEditProduct(p)} title="Edit">
                      <Edit2 size={14} />
                    </button>
                    <button className="admin-icon-btn delete-btn" onClick={() => setDeleteConfirm(p._id)} title="Delete">
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="admin-card-image" style={{ background: p.imageUrl ? '#fff' : p.imageColor }}>
                    {p.imageUrl
                      ? <img src={p.imageUrl} alt={p.name} />
                      : <span style={{fontSize: '4rem'}}>{p.emoji||'🧸'}</span>}
                  </div>
                </div>
                
                <div className="admin-card-content">
                  <div className="admin-card-meta">
                    {p.category || 'Toys'} | Pigglitz
                  </div>
                  <h3 className="admin-card-title" title={p.name}>{p.name}</h3>
                  <div className="admin-card-rating">
                    <span className="stars">★★★★★</span> <span className="rating-num">(5.0)</span>
                  </div>
                  <div className="admin-card-price-row">
                    <span className="admin-card-price">{p.price?.includes('₹') ? p.price : `₹${p.price}`}</span>
                    <span className="admin-card-stock text-green">Stock: {Math.floor(Math.random() * 10) + 1}</span>
                  </div>

                  <div className="admin-card-buttons">
                    <button 
                      className={`admin-block-btn ${p.isFeatured ? 'btn-featured' : 'btn-default'}`}
                      onClick={() => toggleFlag(p._id,'isFeatured',p.isFeatured)}>
                      ★ {p.isFeatured ? 'Featured' : 'Feature'}
                    </button>
                    <button 
                      className={`admin-block-btn ${p.isNewArrival ? 'btn-new' : 'btn-default'}`}
                      onClick={() => toggleFlag(p._id,'isNewArrival',p.isNewArrival)}>
                      ✨ {p.isNewArrival ? 'New Arrival' : 'Mark New'}
                    </button>
                    <button className="admin-block-btn btn-stock">
                      Out of Stock
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filteredProducts.length===0 && <p style={{color:'#888'}}>No toys found. Add your first one!</p>}
          </div>
        </div>
      </div>

      {/* EDIT MODAL */}
      {editingProduct && (
        <div className="edit-modal-backdrop" onClick={() => setEditingProduct(null)}>
          <div className="edit-modal" onClick={e => e.stopPropagation()}>
            <div className="edit-modal-header">
              <h3 className="text-purple">✏️ Edit Toy</h3>
              <button className="edit-modal-close" onClick={() => setEditingProduct(null)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSaveEdit} className="admin-form">
              <label className="field-label">Toy Name</label>
              <input type="text" placeholder="Toy Name" value={eName} onChange={e => setEName(e.target.value)} required className="playful-input" />
              
              <label className="field-label">Price</label>
              <input type="text" placeholder="Price (e.g. ₹499)" value={ePrice} onChange={e => setEPrice(e.target.value)} required className="playful-input" />
              
              <label className="field-label">Category</label>
              <select value={eCategory} onChange={e => setECategory(e.target.value)} className="playful-input">
                <option value="Toys">Toys</option>
                <option value="DIY Paint Kit">DIY Paint Kit</option>
                <option value="Home Decor">Home Decor</option>
                <option value="Collectible">Collectible</option>
              </select>
              
              <label className="field-label">Description</label>
              <div style={{ marginBottom: '1rem' }}>
                <ReactQuill theme="snow" modules={quillModules} value={eDescription} onChange={setEDescription} className="quill-editor" />
              </div>
              
              <label className="field-label">Features</label>
              <textarea placeholder="Features (one per line)" value={eFeatures} onChange={e => setEFeatures(e.target.value)} className="playful-input" />
              
              <label className="field-label">Additional Info</label>
              <div style={{ marginBottom: '1rem' }}>
                <ReactQuill theme="snow" modules={quillModules} value={eAdditionalInfo} onChange={setEAdditionalInfo} className="quill-editor" />
              </div>
              
              <label className="field-label">Models/Dimensions</label>
              <textarea value={editModels} onChange={e => setEditModels(e.target.value)} className="playful-input" style={{minHeight:'60px'}}/>

              <label className="field-label">SEO Keywords</label>
              <input type="text" value={editSeoKeywords} onChange={e => setEditSeoKeywords(e.target.value)} className="playful-input" />

              <div className="image-upload-area">
                <label className="field-label">Toy Image</label>
                <div className="edit-image-row">
                  {(eImagePreview) && (
                    <img src={eImagePreview} alt="current" style={{ width: 80, height: 80, objectFit: 'contain', borderRadius: 10, border: '2px solid #eee', padding: 4 }} />
                  )}
                  <label className="image-drop-zone" htmlFor="edit-toy-image" style={{ flex: 1, padding: '0.8rem' }}>
                    <Upload size={20} color="var(--color-purple)" />
                    <span style={{ fontSize: '0.82rem' }}>Replace main image</span>
                  </label>
                  <input id="edit-toy-image" ref={editFileRef} type="file" accept="image/*" style={{ display:'none' }}
                    onChange={e => { const f = e.target.files?.[0]; if(f){ setEditImageFile(f); setEImagePreview(URL.createObjectURL(f)); }}} />
                </div>
              </div>

              <div className="image-upload-area">
                <label className="field-label">Gallery Images (Replace all)</label>
                <input type="file" multiple accept="image/*" onChange={e => setEGalleryFiles(Array.from(e.target.files || []).slice(0, 4))} />
                <div style={{fontSize:'0.8rem', color:'#666'}}>{eGalleryFiles.length} files selected</div>
              </div>

              <div className="emoji-picker-row">
                <label className="field-label">Fallback Emoji</label>
                <div className="emoji-grid">
                  {EMOJI_OPTIONS.map(em => (
                    <button key={em} type="button" className={`emoji-opt${eEmoji===em?' emoji-opt--active':''}`} onClick={() => setEEmoji(em)}>{em}</button>
                  ))}
                </div>
              </div>

              <div className="color-picker-container">
                <label>Background Color:</label>
                <input type="color" value={eColor} onChange={e => setEColor(e.target.value)} className="color-input" />
                <span className="color-preview" style={{ background: eColor }} />
              </div>

              <label className="field-label">Badge</label>
              <input type="text" placeholder="Badge" value={eBadge} onChange={e => setEBadge(e.target.value)} className="playful-input" />

              <div className="flag-toggles">
                <label className={`flag-toggle${eFeatured?' flag-toggle--on':''}`}>
                  <input type="checkbox" checked={eFeatured} onChange={e => setEFeatured(e.target.checked)} />
                  <Star size={15} fill={eFeatured?'var(--color-yellow)':'none'} color={eFeatured?'var(--color-yellow)':'#aaa'} /> Featured
                </label>
                <label className={`flag-toggle${eNewArrival?' flag-toggle--on':''}`}>
                  <input type="checkbox" checked={eNewArrival} onChange={e => setENewArrival(e.target.checked)} />
                  <Zap size={15} fill={eNewArrival?'var(--color-orange)':'none'} color={eNewArrival?'var(--color-orange)':'#aaa'} /> New Arrival
                </label>
              </div>

              <div style={{ display:'flex', gap:'0.8rem', marginTop:'0.5rem' }}>
                <button type="submit" className="btn-playful btn-primary" disabled={editUploading} style={{ flex:1, backgroundColor:'var(--color-purple)', color:'white' }}>
                  {editUploading ? '⏳ Saving…' : <><Save size={15} style={{marginRight:'0.3rem',verticalAlign:'middle'}}/>Save Changes</>}
                </button>
                <button type="button" className="btn-playful btn-secondary" onClick={() => setEditingProduct(null)} style={{ flex:1 }}>Cancel</button>
              </div>
              {editMsg && <p className="reel-msg">{editMsg}</p>}
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM */}
      {deleteConfirm && (
        <div className="edit-modal-backdrop" onClick={() => setDeleteConfirm(null)}>
          <div className="edit-modal" style={{ maxWidth: '400px', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
            <div className="edit-modal-header" style={{ justifyContent: 'center' }}>
              <h3 className="text-pink" style={{ margin: 0 }}>🗑️ Confirm Deletion</h3>
            </div>
            <p style={{ margin: '1.5rem 0', color: '#555' }}>Are you sure you want to delete this toy? This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button className="btn-playful btn-secondary" style={{ flex: 1 }} onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button 
                className="btn-playful btn-danger" 
                style={{ flex: 1 }} 
                onClick={async () => {
                  try {
                    await axios.delete(`${API_BASE}/api/products/${deleteConfirm}`, authHeader()); 
                    fetchProducts(); 
                  } catch (e) { console.error(e); }
                  setDeleteConfirm(null);
                }}
              >Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ToyManagement;
