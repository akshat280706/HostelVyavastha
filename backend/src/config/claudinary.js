// const cloudinary = require('cloudinary').v2;

// // Configure Cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET
// });

// // Upload image to Cloudinary
// const uploadImage = async (filePath, folder = 'hostel_management') => {
//   try {
//     const result = await cloudinary.uploader.upload(filePath, {
//       folder: folder,
//       allowed_formats: ['jpg', 'png', 'jpeg', 'gif'],
//       transformation: [
//         { width: 800, height: 800, crop: 'limit' },
//         { quality: 'auto' }
//       ]
//     });
//     return {
//       success: true,
//       url: result.secure_url,
//       public_id: result.public_id,
//       width: result.width,
//       height: result.height
//     };
//   } catch (error) {
//     console.error('Cloudinary upload error:', error);
//     return { success: false, error: error.message };
//   }
// };

// // Upload multiple images
// const uploadMultipleImages = async (files, folder = 'hostel_management') => {
//   const uploadPromises = files.map(file => uploadImage(file.path, folder));
//   const results = await Promise.all(uploadPromises);
//   return results.filter(result => result.success);
// };

// // Delete image from Cloudinary
// const deleteImage = async (publicId) => {
//   try {
//     const result = await cloudinary.uploader.destroy(publicId);
//     return { success: true, result };
//   } catch (error) {
//     console.error('Cloudinary delete error:', error);
//     return { success: false, error: error.message };
//   }
// };

// // Get image URL with transformations
// const getOptimizedUrl = (publicId, options = {}) => {
//   return cloudinary.url(publicId, {
//     transformation: [
//       { width: options.width || 800, height: options.height || 800, crop: 'limit' },
//       { quality: options.quality || 'auto' },
//       { fetch_format: options.format || 'auto' }
//     ]
//   });
// };

// module.exports = {
//   uploadImage,
//   uploadMultipleImages,
//   deleteImage,
//   getOptimizedUrl
// };