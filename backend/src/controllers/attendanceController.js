const Attendance = require('../models/Attendance.js');
const User = require('../models/User.js');

// @desc    Mark attendance
// @route   POST /api/attendance/mark
// @access  Private (Warden/Admin)
const markAttendance = async (req, res) => {
  try {
    const { studentId, status, checkInTime, checkOutTime, remarks } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let attendance = await Attendance.findOne({
      studentId,
      date: today
    });
    
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    if (attendance) {
      // Update existing
      attendance.status = status || attendance.status;
      attendance.checkInTime = checkInTime || attendance.checkInTime;
      attendance.checkOutTime = checkOutTime || attendance.checkOutTime;
      attendance.remarks = remarks || attendance.remarks;
      await attendance.save();
    } else {
      // Create new
      attendance = await Attendance.create({
        studentId,
        studentName: student.name,
        roomNumber: student.roomNumber,
        date: today,
        status,
        checkInTime,
        checkOutTime,
        markedBy: req.user._id,
        remarks
      });
    }
    
    res.json(attendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get attendance records
// @route   GET /api/attendance
// @access  Private
const getAttendance = async (req, res) => {
  try {
    const { startDate, endDate, studentId, status, month, year } = req.query;
    let query = {};
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    if (month && year) {
      query.date = {
        $gte: new Date(year, month - 1, 1),
        $lte: new Date(year, month, 0)
      };
    }
    
    if (studentId) query.studentId = studentId;
    if (status) query.status = status;
    
    // If student, show only their records
    if (req.user.role === 'student') {
      query.studentId = req.user._id;
    }
    
    const attendance = await Attendance.find(query)
      .populate('studentId', 'name rollNumber roomNumber')
      .populate('markedBy', 'name')
      .sort({ date: -1 });
    
    // Calculate statistics
    const total = attendance.length;
    const present = attendance.filter(a => a.status === 'present').length;
    const absent = attendance.filter(a => a.status === 'absent').length;
    const late = attendance.filter(a => a.status === 'late').length;
    
    res.json({
      attendance,
      stats: { total, present, absent, late, attendanceRate: ((present / total) * 100).toFixed(2) }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get attendance for a specific student
// @route   GET /api/attendance/student/:studentId
// @access  Private
const getStudentAttendance = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { month, year } = req.query;
    
    let query = { studentId };
    
    if (month && year) {
      query.date = {
        $gte: new Date(year, month - 1, 1),
        $lte: new Date(year, month, 0)
      };
    }
    
    const attendance = await Attendance.find(query).sort({ date: -1 });
    
    const total = attendance.length;
    const present = attendance.filter(a => a.status === 'present').length;
    const absent = attendance.filter(a => a.status === 'absent').length;
    const late = attendance.filter(a => a.status === 'late').length;
    
    res.json({
      attendance,
      stats: { total, present, absent, late, percentage: ((present / total) * 100).toFixed(2) }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update attendance
// @route   PUT /api/attendance/:id
// @access  Private (Warden/Admin)
const updateAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }
    res.json(attendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete attendance record
// @route   DELETE /api/attendance/:id
// @access  Private (Admin only)
const deleteAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id);
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }
    await attendance.deleteOne();
    res.json({ message: 'Attendance record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  markAttendance,
  getAttendance,
  getStudentAttendance,
  updateAttendance,
  deleteAttendance
};