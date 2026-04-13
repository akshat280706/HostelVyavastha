const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');

const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { data: user } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', decoded.id)
      .maybeSingle();

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    req.user = user;

    next();

  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token invalid'
    });
  }
};


// ROLE MIDDLEWARE
const admin = (req, res, next) => {
  if (req.user.role === 'admin') return next();
  return res.status(403).json({ success: false, message: 'Admin only' });
};

const warden = (req, res, next) => {
  if (['warden', 'admin'].includes(req.user.role)) return next();
  return res.status(403).json({ success: false, message: 'Warden only' });
};

module.exports = { protect, admin, warden };


// const jwt = require('jsonwebtoken');
// const supabase = require('../config/supabase');

// // ================= PROTECT =================
// const protect = async (req, res, next) => {
//   try {
//     let token;

//     // Get token
//     if (
//       req.headers.authorization &&
//       req.headers.authorization.startsWith('Bearer')
//     ) {
//       token = req.headers.authorization.split(' ')[1];
//     }

//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: 'Not authorized, no token'
//       });
//     }

//     // ✅ VERIFY JWT (NOT Supabase)
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // ✅ Fetch user from DB
//     const { data: user, error } = await supabase
//       .from('profiles')
//       .select('*')
//       .eq('id', decoded.id)
//       .maybeSingle();

//     if (error || !user) {
//       return res.status(401).json({
//         success: false,
//         message: 'User not found'
//       });
//     }

//     // Attach user
//     req.user = user;

//     next();

//   } catch (error) {
//     console.error('Auth Error:', error);

//     return res.status(401).json({
//       success: false,
//       message: 'Not authorized, token failed'
//     });
//   }
// };



// // ================= ROLE MIDDLEWARE =================
// const admin = (req, res, next) => {
//   if (req.user?.role === 'admin') return next();

//   return res.status(403).json({
//     success: false,
//     message: 'Admin access only'
//   });
// };

// const warden = (req, res, next) => {
//   if (req.user?.role === 'warden' || req.user?.role === 'admin') return next();

//   return res.status(403).json({
//     success: false,
//     message: 'Warden or Admin only'
//   });
// };

// const student = (req, res, next) => {
//   if (req.user?.role === 'student') return next();

//   return res.status(403).json({
//     success: false,
//     message: 'Student only'
//   });
// };


// module.exports = {
//   protect,
//   admin,
//   warden,
//   student
// };

// // const supabase = require('../config/supabase');

// // // Protect routes - verify JWT token
// // const protect = async (req, res, next) => {
// //   try {
// //     let token;
    
// //     // Get token from header
// //     if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
// //       token = req.headers.authorization.split(' ')[1];
// //     }
    
// //     if (!token) {
// //       return res.status(401).json({
// //         success: false,
// //         message: 'Not authorized, no token provided'
// //       });
// //     }
    
// //     // Verify token with Supabase
// //     const { data: { user }, error } = await supabase.auth.getUser(token);
    
// //     if (error || !user) {
// //       return res.status(401).json({
// //         success: false,
// //         message: 'Not authorized, invalid token'
// //       });
// //     }
    
// //     // Get user profile from database
// //     const { data: profile, error: profileError } = await supabase
// //       .from('profiles')
// //       .select('*')
// //       .eq('id', user.id)
// //       .single();
    
// //     if (profileError) {
// //       console.error('Profile fetch error:', profileError);
// //     }
    
// //     req.user = {
// //       id: user.id,
// //       email: user.email,
// //       ...profile
// //     };
    
// //     next();
// //   } catch (error) {
// //     console.error('Auth middleware error:', error);
// //     res.status(401).json({
// //       success: false,
// //       message: 'Not authorized'
// //     });
// //   }
// // };

// // // Admin only middleware
// // const admin = async (req, res, next) => {
// //   if (req.user && req.user.role === 'admin') {
// //     next();
// //   } else {
// //     res.status(403).json({
// //       success: false,
// //       message: 'Access denied. Admin only.'
// //     });
// //   }
// // };

// // // Warden or Admin middleware
// // const warden = async (req, res, next) => {
// //   if (req.user && (req.user.role === 'warden' || req.user.role === 'admin')) {
// //     next();
// //   } else {
// //     res.status(403).json({
// //       success: false,
// //       message: 'Access denied. Warden or Admin only.'
// //     });
// //   }
// // };

// // // Student only middleware
// // const student = async (req, res, next) => {
// //   if (req.user && req.user.role === 'student') {
// //     next();
// //   } else {
// //     res.status(403).json({
// //       success: false,
// //       message: 'Access denied. Students only.'
// //     });
// //   }
// // };

// // module.exports = { protect, admin, warden, student };