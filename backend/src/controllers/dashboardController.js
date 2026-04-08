const User = require('../models/User.js');
const Room = require('../models/Room.js');
const Complaint = require('../models/Complaint.js');
const Attendance = require('../models/Attendance.js');
const Fee = require('../models/Fee.js');
const Notice = require('../models/Notice.js');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private (Admin/Warden)
const getDashboardStats = async (req, res) => {
  try {
    // Get current date for monthly stats
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    // Student statistics
    const totalStudents = await User.countDocuments({ role: 'student' });
    const activeStudents = await User.countDocuments({ role: 'student', isActive: true });
    const newStudentsThisMonth = await User.countDocuments({
      role: 'student',
      joiningDate: {
        $gte: new Date(currentYear, currentMonth, 1),
        $lte: new Date(currentYear, currentMonth + 1, 0)
      }
    });
    
    // Room statistics
    const totalRooms = await Room.countDocuments();
    const occupiedRooms = await Room.countDocuments({ isAvailable: false });
    const availableRooms = totalRooms - occupiedRooms;
    const totalCapacity = (await Room.find()).reduce((sum, room) => sum + room.capacity, 0);
    const totalOccupancy = (await Room.find()).reduce((sum, room) => sum + room.currentOccupancy, 0);
    
    // Complaint statistics
    const totalComplaints = await Complaint.countDocuments();
    const pendingComplaints = await Complaint.countDocuments({ status: 'pending' });
    const inProgressComplaints = await Complaint.countDocuments({ status: 'in-progress' });
    const resolvedComplaints = await Complaint.countDocuments({ status: 'resolved' });
    const urgentComplaints = await Complaint.countDocuments({ priority: 'urgent', status: { $ne: 'resolved' } });
    
    // Attendance statistics for current month
    const attendanceRecords = await Attendance.find({
      date: {
        $gte: new Date(currentYear, currentMonth, 1),
        $lte: new Date(currentYear, currentMonth + 1, 0)
      }
    });
    
    const totalAttendance = attendanceRecords.length;
    const presentAttendance = attendanceRecords.filter(a => a.status === 'present').length;
    const attendanceRate = totalAttendance > 0 ? ((presentAttendance / totalAttendance) * 100).toFixed(2) : 0;
    
    // Fee statistics
    const feesThisMonth = await Fee.find({
      month: currentDate.toLocaleString('default', { month: 'long' }),
      year: currentYear
    });
    
    const totalFeesAmount = feesThisMonth.reduce((sum, f) => sum + f.amount, 0);
    const paidFeesAmount = feesThisMonth.filter(f => f.status === 'paid').reduce((sum, f) => sum + f.amount, 0);
    const pendingFeesAmount = totalFeesAmount - paidFeesAmount;
    const collectionRate = totalFeesAmount > 0 ? ((paidFeesAmount / totalFeesAmount) * 100).toFixed(2) : 0;
    
    // Recent activities
    const recentComplaints = await Complaint.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('studentId', 'name');
    
    const recentNotices = await Notice.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('author', 'name');
    
    const recentAttendance = await Attendance.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('studentId', 'name');
    
    res.json({
      students: {
        total: totalStudents,
        active: activeStudents,
        newThisMonth: newStudentsThisMonth,
        occupancyRate: ((totalOccupancy / totalCapacity) * 100).toFixed(2)
      },
      rooms: {
        total: totalRooms,
        occupied: occupiedRooms,
        available: availableRooms,
        totalCapacity,
        currentOccupancy: totalOccupancy
      },
      complaints: {
        total: totalComplaints,
        pending: pendingComplaints,
        inProgress: inProgressComplaints,
        resolved: resolvedComplaints,
        urgent: urgentComplaints,
        resolutionRate: totalComplaints > 0 ? ((resolvedComplaints / totalComplaints) * 100).toFixed(2) : 0
      },
      attendance: {
        total: totalAttendance,
        present: presentAttendance,
        rate: attendanceRate
      },
      fees: {
        totalAmount: totalFeesAmount,
        paidAmount: paidFeesAmount,
        pendingAmount: pendingFeesAmount,
        collectionRate
      },
      recentActivities: {
        complaints: recentComplaints,
        notices: recentNotices,
        attendance: recentAttendance
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get chart data for analytics
// @route   GET /api/dashboard/charts
// @access  Private (Admin/Warden)
const getChartData = async (req, res) => {
  try {
    const { type, year = 2024 } = req.query;
    
    if (type === 'attendance') {
      // Monthly attendance data
      const monthlyData = [];
      for (let month = 0; month < 12; month++) {
        const attendance = await Attendance.find({
          date: {
            $gte: new Date(year, month, 1),
            $lte: new Date(year, month + 1, 0)
          }
        });
        
        const present = attendance.filter(a => a.status === 'present').length;
        const absent = attendance.filter(a => a.status === 'absent').length;
        
        monthlyData.push({
          month: new Date(year, month, 1).toLocaleString('default', { month: 'short' }),
          present,
          absent,
          total: attendance.length
        });
      }
      res.json(monthlyData);
    }
    
    else if (type === 'complaints') {
      // Complaint trends by month
      const complaintsByMonth = [];
      for (let month = 0; month < 12; month++) {
        const complaints = await Complaint.find({
          createdAt: {
            $gte: new Date(year, month, 1),
            $lte: new Date(year, month + 1, 0)
          }
        });
        
        complaintsByMonth.push({
          month: new Date(year, month, 1).toLocaleString('default', { month: 'short' }),
          total: complaints.length,
          resolved: complaints.filter(c => c.status === 'resolved').length,
          pending: complaints.filter(c => c.status === 'pending').length
        });
      }
      res.json(complaintsByMonth);
    }
    
    else if (type === 'fees') {
      // Fee collection data
      const feesByMonth = [];
      for (let month = 0; month < 12; month++) {
        const monthName = new Date(year, month, 1).toLocaleString('default', { month: 'long' });
        const fees = await Fee.find({ month: monthName, year });
        
        const total = fees.reduce((sum, f) => sum + f.amount, 0);
        const collected = fees.filter(f => f.status === 'paid').reduce((sum, f) => sum + f.amount, 0);
        
        feesByMonth.push({
          month: new Date(year, month, 1).toLocaleString('default', { month: 'short' }),
          total,
          collected,
          pending: total - collected
        });
      }
      res.json(feesByMonth);
    }
    
    else {
      res.status(400).json({ message: 'Invalid chart type. Use: attendance, complaints, or fees' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardStats, getChartData };