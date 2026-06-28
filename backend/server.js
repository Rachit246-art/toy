require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const app = express();

// ── CORS — allow Vercel frontend + localhost dev ──
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://toy-git-main-rachit246-arts-projects.vercel.app',
  'https://toy-e0h25coer-rachit246-arts-projects.vercel.app',
  'https://orange-wolverine-290055.hostingersite.com',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow all origins to bypass CORS issues during testing/deployment
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

const PORT       = process.env.PORT        || 5000;
const JWT_SECRET = process.env.JWT_SECRET  || 'supersecretpigglitzkey';

// Build MongoDB URI — use separate vars so special chars in password are handled safely
const MONGO_USER = encodeURIComponent(process.env.MONGO_USER || 'admin');
const MONGO_PASS = encodeURIComponent(process.env.MONGO_PASS || 'Rachit@12');
const MONGO_HOST1 = 'ac-kxdsipc-shard-00-00.m8mypwk.mongodb.net:27017';
const MONGO_HOST2 = 'ac-kxdsipc-shard-00-01.m8mypwk.mongodb.net:27017';
const MONGO_HOST3 = 'ac-kxdsipc-shard-00-02.m8mypwk.mongodb.net:27017';
const MONGO_URI = process.env.MONGODB_URI ||
  `mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST1},${MONGO_HOST2},${MONGO_HOST3}/toy_store?ssl=true&replicaSet=atlas-u6vim9-shard-0&authSource=admin&retryWrites=true&w=majority`;

// ── Cloudinary config ──
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── Multer + Cloudinary storage for images ──
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'pigglitz_products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    transformation: [{ width: 800, height: 800, crop: 'limit', quality: 'auto' }],
  },
});
const upload = multer({ storage });

// ── Multer + Cloudinary storage for reels (images + videos) ──
const reelStorage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    if (file.mimetype.startsWith('video/')) {
      return {
        folder: 'pigglitz_reels',
        resource_type: 'video',
        allowed_formats: ['mp4', 'mov', 'webm'],
      };
    }
    return {
      folder: 'pigglitz_reels',
      resource_type: 'image',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [{ width: 600, height: 900, crop: 'fill', quality: 'auto' }],
    };
  },
});
const uploadReel = multer({ storage: reelStorage });

// ── Multer + Cloudinary storage for hero slides ──
const slideStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'pigglitz_slides',
    resource_type: 'image',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1200, height: 1200, crop: 'limit', quality: 'auto' }],
  },
});
const uploadSlide = multer({ storage: slideStorage });

// Models
const ReviewSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  rating:   { type: Number, required: true, min: 1, max: 5 },
  comment:  { type: String, required: true },
  createdAt:{ type: Date, default: Date.now }
});

const ProductSchema = new mongoose.Schema({
  name:          { type: String, required: true },
  price:         { type: String, required: true },
  imageColor:    { type: String, default: '#FFC400' },
  imageUrl:      { type: String, default: '' },
  galleryUrls:   { type: [String], default: [] },
  badge:         { type: String, default: '' },
  emoji:         { type: String, default: '' },
  category:      { type: String, default: 'Toys' },
  isFeatured:    { type: Boolean, default: false },
  isNewArrival:  { type: Boolean, default: false },
  description:   { type: String, default: '' },
  features:      { type: String, default: '' },
  additionalInfo:{ type: String, default: '' },
  models:        { type: String, default: '' },
  reviews:       { type: [ReviewSchema], default: [] },
  createdAt:     { type: Date, default: Date.now },
  seoKeywords:   { type: String, default: '' }
});
const Product = mongoose.model('Product', ProductSchema);

const VideoReelSchema = new mongoose.Schema({
  title:        { type: String, required: true },
  youtubeUrl:   { type: String, default: '' },   // YouTube or Instagram URL (for link)
  thumbnailUrl: { type: String, default: '' },   // Custom thumbnail from Cloudinary
  videoUrl:     { type: String, default: '' },   // Direct video file from Cloudinary (MP4)
  likes:        { type: Number, default: 0 },
  createdAt:    { type: Date, default: Date.now }
});
const VideoReel = mongoose.model('VideoReel', VideoReelSchema);

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, default: 'Pigglitz User' },
  phone: { type: String, default: '' },
  role: { type: String, default: 'admin' }
});
const User = mongoose.model('User', UserSchema);

const CouponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  discountAmount: { type: Number, required: true },
  discountType: { type: String, enum: ['fixed', 'percentage'], default: 'fixed' },
  expiryDate: { type: Date, default: null },
  maxUsers: { type: Number, default: null },
  currentUses: { type: Number, default: 0 },
  isPublic: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
const Coupon = mongoose.model('Coupon', CouponSchema);

const SiteSettingsSchema = new mongoose.Schema({
  showcaseVideoUrl: { type: String, default: "https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&modestbranding=1" },
  announcementText1: { type: String, default: "🔥 FREE SHIPPING ABOVE ₹1000" },
  announcementText2: { type: String, default: "🎉 USE CODE WIGGLE10 FOR 10% OFF." }
});
const SiteSettings = mongoose.model('SiteSettings', SiteSettingsSchema);

const HeroSlideSchema = new mongoose.Schema({
  titleLine1: { type: String, default: 'Little Prints.' },
  titleLine2: { type: String, default: 'Big Smiles.' },
  description: { type: String, default: 'Welcome to Pigglitz, your 3D Printing Pitara! Discover magical, colorful, and fun 3D printed toys made just for you!' },
  buttonText: { type: String, default: 'Shop Now' },
  buttonLink: { type: String, default: '/toys' },
  imageUrl: { type: String, default: '' },
  backgroundColor: { type: String, default: '#FFC400' },
  emoji: { type: String, default: '🧸' },
  createdAt: { type: Date, default: Date.now }
});
const HeroSlide = mongoose.model('HeroSlide', HeroSlideSchema);

const OrderSchema = new mongoose.Schema({
  customerInfo: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true }
  },
  items: [{
    _id: String,
    name: String,
    price: String,
    quantity: Number,
    imageUrl: String,
    isBundle: { type: Boolean, default: false },
    bundleDetails: {
      type: { type: String },
      packSize: { type: Number },
      size: { type: String },
      items: [{
        name: String,
        qty: Number,
        imageUrl: String
      }]
    }
  }],
  totalAmount: { type: Number, required: true },
  status: { type: String, default: 'Pending', enum: ['Pending', 'Shipped', 'Delivered'] },
  paymentMethod: { type: String, default: 'COD' },
  paymentStatus: { type: String, default: 'Pending' },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  createdAt: { type: Date, default: Date.now }
});
const Order = mongoose.model('Order', OrderSchema);

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB connected to Atlas');
    await seedAdminUser();
  })
  .catch(err => { console.error('❌ MongoDB connection error:', err); process.exit(1); });

// Auth Middleware — reads Bearer token from Authorization header
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'] || '';
  const token = authHeader.replace('Bearer ', '').trim();
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// ── Razorpay Setup ──
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder_key_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'placeholder_key_secret',
});

