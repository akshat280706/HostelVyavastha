const supabase = require('../config/supabase');

class NoticeModel {
  // Create notice
  static async create(noticeData) {
    const { data, error } = await supabase
      .from('notices')
      .insert([{
        title: noticeData.title,
        content: noticeData.content,
        category: noticeData.category || 'general',
        is_important: noticeData.isImportant || false,
        author_id: noticeData.authorId,
        expiry_date: noticeData.expiryDate || null
      }])
      .select()
      .maybeSingle()
    
    if (error) throw error;
    return data;
  }

  // Get all active notices
  static async getAll(filters = {}) {
    let query = supabase
      .from('notices')
      .select(`
        *,
        profiles:author_id (name)
      `)
      .eq('is_active', true);
    
    if (filters.category) query = query.eq('category', filters.category);
    if (filters.important) query = query.eq('is_important', true);
    
    const { data, error } = await query
      .order('is_important', { ascending: false })
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  // Get notice by ID
  static async findById(id) {
    const { data, error } = await supabase
      .from('notices')
      .select(`
        *,
        profiles:author_id (name, email)
      `)
      .eq('id', id)
      .maybeSingle()
    
    if (error) throw error;
    return data;
  }

  // Update notice
  static async update(id, updates) {
    const { data, error } = await supabase
      .from('notices')
      .update(updates)
      .eq('id', id)
      .select()
      .maybeSingle()
    
    if (error) throw error;
    return data;
  }

  // Delete notice (soft delete)
  static async delete(id) {
    const { error } = await supabase
      .from('notices')
      .update({ is_active: false })
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }

  // Permanent delete
  static async permanentDelete(id) {
    const { error } = await supabase
      .from('notices')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
}

module.exports = NoticeModel;