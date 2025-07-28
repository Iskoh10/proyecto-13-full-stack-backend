const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'shopBakery',
    allowedFormats: ['jpeg', 'jpg', 'png', 'webp']
  }
});

const upload = multer({ storage });

module.exports = upload;
