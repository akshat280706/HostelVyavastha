const supabase = require('../config/supabase');

class FeeModel {
  // Create fee record
  static async create(feeData) {
    const { data, error } = await supabase
      .from('fees')
      .insert([{
        student_id: feeData.studentId,
        student_name: feeData.studentName,
        room_number: feeData.roomNumber,
        amount: feeData.amount,
        month: feeData.month,
        year: feeData.year,
        due_date: feeData.dueDate,
        status: 'pending'
      }])
      .select()
      .maybeSingle();
    
    if (error) throw error;
    return data;
  }

  // Get fees with filters
  static async getAll(filters = {}, userId = null, userRole = 'student') {
    let query = supabase.from('fees').select('*');
    
    if (userRole === 'student' && userId) {
      query = query.eq('student_id', userId);
    }
    
    if (filters.status) query = query.eq('status', filters.status);
    if (filters.month) query = query.eq('month', filters.month);
    if (filters.year) query = query.eq('year', filters.year);
    if (filters.studentId) query = query.eq('student_id', filters.studentId);
    
    const { data, error } = await query
      .order('year', { ascending: false })
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  // Get fee by ID
  static async findById(id) {
    const { data, error } = await supabase
      .from('fees')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) throw error;
    return data;
  }

  // Update fee record
  static async update(id, updates) {
    const { data, error } = await supabase
      .from('fees')
      .update(updates)
      .eq('id', id)
      .select()
      .maybeSingle();
    
    if (error) throw error;
    return data;
  }

  // Mark as paid
  static async markAsPaid(id, paymentMethod, transactionId) {
    const { data, error } = await supabase
      .from('fees')
      .update({
        status: 'paid',
        payment_date: new Date().toISOString().split('T')[0],
        payment_method: paymentMethod,
        transaction_id: transactionId
      })
      .eq('id', id)
      .select()
      .maybeSingle();
    
    if (error) throw error;
    return data;
  }

  // Get student fee summary
  static async getStudentSummary(studentId) {
    const { data, error } = await supabase
      .from('fees')
      .select('amount, status')
      .eq('student_id', studentId);
    
    if (error) throw error;
    
    const total = data.reduce((sum, f) => sum + f.amount, 0);
    const paid = data.filter(f => f.status === 'paid').reduce((sum, f) => sum + f.amount, 0);
    
    return {
      studentId,
      totalFees: total,
      paidFees: paid,
      pendingFees: total - paid,
      totalRecords: data.length,
      paidRecords: data.filter(f => f.status === 'paid').length,
      pendingRecords: data.filter(f => f.status === 'pending').length
    };
  }
}

module.exports = FeeModel;