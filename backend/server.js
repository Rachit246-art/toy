require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

const app = express();

// ── CORS — allow Vercel frontend + localhost dev ──
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL, // set this in Render env vars e.g. https://your-app.vercel.app
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    // Also allow any vercel.app subdomain
    if (/\.vercel\.app$/.test(origin)) return callback(null, true);
    callback(new Error(`CORS blocked: ${origin}`));
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

// ── Multer + Cloudinary storage ──
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'pigglitz_products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    transformation: [{ width: 800, height: 800, crop: 'limit', quality: 'auto' }],
  },
});
const upload = multer({ storage });

// Models
const ProductSchema = new mongoose.Schema({
  name:          { type: String, required: true },
  price:         { type: String, required: true },
  imageColor:    { type: String, default: '#FFC400' },
  imageUrl:      { type: String, default: '' },
  badge:         { type: String, default: '' },
  emoji:         { type: String, default: '' },
  isFeatured:    { type: Boolean, default: false },
  isNewArrival:  { type: Boolean, default: false },
  createdAt:     { type: Date, default: Date.now }
});
const Product = mongoose.model('Product', ProductSchema);

const VideoReelSchema = new mongoose.Schema({
  title: { type: String, required: true },
  youtubeUrl: { type: String, required: true },
  likes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});
const VideoReel = mongoose.model('VideoReel', VideoReelSchema);

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin' }
});
const User = mongoose.model('User', UserSchema);

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB connected to Atlas');
    await seedAdminUser();
  })
  .catch(err => { console.error('❌ MongoDB connection error:', err); process.exit(1); });

// Auth Middleware
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// 1. Login Route
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Always check DB first (admin is seeded into DB)
    const user = await User.findOne({ email });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
      const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '30d' });
      return res.json({ token, user: { email: user.email, role: user.role } });
    }

    // Fallback: hardcoded admin (in case DB seed hasn't run yet)
    if (email === 'connect2rachit882@gmail.com' && password === 'Rachit@12') {
      const token = jwt.sign({ email, role: 'admin' }, JWT_SECRET, { expiresIn: '30d' });
      return res.json({ token, user: { email, role: 'admin' } });
    }

    return res.status(400).json({ message: 'Invalid credentials' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 1b. Seed admin user into DB (call once at startup automatically)
const seedAdminUser = async () => {
  try {
    const existing = await User.findOne({ email: 'connect2rachit882@gmail.com' });
    if (!existing) {
      // First time — create the admin user
      const hashed = await bcrypt.hash('Rachit@12', 10);
      await User.create({
        email: 'connect2rachit882@gmail.com',
        password: hashed,
        role: 'admin'
      });
      console.log('✅ Admin user seeded into database');
    } else {
      // Always update password to latest value so it stays in sync
      const hashed = await bcrypt.hash('Rachit@12', 10);
      await User.updateOne(
        { email: 'connect2rachit882@gmail.com' },
        { $set: { password: hashed, role: 'admin' } }
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

// 3. Add Product Route (Admin Only) — accepts multipart/form-data with optional image
app.post('/api/products', authMiddleware, upload.single('image'), async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
  try {
    const { name, price, imageColor, badge, emoji, isFeatured, isNewArrival } = req.body;
    const imageUrl = req.file ? req.file.path : '';
    const newProduct = new Product({
      name, price,
      imageColor: imageColor || '#FFC400',
      imageUrl,
      badge:        badge        || '',
      emoji:        emoji        || '',
      isFeatured:   isFeatured   === 'true' || isFeatured   === true,
      isNewArrival: isNewArrival === 'true' || isNewArrival === true,
    });
    const saved = await newProduct.save();
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

// 5b. Full product edit (Admin Only) — multipart with optional new image
app.put('/api/products/:id', authMiddleware, upload.single('image'), async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
  try {
    const { name, price, imageColor, badge, emoji, isFeatured, isNewArrival } = req.body;
    const updates = {
      name, price,
      imageColor: imageColor || '#FFC400',
      badge:        badge        || '',
      emoji:        emoji        || '',
      isFeatured:   isFeatured   === 'true' || isFeatured   === true,
      isNewArrival: isNewArrival === 'true' || isNewArrival === true,
    };
    if (req.file) updates.imageUrl = req.file.path;
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
app.post('/api/reels', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
  try {
    const reel = new VideoReel(req.body);
    const saved = await reel.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
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
app.put('/api/reels/:id', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
  try {
    const updated = await VideoReel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Health check — keeps Render from spinning down
app.get('/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));
app.get('/', (req, res) => res.json({ message: 'Pigglitz API running 🧸' }));
