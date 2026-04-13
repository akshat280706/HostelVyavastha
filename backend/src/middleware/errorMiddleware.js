const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  let statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  let message = err.message || 'Server Error';

  // Duplicate error
  if (message.includes('duplicate key')) {
    statusCode = 400;
    message = 'Duplicate entry found';
  }

  // Foreign key error
  if (message.includes('violates foreign key')) {
    statusCode = 400;
    message = 'Referenced record not found';
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

module.exports = errorHandler;

// const errorHandler = (err, req, res, next) => {
//   let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
//   let message = err.message;
  
//   // Log error for debugging
//   console.error('Error:', err);
  
//   // Supabase specific errors
//   if (err.message && err.message.includes('duplicate key')) {
//     statusCode = 400;
//     message = 'Duplicate entry found';
//   }
  
//   if (err.message && err.message.includes('violates foreign key')) {
//     statusCode = 400;
//     message = 'Referenced record not found';
//   }
  
//   res.status(statusCode).json({
//     success: false,
//     message: message,
//     stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
//   });
// };

// module.exports = errorHandler;