// 1. Login Route
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Always check DB first (admin is seeded into DB)
    const user = await User.findOne({ email });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
      const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET);
      return res.json({ token, user: { email: user.email, role: user.role, name: user.name, phone: user.phone } });
    }

    // Fallback: hardcoded admin (in case DB seed hasn't run yet)
    if (email === 'connect2rachit882@gmail.com' && password === 'Rachit@12') {
      const token = jwt.sign({ email, role: 'admin' }, JWT_SECRET);
      return res.json({ token, user: { email, role: 'admin', name: 'Admin', phone: '' } });
    }

    return res.status(400).json({ message: 'Invalid credentials' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 1b. Register Route
app.post('/api/auth/register', async (req, res) => {
  const { name, phone, email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      phone,
      email,
      password: hashed,
      role: 'user'
    });
    
    await newUser.save();
    
    // Automatically log them in
    const token = jwt.sign({ id: newUser._id, role: newUser.role }, JWT_SECRET);
    return res.json({ token, user: { email: newUser.email, role: newUser.role, name: newUser.name, phone: newUser.phone } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 1c. Get All Users (Admin Only)
app.get('/api/users', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
  try {
    const users = await User.find().select('-password').sort({ _id: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 1d. Seed admin user into DB (call once at startup automatically)
const seedAdminUser = async () => {
  try {
    const existing = await User.findOne({ email: 'connect2rachit882@gmail.com' });
    if (!existing) {
      // First time — create the admin user
      const hashed = await bcrypt.hash('Rachit@12', 10);
      await User.create({
        email: 'connect2rachit882@gmail.com',
        password: hashed,
        role: 'admin',
        name: 'Admin',
        phone: ''
      });
      console.log('✅ Admin user seeded into database');
    } else {
      // Always update password to latest value so it stays in sync
      const hashed = await bcrypt.hash('Rachit@12', 10);
      await User.updateOne(
        { email: 'connect2rachit882@gmail.com' },
        { $set: { password: hashed, role: 'admin', name: 'Admin' } }
      );
      console.log('✅ Admin user password synced in database');
    }
  } catch (err) {
    console.error('❌ Failed to seed admin user:', err);
  }
};

// 2. Get Products Route
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});



// 3. Add Product Route (Admin Only) — accepts multipart/form-data
app.post('/api/products', authMiddleware, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'gallery', maxCount: 4 }]), async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
  try {
    const { name, price, imageColor, badge, emoji, category, isFeatured, isNewArrival, description, features, additionalInfo, models, seoKeywords } = req.body;
    const imageUrl = req.files && req.files['image'] ? req.files['image'][0].path : '';
    const galleryUrls = req.files && req.files['gallery'] ? req.files['gallery'].map(f => f.path) : [];

    const newProduct = new Product({
      name, price,
      imageColor: imageColor || '#FFC400',
      imageUrl,
      galleryUrls,
      badge:        badge        || '',
      emoji:        emoji        || '',
      category:     category     || 'Toys',
      isFeatured:   isFeatured   === 'true' || isFeatured   === true,
      isNewArrival: isNewArrival === 'true' || isNewArrival === true,
      description:  description  || '',
      features:     features     || '',
      additionalInfo: additionalInfo || '',
      models:       models       || '',
      seoKeywords:  seoKeywords  || ''
    });
    const saved = await newProduct.save();

    // Ping Google to update sitemap
    try {
      require('https').get('https://www.google.com/ping?sitemap=https://pigglitz.com/sitemap.xml', (response) => {
        console.log(`Pinged Google Sitemap. Status Code: ${response.statusCode}`);
      }).on('error', (e) => {
        console.error(`Got error when pinging Google: ${e.message}`);
      });
    } catch (pingErr) {
      console.error('Failed to trigger sitemap ping:', pingErr);
    }

    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 4. Delete Product Route (Admin Only)
app.delete('/api/products/:id', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 5. Update Product flags (Admin Only) — toggle isFeatured / isNewArrival
app.patch('/api/products/:id', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 5b. Full product edit (Admin Only) — multipart
app.put('/api/products/:id', authMiddleware, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'gallery', maxCount: 4 }]), async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
  try {
    const { name, price, imageColor, badge, emoji, category, isFeatured, isNewArrival, description, features, additionalInfo, models, seoKeywords } = req.body;
    const updates = {
      name, price,
      imageColor: imageColor || '#FFC400',
      badge:        badge        || '',
      emoji:        emoji        || '',
      category:     category     || 'Toys',
      isFeatured:   isFeatured   === 'true' || isFeatured   === true,
      isNewArrival: isNewArrival === 'true' || isNewArrival === true,
      description:  description  || '',
      features:     features     || '',
      additionalInfo: additionalInfo || '',
      models:       models       || '',
      seoKeywords:  seoKeywords  || ''
    };
    if (req.files && req.files['image']) updates.imageUrl = req.files['image'][0].path;
    if (req.files && req.files['gallery']) updates.galleryUrls = req.files['gallery'].map(f => f.path);
    
    const updated = await Product.findByIdAndUpdate(req.params.id, { $set: updates }, { new: true });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 6. Get Featured Products (public)
app.get('/api/products/featured', async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 7. Get New Arrivals (public)
app.get('/api/products/new-arrivals', async (req, res) => {
  try {
    const products = await Product.find({ isNewArrival: true }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 7b. Get Single Product Route (Must be after specific routes like /featured and /new-arrivals)
app.get('/api/products/:id', async (req, res) => {
  try {
    const param = req.params.id;
    let product;
    
    // First try by ID
    if (mongoose.Types.ObjectId.isValid(param)) {
      product = await Product.findById(param);
    }
    
    // If not found by ID, try by name (slug)
    if (!product) {
      const regexStr = '^' + param.replace(/-/g, '.*') + '$';
      const nameRegex = new RegExp(regexStr, 'i');
      product = await Product.findOne({ name: nameRegex });
    }
    
    if (!product) return res.status(404).json({ message: 'Not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 7c. Add Review Route (Public)
app.post('/api/products/:id/reviews', async (req, res) => {
  try {
    const { name, rating, comment } = req.body;
    if (!name || !rating || !comment) {
      return res.status(400).json({ message: 'Please provide name, rating, and comment.' });
    }
    
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    
    const review = {
      name,
      rating: Number(rating),
      comment
    };
    
    product.reviews.push(review);
    await product.save();
    
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Seed Initial Data Endpoint (For easy local testing)
app.post('/api/seed', async (req, res) => {
  try {
    await Product.deleteMany({});
    const sampleProducts = [
      { name: 'Magic Unicorn', price: '₹499', imageColor: '#FFE5EC', badge: 'Best Seller' },
      { name: 'Space Rocket', price: '₹799', imageColor: '#E5F0FF', badge: 'New!' },
      { name: 'Dino Friend', price: '₹599', imageColor: '#E5FFE5' },
      { name: 'Little Robot', price: '₹699', imageColor: '#FFF5E5' }
    ];
    await Product.insertMany(sampleProducts);
    res.json({ message: 'Database seeded' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 8. Get Video Reels
app.get('/api/reels', async (req, res) => {
  try {
    const reels = await VideoReel.find().sort({ createdAt: -1 });
    res.json(reels);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 9. Add Video Reel (Admin Only)
app.post('/api/reels', authMiddleware, uploadReel.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]), async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
  try {
    const { title, youtubeUrl, likes } = req.body;
    const files = req.files || {};
    const thumbnailUrl = files.thumbnail ? files.thumbnail[0].path : '';
    const videoUrl     = files.video     ? files.video[0].path     : '';
    const reel = new VideoReel({
      title,
      youtubeUrl: youtubeUrl || '',
      thumbnailUrl,
      videoUrl,
      likes: parseInt(likes) || 0
    });
    const saved = await reel.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Add reel error:', err);
    res.status(500).json({ message: 'Server error', detail: err.message });
  }
});

// 10. Delete Video Reel (Admin Only)
app.delete('/api/reels/:id', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
  try {
    await VideoReel.findByIdAndDelete(req.params.id);
    res.json({ message: 'Reel removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 11. Edit Video Reel (Admin Only)
app.put('/api/reels/:id', authMiddleware, uploadReel.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]), async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
  try {
    const { title, youtubeUrl, likes } = req.body;
    const files = req.files || {};
    const updates = {
      title,
      youtubeUrl: youtubeUrl || '',
      likes: parseInt(likes) || 0
    };
    if (files.thumbnail) updates.thumbnailUrl = files.thumbnail[0].path;
    if (files.video)     updates.videoUrl     = files.video[0].path;
    const updated = await VideoReel.findByIdAndUpdate(
      req.params.id, { $set: updates }, { new: true }
    );
    res.json(updated);
  } catch (err) {
    console.error('Edit reel error:', err);
    res.status(500).json({ message: 'Server error', detail: err.message });
  }
});

// 12. Create Order (Public)
app.post('/api/orders', async (req, res) => {
  try {
    const { customerInfo, items, totalAmount, paymentMethod, paymentStatus, razorpayOrderId, razorpayPaymentId } = req.body;
    if (!customerInfo || !items || items.length === 0) {
      return res.status(400).json({ message: 'Invalid order data' });
    }
    const order = new Order({ 
      customerInfo, 
      items, 
      totalAmount,
      paymentMethod: paymentMethod || 'COD',
      paymentStatus: paymentStatus || 'Pending',
      razorpayOrderId,
      razorpayPaymentId
    });
    const saved = await order.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Create order error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 12b. Create Razorpay Order
app.post('/api/payment/create-order', async (req, res) => {
  try {
    const { amount } = req.body;
    const options = {
      amount: Math.round(amount * 100), // amount in smallest currency unit (paise)
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    };
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    console.error('Razorpay Create Order error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 12c. Verify Razorpay Payment
app.post('/api/payment/verify', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || 'placeholder_key_secret')
                                .update(sign.toString())
                                .digest("hex");

    if (razorpay_signature === expectedSign) {
      res.json({ success: true, message: "Payment verified successfully" });
    } else {
      res.status(400).json({ success: false, message: "Invalid signature sent!" });
    }
  } catch (err) {
    console.error('Razorpay Verify error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 13. Get User Orders (Protected)
// ── Coupons Routes ──
app.get('/api/coupons', async (req, res) => {
  try {
    // Check if admin is requesting
    const authHeader = req.headers['authorization'] || req.headers['Authorization'] || '';
    const token = authHeader.replace('Bearer ', '').trim();
    let isAdmin = false;
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.role === 'admin') isAdmin = true;
      } catch (e) {}
    }

    if (isAdmin) {
      const coupons = await Coupon.find().sort({ createdAt: -1 });
      return res.json(coupons);
    } else {
      // Public view: only show public coupons that are valid
      const now = new Date();
      const coupons = await Coupon.find({
        isPublic: true,
        $or: [{ expiryDate: null }, { expiryDate: { $gt: now } }]
      }).sort({ createdAt: -1 });
      
      // Filter out those that reached max users
      const validCoupons = coupons.filter(c => c.maxUsers === null || c.currentUses < c.maxUsers);
      return res.json(validCoupons);
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 12c. Create Coupon (Admin Only)
app.post('/api/coupons', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
  try {
    const { code, discountAmount, discountType, expiryDate, maxUsers, isPublic } = req.body;
    if (!code || !discountAmount) return res.status(400).json({ message: 'Code and amount are required' });
    
    const existing = await Coupon.findOne({ code: code.toUpperCase() });
    if (existing) return res.status(400).json({ message: 'Coupon code already exists' });

    const newCoupon = new Coupon({
      code: code.toUpperCase(),
      discountAmount,
      discountType: discountType || 'fixed',
      expiryDate: expiryDate ? new Date(expiryDate) : null,
      maxUsers: maxUsers ? parseInt(maxUsers) : null,
      isPublic: isPublic === true || isPublic === 'true'
    });
    
    const saved = await newCoupon.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Create coupon error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 12d. Delete Coupon (Admin Only)
app.delete('/api/coupons/:id', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ message: 'Coupon removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 12e. Validate and Apply Coupon (Public)
app.post('/api/coupons/validate', async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ message: 'Code is required' });
    
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (!coupon) return res.status(404).json({ message: 'Invalid coupon code' });
    
    // Check expiry
    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      return res.status(400).json({ message: 'Coupon has expired' });
    }
    
    // Check usage limits
    if (coupon.maxUsers !== null && coupon.currentUses >= coupon.maxUsers) {
      return res.status(400).json({ message: 'Coupon usage limit reached' });
    }
    
    res.json({ 
      valid: true, 
      code: coupon.code,
      discountAmount: coupon.discountAmount,
      discountType: coupon.discountType 
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 13. Get All Orders (Admin Only)
app.get('/api/orders', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 13b. Get User Orders
app.get('/api/my-orders', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Fetch orders matching the user's email
    const orders = await Order.find({ 'customerInfo.email': user.email }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 14. Update Order Status (Admin Only)
app.patch('/api/orders/:id/status', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Shipped', 'Delivered'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ── Site Settings Routes ──
// 15. Get Showcase Video (Public)
app.get('/api/settings/showcase-video', async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create({});
    }
    res.json({ showcaseVideoUrl: settings.showcaseVideoUrl });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 16. Update Showcase Video (Admin Only)
app.put('/api/settings/showcase-video', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
  try {
    const { showcaseVideoUrl } = req.body;
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create({ showcaseVideoUrl });
    } else {
      settings.showcaseVideoUrl = showcaseVideoUrl;
      await settings.save();
    }
    res.json({ showcaseVideoUrl: settings.showcaseVideoUrl });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 17. Get Announcements (Public)
app.get('/api/settings/announcements', async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create({});
    }
    res.json({ 
      announcementText1: settings.announcementText1,
      announcementText2: settings.announcementText2 
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 18. Update Announcements (Admin Only)
app.put('/api/settings/announcements', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
  try {
    const { announcementText1, announcementText2 } = req.body;
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create({ announcementText1, announcementText2 });
    } else {
      settings.announcementText1 = announcementText1;
      settings.announcementText2 = announcementText2;
      await settings.save();
    }
    res.json({ 
      announcementText1: settings.announcementText1,
      announcementText2: settings.announcementText2 
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ── Hero Slides Routes ──
// 19. Get All Hero Slides (Public)
app.get('/api/hero-slides', async (req, res) => {
  try {
    const slides = await HeroSlide.find().sort({ createdAt: -1 });
    res.json(slides);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 20. Add Hero Slide (Admin Only)
app.post('/api/hero-slides', authMiddleware, uploadSlide.single('image'), async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
  try {
    const { titleLine1, titleLine2, description, buttonText, buttonLink, backgroundColor, emoji } = req.body;
    const imageUrl = req.file ? req.file.path : '';
    const newSlide = new HeroSlide({
      titleLine1, titleLine2, description, buttonText, buttonLink, backgroundColor, emoji, imageUrl
    });
    const saved = await newSlide.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Add hero slide error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 21. Delete Hero Slide (Admin Only)
app.delete('/api/hero-slides/:id', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
  try {
    await HeroSlide.findByIdAndDelete(req.params.id);
    res.json({ message: 'Slide removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 22. Update Hero Slide (Admin Only)
app.put('/api/hero-slides/:id', authMiddleware, uploadSlide.single('image'), async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
  try {
    const { titleLine1, titleLine2, description, buttonText, buttonLink, backgroundColor, emoji } = req.body;
    const updates = { titleLine1, titleLine2, description, buttonText, buttonLink, backgroundColor, emoji };
    if (req.file) updates.imageUrl = req.file.path;
    const updated = await HeroSlide.findByIdAndUpdate(req.params.id, { $set: updates }, { new: true });
    res.json(updated);
  } catch (err) {
    console.error('Edit hero slide error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Health check — keeps Render from spinning down
app.get('/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));
app.get('/api', (req, res) => res.json({ message: 'Pigglitz API running 🧸' }));

// ── Sitemap Route ──
app.get('/sitemap.xml', async (req, res) => {
  try {
    const products = await Product.find({}, '_id updatedAt createdAt');
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://pigglitz.com/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://pigglitz.com/shop</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://pigglitz.com/about</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://pigglitz.com/bundle</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;

    products.forEach(product => {
      xml += `
  <url>
    <loc>https://pigglitz.com/product/${product._id}</loc>
    <lastmod>${(product.updatedAt || product.createdAt || new Date()).toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
    });

    xml += `\n</urlset>`;
    
    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (err) {
    res.status(500).send('Error generating sitemap');
  }
});

// Anything that doesn't match the above API routes, send back the index.html file
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
