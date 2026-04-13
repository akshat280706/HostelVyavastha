const bcrypt = require('bcryptjs');
const supabase = require('../config/supabase');
const generateToken = require('../utils/generateToken');


// ================= REGISTER =================
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, hostel, rollNumber, role = 'student' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email and password required'
      });
    }

    // Check existing user
    const { data: existing } = await supabase
      .from('profiles')
      .select('email')
      .eq('email', email)
      .maybeSingle();

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const { data: user, error } = await supabase
      .from('profiles')
      .insert([{
        name,
        email,
        password: hashedPassword,
        phone,
        hostel,
        roll_number: rollNumber || null,
        role
      }])
      .select()
      .single();

    if (error) throw error;

    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



// ================= LOGIN =================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data: user } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = generateToken(user.id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



// ================= GET ME =================
const getMe = async (req, res) => {
  try {
    const { data: user } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', req.user.id)
      .maybeSingle();

    res.json({
      success: true,
      data: user
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe
};


// const supabase = require('../config/supabase');
// const jwt = require('jsonwebtoken');

// // Generate JWT token
// const generateToken = (id) => {
//   return jwt.sign(
//     { id },
//     process.env.JWT_SECRET,
//     { expiresIn: process.env.JWT_EXPIRE || '7d' }
//   );
// };



// // ================= REGISTER =================
// const registerUser = async (req, res) => {
//   try {
//     const {
//       name,
//       email,
//       password,
//       phone,
//       hostel,
//       rollNumber,
//       role = 'student'
//     } = req.body;

//     // ✅ Validation
//     if (!name || !email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: 'Name, email and password are required'
//       });
//     }

//     // ✅ Check if user already exists (SAFE)
//     const { data: existingUser, error: checkError } = await supabase
//       .from('profiles')
//       .select('email')
//       .eq('email', email)
//       .maybeSingle();

//     if (checkError) throw checkError;

//     if (existingUser) {
//       return res.status(400).json({
//         success: false,
//         message: 'User already exists with this email'
//       });
//     }

//     // ✅ Create user in Supabase Auth
//     const { data: authData, error: authError } = await supabase.auth.signUp({
//       email,
//       password,
//       options: {
//         data: {
//           name,
//           role
//         }
//       }
//     });

//     if (authError) {
//       return res.status(400).json({
//         success: false,
//         message: authError.message
//       });
//     }

//     // ⚠️ Edge case: user might be null if email confirmation required
//     if (!authData?.user) {
//       return res.status(400).json({
//         success: false,
//         message: 'User creation failed'
//       });
//     }

//     // ✅ Create profile
//     const { data: profile, error: profileError } = await supabase
//       .from('profiles')
//       .insert([{
//         id: authData.user.id,
//         name,
//         email,
//         phone,
//         hostel,
//         roll_number: rollNumber || null,
//         role
//       }])
//       .select()
//       .single();

//     if (profileError) {
//       console.error('Profile creation error:', profileError);
//       // Not failing intentionally (auth already created)
//     }

//     // ✅ Generate token
//     const token = generateToken(authData.user.id);

//     res.status(201).json({
//       success: true,
//       message: 'User registered successfully',
//       data: {
//         id: authData.user.id,
//         name,
//         email,
//         role,
//         token
//       }
//     });

//   } catch (error) {
//     console.error('Register Error:', error);
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };



// // ================= LOGIN =================
// const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // ✅ Validation
//     if (!email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: 'Email and password are required'
//       });
//     }

//     // ✅ Supabase Auth Login
//     const { data: authData, error: authError } =
//       await supabase.auth.signInWithPassword({
//         email,
//         password
//       });

//     if (authError) {
//       return res.status(401).json({
//         success: false,
//         message: 'Invalid email or password'
//       });
//     }

//     // ✅ Get profile (SAFE)
//     const { data: profile, error: profileError } = await supabase
//       .from('profiles')
//       .select('*')
//       .eq('id', authData.user.id)
//       .maybeSingle();

//     if (profileError) {
//       console.error('Profile fetch error:', profileError);
//     }

//     // ✅ Generate token
//     const token = generateToken(authData.user.id);

//     res.json({
//       success: true,
//       message: 'Login successful',
//       data: {
//         id: authData.user.id,
//         email: authData.user.email,
//         name: profile?.name || authData.user.user_metadata?.name,
//         role: profile?.role || 'student',
//         hostel: profile?.hostel || null,
//         token
//       }
//     });

//   } catch (error) {
//     console.error('Login Error:', error);
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };



// // ================= GET CURRENT USER =================
// const getMe = async (req, res) => {
//   try {
//     const { data: profile, error } = await supabase
//       .from('profiles')
//       .select('*')
//       .eq('id', req.user.id)
//       .maybeSingle();

//     if (error || !profile) {
//       return res.status(404).json({
//         success: false,
//         message: 'Profile not found'
//       });
//     }

//     res.json({
//       success: true,
//       data: profile
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };



