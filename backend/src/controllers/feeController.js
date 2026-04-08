const Fee = require('../models/Fee.js');
const User = require('../models/User.js');

// @desc    Create fee record
// @route   POST /api/fees
// @access  Private (Admin)
const createFee = async (req, res) => {
  try {
    const fee = await Fee.create(req.body);
    res.status(201).json(fee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all fees
// @route   GET /api/fees
// @access  Private
const getFees = async (req, res) => {
  try {
    const { status, month, year, studentId } = req.query;
    let query = {};
    
    if (status) query.status = status;
    if (month) query.month = month;
    if (year) query.year = parseInt(year);
    if (studentId) query.studentId = studentId;
    
    // If student, show only their fees
    if (req.user.role === 'student') {
      query.studentId = req.user._id;
    }
    
    const fees = await Fee.find(query)
      .populate('studentId', 'name rollNumber roomNumber')
      .sort({ year: -1, month: -1 });
    
    // Calculate summary
    const totalAmount = fees.reduce((sum, f) => sum + f.amount, 0);
    const paidAmount = fees.filter(f => f.status === 'paid').reduce((sum, f) => sum + f.amount, 0);
    const pendingAmount = totalAmount - paidAmount;
    
    res.json({
      fees,
      summary: {
        totalAmount,
        paidAmount,
        pendingAmount,
        totalRecords: fees.length,
        paidRecords: fees.filter(f => f.status === 'paid').length,
        pendingRecords: fees.filter(f => f.status === 'pending').length
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single fee record
// @route   GET /api/fees/:id
// @access  Private
const getFeeById = async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id).populate('studentId', 'name rollNumber roomNumber phone');
    if (!fee) {
      return res.status(404).json({ message: 'Fee record not found' });
    }
    res.json(fee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update fee record
// @route   PUT /api/fees/:id
// @access  Private (Admin)
const updateFee = async (req, res) => {
  try {
    const fee = await Fee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!fee) {
      return res.status(404).json({ message: 'Fee record not found' });
    }
    res.json(fee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete fee record
// @route   DELETE /api/fees/:id
// @access  Private (Admin)
const deleteFee = async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id);
    if (!fee) {
      return res.status(404).json({ message: 'Fee record not found' });
    }
    await fee.deleteOne();
    res.json({ message: 'Fee record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get student fee summary
// @route   GET /api/fees/student/:studentId/summary
// @access  Private
const getStudentFeeSummary = async (req, res) => {
  try {
    const { studentId } = req.params;
    const fees = await Fee.find({ studentId });
    
    const total = fees.reduce((sum, f) => sum + f.amount, 0);
    const paid = fees.filter(f => f.status === 'paid').reduce((sum, f) => sum + f.amount, 0);
    const pending = total - paid;
    const lateFees = fees.reduce((sum, f) => sum + (f.lateFee || 0), 0);
    
    res.json({
      studentId,
      totalFees: total,
      paidFees: paid,
      pendingFees: pending,
      lateFees: lateFees,
      dueAmount: pending + lateFees,
      months: fees
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
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