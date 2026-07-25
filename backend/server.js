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
  email:    { type: String, required: true },
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
}, { timestamps: true });
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

const AddressSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  addressLine1: { type: String, default: '' },
  addressLine2: { type: String, default: '' },
  city: { type: String, default: '' },
  state: { type: String, default: '' },
  pincode: { type: String, default: '' },
  country: { type: String, default: 'India' },
  phone: { type: String, default: '' },
  email: { type: String, default: '' },
  alternatePhone: { type: String, default: '' },
  landmark: { type: String, default: '' }
}, { _id: false });

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, default: 'Pigglitz User' },
  phone: { type: String, default: '' },
  role: { type: String, default: 'admin' },
  billingAddress: { type: AddressSchema, default: () => ({}) },
  shippingAddress: { type: AddressSchema, default: () => ({}) }
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
  announcementText2: { type: String, default: "🎉 USE CODE WIGGLE10 FOR 10% OFF." },
  partnerBannerLeftImage: { type: String, default: "" },
  partnerBannerLeftLink: { type: String, default: "" },
  partnerBannerRightImage: { type: String, default: "" },
  partnerBannerRightLink: { type: String, default: "" },
  amazonStoreLink: { type: String, default: "https://www.amazon.in/l/27943762031?me=AX3F3SGHVD4DN&ref_=ssf_share" },
  flipkartStoreLink: { type: String, default: "https://www.flipkart.com" },
  indiamartStoreLink: { type: String, default: "https://www.indiamart.com/pinakatechnologiessg/" }
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
  orderId: { type: String, unique: true },
  customerInfo: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    alternatePhone: { type: String, default: '' },
    address: { type: String, required: true },
    locality: { type: String, required: true },
    landmark: { type: String, default: '' },
    city: { type: String, required: true },
    state: { type: String, required: true },
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
  status: { type: String, default: 'Order Placed', enum: ['Pending', 'Shipped', 'Delivered', 'Order Placed', 'In Transit', 'Out for Delivery'] },
  paymentMethod: { type: String, default: 'COD' },
  paymentStatus: { type: String, default: 'Pending' },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  deliveryImageUrl: { type: String, default: '' },
  trackingLink: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});
const Order = mongoose.model('Order', OrderSchema);

const ChatbotLeadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  requirement: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});
const ChatbotLead = mongoose.model('ChatbotLead', ChatbotLeadSchema);

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  content: { type: String, required: true },
  imageUrl: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});
const Blog = mongoose.model('Blog', BlogSchema);

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