// // ================= LOGOUT =================
// // (Optional — since JWT is stateless)
// const logoutUser = async (req, res) => {
//   try {
//     // Supabase signOut (optional)
//     await supabase.auth.signOut();

//     res.json({
//       success: true,
//       message: 'Logged out successfully'
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };



// module.exports = {
//   registerUser,
//   loginUser,
//   getMe,
//   logoutUser
// };

// const supabase = require('../config/supabase');
// const jwt = require('jsonwebtoken');

// // Generate JWT token (additional security)
// const generateToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRE,
//   });
// };

// // @desc    Register new user
// // @route   POST /api/auth/register
// // @access  Public
// const registerUser = async (req, res) => {
//   try {
//     const { name, email, password, phone, hostel, rollNumber, role = 'student' } = req.body;
    
//     // Check if user already exists
//     const { data: existingUser, error: checkError } = await supabase
//       .from('profiles')
//       .select('email')
//       .eq('email', email)
//       .single();
    
//     if (existingUser) {
//       return res.status(400).json({
//         success: false,
//         message: 'User already exists with this email'
//       });
//     }
    
//     // Create user in Supabase Auth
//     const { data: authData, error: authError } = await supabase.auth.signUp({
//       email,
//       password,
//       options: {
//         data: {
//           name,
//           role
//         }
//       }
//     });
    
//     if (authError) {
//       console.log("FULL AUTH ERROR:", authError);
//       return res.status(400).json({
//         success: false,
//         message: authError.message
//       });
//     }
    
//     // Create user profile
//     const { data: profile, error: profileError } = await supabase
//       .from('profiles')
//       .insert([{
//         id: authData.user.id,
//         name,
//         email,
//         phone,
//         hostel,
//         roll_number: rollNumber || null,
//         role: role
//       }])
//       .select()
//       .single();
    
//     if (profileError) {
//       console.error('Profile creation error:', profileError);
//       // Don't return error, user was created in auth
//     }
    
//     // Generate token
//     const token = generateToken(authData.user.id);
    
//     res.status(201).json({
//       success: true,
//       message: 'User registered successfully',
//       data: {
//         id: authData.user.id,
//         name,
//         email,
//         role,
//         token
//       }
//     });
//   } catch (error) {
//     console.error('Registration error:', error);
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @desc    Login user
// // @route   POST /api/auth/login
// // @access  Public
// const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;
    
//     // Sign in with Supabase Auth
//     const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
//       email,
//       password
//     });
    
//     if (authError) {
//       return res.status(401).json({
//         success: false,
//         message: 'Invalid email or password'
//       });
//     }
    
//     // Get user profile
//     const { data: profile, error: profileError } = await supabase
//       .from('profiles')
//       .select('*')
//       .eq('id', authData.user.id)
//       .single();
    
//     if (profileError) {
//       console.error('Profile fetch error:', profileError);
//     }
    
//     // Generate token
//     const token = generateToken(authData.user.id);
    
//     res.json({
//       success: true,
//       message: 'Login successful',
//       data: {
//         id: authData.user.id,
//         email: authData.user.email,
//         name: profile?.name || authData.user.user_metadata?.name,
//         role: profile?.role || 'student',
//         hostel: profile?.hostel,
//         token
//       }
//     });
//   } catch (error) {
//     console.error('Login error:', error);
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @desc    Get current user profile
// // @route   GET /api/auth/me
// // @access  Private
// const getMe = async (req, res) => {
//   try {
//     const { data: profile, error } = await supabase
//       .from('profiles')
//       .select('*')
//       .eq('id', req.user.id)
//       .single();
    
//     if (error) {
//       return res.status(404).json({
//         success: false,
//         message: 'Profile not found'
//       });
//     }
    
//     res.json({
//       success: true,
//       data: profile
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @desc    Logout user
// // @route   POST /api/auth/logout
// // @access  Private
// const logoutUser = async (req, res) => {
//   try {
//     const { error } = await supabase.auth.signOut();
    
//     if (error) {
//       return res.status(400).json({
//         success: false,
//         message: error.message
//       });
//     }
    
//     res.json({
//       success: true,
//       message: 'Logged out successfully'
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// module.exports = { registerUser, loginUser, getMe, logoutUser };