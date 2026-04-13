const supabase = require('../config/supabase');

// @desc    Create complaint
// @route   POST /api/complaints
// @access  Private (Student)
const createComplaint = async (req, res) => {
  try {
    const { title, description, type, priority = 'medium' } = req.body;
    
    const { data: complaint, error } = await supabase
      .from('complaints')
      .insert([{
        student_id: req.user.id,
        title,
        description,
        type,
        priority,
        status: 'pending'
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully',
      data: complaint
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all complaints
// @route   GET /api/complaints
// @access  Private (Warden/Admin sees all, Student sees own)
const getComplaints = async (req, res) => {
  try {
    const { status, type, priority } = req.query;
    
    let query = supabase
      .from('complaints')
      .select(`
        *,
        profiles:student_id (name, roll_number, room_number)
      `);
    
    // Filter by user role
    if (req.user.role === 'student') {
      query = query.eq('student_id', req.user.id);
    }
    
    // Apply filters
    if (status) query = query.eq('status', status);
    if (type) query = query.eq('type', type);
    if (priority) query = query.eq('priority', priority);
    
    const { data: complaints, error } = await query
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Calculate statistics
    const stats = {
      total: complaints.length,
      pending: complaints.filter(c => c.status === 'pending').length,
      inProgress: complaints.filter(c => c.status === 'in-progress').length,
      resolved: complaints.filter(c => c.status === 'resolved').length,
      rejected: complaints.filter(c => c.status === 'rejected').length
    };
    
    res.json({
      success: true,
      stats,
      data: complaints
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single complaint
// @route   GET /api/complaints/:id
// @access  Private
const getComplaintById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data: complaint, error } = await supabase
      .from('complaints')
      .select(`
        *,
        profiles:student_id (name, email, roll_number, room_number, phone)
      `)
      .eq('id', id)
      .single();
    
    if (error || !complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }
    
    // Check authorization
    if (req.user.role === 'student' && complaint.student_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this complaint'
      });
    }
    
    res.json({
      success: true,
      data: complaint
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update complaint
// @route   PUT /api/complaints/:id
// @access  Private (Warden/Admin)
const updateComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, priority, remarks } = req.body;
    
    const updates = {};
    if (status) updates.status = status;
    if (priority) updates.priority = priority;
    if (remarks) updates.remarks = remarks;
    if (status === 'resolved') updates.resolved_at = new Date().toISOString();
    
    const { data: complaint, error } = await supabase
      .from('complaints')
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
      message: 'Complaint updated successfully',
      data: complaint
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete complaint
// @route   DELETE /api/complaints/:id
// @access  Private (Admin)
const deleteComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('complaints')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    res.json({
      success: true,
      message: 'Complaint deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint
};