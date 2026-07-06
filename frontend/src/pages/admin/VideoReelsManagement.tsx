import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Trash2, Film, Plus, Upload, X, Edit2, Save } from 'lucide-react';
import API_BASE from '../../config';

interface Reel {
  _id: string;
  title: string;
  youtubeUrl: string;
  thumbnailUrl?: string;
  likes: number;
}

function extractId(url: string): string {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([^&?/\s]{11})/);
  return m ? m[1] : '';
}

const VideoReelsManagement: React.FC = () => {
  const [reels, setReels] = useState<Reel[]>([]);

  // Add reel form
  const [reelTitle, setReelTitle] = useState('');
  const [reelUrl, setReelUrl] = useState('');
  const [reelLikes, setReelLikes] = useState('0');
  const [reelMsg, setReelMsg] = useState('');
  const [reelThumbFile, setReelThumbFile] = useState<File|null>(null);
  const [reelThumbPreview, setReelThumbPreview] = useState('');
  const [reelVideoFile, setReelVideoFile] = useState<File|null>(null);
  const [reelVideoName, setReelVideoName] = useState('');
  const reelThumbRef = useRef<HTMLInputElement>(null);
  const reelVideoRef = useRef<HTMLInputElement>(null);

  // Edit reel inline
  const [editingReel, setEditingReel] = useState<Reel|null>(null);
  const [eReelTitle, setEReelTitle] = useState('');
  const [eReelUrl, setEReelUrl] = useState('');
  const [eReelLikes, setEReelLikes] = useState('0');
  const [eReelMsg, setEReelMsg] = useState('');
  const [eReelThumbFile, setEReelThumbFile] = useState<File|null>(null);
  const [eReelVideoFile, setEReelVideoFile] = useState<File|null>(null);

  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const token = () => localStorage.getItem('token');
  const authHeader = () => ({ headers: { Authorization: `Bearer ${token()}` } });

  const fetchReels = async () => {
    try { const r = await axios.get(`${API_BASE}/api/reels`); setReels(r.data); }
    catch (e) { console.error(e); }
  };

  useEffect(() => {
    fetchReels();
  }, []);

  const handleAddReel = async (e: React.FormEvent) => {
    e.preventDefault(); setReelMsg('');
    try {
      const fd = new FormData();
      fd.append('title', reelTitle);
      fd.append('youtubeUrl', reelUrl);
      fd.append('likes', String(parseInt(reelLikes)||0));
      if (reelThumbFile) fd.append('thumbnail', reelThumbFile);
      if (reelVideoFile) fd.append('video', reelVideoFile);
      await axios.post(`${API_BASE}/api/reels`, fd, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      setReelTitle(''); setReelUrl(''); setReelLikes('0');
      setReelThumbFile(null); setReelThumbPreview('');
      setReelVideoFile(null); setReelVideoName('');
      if (reelThumbRef.current) reelThumbRef.current.value = '';
      if (reelVideoRef.current) reelVideoRef.current.value = '';
      setReelMsg('✅ Reel added!'); fetchReels();
    } catch (err: any) {
      setReelMsg(`❌ Failed to add reel.`);
    }
  };

  const openEditReel = (r: Reel) => {
    setEditingReel(r); setEReelTitle(r.title);
    setEReelUrl(r.youtubeUrl); setEReelLikes(String(r.likes)); setEReelMsg('');
    setEReelThumbFile(null); setEReelVideoFile(null);
  };

  const handleSaveReel = async (e: React.FormEvent) => {
    e.preventDefault(); if (!editingReel) return; setEReelMsg('');
    try {
      const fd = new FormData();
      fd.append('title', eReelTitle);
      fd.append('youtubeUrl', eReelUrl);
      fd.append('likes', String(parseInt(eReelLikes)||0));
      if (eReelThumbFile) fd.append('thumbnail', eReelThumbFile);
      if (eReelVideoFile) fd.append('video', eReelVideoFile);
      await axios.put(`${API_BASE}/api/reels/${editingReel._id}`, fd, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      setEReelMsg('✅ Saved!'); fetchReels();
      setTimeout(() => setEditingReel(null), 600);
    } catch { setEReelMsg('❌ Save failed.'); }
  };

  return (
    <div className="admin-page container">
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

            <div className="image-upload-area">
              <label className="field-label">
                Thumbnail Image
                <span style={{fontWeight:400,color:'#999',marginLeft:'0.4rem'}}>(optional — auto-generated for YouTube)</span>
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

            <div className="image-upload-area">
              <label className="field-label">
                Upload Video File
                <span style={{fontWeight:400,color:'#999',marginLeft:'0.4rem'}}>(MP4/MOV — plays directly in the card)</span>
              </label>
              <label className={`image-drop-zone${reelVideoName ? ' image-drop-zone--has-file' : ''}`} htmlFor="reel-video-input" style={{padding:'0.8rem'}}>
                <Upload size={22} color={reelVideoName ? 'var(--color-purple)' : '#aaa'} />
                <span style={{fontSize:'0.82rem'}}>{reelVideoName || 'Upload video (MP4, MOV, WEBM)'}</span>
                {reelVideoName && <span style={{fontSize:'0.72rem',color:'green'}}>✅ Ready to upload</span>}
              </label>
              <input id="reel-video-input" ref={reelVideoRef} type="file" accept="video/*"
                onChange={e => { const f=e.target.files?.[0]; if(f){setReelVideoFile(f);setReelVideoName(f.name);} }}
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
                  <form onSubmit={handleSaveReel} className="reel-edit-row">
                    <input type="text" value={eReelTitle} onChange={e=>setEReelTitle(e.target.value)}
                      required className="playful-input reel-edit-input" placeholder="Title" />
                    <input type="url" value={eReelUrl} onChange={e=>setEReelUrl(e.target.value)}
                      required className="playful-input reel-edit-input" placeholder="YouTube or Instagram URL" />
                    <input type="number" value={eReelLikes} onChange={e=>setEReelLikes(e.target.value)}
                      min="0" className="playful-input reel-edit-input" placeholder="Likes" style={{width:90}} />
                    <label htmlFor={`reel-edit-thumb-${r._id}`} className="reel-thumb-upload-btn" title="Replace thumbnail">
                      <Upload size={14}/>
                      {eReelThumbFile ? '✅' : 'Thumb'}
                    </label>
                    <input id={`reel-edit-thumb-${r._id}`} type="file" accept="image/*" style={{display:'none'}}
                      onChange={e=>{const f=e.target.files?.[0];if(f){setEReelThumbFile(f);}}} />
                    <button type="submit" className="btn-playful btn-primary" style={{padding:'0.5rem 0.9rem'}}>
                      <Save size={15}/>
                    </button>
                    <button type="button" className="btn-playful btn-secondary" style={{padding:'0.5rem 0.9rem'}}
                      onClick={() => setEditingReel(null)}><X size={15}/></button>
                    {eReelMsg && <span className="reel-msg">{eReelMsg}</span>}
                  </form>
                ) : (
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
                    <button onClick={() => setDeleteConfirm(r._id)} className="btn-playful btn-danger reel-delete-btn">
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

      {deleteConfirm && (
        <div className="edit-modal-backdrop" onClick={() => setDeleteConfirm(null)}>
          <div className="edit-modal" style={{ maxWidth: '400px', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
            <div className="edit-modal-header" style={{ justifyContent: 'center' }}>
              <h3 className="text-pink" style={{ margin: 0 }}>🗑️ Confirm Deletion</h3>
            </div>
            <p style={{ margin: '1.5rem 0', color: '#555' }}>Are you sure you want to delete this reel? This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button className="btn-playful btn-secondary" style={{ flex: 1 }} onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button 
                className="btn-playful btn-danger" 
                style={{ flex: 1 }} 
                onClick={async () => {
                  try {
                    await axios.delete(`${API_BASE}/api/reels/${deleteConfirm}`, authHeader()); 
                    fetchReels(); 
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

export default VideoReelsManagement;
