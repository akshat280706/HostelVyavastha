const supabase = require('../config/supabase');

// MARK ATTENDANCE
const markAttendance = async (req, res) => {
  try {
    const { studentId, status, checkInTime, date } = req.body;  // ← Add date
    
    // Use provided date or default to today
    const attendanceDate = date || new Date().toISOString().split('T')[0];
    
    // Check if attendance already exists for this student on this specific date
    const { data: existing } = await supabase
      .from('attendance')
      .select('id')
      .eq('student_id', studentId)
      .eq('date', attendanceDate)  // ← Use the specific date!
      .maybeSingle();
    
    let result;
    
    if (existing) {
      // Update existing record for that specific date
      const { data, error } = await supabase
        .from('attendance')
        .update({
          status,
          check_in_time: checkInTime,
          marked_by: req.user.id
        })
        .eq('id', existing.id)
        .select()
        .single();
      
      if (error) throw error;
      result = data;
    } else {
      // Create new record for that specific date
      const { data, error } = await supabase
        .from('attendance')
        .insert([{
          student_id: studentId,
          date: attendanceDate,  // ← Use the specific date!
          status,
          check_in_time: checkInTime,
          marked_by: req.user.id
        }])
        .select()
        .single();
      
      if (error) throw error;
      result = data;
    }
    
    res.json({
      success: true,
      message: `Attendance marked as ${status} for ${attendanceDate}`,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


// GET ATTENDANCE
const getAttendance = async (req, res) => {
  try {
    const { startDate, endDate, studentId, month, year } = req.query;

    let query = supabase
      .from('attendance')
      .select(`
        *,
        profiles:student_id (name, roll_number, room_number)
      `);

    if (startDate && endDate) {
      query = query.gte('date', startDate).lte('date', endDate);
    } 
    else if (month && year) {
      const start = `${year}-${month}-01`;
      const end = new Date(year, month, 0).toISOString().split('T')[0];
      query = query.gte('date', start).lte('date', end);
    }

    if (studentId) {
      query = query.eq('student_id', studentId);
    } 
    else if (req.user.role === 'student') {
      query = query.eq('student_id', req.user.id);
    }

    const { data: attendance, error } = await query.order('date', { ascending: false });

    if (error) throw error;

    const total = attendance.length;
    const present = attendance.filter(a => a.status === 'present').length;
    const absent = attendance.filter(a => a.status === 'absent').length;
    const late = attendance.filter(a => a.status === 'late').length;

    res.json({
      success: true,
      stats: {
        total,
        present,
        absent,
        late,
        attendanceRate: total > 0 ? ((present / total) * 100).toFixed(2) : 0
      },
      data: attendance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



// GET STUDENT ATTENDANCE
const getStudentAttendance = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { month, year } = req.query;

    let query = supabase
      .from('attendance')
      .select('*')
      .eq('student_id', studentId);

    if (month && year) {
      const start = `${year}-${month}-01`;
      const end = new Date(year, month, 0).toISOString().split('T')[0];
      query = query.gte('date', start).lte('date', end);
    }

    const { data: attendance, error } = await query.order('date', { ascending: false });

    if (error) throw error;

    const total = attendance.length;
    const present = attendance.filter(a => a.status === 'present').length;
    const absent = attendance.filter(a => a.status === 'absent').length;
    const late = attendance.filter(a => a.status === 'late').length;

    res.json({
      success: true,
      stats: {
        total,
        present,
        absent,
        late,
        percentage: total > 0 ? ((present / total) * 100).toFixed(2) : 0
      },
      data: attendance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



// UPDATE
const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, checkInTime, remarks } = req.body;

    const { data, error } = await supabase
      .from('attendance')
      .update({ status, check_in_time: checkInTime, remarks })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      message: 'Attendance updated successfully',
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



// DELETE
const deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('attendance')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({
      success: true,
      message: 'Attendance record deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  markAttendance,
  getAttendance,
  getStudentAttendance,
  updateAttendance,
  deleteAttendance
};

// const supabase = require('../config/supabase');

// // @desc    Mark attendance
// // @route   POST /api/attendance/mark
// // @access  Private (Warden/Admin)
// const markAttendance = async (req, res) => {
//   try {
//     const { studentId, status, checkInTime, remarks } = req.body;
//     const today = new Date().toISOString().split('T')[0];
    
//     // Check if attendance already marked for today
//     const { data: existing } = await supabase
//       .from('attendance')
//       .select('id')
//       .eq('student_id', studentId)
//       .eq('date', today)
//       .single();
    
//     let result;
    
//     if (existing) {
//       // Update existing
//       const { data, error } = await supabase
//         .from('attendance')
//         .update({
//           status,
//           check_in_time: checkInTime,
//           marked_by: req.user.id
//         })
//         .eq('id', existing.id)
//         .select()
//         .single();
      
//       if (error) throw error;
//       result = data;
//     } else {
//       // Create new
//       const { data, error } = await supabase
//         .from('attendance')
//         .insert([{
//           student_id: studentId,
//           date: today,
//           status,
//           check_in_time: checkInTime,
//           marked_by: req.user.id
//         }])
//         .select()
//         .single();
      
//       if (error) throw error;
//       result = data;
//     }
    
//     res.json({
//       success: true,
//       message: 'Attendance marked successfully',
//       data: result
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @desc    Get attendance records
// // @route   GET /api/attendance
// // @access  Private
// const getAttendance = async (req, res) => {
//   try {
//     const { startDate, endDate, studentId, month, year } = req.query;
    
//     let query = supabase
//       .from('attendance')
//       .select(`
//         *,
//         profiles:student_id (name, roll_number, room_number)
//       `);
    
//     // Date filters
//     if (startDate && endDate) {
//       query = query.gte('date', startDate).lte('date', endDate);
//     } else if (month && year) {
//       const start = `${year}-${month}-01`;
//       const end = `${year}-${month}-31`;
//       query = query.gte('date', start).lte('date', end);
//     }
    
//     // Student filter
//     if (studentId) {
//       query = query.eq('student_id', studentId);
//     } else if (req.user.role === 'student') {
//       query = query.eq('student_id', req.user.id);
//     }
    
//     const { data: attendance, error } = await query.order('date', { ascending: false });
    
//     if (error) throw error;
    
//     // Calculate statistics
//     const total = attendance.length;
//     const present = attendance.filter(a => a.status === 'present').length;
//     const absent = attendance.filter(a => a.status === 'absent').length;
//     const late = attendance.filter(a => a.status === 'late').length;
    
//     res.json({
//       success: true,
//       stats: {
//         total,
//         present,
//         absent,
//         late,
//         attendanceRate: total > 0 ? ((present / total) * 100).toFixed(2) : 0
//       },
//       data: attendance
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @desc    Get student attendance summary
// // @route   GET /api/attendance/student/:studentId
// // @access  Private (Warden/Admin)
// const getStudentAttendance = async (req, res) => {
//   try {
//     const { studentId } = req.params;
//     const { month, year } = req.query;
    
//     let query = supabase
//       .from('attendance')
//       .select('*')
//       .eq('student_id', studentId);
    
//     if (month && year) {
//       const start = `${year}-${month}-01`;
//       const end = `${year}-${month}-31`;
//       query = query.gte('date', start).lte('date', end);
//     }
    
//     const { data: attendance, error } = await query.order('date', { ascending: false });
    
//     if (error) throw error;
    
//     const total = attendance.length;
//     const present = attendance.filter(a => a.status === 'present').length;
//     const absent = attendance.filter(a => a.status === 'absent').length;
//     const late = attendance.filter(a => a.status === 'late').length;
    
//     res.json({
//       success: true,
//       stats: {
//         total,
//         present,
//         absent,
//         late,
//         percentage: total > 0 ? ((present / total) * 100).toFixed(2) : 0
//       },
//       data: attendance
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @desc    Update attendance
// // @route   PUT /api/attendance/:id
// // @access  Private (Warden/Admin)
// const updateAttendance = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status, checkInTime, remarks } = req.body;
    
//     const { data: attendance, error } = await supabase
//       .from('attendance')
//       .update({ status, check_in_time: checkInTime, remarks })
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
//       message: 'Attendance updated successfully',
//       data: attendance
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @desc    Delete attendance
// // @route   DELETE /api/attendance/:id
// // @access  Private (Admin)
// const deleteAttendance = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     const { error } = await supabase
//       .from('attendance')
//       .delete()
//       .eq('id', id);
    
//     if (error) throw error;
    
//     res.json({
//       success: true,
//       message: 'Attendance record deleted successfully'
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// module.exports = {
//   markAttendance,
//   getAttendance,
//   getStudentAttendance,
//   updateAttendance,
//   deleteAttendance
// };