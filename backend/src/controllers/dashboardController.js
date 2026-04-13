const supabase = require('../config/supabase');

// ================= GET DASHBOARD STATS =================
const getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    // ✅ Correct month end (important fix)
    const endDate = new Date(currentYear, currentMonth, 0)
      .toISOString()
      .split('T')[0];

    // ================= STUDENTS =================
    const { count: totalStudents } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'student');

    const { count: newStudents } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'student')
      .gte('created_at', new Date(currentYear, currentMonth - 1, 1).toISOString());

    // ================= ROOMS =================
    const { data: rooms } = await supabase.from('rooms').select('*');

    const totalRooms = rooms?.length || 0;
    const occupiedRooms = rooms?.filter(r => !r.is_available).length || 0;
    const totalCapacity = rooms?.reduce((sum, r) => sum + r.capacity, 0) || 0;
    const currentOccupancy = rooms?.reduce((sum, r) => sum + r.current_occupancy, 0) || 0;

    // ================= COMPLAINTS =================
    const { data: complaints } = await supabase
      .from('complaints')
      .select('status, priority');

    const totalComplaints = complaints?.length || 0;
    const pendingComplaints = complaints?.filter(c => c.status === 'pending').length || 0;
    const resolvedComplaints = complaints?.filter(c => c.status === 'resolved').length || 0;
    const urgentComplaints = complaints?.filter(
      c => c.priority === 'urgent' && c.status !== 'resolved'
    ).length || 0;

    // ================= ATTENDANCE =================
    const { data: attendance } = await supabase
      .from('attendance')
      .select('status')
      .gte('date', `${currentYear}-${currentMonth}-01`)
      .lte('date', endDate);

    const totalAttendance = attendance?.length || 0;
    const presentAttendance = attendance?.filter(a => a.status === 'present').length || 0;

    const attendanceRate =
      totalAttendance > 0
        ? ((presentAttendance / totalAttendance) * 100).toFixed(2)
        : 0;

    // ================= FEES =================
    const monthNames = [
      'January','February','March','April','May','June',
      'July','August','September','October','November','December'
    ];

    const { data: fees } = await supabase
      .from('fees')
      .select('amount, status')
      .eq('month', monthNames[currentMonth - 1])
      .eq('year', currentYear);

    const totalFees = fees?.reduce((sum, f) => sum + f.amount, 0) || 0;
    const paidFees = fees?.filter(f => f.status === 'paid')
      .reduce((sum, f) => sum + f.amount, 0) || 0;

    const collectionRate =
      totalFees > 0
        ? ((paidFees / totalFees) * 100).toFixed(2)
        : 0;

    // ================= RECENT ACTIVITY =================
    const { data: recentComplaints } = await supabase
      .from('complaints')
      .select('*, profiles:student_id(name)')
      .order('created_at', { ascending: false })
      .limit(5);

    const { data: recentNotices } = await supabase
      .from('notices')
      .select('*, profiles:author_id(name)')
      .order('created_at', { ascending: false })
      .limit(5);

    // ================= RESPONSE =================
    res.json({
      success: true,
      data: {
        students: {
          total: totalStudents || 0,
          newThisMonth: newStudents || 0,
          occupancyRate:
            totalCapacity > 0
              ? ((currentOccupancy / totalCapacity) * 100).toFixed(2)
              : 0
        },
        rooms: {
          total: totalRooms,
          occupied: occupiedRooms,
          available: totalRooms - occupiedRooms,
          totalCapacity,
          currentOccupancy
        },
        complaints: {
          total: totalComplaints,
          pending: pendingComplaints,
          resolved: resolvedComplaints,
          urgent: urgentComplaints,
          resolutionRate:
            totalComplaints > 0
              ? ((resolvedComplaints / totalComplaints) * 100).toFixed(2)
              : 0
        },
        attendance: {
          total: totalAttendance,
          present: presentAttendance,
          rate: attendanceRate
        },
        fees: {
          totalAmount: totalFees,
          paidAmount: paidFees,
          pendingAmount: totalFees - paidFees,
          collectionRate
        },
        recentActivities: {
          complaints: recentComplaints || [],
          notices: recentNotices || []
        }
      }
    });

  } catch (error) {
    console.error('Dashboard Error:', error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



// ================= GET CHART DATA =================
const getChartData = async (req, res) => {
  try {
    const { type, year = new Date().getFullYear() } = req.query;

    const monthNamesShort = [
      'Jan','Feb','Mar','Apr','May','Jun',
      'Jul','Aug','Sep','Oct','Nov','Dec'
    ];

    const monthNamesFull = [
      'January','February','March','April','May','June',
      'July','August','September','October','November','December'
    ];

    const chartData = [];

    for (let month = 1; month <= 12; month++) {
      const endDate = new Date(year, month, 0)
        .toISOString()
        .split('T')[0];

      if (type === 'attendance') {
        const { data } = await supabase
          .from('attendance')
          .select('status')
          .gte('date', `${year}-${month}-01`)
          .lte('date', endDate);

        chartData.push({
          month: monthNamesShort[month - 1],
          present: data?.filter(a => a.status === 'present').length || 0,
          absent: data?.filter(a => a.status === 'absent').length || 0,
          total: data?.length || 0
        });
      }

      else if (type === 'complaints') {
        const { data } = await supabase
          .from('complaints')
          .select('status')
          .gte('created_at', `${year}-${month}-01`)
          .lte('created_at', endDate);

        chartData.push({
          month: monthNamesShort[month - 1],
          total: data?.length || 0,
          resolved: data?.filter(c => c.status === 'resolved').length || 0,
          pending: data?.filter(c => c.status === 'pending').length || 0
        });
      }

      else if (type === 'fees') {
        const { data } = await supabase
          .from('fees')
          .select('amount, status')
          .eq('month', monthNamesFull[month - 1])
          .eq('year', year);

        const total = data?.reduce((sum, f) => sum + f.amount, 0) || 0;
        const collected = data?.filter(f => f.status === 'paid')
          .reduce((sum, f) => sum + f.amount, 0) || 0;

        chartData.push({
          month: monthNamesShort[month - 1],
          total,
          collected,
          pending: total - collected
        });
      }
    }

    if (!['attendance', 'complaints', 'fees'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid chart type'
      });
    }

    res.json({
      success: true,
      data: chartData
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getDashboardStats,
  getChartData
};

// const supabase = require('../config/supabase');

// // @desc    Get dashboard statistics
// // @route   GET /api/dashboard/stats
// // @access  Private (Admin/Warden)
// const getDashboardStats = async (req, res) => {
//   try {
//     const currentDate = new Date();
//     const currentYear = currentDate.getFullYear();
//     const currentMonth = currentDate.getMonth() + 1;
    
//     // Student statistics
//     const { count: totalStudents } = await supabase
//       .from('profiles')
//       .select('*', { count: 'exact', head: true })
//       .eq('role', 'student');
    
//     const { count: newStudents } = await supabase
//       .from('profiles')
//       .select('*', { count: 'exact', head: true })
//       .eq('role', 'student')
//       .gte('created_at', new Date(currentYear, currentMonth - 1, 1).toISOString());
    
//     // Room statistics
//     const { data: rooms } = await supabase.from('rooms').select('*');
//     const totalRooms = rooms?.length || 0;
//     const occupiedRooms = rooms?.filter(r => !r.is_available).length || 0;
//     const totalCapacity = rooms?.reduce((sum, r) => sum + r.capacity, 0) || 0;
//     const currentOccupancy = rooms?.reduce((sum, r) => sum + r.current_occupancy, 0) || 0;
    
//     // Complaint statistics
//     const { data: complaints } = await supabase.from('complaints').select('status, priority');
//     const totalComplaints = complaints?.length || 0;
//     const pendingComplaints = complaints?.filter(c => c.status === 'pending').length || 0;
//     const resolvedComplaints = complaints?.filter(c => c.status === 'resolved').length || 0;
//     const urgentComplaints = complaints?.filter(c => c.priority === 'urgent' && c.status !== 'resolved').length || 0;
    
//     // Attendance for current month
//     const { data: attendance } = await supabase
//       .from('attendance')
//       .select('status')
//       .gte('date', `${currentYear}-${currentMonth}-01`)
//       .lte('date', `${currentYear}-${currentMonth}-31`);
    
//     const totalAttendance = attendance?.length || 0;
//     const presentAttendance = attendance?.filter(a => a.status === 'present').length || 0;
//     const attendanceRate = totalAttendance > 0 ? ((presentAttendance / totalAttendance) * 100).toFixed(2) : 0;
    
//     // Fee statistics for current month
//     const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
//     const { data: fees } = await supabase
//       .from('fees')
//       .select('amount, status')
//       .eq('month', monthNames[currentMonth - 1])
//       .eq('year', currentYear);
    
//     const totalFees = fees?.reduce((sum, f) => sum + f.amount, 0) || 0;
//     const paidFees = fees?.filter(f => f.status === 'paid').reduce((sum, f) => sum + f.amount, 0) || 0;
//     const collectionRate = totalFees > 0 ? ((paidFees / totalFees) * 100).toFixed(2) : 0;
    
//     // Recent activities
//     const { data: recentComplaints } = await supabase
//       .from('complaints')
//       .select('*, profiles:student_id(name)')
//       .order('created_at', { ascending: false })
//       .limit(5);
    
//     const { data: recentNotices } = await supabase
//       .from('notices')
//       .select('*, profiles:author_id(name)')
//       .order('created_at', { ascending: false })
//       .limit(5);
    
//     res.json({
//       success: true,
//       data: {
//         students: {
//           total: totalStudents,
//           newThisMonth: newStudents,
//           occupancyRate: totalCapacity > 0 ? ((currentOccupancy / totalCapacity) * 100).toFixed(2) : 0
//         },
//         rooms: {
//           total: totalRooms,
//           occupied: occupiedRooms,
//           available: totalRooms - occupiedRooms,
//           totalCapacity,
//           currentOccupancy
//         },
//         complaints: {
//           total: totalComplaints,
//           pending: pendingComplaints,
//           resolved: resolvedComplaints,
//           urgent: urgentComplaints,
//           resolutionRate: totalComplaints > 0 ? ((resolvedComplaints / totalComplaints) * 100).toFixed(2) : 0
//         },
//         attendance: {
//           total: totalAttendance,
//           present: presentAttendance,
//           rate: attendanceRate
//         },
//         fees: {
//           totalAmount: totalFees,
//           paidAmount: paidFees,
//           pendingAmount: totalFees - paidFees,
//           collectionRate
//         },
//         recentActivities: {
//           complaints: recentComplaints || [],
//           notices: recentNotices || []
//         }
//       }
//     });
//   } catch (error) {
//     console.error('Dashboard error:', error);
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @desc    Get chart data
// // @route   GET /api/dashboard/charts
// // @access  Private (Admin/Warden)
// const getChartData = async (req, res) => {
//   try {
//     const { type, year = 2024 } = req.query;
//     const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
//     if (type === 'attendance') {
//       const chartData = [];
//       for (let month = 1; month <= 12; month++) {
//         const { data } = await supabase
//           .from('attendance')
//           .select('status')
//           .gte('date', `${year}-${month}-01`)
//           .lte('date', `${year}-${month}-31`);
        
//         const present = data?.filter(a => a.status === 'present').length || 0;
//         const absent = data?.filter(a => a.status === 'absent').length || 0;
        
//         chartData.push({
//           month: monthNames[month - 1],
//           present,
//           absent,
//           total: data?.length || 0
//         });
//       }
//       res.json({ success: true, data: chartData });
//     }
    
//     else if (type === 'complaints') {
//       const chartData = [];
//       for (let month = 1; month <= 12; month++) {
//         const { data } = await supabase
//           .from('complaints')
//           .select('status')
//           .gte('created_at', `${year}-${month}-01`)
//           .lte('created_at', `${year}-${month}-31`);
        
//         chartData.push({
//           month: monthNames[month - 1],
//           total: data?.length || 0,
//           resolved: data?.filter(c => c.status === 'resolved').length || 0,
//           pending: data?.filter(c => c.status === 'pending').length || 0
//         });
//       }
//       res.json({ success: true, data: chartData });
//     }
    
//     else if (type === 'fees') {
//       const chartData = [];
//       for (let month = 1; month <= 12; month++) {
//         const { data } = await supabase
//           .from('fees')
//           .select('amount, status')
//           .eq('month', monthNames[month - 1])
//           .eq('year', year);
        
//         const total = data?.reduce((sum, f) => sum + f.amount, 0) || 0;
//         const collected = data?.filter(f => f.status === 'paid').reduce((sum, f) => sum + f.amount, 0) || 0;
        
//         chartData.push({
//           month: monthNames[month - 1],
//           total,
//           collected,
//           pending: total - collected
//         });
//       }
//       res.json({ success: true, data: chartData });
//     }
    
//     else {
//       res.status(400).json({
//         success: false,
//         message: 'Invalid chart type. Use: attendance, complaints, or fees'
//       });
//     }
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// module.exports = { getDashboardStats, getChartData };