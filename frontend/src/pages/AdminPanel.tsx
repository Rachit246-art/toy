import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Trash2, Film, Plus, Star, Zap, CheckCircle, Circle, Upload, X, Home, Edit2, Save, Ticket, MessageSquare } from 'lucide-react';
import Navbar from '../components/Navbar';
import API_BASE from '../config';
import './AdminPanel.css';

interface Product {
  _id: string; name: string; price: string; imageColor: string;
  imageUrl: string; badge: string; emoji: string; category?: string;
  isFeatured: boolean; isNewArrival: boolean;
  description?: string; features?: string; additionalInfo?: string; models?: string;
  galleryUrls?: string[]; seoKeywords?: string;
}
interface Reel {
  _id: string;
  title: string;
  youtubeUrl: string;
  thumbnailUrl?: string;
  likes: number;
}
interface Order {
  _id: string;
  customerInfo: { name: string; email: string; phone: string; address: string; city: string; pincode: string };
  items: { _id: string; name: string; price: string; quantity: number; imageUrl: string }[];
  totalAmount: number;
  status: 'Pending' | 'Shipped' | 'Delivered';
  createdAt: string;
}
interface UserAccount {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
}
interface Coupon {
  _id: string;
  code: string;
  discountAmount: number;
  discountType: 'fixed' | 'percentage';
  expiryDate?: string | null;
  maxUsers?: number | null;
  currentUses: number;
  isPublic: boolean;
  createdAt: string;
}
interface HeroSlide {
  _id: string;
  titleLine1: string;
  titleLine2: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  imageUrl: string;
  backgroundColor: string;
  emoji: string;
}

interface ChatbotLead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}

const EMOJI_OPTIONS = ['🧸','🚀','🦕','🤖','🦄','🎠','🐉','🎪','🎡','🎨','🦊','🐙','🦋','🐻','🦁','🐬','🦸','🌟'];

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

