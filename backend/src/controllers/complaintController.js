const Complaint = require('../models/Complaint.js');

// @desc    Create new complaint
// @route   POST /api/complaints
// @access  Private (Student only)
const createComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.create({
      ...req.body,
      studentId: req.user._id,
      studentName: req.user.name,
      roomNumber: req.user.roomNumber
    });
    res.status(201).json(complaint);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all complaints
// @route   GET /api/complaints
// @access  Private (Warden/Admin sees all, Student sees own)
const getComplaints = async (req, res) => {
  try {
    const { status, type, priority } = req.query;
    let query = {};
    
    if (status) query.status = status;
    if (type) query.type = type;
    if (priority) query.priority = priority;
    
    // If student, show only their complaints
    if (req.user.role === 'student') {
      query.studentId = req.user._id;
    }
    
    const complaints = await Complaint.find(query)
      .sort({ createdAt: -1, priority: -1 })
      .populate('studentId', 'name rollNumber phone')
      .populate('assignedTo', 'name');
    
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single complaint
// @route   GET /api/complaints/:id
// @access  Private
const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('studentId', 'name rollNumber phone roomNumber')
      .populate('assignedTo', 'name email');
    
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    
    // Check if user is authorized to view this complaint
    if (req.user.role === 'student' && complaint.studentId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this complaint' });
    }
    
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update complaint
// @route   PUT /api/complaints/:id
// @access  Private (Warden/Admin)
const updateComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    
    // If status is being changed to resolved, add resolvedAt date
    if (req.body.status === 'resolved' && complaint.status !== 'resolved') {
      req.body.resolvedAt = Date.now();
    }
    
    // Add remarks if provided
    if (req.body.remark) {
      const remark = {
        message: req.body.remark,
        postedBy: req.user.name,
        date: Date.now()
      };
      complaint.remarks.push(remark);
      await complaint.save();
      delete req.body.remark;
    }
    
    const updatedComplaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.json(updatedComplaint);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete complaint
// @route   DELETE /api/complaints/:id
// @access  Private (Admin only)
const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    
    await complaint.deleteOne();
    res.json({ message: 'Complaint deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint
};