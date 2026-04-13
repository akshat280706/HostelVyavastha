const crypto = require('crypto');


// ================= FORMAT DATE =================
const formatDate = (date, format = 'DD/MM/YYYY') => {
  const d = new Date(date);

  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();

  switch (format) {
    case 'DD/MM/YYYY':
      return `${day}/${month}/${year}`;
    case 'YYYY-MM-DD':
      return `${year}-${month}-${day}`;
    default:
      return `${day}/${month}/${year}`;
  }
};



// ================= SECURE RANDOM PASSWORD =================
const generateRandomPassword = (length = 8) => {
  // Generate secure random bytes
  return crypto
    .randomBytes(length)
    .toString('base64')   // convert to string
    .replace(/[^a-zA-Z0-9]/g, '') // remove special chars if needed
    .slice(0, length);
};



// ================= VALIDATE PHONE =================
const isValidPhone = (phone) => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
};



// ================= PAGINATION =================
const paginate = (page = 1, limit = 20) => {
  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.max(1, parseInt(limit) || 20);

  const offset = (pageNum - 1) * limitNum;

  return {
    offset,
    limit: limitNum,
    page: pageNum
  };
};



module.exports = {
  formatDate,
  generateRandomPassword,
  isValidPhone,
  paginate
};

// // Format date
// const formatDate = (date, format = 'DD/MM/YYYY') => {
//   const d = new Date(date);
//   const day = String(d.getDate()).padStart(2, '0');
//   const month = String(d.getMonth() + 1).padStart(2, '0');
//   const year = d.getFullYear();
  
//   switch(format) {
//     case 'DD/MM/YYYY': return `${day}/${month}/${year}`;
//     case 'YYYY-MM-DD': return `${year}-${month}-${day}`;
//     default: return `${day}/${month}/${year}`;
//   }
// };

// // Generate random password
// const generateRandomPassword = (length = 8) => {
//   const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
//   let password = '';
//   for (let i = 0; i < length; i++) {
//     password += chars.charAt(Math.floor(Math.random() * chars.length));
//   }
//   return password;
// };

// // Validate phone number
// const isValidPhone = (phone) => {
//   const phoneRegex = /^[6-9]\d{9}$/;
//   return phoneRegex.test(phone);
// };

// // Pagination helper
// const paginate = (page = 1, limit = 20) => {
//   const pageNum = parseInt(page);
//   const limitNum = parseInt(limit);
//   const offset = (pageNum - 1) * limitNum;
//   return { offset, limit: limitNum, page: pageNum };
// };

// module.exports = {
//   formatDate,
//   generateRandomPassword,
//   isValidPhone,
//   paginate
// };