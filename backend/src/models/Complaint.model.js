const supabase = require('../config/supabase');

class ComplaintModel {
  // Create complaint
  static async create(complaintData) {
    const { data, error } = await supabase
      .from('complaints')
      .insert([{
        student_id: complaintData.studentId,
        title: complaintData.title,
        description: complaintData.description,
        type: complaintData.type,
        priority: complaintData.priority || 'medium',
        status: 'pending'
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Get complaints with filters
  static async getAll(filters = {}, userId = null, userRole = 'student') {
    let query = supabase
      .from('complaints')
      .select(`
        *,
        profiles:student_id (name, roll_number, room_number)
      `);
    
    // Apply role-based filter
    if (userRole === 'student' && userId) {
      query = query.eq('student_id', userId);
    }
    
    // Apply status filter
    if (filters.status) query = query.eq('status', filters.status);
    if (filters.type) query = query.eq('type', filters.type);
    if (filters.priority) query = query.eq('priority', filters.priority);
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  // Get complaint by ID
  static async findById(id) {
    const { data, error } = await supabase
      .from('complaints')
      .select(`
        *,
        profiles:student_id (name, email, roll_number, room_number, phone)
      `)
      .eq('id', id)
      .maybeSingle();
    
    if (error) throw error;
    return data;
  }

  // Update complaint
  static async update(id, updates) {
    const updateData = { ...updates };
    if (updates.status === 'resolved') {
      updateData.resolved_at = new Date().toISOString();
    }
    
    const { data, error } = await supabase
      .from('complaints')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Delete complaint
  static async delete(id) {
    const { error } = await supabase
      .from('complaints')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }

  // Get statistics
  static async getStats(userId = null, userRole = 'student') {
    let query = supabase.from('complaints').select('status');
    
    if (userRole === 'student' && userId) {
      query = query.eq('student_id', userId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return {
      total: data.length,
      pending: data.filter(c => c.status === 'pending').length,
      inProgress: data.filter(c => c.status === 'in-progress').length,
      resolved: data.filter(c => c.status === 'resolved').length,
      rejected: data.filter(c => c.status === 'rejected').length
    };
  }
}

module.exports = ComplaintModel;