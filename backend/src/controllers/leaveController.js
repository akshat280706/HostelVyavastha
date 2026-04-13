const supabase = require('../config/supabase');


// ================= APPLY LEAVE =================
const applyLeave = async (req, res) => {
  try {
    const { fromDate, toDate, reason, leaveType, parentContact } = req.body;

    // ✅ Validation
    if (!fromDate || !toDate || !reason) {
      return res.status(400).json({
        success: false,
        message: 'fromDate, toDate and reason are required'
      });
    }

    // ✅ Get user safely (DO NOT trust req.user directly)
    const { data: user, error: userError } = await supabase
      .from('profiles')
      .select('name, room_number')
      .eq('id', req.user.id)
      .maybeSingle();

    if (userError) throw userError;

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // ✅ Insert leave request
    const { data: leave, error } = await supabase
      .from('leaves')
      .insert([{
        student_id: req.user.id,
        student_name: user.name,
        room_number: user.room_number,
        from_date: fromDate,
        to_date: toDate,
        reason,
        leave_type: leaveType || 'casual',
        parent_contact: parentContact || null,
        status: 'pending'
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: 'Leave application submitted successfully',
      data: leave
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};



// ================= GET LEAVES =================
const getLeaves = async (req, res) => {
  try {
    const { status, studentId } = req.query;

    let query = supabase.from('leaves').select('*');

    if (status) query = query.eq('status', status);
    if (studentId) query = query.eq('student_id', studentId);

    // ✅ Restrict students
    if (req.user.role === 'student') {
      query = query.eq('student_id', req.user.id);
    }

    const { data: leaves, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      data: leaves
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



// ================= GET SINGLE LEAVE =================
const getLeaveById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: leave, error } = await supabase
      .from('leaves')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found'
      });
    }

    // ✅ Authorization check
    if (req.user.role === 'student' && leave.student_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this leave'
      });
    }

    res.json({
      success: true,
      data: leave
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



// ================= UPDATE LEAVE STATUS =================
const updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    const updates = {
      status,
      approved_by: req.user.id,
      approved_at: status === 'approved' ? new Date().toISOString() : null
    };

    if (rejectionReason) {
      updates.rejection_reason = rejectionReason;
    }

    const { data: leave, error } = await supabase
      .from('leaves')
      .update(updates)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) throw error;

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: 'Leave not found'
      });
    }

    res.json({
      success: true,
      message: `Leave ${status} successfully`,
      data: leave
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



// ================= DELETE LEAVE =================
const deleteLeave = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: leave, error: fetchError } = await supabase
      .from('leaves')
      .select('student_id, status')
      .eq('id', id)
      .maybeSingle();

    if (fetchError) throw fetchError;

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: 'Leave not found'
      });
    }

    // ✅ Authorization rules
    if (req.user.role === 'student') {
      if (leave.student_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized'
        });
      }

      if (leave.status !== 'pending') {
        return res.status(400).json({
          success: false,
          message: 'Only pending leaves can be cancelled'
        });
      }
    }

    const { error } = await supabase
      .from('leaves')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({
      success: true,
      message: 'Leave deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


module.exports = {
  applyLeave,
  getLeaves,
  getLeaveById,
  updateLeaveStatus,
  deleteLeave
};

// const supabase = require('../config/supabase');

// // @desc    Apply for leave
// // @route   POST /api/leaves
// // @access  Private (Student)
// const applyLeave = async (req, res) => {
//   try {
//     const { fromDate, toDate, reason, leaveType, parentContact } = req.body;
    
//     const { data: leave, error } = await supabase
//       .from('leaves')
//       .insert([{
//         student_id: req.user.id,
//         student_name: req.user.name,
//         room_number: req.user.room_number,
//         from_date: fromDate,
//         to_date: toDate,
//         reason,
//         leave_type: leaveType,
//         parent_contact: parentContact,
//         status: 'pending'
//       }])
//       .select()
//       .single();
    
//     if (error) throw error;
    
//     res.status(201).json({
//       success: true,
//       message: 'Leave application submitted',
//       data: leave
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @desc    Get all leave requests
// // @route   GET /api/leaves
// // @access  Private
// const getLeaves = async (req, res) => {
//   try {
//     const { status, studentId } = req.query;
    
//     let query = supabase.from('leaves').select('*');
    
//     if (status) query = query.eq('status', status);
//     if (studentId) query = query.eq('student_id', studentId);
    
//     // If student, show only their leaves
//     if (req.user.role === 'student') {
//       query = query.eq('student_id', req.user.id);
//     }
    
//     const { data: leaves, error } = await query.order('created_at', { ascending: false });
    
//     if (error) throw error;
    
//     res.json({
//       success: true,
//       data: leaves
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @desc    Get single leave request
// // @route   GET /api/leaves/:id
// // @access  Private
// const getLeaveById = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     const { data: leave, error } = await supabase
//       .from('leaves')
//       .select('*')
//       .eq('id', id)
//       .single();
    
//     if (error || !leave) {
//       return res.status(404).json({
//         success: false,
//         message: 'Leave request not found'
//       });
//     }
    
//     // Check authorization
//     if (req.user.role === 'student' && leave.student_id !== req.user.id) {
//       return res.status(403).json({
//         success: false,
//         message: 'Not authorized'
//       });
//     }
    
//     res.json({
//       success: true,
//       data: leave
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @desc    Update leave status (Approve/Reject)
// // @route   PUT /api/leaves/:id/status
// // @access  Private (Warden/Admin)
// const updateLeaveStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status, rejectionReason } = req.body;
    
//     const updates = { 
//       status,
//       approved_by: req.user.id,
//       approved_at: status === 'approved' ? new Date().toISOString() : null
//     };
//     if (rejectionReason) updates.rejection_reason = rejectionReason;
    
//     const { data: leave, error } = await supabase
//       .from('leaves')
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
//       message: `Leave ${status}`,
//       data: leave
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @desc    Delete leave request
// // @route   DELETE /api/leaves/:id
// // @access  Private (Student - own pending, Admin - any)
// const deleteLeave = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     const { data: leave } = await supabase
//       .from('leaves')
//       .select('student_id, status')
//       .eq('id', id)
//       .single();
    
//     if (!leave) {
//       return res.status(404).json({
//         success: false,
//         message: 'Leave request not found'
//       });
//     }
    
//     // Check authorization
//     if (req.user.role === 'student') {
//       if (leave.student_id !== req.user.id) {
//         return res.status(403).json({
//           success: false,
//           message: 'Not authorized'
//         });
//       }
//       if (leave.status !== 'pending') {
//         return res.status(400).json({
//           success: false,
//           message: 'Only pending leaves can be cancelled'
//         });
//       }
//     }
    
//     const { error } = await supabase
//       .from('leaves')
//       .delete()
//       .eq('id', id);
    
//     if (error) throw error;
    
//     res.json({
//       success: true,
//       message: 'Leave request deleted'
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// module.exports = {
//   applyLeave,
//   getLeaves,
//   getLeaveById,
//   updateLeaveStatus,
//   deleteLeave
// };