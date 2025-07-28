const fs = require('fs');
const cloudinary = require('cloudinary').v2;

const uploadFileToCloudinary = async (fileURLToPath) => {
  const uploadResult = await cloudinary.uploader.upload(fileURLToPath, {
    folder: 'workshops',
    resource_type: 'raw'
  });

  fs.unlink(fileURLToPath, (error) => {
    if (error) console.error('Error al eliminar archivo temporal:', error);
  });

  return uploadResult.secure_url;
};

module.exports = uploadFileToCloudinary;
