const supabase = require('../config/supabase');

class LeaveModel {
  // Apply for leave
  static async apply(leaveData) {
    const { data, error } = await supabase
      .from('leaves')
      .insert([{
        student_id: leaveData.studentId,
        student_name: leaveData.studentName,
        room_number: leaveData.roomNumber,
        from_date: leaveData.fromDate,
        to_date: leaveData.toDate,
        reason: leaveData.reason,
        leave_type: leaveData.leaveType || 'casual',
        parent_contact: leaveData.parentContact,
        status: 'pending'
      }])
      .select()
      .maybeSingle()
    
    if (error) throw error;
    return data;
  }

  // Get leave requests
  static async getAll(filters = {}, userId = null, userRole = 'student') {
    let query = supabase.from('leaves').select('*');
    
    if (userRole === 'student' && userId) {
      query = query.eq('student_id', userId);
    }
    
    if (filters.status) query = query.eq('status', filters.status);
    if (filters.studentId) query = query.eq('student_id', filters.studentId);
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  // Get leave by ID
  static async findById(id) {
    const { data, error } = await supabase
      .from('leaves')
      .select('*')
      .eq('id', id)
      .maybeSingle()
    
    if (error) throw error;
    return data;
  }

  // Update leave status (approve/reject)
  static async updateStatus(id, status, approvedBy, rejectionReason = null) {
    const updates = {
      status,
      approved_by: approvedBy,
      approved_at: status === 'approved' ? new Date().toISOString() : null
    };
    
    if (rejectionReason) updates.rejection_reason = rejectionReason;
    
    const { data, error } = await supabase
      .from('leaves')
      .update(updates)
      .eq('id', id)
      .select()
      .maybeSingle()
    
    if (error) throw error;
    return data;
  }

  // Cancel leave (student can cancel pending leaves)
  static async cancel(id, studentId) {
    // First verify ownership and status
    const leave = await this.findById(id);
    
    if (leave.student_id !== studentId) {
      throw new Error('Not authorized to cancel this leave');
    }
    
    if (leave.status !== 'pending') {
      throw new Error('Only pending leaves can be cancelled');
    }
    
    const { data, error } = await supabase
      .from('leaves')
      .update({ status: 'cancelled' })
      .eq('id', id)
      .select()
      .maybeSingle()
    
    if (error) throw error;
    return data;
  }

  // Delete leave (admin only)
  static async delete(id) {
    const { error } = await supabase
      .from('leaves')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
}

module.exports = LeaveModel;