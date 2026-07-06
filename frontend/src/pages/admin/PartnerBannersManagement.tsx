import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Upload, X, Edit2, Save } from 'lucide-react';
import API_BASE from '../../config';

const PartnerBannersManagement: React.FC = () => {
  const [partnerLeftLink, setPartnerLeftLink] = useState('');
  const [partnerRightLink, setPartnerRightLink] = useState('');
  const [partnerLeftFile, setPartnerLeftFile] = useState<File|null>(null);
  const [partnerRightFile, setPartnerRightFile] = useState<File|null>(null);
  const [partnerLeftPreview, setPartnerLeftPreview] = useState('');
  const [partnerRightPreview, setPartnerRightPreview] = useState('');
  const [partnerMsg, setPartnerMsg] = useState('');
  const [isEditingPartnerBanners, setIsEditingPartnerBanners] = useState(false);
  
  const partnerLeftRef = useRef<HTMLInputElement>(null);
  const partnerRightRef = useRef<HTMLInputElement>(null);

  const token = () => localStorage.getItem('token');

  const fetchPartnerBanners = async () => {
    try { 
      const r = await axios.get(`${API_BASE}/api/settings/partner-banners`); 
      setPartnerLeftLink(r.data.leftLink || '');
      setPartnerRightLink(r.data.rightLink || '');
      setPartnerLeftPreview(r.data.leftImage || '');
      setPartnerRightPreview(r.data.rightImage || '');
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    fetchPartnerBanners();
  }, []);

  const handleSavePartnerBanners = async (e: React.FormEvent) => {
    e.preventDefault(); setPartnerMsg('');
    try {
      const fd = new FormData();
      fd.append('leftLink', partnerLeftLink);
      fd.append('rightLink', partnerRightLink);
      if (partnerLeftFile) fd.append('leftImage', partnerLeftFile);
      if (partnerRightFile) fd.append('rightImage', partnerRightFile);
      
      const r = await axios.put(`${API_BASE}/api/settings/partner-banners`, fd, { headers: { Authorization: `Bearer ${token()}` } });
      setPartnerMsg('✅ Partner Banners updated!');
      setPartnerLeftPreview(r.data.leftImage || '');
      setPartnerRightPreview(r.data.rightImage || '');
      setIsEditingPartnerBanners(false);
    } catch { setPartnerMsg('❌ Failed to update partner banners.'); }
  };

  return (
    <div className="admin-page container">
      <div className="admin-section-title" style={{ marginTop: 0 }}><span>🤝</span> Partner Banners Management</div>
      <div className="admin-content" style={{ marginBottom: '2rem' }}>
        <div className="admin-form-container">
          {!isEditingPartnerBanners ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 className="text-pink" style={{ margin: 0 }}>Current Partner Banners</h3>
                <button type="button" className="toggle-btn edit-toggle-btn" onClick={() => setIsEditingPartnerBanners(true)}>
                  <Edit2 size={16} /> <span>Edit Banners</span>
                </button>
              </div>
              
              <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '250px', background: '#f5f5f5', padding: '1rem', borderRadius: '12px' }}>
                  <h4 style={{ marginBottom: '1rem', color: '#555' }}>Left Banner</h4>
                  {partnerLeftPreview ? (
                    <div>
                      <img src={partnerLeftPreview} alt="Left Banner" style={{ width: '100%', borderRadius: '8px', marginBottom: '1rem', maxHeight: '200px', objectFit: 'cover' }} />
                      <p style={{ margin: 0, fontSize: '0.9rem', color: '#666', wordBreak: 'break-all' }}><strong>Link:</strong> {partnerLeftLink || 'None'}</p>
                    </div>
                  ) : (
                    <p style={{ color: '#888', fontStyle: 'italic' }}>No left banner set.</p>
                  )}
                </div>
                
                <div style={{ flex: 1, minWidth: '250px', background: '#f5f5f5', padding: '1rem', borderRadius: '12px' }}>
                  <h4 style={{ marginBottom: '1rem', color: '#555' }}>Right Banner</h4>
                  {partnerRightPreview ? (
                    <div>
                      <img src={partnerRightPreview} alt="Right Banner" style={{ width: '100%', borderRadius: '8px', marginBottom: '1rem', maxHeight: '200px', objectFit: 'cover' }} />
                      <p style={{ margin: 0, fontSize: '0.9rem', color: '#666', wordBreak: 'break-all' }}><strong>Link:</strong> {partnerRightLink || 'None'}</p>
                    </div>
                  ) : (
                    <p style={{ color: '#888', fontStyle: 'italic' }}>No right banner set.</p>
                  )}
                </div>
              </div>
              {partnerMsg && <p className="reel-msg" style={{ marginTop: '1.5rem' }}>{partnerMsg}</p>}
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 className="text-pink" style={{ margin: 0 }}>Edit Partner Banners</h3>
                <button type="button" className="toggle-btn" onClick={() => setIsEditingPartnerBanners(false)}>
                  <X size={16} /> <span>Cancel</span>
                </button>
              </div>
              <form onSubmit={handleSavePartnerBanners} className="admin-form">
                <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                  {/* Left Banner */}
                  <div style={{ flex: 1, minWidth: '250px' }}>
                    <h4>Left Banner</h4>
                    <input type="text" placeholder="Left Link URL" value={partnerLeftLink} onChange={e => setPartnerLeftLink(e.target.value)} className="playful-input" style={{ marginBottom: '1rem' }} />
                    <div className="image-upload-area">
                      {partnerLeftPreview ? (
                        <div className="image-preview-box">
                          <img src={partnerLeftPreview} alt="Left Preview" className="image-preview" />
                          <button type="button" className="image-clear-btn" onClick={() => { setPartnerLeftFile(null); setPartnerLeftPreview(''); if(partnerLeftRef.current) partnerLeftRef.current.value=''; }}>
                            <X size={16} /> Remove
                          </button>
                        </div>
                      ) : (
                        <label className="image-drop-zone" htmlFor="partner-left-input">
                          <Upload size={28} color="var(--color-purple)" />
                          <span>Upload Left Image</span>
                        </label>
                      )}
                      <input id="partner-left-input" ref={partnerLeftRef} type="file" accept="image/*"
                        onChange={e => { const f=e.target.files?.[0]; if(f){setPartnerLeftFile(f);setPartnerLeftPreview(URL.createObjectURL(f));} }}
                        style={{ display:'none' }} />
                    </div>
                  </div>

                  {/* Right Banner */}
                  <div style={{ flex: 1, minWidth: '250px' }}>
                    <h4>Right Banner</h4>
                    <input type="text" placeholder="Right Link URL" value={partnerRightLink} onChange={e => setPartnerRightLink(e.target.value)} className="playful-input" style={{ marginBottom: '1rem' }} />
                    <div className="image-upload-area">
                      {partnerRightPreview ? (
                        <div className="image-preview-box">
                          <img src={partnerRightPreview} alt="Right Preview" className="image-preview" />
                          <button type="button" className="image-clear-btn" onClick={() => { setPartnerRightFile(null); setPartnerRightPreview(''); if(partnerRightRef.current) partnerRightRef.current.value=''; }}>
                            <X size={16} /> Remove
                          </button>
                        </div>
                      ) : (
                        <label className="image-drop-zone" htmlFor="partner-right-input">
                          <Upload size={28} color="var(--color-purple)" />
                          <span>Upload Right Image</span>
                        </label>
                      )}
                      <input id="partner-right-input" ref={partnerRightRef} type="file" accept="image/*"
                        onChange={e => { const f=e.target.files?.[0]; if(f){setPartnerRightFile(f);setPartnerRightPreview(URL.createObjectURL(f));} }}
                        style={{ display:'none' }} />
                    </div>
                  </div>
                </div>
                <button type="submit" className="btn-playful btn-primary" style={{ marginTop: '2rem' }}>
                  <Save size={18} style={{marginRight: '0.4rem', verticalAlign: 'middle'}}/> Save Partner Banners
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PartnerBannersManagement;
