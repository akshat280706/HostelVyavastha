const supabase = require('../config/supabase');


// ================= GET ALL STUDENTS =================
const getStudents = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, hostel } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    let query = supabase
      .from('profiles')
      .select('*', { count: 'exact' })
      .eq('role', 'student')
      .order('created_at', { ascending: false });

    // ✅ Search filter
    if (search) {
      query = query.or(
        `name.ilike.%${search}%,email.ilike.%${search}%,roll_number.ilike.%${search}%`
      );
    }

    // ✅ Hostel filter
    if (hostel) {
      query = query.eq('hostel', hostel);
    }

    // ✅ Pagination
    query = query.range(offset, offset + limitNum - 1);

    const { data: students, error, count } = await query;

    if (error) throw error;

    res.json({
      success: true,
      data: students,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limitNum)
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



// ================= GET USER BY ID =================
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: user, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .maybeSingle(); // ✅ FIX

    if (error) throw error;

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



// ================= UPDATE USER =================
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    // ✅ Prevent unsafe updates
    delete updates.id;
    delete updates.created_at;
    delete updates.email; // optional restriction

    const { data: user, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .maybeSingle(); // ✅ FIX

    if (error) throw error;

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User updated successfully',
      data: user
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



// ================= DELETE USER =================
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ================= USER STATS =================
const getUserStats = async (req, res) => {
  try {
    // Total students
    const { count: totalStudents } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'student');

    // Hostel distribution
    const { data: hostelStats } = await supabase
      .from('profiles')
      .select('hostel')
      .eq('role', 'student');

    const hostelCount = {};

    hostelStats?.forEach(s => {
      hostelCount[s.hostel] = (hostelCount[s.hostel] || 0) + 1;
    });

    res.json({
      success: true,
      data: {
        totalStudents: totalStudents || 0,
        hostelDistribution: hostelCount,
        activeUsers: totalStudents || 0
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



module.exports = {
  getStudents,
  getUserById,
  updateUser,
  deleteUser,
  getUserStats
};

// const supabase = require('../config/supabase');

// // @desc    Get all students
// // @route   GET /api/users/students
// // @access  Private (Admin/Warden)
// const getStudents = async (req, res) => {
//   try {
//     const { page = 1, limit = 20, search, hostel } = req.query;
//     const offset = (page - 1) * limit;
    
//     let query = supabase
//       .from('profiles')
//       .select('*', { count: 'exact' })
//       .eq('role', 'student')
//       .order('created_at', { ascending: false });
    
//     // Apply filters
//     if (search) {
//       query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,roll_number.ilike.%${search}%`);
//     }
    
//     if (hostel) {
//       query = query.eq('hostel', hostel);
//     }
    
//     // Apply pagination
//     query = query.range(offset, offset + limit - 1);
    
//     const { data: students, error, count } = await query;
    
//     if (error) throw error;
    
//     res.json({
//       success: true,
//       data: students,
//       pagination: {
//         page: parseInt(page),
//         limit: parseInt(limit),
//         total: count,
//         totalPages: Math.ceil(count / limit)
//       }
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @desc    Get single user by ID
// // @route   GET /api/users/:id
// // @access  Private (Admin/Warden)
// const getUserById = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     const { data: user, error } = await supabase
//       .from('profiles')
//       .select('*')
//       .eq('id', id)
//       .single();
    
//     if (error || !user) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }
    
//     res.json({
//       success: true,
//       data: user
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @desc    Update user
// // @route   PUT /api/users/:id
// // @access  Private (Admin)
// const updateUser = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updates = req.body;
    
//     // Remove fields that shouldn't be updated directly
//     delete updates.id;
//     delete updates.created_at;
    
//     const { data: user, error } = await supabase
//       .from('profiles')
//       .update(updates)
//       .eq('id', id)
//       .select()
//       .single();
    
//     if (error) {
//       return res.status(400).json({
//         success: false,
//         message: error.message
//       });
//     }
    
//     res.json({
//       success: true,
//       message: 'User updated successfully',
//       data: user
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @desc    Delete user
// // @route   DELETE /api/users/:id
// // @access  Private (Admin)
// const deleteUser = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     // First delete profile
//     const { error: profileError } = await supabase
//       .from('profiles')
//       .delete()
//       .eq('id', id);
    
//     if (profileError) throw profileError;
    
//     // Then delete auth user (using admin API)
//     const { error: authError } = await supabase.auth.admin.deleteUser(id);
    
//     if (authError) throw authError;
    
//     res.json({
//       success: true,
//       message: 'User deleted successfully'
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @desc    Get user statistics
// // @route   GET /api/users/stats
// // @access  Private (Admin)
// const getUserStats = async (req, res) => {
//   try {
//     // Total students
//     const { count: totalStudents } = await supabase
//       .from('profiles')
//       .select('*', { count: 'exact', head: true })
//       .eq('role', 'student');
    
//     // Students by hostel
//     const { data: hostelStats } = await supabase
//       .from('profiles')
//       .select('hostel')
//       .eq('role', 'student');
    
//     const hostelCount = {};
//     hostelStats?.forEach(s => {
//       hostelCount[s.hostel] = (hostelCount[s.hostel] || 0) + 1;
//     });
    
//     res.json({
//       success: true,
//       data: {
//         totalStudents,
//         hostelDistribution: hostelCount,
//         activeUsers: totalStudents
//       }
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// module.exports = { getStudents, getUserById, updateUser, deleteUser, getUserStats };