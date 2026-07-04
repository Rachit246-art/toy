const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const SiteSettingsSchema = new mongoose.Schema({
  partnerBannerLeftImage: String,
  partnerBannerLeftLink: String,
  partnerBannerRightImage: String,
  partnerBannerRightLink: String,
}, { strict: false });

const SiteSettings = mongoose.model('SiteSettings', SiteSettingsSchema);

mongoose.connect(process.env.MONGO_URI || "mongodb+srv://rachitkataria001:vV37Lh4rM5Y0Hq68@pigglitz.s78is.mongodb.net/?retryWrites=true&w=majority&appName=Pigglitz")
  .then(async () => {
    console.log('Connected');
    const settings = await SiteSettings.findOne();
    console.log(settings);
    process.exit(0);
  });
