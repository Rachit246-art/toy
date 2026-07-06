require('dotenv').config();
const mongoose = require('mongoose');

// We have to define the models manually since server.js doesn't export them
const AddressSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  addressLine1: { type: String, default: '' },
  addressLine2: { type: String, default: '' },
  city: { type: String, default: '' },
  state: { type: String, default: '' },
  pincode: { type: String, default: '' },
  country: { type: String, default: 'India' },
  phone: { type: String, default: '' },
  email: { type: String, default: '' }
}, { _id: false });

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  billingAddress: { type: AddressSchema, default: () => ({}) },
  shippingAddress: { type: AddressSchema, default: () => ({}) },
  createdAt: { type: Date, default: Date.now }
});

const OrderSchema = new mongoose.Schema({
  customerInfo: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true }
  },
  createdAt: { type: Date, default: Date.now }
}, { strict: false }); // skip other fields

const User = mongoose.model('User', UserSchema);
const Order = mongoose.model('Order', OrderSchema);

async function run() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://shivamssachann:WdF5B4PjOaWkZ27b@cluster0.p7eq4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
  console.log('Connected to DB');

  const users = await User.find();
  for (let user of users) {
    if (!user.shippingAddress || !user.shippingAddress.addressLine1 || !user.billingAddress || !user.billingAddress.addressLine1) {
      // Find latest order
      const order = await Order.findOne({ 'customerInfo.email': user.email }).sort({ createdAt: -1 });
      if (order) {
        const addressObj = {
          name: order.customerInfo.name,
          email: order.customerInfo.email,
          phone: order.customerInfo.phone,
          addressLine1: order.customerInfo.address,
          city: order.customerInfo.city,
          pincode: order.customerInfo.pincode,
          country: 'India'
        };
        
        if (!user.shippingAddress || !user.shippingAddress.addressLine1) {
          user.shippingAddress = addressObj;
        }
        if (!user.billingAddress || !user.billingAddress.addressLine1) {
          user.billingAddress = addressObj;
        }
        await user.save();
        console.log(`Updated user ${user.email} from their order.`);
      }
    }
  }
  console.log('Done');
  process.exit(0);
}

run();