// 1c.1 Get Current User Profile
app.get('/api/users/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Auto-backfill if addresses are empty
    let updated = false;
    if (!user.shippingAddress || !user.shippingAddress.addressLine1 || !user.billingAddress || !user.billingAddress.addressLine1) {
      const order = await Order.findOne({ 'customerInfo.email': user.email }).sort({ createdAt: -1 });
      if (order && order.customerInfo) {
        const addr = {
          name: order.customerInfo.name,
          email: order.customerInfo.email,
          phone: order.customerInfo.phone,
          addressLine1: order.customerInfo.address,
          city: order.customerInfo.city,
          pincode: order.customerInfo.pincode,
          country: 'India'
        };
        if (!user.shippingAddress || !user.shippingAddress.addressLine1) {
          user.shippingAddress = addr;
          updated = true;
        }
        if (!user.billingAddress || !user.billingAddress.addressLine1) {
          user.billingAddress = addr;
          updated = true;
        }
        if (updated) {
          const userToSave = await User.findById(req.user.id);
          userToSave.shippingAddress = addr;
          userToSave.billingAddress = addr;
          await userToSave.save();
          // Update the user object we are returning
          user.shippingAddress = addr;
          user.billingAddress = addr;
        }
      }
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 1c.2 Update Current User Profile
app.put('/api/users/profile', authMiddleware, async (req, res) => {
  try {
    const { name, phone, billingAddress, shippingAddress } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    
    if (billingAddress !== undefined) {
      user.billingAddress = { ...user.billingAddress.toObject(), ...billingAddress };
    }
    if (shippingAddress !== undefined) {
      user.shippingAddress = { ...user.shippingAddress.toObject(), ...shippingAddress };
    }

    await user.save();
    
    // Return updated user data (without password)
    const updatedUser = await User.findById(req.user.id).select('-password');
    res.json({ message: 'Profile updated', user: updatedUser });
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

// 1e. Chatbot Leads Routes
app.post('/api/chatbot-leads', async (req, res) => {
  try {
    const { name, email, phone, requirement } = req.body;
    if (!name || !email || !phone) return res.status(400).json({ message: 'Missing fields' });
    const newLead = new ChatbotLead({ name, email, phone, requirement });
    await newLead.save();
    res.status(201).json(newLead);
  } catch (err) {
    res.status(500).json({ message: 'Server error saving lead' });
  }
});

app.get('/api/chatbot-leads', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
  try {
    const leads = await ChatbotLead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching leads' });
  }
});

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
      // Allow optional non-alphanumeric characters at the start and end,
      // as the frontend strips them when creating the slug.
      const regexStr = '^[^a-zA-Z0-9]*' + param.replace(/-/g, '.*') + '[^a-zA-Z0-9]*$';
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
    const { name, email, rating, comment } = req.body;
    if (!name || !email || !rating || !comment) {
      return res.status(400).json({ message: 'Please provide name, email, rating, and comment.' });
    }
    
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    
    // Check if user already reviewed
    const alreadyReviewed = product.reviews.find(
      (r) => r.email.toLowerCase() === email.toLowerCase()
    );
    if (alreadyReviewed) {
      return res.status(400).json({ message: 'You have already reviewed this product.' });
    }

    // Check if user purchased the product
    const order = await Order.findOne({
      'customerInfo.email': { $regex: new RegExp(`^${email}$`, 'i') },
      'items._id': req.params.id,
      status: { $ne: 'Pending' } // Optionally ensure it's not just an abandoned checkout
    });

    if (!order) {
      return res.status(400).json({ message: 'You can only review products you have purchased.' });
    }
    
    const review = {
      name,
      email,
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

// 7d. Chatbot Leads Routes
app.post('/api/chatbot-leads', async (req, res) => {
  try {
    const { name, email, phone, requirement } = req.body;
    if (!name || !email || !phone) return res.status(400).json({ message: 'Missing fields' });
    const lead = new ChatbotLead({ name, email, phone, requirement });
    await lead.save();
    res.status(201).json(lead);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/chatbot-leads', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
  try {
    const leads = await ChatbotLead.find().sort({ createdAt: -1 });
    res.json(leads);
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

// 12. Blog Routes

// Get all blogs (Public)
app.get('/api/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single blog (Public)
app.get('/api/blogs/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create Blog (Admin Only)
app.post('/api/blogs', authMiddleware, upload.single('image'), async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
  try {
    const { title, subtitle, content } = req.body;
    const imageUrl = req.file ? req.file.path : '';
    
    const newBlog = new Blog({
      title,
      subtitle: subtitle || '',
      content,
      imageUrl
    });
    const saved = await newBlog.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Create blog error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update Blog (Admin Only)
app.put('/api/blogs/:id', authMiddleware, upload.single('image'), async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
  try {
    const { title, subtitle, content } = req.body;
    const updates = { title, subtitle: subtitle || '', content };
    if (req.file) updates.imageUrl = req.file.path;
    
    const updated = await Blog.findByIdAndUpdate(
      req.params.id, { $set: updates }, { new: true }
    );
    res.json(updated);
  } catch (err) {
    console.error('Update blog error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete Blog (Admin Only)
app.delete('/api/blogs/:id', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: 'Blog removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 13. General Image Upload (Admin Only)
app.post('/api/upload', authMiddleware, upload.single('image'), async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
  try {
    if (!req.file) return res.status(400).json({ message: 'No image provided' });
    res.json({ imageUrl: req.file.path });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});



// 12. Create Order (Public)
app.post('/api/orders', async (req, res) => {
  try {
    const { customerInfo, items, totalAmount, paymentMethod, paymentStatus, razorpayOrderId, razorpayPaymentId } = req.body;
    if (!customerInfo || !items || items.length === 0) {
      return res.status(400).json({ message: 'Invalid order data' });
    }

    let isUnique = false;
    let orderId = '';
    while (!isUnique) {
      orderId = Math.floor(1000000 + Math.random() * 9000000).toString();
      const existing = await Order.findOne({ orderId });
      if (!existing) isUnique = true;
    }

    const order = new Order({ 
      orderId,
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
    const validStatuses = ['Pending', 'Shipped', 'Delivered', 'Order Placed', 'In Transit', 'Out for Delivery'];
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

// 14b. Upload Delivery Image (Admin Only)
app.patch('/api/orders/:id/delivery-image', authMiddleware, upload.single('image'), async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }
    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: { deliveryImageUrl: req.file.path } },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    console.error('Upload delivery image error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 14c. Update Tracking Link (Admin Only)
app.patch('/api/orders/:id/tracking-link', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
  try {
    const { trackingLink } = req.body;
    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: { trackingLink } },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    console.error('Update tracking link error:', err);
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

// 18b. Get Partner Banners (Public)
app.get('/api/settings/partner-banners', async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) settings = await SiteSettings.create({});
    res.json({
      leftImage: settings.partnerBannerLeftImage,
      leftLink: settings.partnerBannerLeftLink,
      rightImage: settings.partnerBannerRightImage,
      rightLink: settings.partnerBannerRightLink
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 18b-1. Get Online Store Links (Public)
app.get('/api/settings/online-stores', async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) settings = await SiteSettings.create({});
    res.json({
      amazonStoreLink: settings.amazonStoreLink,
      flipkartStoreLink: settings.flipkartStoreLink,
      indiamartStoreLink: settings.indiamartStoreLink
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 18b-2. Update Online Store Links (Admin Only)
app.put('/api/settings/online-stores', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
  try {
    const { amazonStoreLink, flipkartStoreLink, indiamartStoreLink } = req.body;
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create({ amazonStoreLink, flipkartStoreLink, indiamartStoreLink });
    } else {
      if (amazonStoreLink !== undefined) settings.amazonStoreLink = amazonStoreLink;
      if (flipkartStoreLink !== undefined) settings.flipkartStoreLink = flipkartStoreLink;
      if (indiamartStoreLink !== undefined) settings.indiamartStoreLink = indiamartStoreLink;
      await settings.save();
    }
    res.json({
      amazonStoreLink: settings.amazonStoreLink,
      flipkartStoreLink: settings.flipkartStoreLink,
      indiamartStoreLink: settings.indiamartStoreLink
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 18c. Update Partner Banners (Admin Only)
app.put('/api/settings/partner-banners', authMiddleware, uploadSlide.fields([{ name: 'leftImage', maxCount: 1 }, { name: 'rightImage', maxCount: 1 }]), async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
  try {
    const { leftLink, rightLink } = req.body;
    let settings = await SiteSettings.findOne();
    if (!settings) settings = await SiteSettings.create({});

    if (leftLink !== undefined) settings.partnerBannerLeftLink = leftLink;
    if (rightLink !== undefined) settings.partnerBannerRightLink = rightLink;

    if (req.files && req.files['leftImage']) {
      settings.partnerBannerLeftImage = req.files['leftImage'][0].path;
    }
    if (req.files && req.files['rightImage']) {
      settings.partnerBannerRightImage = req.files['rightImage'][0].path;
    }

    await settings.save();
    res.json({
      leftImage: settings.partnerBannerLeftImage,
      leftLink: settings.partnerBannerLeftLink,
      rightImage: settings.partnerBannerRightImage,
      rightLink: settings.partnerBannerRightLink
    });
  } catch (err) {
    console.error('Update partner banners error:', err);
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
const escapeXML = (str) => {
  if (!str) return '';
  return str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
};

const createSlug = (name) => {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
};

app.get('/sitemap.xml', async (req, res) => {
  try {
    const products = await Product.find({}, 'name updatedAt createdAt');
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
  </url>
  <url>
    <loc>https://pigglitz.com/contact</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`;

    products.forEach(product => {
      const slug = createSlug(product.name || 'product');
      xml += `
  <url>
    <loc>https://pigglitz.com/product/${escapeXML(slug)}</loc>
    <lastmod>${(product.updatedAt || product.createdAt || new Date()).toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
    });

    xml += `\n</urlset>`;
    
    res.header('Content-Type', 'application/xml');
    res.header('Cache-Control', 'public, max-age=3600');
    res.send(xml);
  } catch (err) {
    res.status(500).send('Error generating sitemap');
  }
});
// ── SEO SSR Route for Product Pages ──
const https = require('https');
const getHtml = (url) => new Promise((resolve, reject) => {
  https.get(url, (response) => {
    let data = '';
    response.on('data', chunk => data += chunk);
    response.on('end', () => resolve(data));
  }).on('error', reject);
});

app.get('/seo/product/:slug', async (req, res) => {
  try {
    const slug = req.params.slug;
    const regexStr = '^' + slug.replace(/-/g, '.*') + '$';
    const nameRegex = new RegExp(regexStr, 'i');
    
    // Find the product
    let product;
    if (mongoose.Types.ObjectId.isValid(slug)) {
      product = await Product.findById(slug);
    }
    if (!product) {
      product = await Product.findOne({ name: nameRegex });
    }

    // Try to get the frontend index.html
    let htmlTemplate = '';
    try {
      htmlTemplate = await getHtml('https://pigglitz.com/index.html');
      if (!htmlTemplate || !htmlTemplate.includes('<html')) {
        throw new Error('Invalid HTML received');
      }
    } catch (e) {
      // Fallback to local file if fetch fails (e.g., local dev)
      try {
        const fs = require('fs');
        const path = require('path');
        htmlTemplate = fs.readFileSync(path.join(__dirname, '../frontend/dist', 'index.html'), 'utf8');
      } catch(e2) {
        htmlTemplate = '<!doctype html><html lang="en"><head><title>Pigglitz</title></head><body><div id="root"></div></body></html>';
      }
    }

    if (!product) {
      // Return 404 with noindex
      const noindexHead = '<title>Product Not Found</title>\n<meta name="robots" content="noindex, nofollow" />';
      let finalHtml = htmlTemplate.replace(/<title>.*?<\/title>/i, '');
      finalHtml = finalHtml.replace('</head>', noindexHead + '\n</head>');
      return res.status(404).send(finalHtml);
    }

    const title = `${product.name} | Pigglitz 3D Toys`;
    const desc = product.description || `Buy ${product.name} from Pigglitz. High-quality 3D printed toys.`;
    const url = `https://pigglitz.com/product/${slug}`;
    const allImages = [product.imageUrl, ...(product.galleryUrls || [])].filter(Boolean);
    const mainImg = allImages.length > 0 ? allImages[0] : "https://pigglitz.com/logo.png";
    const price = product.price ? product.price.replace(/[^0-9.]/g, '') : "0";

    const jsonLd = {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": product.name,
      "image": allImages.length > 0 ? allImages : ["https://pigglitz.com/logo.png"],
      "description": desc,
      "sku": product._id.toString(),
      "brand": {
        "@type": "Brand",
        "name": "Pigglitz"
      },
      "offers": {
        "@type": "Offer",
        "url": url,
        "priceCurrency": "INR",
        "price": price,
        "availability": "https://schema.org/InStock",
        "itemCondition": "https://schema.org/NewCondition"
      }
    };

    const seoHead = `
      <title>${escapeXML(title)}</title>
      <meta name="description" content="${escapeXML(desc)}" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href="${escapeXML(url)}" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="${escapeXML(url)}" />
      <meta property="og:title" content="${escapeXML(title)}" />
      <meta property="og:description" content="${escapeXML(desc)}" />
      <meta property="og:image" content="${escapeXML(mainImg)}" />
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content="${escapeXML(url)}" />
      <meta property="twitter:title" content="${escapeXML(title)}" />
      <meta property="twitter:description" content="${escapeXML(desc)}" />
      <meta property="twitter:image" content="${escapeXML(mainImg)}" />
      <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
      <script>
        window.__INITIAL_PRODUCT_DATA__ = ${JSON.stringify(product)};
        window.__INITIAL_PRODUCT_SLUG__ = "${escapeXML(slug)}";
      </script>
    `;

    // Visible HTML to satisfy Google's content checks before JS runs
    // We use the screen-reader-only pattern instead of display:none because Google ignores display:none content.
    const visibleHtml = `
      <div style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;" id="seo-prerender">
        <h1>${escapeXML(product.name)}</h1>
        <img src="${escapeXML(mainImg)}" alt="${escapeXML(product.name)}" />
        <p>${escapeXML(desc)}</p>
        <p>Price: ${escapeXML(product.price)}</p>
        <h2>Features</h2>
        <p>${escapeXML(product.features || '')}</p>
        <h2>Additional Information</h2>
        <p>Material: Premium, eco-friendly 3D printed PLA plastic (Non-toxic and safe for kids).</p>
        <p>Care Instructions: Wipe clean with a damp cloth. Do not expose to extreme heat.</p>
        <p>Shipping & Returns: Dispatched within 2-3 business days. 7-day return policy on defective items.</p>
      </div>
    `;

    let finalHtml = htmlTemplate.replace(/<title>.*?<\/title>/i, '');
    finalHtml = finalHtml.replace('</head>', seoHead + '\n</head>');
    finalHtml = finalHtml.replace('<body>', '<body>\n' + visibleHtml);

    res.header('Content-Type', 'text/html');
    res.header('Cache-Control', 'public, max-age=300'); // Cache SEO hit for 5 mins
    res.send(finalHtml);

  } catch (err) {
    console.error("SEO render error:", err);
    res.status(500).send("SEO Error");
  }
});

// Anything that doesn't match the above API routes, send back the index.html file
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
