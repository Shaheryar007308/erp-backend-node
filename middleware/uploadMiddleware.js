const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// 1. Configure Cloudinary link using your environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Setup the Cloudinary storage rules for Multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'erp_student_photos', // The name of the folder inside your online Cloudinary dashboard
        allowed_formats: ['jpg', 'jpeg', 'png'], // Restrict file system strictly to images
        public_id: (req, file) => 'student_' + Date.now() // Dynamically renames files uniquely using current timestamp
    }
});

// 3. Initialize Multer middleware with our cloud rules
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1020 * 1024 } // Maximum file size safety limit: 5MB
});

module.exports = upload;
