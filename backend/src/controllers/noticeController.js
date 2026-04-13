const supabase = require('../config/supabase');

// @desc    Create notice
// @route   POST /api/notices
// @access  Private (Admin/Warden)
const createNotice = async (req, res) => {
  try {
    const { title, content, category, isImportant, expiryDate } = req.body;
    
    const { data: notice, error } = await supabase
      .from('notices')
      .insert([{
        title,
        content,
        category: category || 'general',
        is_important: isImportant || false,
        author_id: req.user.id,
        expiry_date: expiryDate || null
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    res.status(201).json({
      success: true,
      message: 'Notice created successfully',
      data: notice
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all notices
// @route   GET /api/notices
// @access  Public
const getNotices = async (req, res) => {
  try {
    const { category, important } = req.query;
    
    let query = supabase
      .from('notices')
      .select(`
        *,
        profiles:author_id (name)
      `)
      .eq('is_active', true);
    
    if (category) query = query.eq('category', category);
    if (important === 'true') query = query.eq('is_important', true);
    
    const { data: notices, error } = await query
      .order('is_important', { ascending: false })
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    res.json({
      success: true,
      data: notices
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single notice
// @route   GET /api/notices/:id
// @access  Public
const getNoticeById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data: notice, error } = await supabase
      .from('notices')
      .select(`
        *,
        profiles:author_id (name, email)
      `)
      .eq('id', id)
      .single();
    
    if (error || !notice) {
      return res.status(404).json({
        success: false,
        message: 'Notice not found'
      });
    }
    
    res.json({
      success: true,
      data: notice
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update notice
// @route   PUT /api/notices/:id
// @access  Private (Admin/Warden)
const updateNotice = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const { data: notice, error } = await supabase
      .from('notices')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    
    res.json({
      success: true,
      message: 'Notice updated successfully',
      data: notice
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete notice
// @route   DELETE /api/notices/:id
// @access  Private (Admin)
const deleteNotice = async (req, res) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('notices')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    res.json({
      success: true,
      message: 'Notice deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createNotice,
  getNotices,
  getNoticeById,
  updateNotice,
  deleteNotice
};