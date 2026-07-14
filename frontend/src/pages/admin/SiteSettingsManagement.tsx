import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Film, Ticket, Save, ShoppingCart } from 'lucide-react';
import API_BASE from '../../config';

function extractId(url: string): string {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([^&?/\s]{11})/);
  return m ? m[1] : '';
}

function formatYouTubeEmbed(url: string): string {
  const id = extractId(url);
  if (id) {
    return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`;
  }
  return url;
}

const SiteSettingsManagement: React.FC = () => {
  const [showcaseUrl, setShowcaseUrl] = useState('');
  const [showcaseMsg, setShowcaseMsg] = useState('');
  
  const [announcementText1, setAnnouncementText1] = useState('');
  const [announcementText2, setAnnouncementText2] = useState('');
  const [announcementMsg, setAnnouncementMsg] = useState('');

  const [amazonStoreLink, setAmazonStoreLink] = useState('');
  const [flipkartStoreLink, setFlipkartStoreLink] = useState('');
  const [indiamartStoreLink, setIndiamartStoreLink] = useState('');
  const [onlineStoresMsg, setOnlineStoresMsg] = useState('');

  const token = () => localStorage.getItem('token');
  const authHeader = () => ({ headers: { Authorization: `Bearer ${token()}` } });

  const fetchShowcaseVideo = async () => {
    try { const r = await axios.get(`${API_BASE}/api/settings/showcase-video`); setShowcaseUrl(r.data.showcaseVideoUrl); }
    catch (e) { console.error(e); }
  };
  
  const fetchAnnouncements = async () => {
    try { 
      const r = await axios.get(`${API_BASE}/api/settings/announcements`); 
      setAnnouncementText1(r.data.announcementText1 || '');
      setAnnouncementText2(r.data.announcementText2 || '');
    } catch (e) { console.error(e); }
  };

  const fetchOnlineStores = async () => {
    try { 
      const r = await axios.get(`${API_BASE}/api/settings/online-stores`); 
      setAmazonStoreLink(r.data.amazonStoreLink || '');
      setFlipkartStoreLink(r.data.flipkartStoreLink || '');
      setIndiamartStoreLink(r.data.indiamartStoreLink || '');
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    fetchShowcaseVideo();
    fetchAnnouncements();
    fetchOnlineStores();
  }, []);

  const handleSaveShowcaseVideo = async (e: React.FormEvent) => {
    e.preventDefault(); setShowcaseMsg('');
    try {
      const formattedUrl = formatYouTubeEmbed(showcaseUrl);
      await axios.put(`${API_BASE}/api/settings/showcase-video`, { showcaseVideoUrl: formattedUrl }, authHeader());
      setShowcaseUrl(formattedUrl);
      setShowcaseMsg('✅ Showcase video updated!');
    } catch { setShowcaseMsg('❌ Failed to update.'); }
  };

  const handleSaveAnnouncements = async (e: React.FormEvent) => {
    e.preventDefault(); setAnnouncementMsg('');
    try {
      await axios.put(`${API_BASE}/api/settings/announcements`, 
        { announcementText1, announcementText2 },
        authHeader()
      );
      setAnnouncementMsg('✅ Announcements updated!');
    } catch { setAnnouncementMsg('❌ Failed to update announcements.'); }
  };

  const handleSaveOnlineStores = async (e: React.FormEvent) => {
    e.preventDefault(); setOnlineStoresMsg('');
    try {
      await axios.put(`${API_BASE}/api/settings/online-stores`, 
        { amazonStoreLink, flipkartStoreLink, indiamartStoreLink },
        authHeader()
      );
      setOnlineStoresMsg('✅ Online store links updated!');
    } catch { setOnlineStoresMsg('❌ Failed to update online store links.'); }
  };

  return (
    <div className="admin-page container">
      <div className="admin-section-title" style={{ marginTop: 0 }}><span>⚙️</span> Site Settings</div>
      <div className="admin-content" style={{ marginBottom: '2rem' }}>
        <div className="admin-form-container reel-form-container">
          <h3 className="text-pink" style={{marginBottom:'1.2rem',display:'flex',alignItems:'center',gap:'0.5rem'}}>
            <Film size={18}/> Home Page Main Video
          </h3>
          <form onSubmit={handleSaveShowcaseVideo} className="admin-form">
            <input type="url" placeholder="YouTube Embed URL"
              value={showcaseUrl} onChange={e => setShowcaseUrl(e.target.value)} required className="playful-input" />
            <button type="submit" className="btn-playful btn-primary" style={{ marginTop: '0.5rem' }}>
              <Save size={16} style={{marginRight:'0.4rem',verticalAlign:'middle'}}/> Save Video
            </button>
            {showcaseMsg && <p className="reel-msg">{showcaseMsg}</p>}
          </form>
          <div className="reel-url-hint">
            <strong>Tip:</strong> Ensure you use an embed URL. E.g., <code>https://www.youtube.com/embed/dQw4w9WgXcQ</code>
          </div>
        </div>

        <div className="admin-form-container reel-form-container">
          <h3 className="text-pink" style={{marginBottom:'1.2rem',display:'flex',alignItems:'center',gap:'0.5rem'}}>
            <Ticket size={18}/> Top Announcements
          </h3>
          <form onSubmit={handleSaveAnnouncements} className="admin-form">
            <label className="field-label">Announcement 1 (e.g. Free Shipping)</label>
            <input type="text" placeholder="Announcement 1"
              value={announcementText1} onChange={e => setAnnouncementText1(e.target.value)} required className="playful-input" />
              
            <label className="field-label">Announcement 2 (e.g. Coupon Code)</label>
            <input type="text" placeholder="Announcement 2"
              value={announcementText2} onChange={e => setAnnouncementText2(e.target.value)} required className="playful-input" />
              
            <button type="submit" className="btn-playful btn-primary" style={{ marginTop: '0.5rem' }}>
              <Save size={16} style={{marginRight:'0.4rem',verticalAlign:'middle'}}/> Save Announcements
            </button>
            {announcementMsg && <p className="reel-msg">{announcementMsg}</p>}
          </form>
        </div>

        <div className="admin-form-container reel-form-container">
          <h3 className="text-pink" style={{marginBottom:'1.2rem',display:'flex',alignItems:'center',gap:'0.5rem'}}>
            <ShoppingCart size={18}/> Online Store Links
          </h3>
          <form onSubmit={handleSaveOnlineStores} className="admin-form">
            <label className="field-label">Amazon Store Link</label>
            <input type="url" placeholder="https://amazon.in/..."
              value={amazonStoreLink} onChange={e => setAmazonStoreLink(e.target.value)} className="playful-input" />
              
            <label className="field-label">Flipkart Store Link</label>
            <input type="url" placeholder="https://flipkart.com/..."
              value={flipkartStoreLink} onChange={e => setFlipkartStoreLink(e.target.value)} className="playful-input" />

            <label className="field-label">IndiaMART Store Link</label>
            <input type="url" placeholder="https://indiamart.com/..."
              value={indiamartStoreLink} onChange={e => setIndiamartStoreLink(e.target.value)} className="playful-input" />
              
            <button type="submit" className="btn-playful btn-primary" style={{ marginTop: '0.5rem' }}>
              <Save size={16} style={{marginRight:'0.4rem',verticalAlign:'middle'}}/> Save Store Links
            </button>
            {onlineStoresMsg && <p className="reel-msg">{onlineStoresMsg}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default SiteSettingsManagement;
