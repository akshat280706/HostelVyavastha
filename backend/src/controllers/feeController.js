const supabase = require('../config/supabase');


// ================= CREATE FEE =================
const createFee = async (req, res) => {
  try {
    const { studentId, amount, month, year, dueDate, remarks } = req.body;

    // ✅ Validation
    if (!studentId || !amount || !month || !year) {
      return res.status(400).json({
        success: false,
        message: 'studentId, amount, month, and year are required'
      });
    }

    // ✅ Get student safely
    const { data: student, error: studentError } = await supabase
      .from('profiles')
      .select('name, room_number')
      .eq('id', studentId)
      .maybeSingle();

    if (studentError) throw studentError;

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // ✅ Create fee record
    const { data: fee, error } = await supabase
      .from('fees')
      .insert([{
        student_id: studentId,
        student_name: student.name,
        room_number: student.room_number,
        amount,
        month,
        year,
        due_date: dueDate || null,
        status: 'pending',
        remarks: remarks || null
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: 'Fee record created successfully',
      data: fee
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};



// ================= GET ALL FEES =================
const getFees = async (req, res) => {
  try {
    const { status, month, year, studentId } = req.query;

    let query = supabase.from('fees').select('*');

    if (status) query = query.eq('status', status);
    if (month) query = query.eq('month', month);
    if (year) query = query.eq('year', parseInt(year));
    if (studentId) query = query.eq('student_id', studentId);

    // ✅ Restrict students
    if (req.user.role === 'student') {
      query = query.eq('student_id', req.user.id);
    }

    const { data: fees, error } = await query
      .order('year', { ascending: false })
      .order('month', { ascending: false });

    if (error) throw error;

    // ✅ Summary
    const totalAmount = fees.reduce((sum, f) => sum + f.amount, 0);
    const paidAmount = fees
      .filter(f => f.status === 'paid')
      .reduce((sum, f) => sum + f.amount, 0);

    res.json({
      success: true,
      summary: {
        totalAmount,
        paidAmount,
        pendingAmount: totalAmount - paidAmount,
        totalRecords: fees.length,
        paidRecords: fees.filter(f => f.status === 'paid').length,
        pendingRecords: fees.filter(f => f.status === 'pending').length
      },
      data: fees
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



// ================= GET SINGLE FEE =================
const getFeeById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: fee, error } = await supabase
      .from('fees')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;

    if (!fee) {
      return res.status(404).json({
        success: false,
        message: 'Fee record not found'
      });
    }

    res.json({
      success: true,
      data: fee
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



// ================= UPDATE FEE =================
const updateFee = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentDate, transactionId, remarks } = req.body;

    const updates = {};
    if (status) updates.status = status;
    if (paymentDate) updates.payment_date = paymentDate;
    if (transactionId) updates.transaction_id = transactionId;
    if (remarks) updates.remarks = remarks;

    const { data: fee, error } = await supabase
      .from('fees')
      .update(updates)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) throw error;

    res.json({
      success: true,
      message: 'Fee record updated successfully',
      data: fee
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



// ================= DELETE FEE =================
const deleteFee = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('fees')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({
      success: true,
      message: 'Fee record deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



// ================= STUDENT FEE SUMMARY =================
const getStudentFeeSummary = async (req, res) => {
  try {
    const { studentId } = req.params;

    const { data: fees, error } = await supabase
      .from('fees')
      .select('*')
      .eq('student_id', studentId);

    if (error) throw error;

    const total = fees.reduce((sum, f) => sum + f.amount, 0);
    const paid = fees
      .filter(f => f.status === 'paid')
      .reduce((sum, f) => sum + f.amount, 0);

    res.json({
      success: true,
      data: {
        studentId,
        totalFees: total,
        paidFees: paid,
        pendingFees: total - paid,
        months: fees
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
  createFee,
  getFees,
  getFeeById,
  updateFee,
  deleteFee,
  getStudentFeeSummary
};

// const supabase = require('../config/supabase');

// // @desc    Create fee record
// // @route   POST /api/fees
// // @access  Private (Admin)
// const createFee = async (req, res) => {
//   try {
//     const { studentId, amount, month, year, dueDate, remarks } = req.body;
    
//     // Get student info
//     const { data: student } = await supabase
//       .from('profiles')
//       .select('name, room_number')
//       .eq('id', studentId)
//       .single();
    
//     const { data: fee, error } = await supabase
//       .from('fees')
//       .insert([{
//         student_id: studentId,
//         student_name: student?.name,
//         room_number: student?.room_number,
//         amount,
//         month,
//         year,
//         due_date: dueDate,
//         status: 'pending',
//         remarks
//       }])
//       .select()
//       .single();
    
//     if (error) throw error;
    
//     res.status(201).json({
//       success: true,
//       message: 'Fee record created',
//       data: fee
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @desc    Get all fees
// // @route   GET /api/fees
// // @access  Private
// const getFees = async (req, res) => {
//   try {
//     const { status, month, year, studentId } = req.query;
    
//     let query = supabase.from('fees').select('*');
    
//     if (status) query = query.eq('status', status);
//     if (month) query = query.eq('month', month);
//     if (year) query = query.eq('year', parseInt(year));
//     if (studentId) query = query.eq('student_id', studentId);
    
//     // If student, show only their fees
//     if (req.user.role === 'student') {
//       query = query.eq('student_id', req.user.id);
//     }
    
//     const { data: fees, error } = await query.order('year', { ascending: false }).order('month', { ascending: false });
    
//     if (error) throw error;
    
//     // Calculate summary
//     const totalAmount = fees.reduce((sum, f) => sum + f.amount, 0);
//     const paidAmount = fees.filter(f => f.status === 'paid').reduce((sum, f) => sum + f.amount, 0);
    
//     res.json({
//       success: true,
//       summary: {
//         totalAmount,
//         paidAmount,
//         pendingAmount: totalAmount - paidAmount,
//         totalRecords: fees.length,
//         paidRecords: fees.filter(f => f.status === 'paid').length,
//         pendingRecords: fees.filter(f => f.status === 'pending').length
//       },
//       data: fees
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @desc    Get single fee record
// // @route   GET /api/fees/:id
// // @access  Private
// const getFeeById = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     const { data: fee, error } = await supabase
//       .from('fees')
//       .select('*')
//       .eq('id', id)
//       .single();
    
//     if (error || !fee) {
//       return res.status(404).json({
//         success: false,
//         message: 'Fee record not found'
//       });
//     }
    
//     res.json({
//       success: true,
//       data: fee
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @desc    Update fee record
// // @route   PUT /api/fees/:id
// // @access  Private (Admin)
// const updateFee = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status, paymentDate, transactionId, remarks } = req.body;
    
//     const updates = { status };
//     if (paymentDate) updates.payment_date = paymentDate;
//     if (transactionId) updates.transaction_id = transactionId;
//     if (remarks) updates.remarks = remarks;
    
//     const { data: fee, error } = await supabase
//       .from('fees')
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
//       message: 'Fee record updated',
//       data: fee
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @desc    Delete fee record
// // @route   DELETE /api/fees/:id
// // @access  Private (Admin)
// const deleteFee = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     const { error } = await supabase
//       .from('fees')
//       .delete()
//       .eq('id', id);
    
//     if (error) throw error;
    
//     res.json({
//       success: true,
//       message: 'Fee record deleted'
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @desc    Get student fee summary
// // @route   GET /api/fees/student/:studentId/summary
// // @access  Private
// const getStudentFeeSummary = async (req, res) => {
//   try {
//     const { studentId } = req.params;
    
//     const { data: fees, error } = await supabase
//       .from('fees')
//       .select('*')
//       .eq('student_id', studentId);
    
//     if (error) throw error;
    
//     const total = fees.reduce((sum, f) => sum + f.amount, 0);
//     const paid = fees.filter(f => f.status === 'paid').reduce((sum, f) => sum + f.amount, 0);
//     const pending = total - paid;
    
//     res.json({
//       success: true,
//       data: {
//         studentId,
//         totalFees: total,
//         paidFees: paid,
//         pendingFees: pending,
//         months: fees
//       }
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// module.exports = {
//   createFee,
//   getFees,
//   getFeeById,
//   updateFee,
//   deleteFee,
//   getStudentFeeSummary
// };