const AdminPanel: React.FC = () => {
  const [dbStatus, setDbStatus] = useState<'checking'|'ok'|'error'>('checking');
  const [products, setProducts] = useState<Product[]>([]);
  const [reels, setReels] = useState<Reel[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [chatbotLeads, setChatbotLeads] = useState<ChatbotLead[]>([]);

  // ── Site Settings ──
  const [showcaseUrl, setShowcaseUrl] = useState('');
  const [showcaseMsg, setShowcaseMsg] = useState('');
  const [announcementText1, setAnnouncementText1] = useState('');
  const [announcementText2, setAnnouncementText2] = useState('');
  const [announcementMsg, setAnnouncementMsg] = useState('');

  // ── Add product form ──
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

  // ── Edit product modal ──
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

  // ── Add reel form ──
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

  // ── Edit reel inline ──
  const [editingReel, setEditingReel] = useState<Reel|null>(null);
  const [eReelTitle, setEReelTitle] = useState('');
  const [eReelUrl, setEReelUrl] = useState('');
  const [eReelLikes, setEReelLikes] = useState('0');
  const [eReelMsg, setEReelMsg] = useState('');
  const [eReelThumbFile, setEReelThumbFile] = useState<File|null>(null);
  const [eReelVideoFile, setEReelVideoFile] = useState<File|null>(null);

  // ── Add coupon form ──
  const [couponCode, setCouponCode] = useState('');
  const [couponAmount, setCouponAmount] = useState('');
  const [couponType, setCouponType] = useState('fixed');
  const [couponExpiry, setCouponExpiry] = useState('');
  const [couponMaxUsers, setCouponMaxUsers] = useState('');
  const [couponIsPublic, setCouponIsPublic] = useState(false);
  const [couponMsg, setCouponMsg] = useState('');

  // ── Add Hero Banner form ──
  const [slideBtnLink, setSlideBtnLink] = useState('');
  const [slideImageFile, setSlideImageFile] = useState<File|null>(null);
  const [slideImagePreview, setSlideImagePreview] = useState('');
  const [slideMsg, setSlideMsg] = useState('');
  const slideFileRef = useRef<HTMLInputElement>(null);

  // ── Partner Banners form ──
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

  // ── Edit hero banner inline ──
  const [editingSlide, setEditingSlide] = useState<HeroSlide|null>(null);
  const [eSlideBtnLink, setESlideBtnLink] = useState('');
  const [eSlideImageFile, setESlideImageFile] = useState<File|null>(null);
  const [eSlideMsg, setESlideMsg] = useState('');

  // ── Custom Delete Confirmation Modal ──
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string, type: 'product' | 'reel' | 'coupon' | 'slide' | null }>({ id: '', type: null });

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
  const fetchOrders = async () => {
    try { const r = await axios.get(`${API_BASE}/api/orders`, authHeader()); setOrders(r.data); }
    catch (e) { console.error(e); }
  };
  const fetchUsers = async () => {
    try { const r = await axios.get(`${API_BASE}/api/users`, authHeader()); setUsers(r.data); }
    catch (e) { console.error(e); }
  };
  const fetchCoupons = async () => {
    try { const r = await axios.get(`${API_BASE}/api/coupons`, authHeader()); setCoupons(r.data); }
    catch (e) { console.error(e); }
  };
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
  const fetchHeroSlides = async () => {
    try { 
      const r = await axios.get(`${API_BASE}/api/hero-slides`); 
      if (Array.isArray(r.data)) setHeroSlides(r.data); 
    }
    catch (e) { console.error(e); }
  };
  const fetchChatbotLeads = async () => {
    try { const r = await axios.get(`${API_BASE}/api/chatbot-leads`, authHeader()); setChatbotLeads(r.data); }
    catch (e) { console.error(e); }
  };
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
    if (!token()) { navigate('/login', { replace: true }); return; }
    checkDb(); fetchProducts(); fetchReels(); fetchOrders(); fetchUsers(); fetchCoupons(); fetchShowcaseVideo(); fetchAnnouncements(); fetchHeroSlides(); fetchPartnerBanners(); fetchChatbotLeads();
  }, [navigate]);

  const handleSaveAnnouncements = async (e: React.FormEvent) => {
    e.preventDefault(); setAnnouncementMsg('');
    try {
      await axios.put(`${API_BASE}/api/settings/announcements`, 
        { announcementText1, announcementText2 },
        { headers: { Authorization: `Bearer ${token()}` } }
      );
      setAnnouncementMsg('✅ Announcements updated!');
    } catch { setAnnouncementMsg('❌ Failed to update announcements.'); }
  };

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
    } catch { setPartnerMsg('❌ Failed to update partner banners.'); }
  };

  // ── Add product ──
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

  // ── Open edit modal ──
  const openEditProduct = (p: Product) => {
    setEditingProduct(p); setEName(p.name); setEPrice(p.price);
    setEColor(p.imageColor); setEBadge(p.badge); setEEmoji(p.emoji || '🧸'); setECategory(p.category || 'Toys');
    setEFeatured(p.isFeatured); setENewArrival(p.isNewArrival);
    setEDescription(p.description || ''); setEFeatures(p.features || '');
    setEAdditionalInfo(p.additionalInfo || '');    setEditModels(p.models || '');
    setEditSeoKeywords(p.seoKeywords || '');
    setEImagePreview(p.imageUrl || ''); setEGalleryFiles([]); setEditMsg('');
  };

  // ── Save edit ──
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

  const handleDeleteProduct = (id: string) => {
    setDeleteConfirm({ id, type: 'product' });
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

  // ── Open edit reel ──
  const openEditReel = (r: Reel) => {
    setEditingReel(r); setEReelTitle(r.title);
    setEReelUrl(r.youtubeUrl); setEReelLikes(String(r.likes)); setEReelMsg('');
    setEReelThumbFile(null); setEReelVideoFile(null);
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
      if (eReelVideoFile) fd.append('video', eReelVideoFile);
      await axios.put(`${API_BASE}/api/reels/${editingReel._id}`, fd, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      setEReelMsg('✅ Saved!'); fetchReels();
      setTimeout(() => setEditingReel(null), 600);
    } catch { setEReelMsg('❌ Save failed.'); }
  };

  const handleDeleteReel = (id: string) => {
    setDeleteConfirm({ id, type: 'reel' });
  };

  const updateOrderStatus = async (id: string, newStatus: string) => {
    try { 
      await axios.patch(`${API_BASE}/api/orders/${id}/status`, { status: newStatus }, authHeader()); 
      fetchOrders(); 
    } catch (e) { console.error(e); }
  };

  const handleAddCoupon = async (e: React.FormEvent) => {
    e.preventDefault(); setCouponMsg('');
    try {
      await axios.post(`${API_BASE}/api/coupons`, {
        code: couponCode,
        discountAmount: Number(couponAmount),
        discountType: couponType,
        expiryDate: couponExpiry || null,
        maxUsers: couponMaxUsers ? Number(couponMaxUsers) : null,
        isPublic: couponIsPublic
      }, authHeader());
      setCouponCode(''); setCouponAmount(''); setCouponType('fixed'); 
      setCouponExpiry(''); setCouponMaxUsers(''); setCouponIsPublic(false);
      setCouponMsg('✅ Coupon added!');
      fetchCoupons();
    } catch (err: any) {
      setCouponMsg(err.response?.data?.message || '❌ Failed to add coupon.');
    }
  };

  const handleDeleteCoupon = (id: string) => {
    setDeleteConfirm({ id, type: 'coupon' });
  };

  const handleSaveShowcaseVideo = async (e: React.FormEvent) => {
    e.preventDefault(); setShowcaseMsg('');
    try {
      const formattedUrl = formatYouTubeEmbed(showcaseUrl);
      await axios.put(`${API_BASE}/api/settings/showcase-video`, { showcaseVideoUrl: formattedUrl }, authHeader());
      setShowcaseUrl(formattedUrl);
      setShowcaseMsg('✅ Showcase video updated!');
    } catch { setShowcaseMsg('❌ Failed to update.'); }
  };

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

  const handleDeleteHeroSlide = (id: string) => {
    setDeleteConfirm({ id, type: 'slide' });
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

  const handleLogout = () => { localStorage.removeItem('token'); navigate('/login'); };

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

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
            { icon: '💰', num: `₹${totalRevenue.toLocaleString()}`, label: 'Total Revenue' },
            { icon: '📦', num: orders.length,     label: 'Total Orders' },
            { icon: '👥', num: users.length,      label: 'Total Users' },
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
                <select value={eCategory} onChange={e => setECategory(e.target.value)} className="playful-input">
                  <option value="Toys">Toys</option>
                  <option value="DIY Paint Kit">DIY Paint Kit</option>
                  <option value="Home Decor">Home Decor</option>
                  <option value="Collectible">Collectible</option>
                </select>
                
                <textarea placeholder="Description" value={eDescription} onChange={e => setEDescription(e.target.value)} className="playful-input" />
                <textarea placeholder="Features (one per line)" value={eFeatures} onChange={e => setEFeatures(e.target.value)} className="playful-input" />
                <textarea placeholder="Additional Info" value={eAdditionalInfo} onChange={e => setEAdditionalInfo(e.target.value)} className="playful-input" />
                
                <label className="field-label">Models/Dimensions</label>
                <textarea value={editModels} onChange={e => setEditModels(e.target.value)} className="playful-input" style={{minHeight:'60px'}}/>

                <label className="field-label">SEO Keywords</label>
                <input type="text" value={editSeoKeywords} onChange={e => setEditSeoKeywords(e.target.value)} className="playful-input" />

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
                      <span style={{ fontSize: '0.82rem' }}>Replace main image</span>
                    </label>
                    <input id="edit-toy-image" ref={editFileRef} type="file" accept="image/*" style={{ display:'none' }}
                      onChange={e => { const f = e.target.files?.[0]; if(f){ setEditImageFile(f); setEImagePreview(URL.createObjectURL(f)); }}} />
                  </div>
                </div>

                {/* Gallery */}
                <div className="image-upload-area">
                  <label className="field-label">Gallery Images (Replace all)</label>
                  <input type="file" multiple accept="image/*" onChange={e => setEGalleryFiles(Array.from(e.target.files || []).slice(0, 4))} />
                  <div style={{fontSize:'0.8rem', color:'#666'}}>{eGalleryFiles.length} files selected</div>
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
              <select value={category} onChange={e => setCategory(e.target.value)} className="playful-input">
                <option value="Toys">Toys</option>
                <option value="DIY Paint Kit">DIY Paint Kit</option>
                <option value="Home Decor">Home Decor</option>
                <option value="Collectible">Collectible</option>
              </select>

              <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} className="playful-input" style={{minHeight:'80px'}} />
              <textarea placeholder="Features (one per line)" value={features} onChange={e => setFeatures(e.target.value)} className="playful-input" style={{minHeight:'80px'}} />
              <textarea placeholder="Additional Info" value={additionalInfo} onChange={e => setAdditionalInfo(e.target.value)} className="playful-input" style={{minHeight:'80px'}} />
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
                    <h3>{p.name}</h3>
                    <p>{p.price}</p>
                    <p style={{fontSize: '0.8rem', color: '#666'}}>{p.category || 'Toys'}</p>
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

        {/* ══ HERO BANNERS MANAGEMENT ══ */}
        <div className="admin-section-title" style={{ marginTop: '3rem' }}><span>🖼️</span> Hero Banners Management</div>
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
                        <button onClick={() => handleDeleteHeroSlide(slide._id)} className="btn-playful btn-danger" style={{padding:'0.4rem 0.8rem'}}>
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

        {/* ══ PARTNER BANNERS MANAGEMENT ══ */}
        <div className="admin-section-title" style={{ marginTop: '3rem' }}><span>🤝</span> Partner Banners Management</div>
        <div className="admin-content" style={{ marginBottom: '2rem' }}>
          <div className="admin-form-container">
            {!isEditingPartnerBanners ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h3 className="text-pink" style={{ margin: 0 }}>Current Partner Banners</h3>
                  <button type="button" className="action-btn edit" onClick={() => setIsEditingPartnerBanners(true)}>
                    <Edit2 size={16} /> Edit Banners
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
                {partnerMsg && <p className="success-msg" style={{ marginTop: '1.5rem' }}>{partnerMsg}</p>}
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h3 className="text-pink" style={{ margin: 0 }}>Edit Partner Banners</h3>
                  <button type="button" className="action-btn delete" onClick={() => setIsEditingPartnerBanners(false)}>
                    <X size={16} /> Cancel
                  </button>
                </div>
                <form onSubmit={async (e) => {
                  await handleSavePartnerBanners(e);
                  setIsEditingPartnerBanners(false);
                }} className="admin-form">
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
                  <button type="submit" className="save-btn" style={{ marginTop: '2rem' }}>
                    <Save size={18} /> Save Partner Banners
                  </button>
                  {partnerMsg && <p className="success-msg">{partnerMsg}</p>}
                </form>
              </div>
            )}
          </div>
        </div>

        {/* ══ VIDEO REELS ══ */}
        <div className="admin-section-title" style={{ marginTop: '3rem' }}><span>📺</span> Main Showcase Video</div>
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
        </div>

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

                {/* Thumbnail upload */}
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

                {/* Video upload — for Instagram reels or any direct video */}
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
                          onChange={e=>{const f=e.target.files?.[0];if(f){setEReelThumbFile(f);}}} />
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

        {/* ══ ORDERS MANAGEMENT ══ */}
        <div className="admin-section-title" style={{ marginTop: '3rem' }}><span>📦</span> Order Management</div>
        <div className="admin-list-container">
          <h2 className="text-purple" style={{ marginBottom: '1.5rem' }}>Recent Orders ({orders.length})</h2>
            
            {orders.length === 0 ? (
              <p style={{color:'#888', padding: '1rem 0'}}>No orders yet.</p>
            ) : (
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order ID & Date</th>
                      <th>Customer Details</th>
                      <th>Items Ordered</th>
                      <th>Total Amount</th>
                      <th>Status Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(o => (
                      <tr key={o._id}>
                        <td>
                          <strong>#{o._id.slice(-6).toUpperCase()}</strong>
                          <div className="table-subtext">{new Date(o.createdAt).toLocaleDateString()}</div>
                        </td>
                        <td>
                          <strong>{o.customerInfo.name}</strong>
                          <div className="table-subtext">{o.customerInfo.phone}</div>
                          <div className="table-subtext">{o.customerInfo.address}, {o.customerInfo.city} - {o.customerInfo.pincode}</div>
                        </td>
                        <td>
                          <div className="table-items-list">
                            {o.items.map(item => (
                              <div key={item._id} className="table-item-line">
                                {item.quantity}x {item.name}
                              </div>
                            ))}
                          </div>
                        </td>
                        <td style={{ fontWeight: 'bold', color: 'var(--color-pink)' }}>
                          ₹{o.totalAmount.toLocaleString()}
                        </td>
                        <td>
                          <select 
                            className={`status-select status-${o.status.toLowerCase()}`}
                            value={o.status} 
                            onChange={(e) => updateOrderStatus(o._id, e.target.value)}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
        </div>

        {/* ══ USER MANAGEMENT ══ */}
        <div className="admin-section-title" style={{ marginTop: '3rem' }}><span>👥</span> User Management</div>
        <div className="admin-list-container">
          <h2 className="text-blue" style={{ marginBottom: '1.5rem' }}>Registered Users ({users.length})</h2>
            
            {users.length === 0 ? (
              <p style={{color:'#888', padding: '1rem 0'}}>No users found.</p>
            ) : (
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u._id}>
                        <td><strong>{u.name}</strong></td>
                        <td>{u.email}</td>
                        <td>{u.phone || '-'}</td>
                        <td>
                          <span className={`role-badge role-${u.role}`}>
                            {u.role.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
        </div>

        {/* ══ COUPONS MANAGEMENT ══ */}
        <div className="admin-section-title" style={{ marginTop: '3rem' }}><span>🎟️</span> Coupon Management</div>
        <div className="admin-content">
          <div className="admin-form-container reel-form-container">
            <h3 className="text-pink" style={{marginBottom:'1.2rem',display:'flex',alignItems:'center',gap:'0.5rem'}}>
              <Plus size={18}/> Add New Coupon
            </h3>
            <form onSubmit={handleAddCoupon} className="admin-form">
              <input type="text" placeholder="Coupon Code (e.g. WELCOME10)" value={couponCode}
                onChange={e => setCouponCode(e.target.value.toUpperCase())} required className="playful-input" />
              <div style={{ display: 'flex', gap: '1rem' }}>
                <input type="number" placeholder="Discount Amount" value={couponAmount}
                  onChange={e => setCouponAmount(e.target.value)} required className="playful-input" style={{ flex: 2 }} />
                <select value={couponType} onChange={e => setCouponType(e.target.value)} className="playful-input" style={{ flex: 1 }}>
                  <option value="fixed">Fixed (₹)</option>
                  <option value="percentage">Percentage (%)</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label className="field-label" style={{ marginBottom: '0.2rem' }}>Expiry Date (Optional)</label>
                  <input type="date" value={couponExpiry} onChange={e => setCouponExpiry(e.target.value)} className="playful-input" />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="field-label" style={{ marginBottom: '0.2rem' }}>Max Uses (Optional)</label>
                  <input type="number" placeholder="Leave empty for unlimited" value={couponMaxUsers} onChange={e => setCouponMaxUsers(e.target.value)} className="playful-input" />
                </div>
              </div>
              
              <label className={`flag-toggle${couponIsPublic?' flag-toggle--on':''}`} style={{ marginTop: '0.5rem' }}>
                <input type="checkbox" checked={couponIsPublic} onChange={e => setCouponIsPublic(e.target.checked)} />
                <Ticket size={15} fill={couponIsPublic?'var(--color-pink)':'none'} color={couponIsPublic?'var(--color-pink)':'#aaa'} /> 
                Make Public (Visible in user cart)
              </label>

              <button type="submit" className="btn-playful btn-primary" style={{ marginTop: '1rem' }}>
                <Plus size={16} style={{marginRight:'0.4rem',verticalAlign:'middle'}}/> Add Coupon
              </button>
              {couponMsg && <p className="reel-msg">{couponMsg}</p>}
            </form>
          </div>

          <div className="admin-list-container reel-list-container">
            <h3 className="text-blue" style={{marginBottom:'1.2rem'}}>Active Coupons ({coupons.length})</h3>
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Discount</th>
                    <th>Visibility</th>
                    <th>Usage / Expiry</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.length === 0 ? (
                    <tr><td colSpan={5} style={{textAlign:'center', padding:'1.5rem', color:'#888'}}>No coupons found.</td></tr>
                  ) : (
                    coupons.map(c => {
                      const isExpired = c.expiryDate && new Date(c.expiryDate) < new Date();
                      const isExhausted = typeof c.maxUsers === 'number' && c.currentUses >= c.maxUsers;
                      const isInactive = isExpired || isExhausted;
                      return (
                        <tr key={c._id} style={{ opacity: isInactive ? 0.6 : 1 }}>
                          <td><strong style={{ letterSpacing: '1px' }}>{c.code}</strong></td>
                          <td style={{ color: 'var(--color-pink)', fontWeight: 'bold' }}>
                            {c.discountType === 'percentage' ? `${c.discountAmount}%` : `₹${c.discountAmount}`} OFF
                          </td>
                          <td>
                            {c.isPublic ? <span className="flag-badge flag-featured">Public</span> : <span className="flag-badge" style={{background:'#eee', color:'#555'}}>Private</span>}
                          </td>
                          <td>
                            <div className="table-subtext">Uses: {c.currentUses} {c.maxUsers ? `/ ${c.maxUsers}` : '(unlimited)'}</div>
                            {c.expiryDate && <div className="table-subtext">Exp: {new Date(c.expiryDate).toLocaleDateString()}</div>}
                            {isInactive && <span style={{color:'red', fontSize:'0.75rem', fontWeight:'bold'}}>{isExpired ? 'EXPIRED' : 'EXHAUSTED'}</span>}
                          </td>
                          <td>
                            <button onClick={() => handleDeleteCoupon(c._id)} className="btn-playful btn-danger" style={{padding:'0.4rem 0.8rem'}}>
                              <Trash2 size={15}/>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ══ CHATBOT LEADS ══ */}
        <div className="admin-section-title" style={{ marginTop: '3rem' }}><span><MessageSquare size={20} style={{verticalAlign:'middle', marginRight:'0.5rem'}}/></span> Chatbot Leads</div>
        <div className="admin-list-container">
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {(!chatbotLeads || !Array.isArray(chatbotLeads) || chatbotLeads.length === 0) ? (
                  <tr><td colSpan={4} style={{textAlign:'center', padding:'1.5rem', color:'#888'}}>No leads yet.</td></tr>
                ) : (
                  chatbotLeads.map(lead => (
                    <tr key={lead._id}>
                      <td><strong>{lead.name}</strong></td>
                      <td>{lead.email}</td>
                      <td>{lead.phone}</td>
                      <td>{new Date(lead.createdAt).toLocaleDateString()} {new Date(lead.createdAt).toLocaleTimeString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* ══ DELETE CONFIRMATION MODAL ══ */}
      {deleteConfirm.type && (
        <div className="edit-modal-backdrop" onClick={() => setDeleteConfirm({ id: '', type: null })}>
          <div className="edit-modal" style={{ maxWidth: '400px', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
            <div className="edit-modal-header" style={{ justifyContent: 'center' }}>
              <h3 className="text-pink" style={{ margin: 0 }}>🗑️ Confirm Deletion</h3>
            </div>
            <p style={{ margin: '1.5rem 0', color: '#555' }}>
              Are you sure you want to delete this {deleteConfirm.type}? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button className="btn-playful btn-secondary" style={{ flex: 1 }} onClick={() => setDeleteConfirm({ id: '', type: null })}>
                Cancel
              </button>
              <button 
                className="btn-playful btn-danger" 
                style={{ flex: 1 }} 
                onClick={async () => {
                  const { id, type } = deleteConfirm;
                  try {
                    if (type === 'product') { await axios.delete(`${API_BASE}/api/products/${id}`, authHeader()); fetchProducts(); }
                    else if (type === 'reel') { await axios.delete(`${API_BASE}/api/reels/${id}`, authHeader()); fetchReels(); }
                    else if (type === 'coupon') { await axios.delete(`${API_BASE}/api/coupons/${id}`, authHeader()); fetchCoupons(); }
                    else if (type === 'slide') { await axios.delete(`${API_BASE}/api/hero-slides/${id}`, authHeader()); fetchHeroSlides(); }
                  } catch (e) { console.error(e); }
                  setDeleteConfirm({ id: '', type: null });
                }}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminPanel;
