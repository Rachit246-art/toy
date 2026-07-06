import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Trash2, Plus, Upload, X, Edit2, Save } from 'lucide-react';
import API_BASE from '../../config';

interface HeroSlide {
  _id: string;
  buttonLink: string;
  imageUrl: string;
}

const HeroBannersManagement: React.FC = () => {
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);

  // Add Hero Banner form
  const [slideBtnLink, setSlideBtnLink] = useState('');
  const [slideImageFile, setSlideImageFile] = useState<File|null>(null);
  const [slideImagePreview, setSlideImagePreview] = useState('');
  const [slideMsg, setSlideMsg] = useState('');
  const slideFileRef = useRef<HTMLInputElement>(null);

  // Edit hero banner inline
  const [editingSlide, setEditingSlide] = useState<HeroSlide|null>(null);
  const [eSlideBtnLink, setESlideBtnLink] = useState('');
  const [eSlideImageFile, setESlideImageFile] = useState<File|null>(null);
  const [eSlideMsg, setESlideMsg] = useState('');

  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const token = () => localStorage.getItem('token');
  const authHeader = () => ({ headers: { Authorization: `Bearer ${token()}` } });

  const fetchHeroSlides = async () => {
    try { 
      const r = await axios.get(`${API_BASE}/api/hero-slides`); 
      if (Array.isArray(r.data)) setHeroSlides(r.data); 
    }
    catch (e) { console.error(e); }
  };

  useEffect(() => {
    fetchHeroSlides();
  }, []);

  const handleAddHeroSlide = async (e: React.FormEvent) => {
    e.preventDefault(); setSlideMsg('');
    try {
      const fd = new FormData();
      fd.append('buttonLink', slideBtnLink);
      if (slideImageFile) fd.append('image', slideImageFile);

      await axios.post(`${API_BASE}/api/hero-slides`, fd, {
        headers: { Authorization: `Bearer ${token()}`, 'Content-Type': 'multipart/form-data' },
      });
      setSlideBtnLink('');
      setSlideImageFile(null); setSlideImagePreview('');
      if (slideFileRef.current) slideFileRef.current.value = '';
      setSlideMsg('✅ Hero Banner added!');
      fetchHeroSlides();
    } catch (err: any) {
      setSlideMsg('❌ Failed to add hero banner.');
    }
  };

  const openEditSlide = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setESlideBtnLink(slide.buttonLink || '');
    setESlideImageFile(null);
    setESlideMsg('');
  };

  const handleSaveSlide = async (e: React.FormEvent) => {
    e.preventDefault(); if (!editingSlide) return; setESlideMsg('');
    try {
      const fd = new FormData();
      fd.append('buttonLink', eSlideBtnLink);
      if (eSlideImageFile) fd.append('image', eSlideImageFile);
      
      await axios.put(`${API_BASE}/api/hero-slides/${editingSlide._id}`, fd, {
        headers: { Authorization: `Bearer ${token()}`, 'Content-Type': 'multipart/form-data' },
      });
      setESlideMsg('✅ Saved!'); fetchHeroSlides();
      setTimeout(() => setEditingSlide(null), 600);
    } catch { setESlideMsg('❌ Save failed.'); }
  };

  return (
    <div className="admin-page container">
      <div className="admin-section-title" style={{ marginTop: 0 }}><span>🖼️</span> Hero Banners Management</div>
      <div className="admin-content" style={{ marginBottom: '2rem' }}>
        <div className="admin-form-container">
          <h3 className="text-pink" style={{marginBottom:'1.2rem'}}>Add New Hero Banner</h3>
          <form onSubmit={handleAddHeroSlide} className="admin-form">
            <input type="text" placeholder="Banner Link (e.g. /toys or URL)" value={slideBtnLink} onChange={e => setSlideBtnLink(e.target.value)} className="playful-input" />
            
            <div className="image-upload-area">
              <label className="field-label">Banner Image</label>
              {slideImagePreview ? (
                <div className="image-preview-box">
                  <img src={slideImagePreview} alt="Preview" className="image-preview" />
                  <button type="button" className="image-clear-btn" onClick={() => { setSlideImageFile(null); setSlideImagePreview(''); if(slideFileRef.current) slideFileRef.current.value=''; }}>
                    <X size={16} /> Remove
                  </button>
                </div>
              ) : (
                <label className="image-drop-zone" htmlFor="slide-image-input">
                  <Upload size={28} color="var(--color-purple)" />
                  <span>Upload Banner Image</span>
                </label>
              )}
              <input id="slide-image-input" ref={slideFileRef} type="file" accept="image/*"
                onChange={e => { const f=e.target.files?.[0]; if(f){setSlideImageFile(f);setSlideImagePreview(URL.createObjectURL(f));} }}
                style={{ display:'none' }} required />
            </div>

            <button type="submit" className="btn-playful btn-primary" style={{ marginTop: '1rem' }}>
              <Plus size={16} style={{marginRight:'0.4rem',verticalAlign:'middle'}}/> Add Hero Banner
            </button>
            {slideMsg && <p className="reel-msg">{slideMsg}</p>}
          </form>
        </div>

        <div className="admin-list-container">
          <h3 className="text-blue" style={{marginBottom:'1.2rem'}}>Current Hero Banners ({heroSlides.length})</h3>
          <div className="admin-product-list">
            {heroSlides.map(slide => (
              <div key={slide._id}>
                {editingSlide?._id === slide._id ? (
                  <form onSubmit={handleSaveSlide} className="reel-edit-row" style={{ flexDirection: 'column', gap: '0.8rem', alignItems: 'stretch' }}>
                    <input type="text" value={eSlideBtnLink} onChange={e=>setESlideBtnLink(e.target.value)} className="playful-input reel-edit-input" placeholder="Banner Link (/toys)" />
                    <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                      <label htmlFor={`slide-edit-image-${slide._id}`} className="reel-thumb-upload-btn" title="Replace Image">
                        <Upload size={14} style={{marginRight:'0.3rem'}}/> {eSlideImageFile ? '✅ Image Selected' : 'Replace Image'}
                      </label>
                      <input id={`slide-edit-image-${slide._id}`} type="file" accept="image/*" style={{display:'none'}} onChange={e=>{const f=e.target.files?.[0];if(f){setESlideImageFile(f);}}} />
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button type="submit" className="btn-playful btn-primary" style={{flex:1, padding:'0.5rem'}}><Save size={15}/> Save</button>
                      <button type="button" className="btn-playful btn-secondary" style={{flex:1, padding:'0.5rem'}} onClick={() => setEditingSlide(null)}>Cancel</button>
                    </div>
                    {eSlideMsg && <span className="reel-msg">{eSlideMsg}</span>}
                  </form>
                ) : (
                  <div className="admin-product-item" style={{ borderLeftColor: 'var(--color-purple)' }}>
                    <div className="product-swatch" style={{ background: '#f0f0f0', width: '120px' }}>
                      {slide.imageUrl ? <img src={slide.imageUrl} alt="banner" style={{width:'100%',height:'100%',objectFit:'cover'}} /> : <span style={{fontSize: '0.8rem'}}>No Image</span>}
                    </div>
                    <div className="product-details">
                      <p style={{fontSize: '0.9rem', color: 'var(--color-purple)'}}><strong>Link:</strong> {slide.buttonLink || 'None'}</p>
                    </div>
                    <div className="product-actions">
                      <button className="toggle-btn edit-toggle-btn" onClick={() => openEditSlide(slide)} title="Edit">
                        <Edit2 size={15} color="var(--color-purple)"/><span>Edit</span>
                      </button>
                      <button onClick={() => setDeleteConfirm(slide._id)} className="btn-playful btn-danger" style={{padding:'0.4rem 0.8rem'}}>
                        <Trash2 size={15}/>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {heroSlides.length === 0 && <p style={{color:'#888'}}>No banners yet.</p>}
          </div>
        </div>
      </div>

      {deleteConfirm && (
        <div className="edit-modal-backdrop" onClick={() => setDeleteConfirm(null)}>
          <div className="edit-modal" style={{ maxWidth: '400px', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
            <div className="edit-modal-header" style={{ justifyContent: 'center' }}>
              <h3 className="text-pink" style={{ margin: 0 }}>🗑️ Confirm Deletion</h3>
            </div>
            <p style={{ margin: '1.5rem 0', color: '#555' }}>Are you sure you want to delete this hero banner? This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button className="btn-playful btn-secondary" style={{ flex: 1 }} onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button 
                className="btn-playful btn-danger" 
                style={{ flex: 1 }} 
                onClick={async () => {
                  try {
                    await axios.delete(`${API_BASE}/api/hero-slides/${deleteConfirm}`, authHeader()); 
                    fetchHeroSlides(); 
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

export default HeroBannersManagement;
