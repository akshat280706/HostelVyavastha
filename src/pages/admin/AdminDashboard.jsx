// import { useState, useEffect } from 'react';
// import { Users, DoorOpen, DollarSign, AlertCircle, Bell, MessageSquare } from 'lucide-react';

// // ✅ REAL DATA IMPORTS (make sure paths are correct)
// import { studentsData } from '../../data/studentsData';
// import { roomsData } from '../../data/roomsData';
// import { feeData } from '../../data/feeData';
// import { complaintsData } from '../../data/complaintsData';
// import { attendanceRecords } from '../../data/attendanceData';
// import { noticesData } from '../../data/noticesData';

// export default function AdminDashboard() {
//   const [stats, setStats] = useState({
//     totalStudents: 0,
//     totalRooms: 0,
//     occupiedRooms: 0,
//     availableRooms: 0,
//     totalFeesCollected: 0,
//     totalFeesPending: 0,
//     pendingComplaints: 0,
//     activeNotices: 0,
//     todayAttendance: 0
//   });

//   const [recentComplaints, setRecentComplaints] = useState([]);

//   useEffect(() => {
//     // 🧮 STUDENTS
//     const totalStudents = studentsData.filter(s => s.status === 'active').length;

//     // 🏠 ROOMS
//     const totalRooms = roomsData.length;
//     const occupiedRooms = roomsData.filter(
//       r => r.status === 'full' || r.status === 'partial'
//     ).length;
//     const availableRooms = roomsData.filter(r => r.status === 'available').length;

//     // 💰 FEES
//     const totalFeesCollected = feeData.reduce((sum, f) => sum + f.paid, 0);
//     const totalFeesPending = feeData.reduce((sum, f) => sum + f.due, 0);

//     // ⚠️ COMPLAINTS
//     const pendingComplaints = complaintsData.filter(c => c.status === 'pending').length;

//     // 📢 NOTICES
//     const activeNotices = noticesData.length;

//     // 📅 ATTENDANCE (fix: match dataset date)
//     const today = attendanceRecords[0]?.date || '';
//     const todayAttendance = attendanceRecords.filter(
//       a => a.date === today && a.status === 'present'
//     ).length;

//     setStats({
//       totalStudents,
//       totalRooms,
//       occupiedRooms,
//       availableRooms,
//       totalFeesCollected,
//       totalFeesPending,
//       pendingComplaints,
//       activeNotices,
//       todayAttendance
//     });

//     // 📌 RECENT COMPLAINTS
//     const recent = complaintsData.slice(0, 5);
//     setRecentComplaints(recent);

//   }, []);

//   const statCards = [
//     {
//       label: 'Total Students',
//       value: stats.totalStudents || '—',
//       icon: Users,
//       color: 'text-blue-400',
//       bg: 'bg-blue-500/10'
//     },
//     {
//       label: 'Rooms Occupied',
//       value: `${stats.occupiedRooms}/${stats.totalRooms}`,
//       icon: DoorOpen,
//       color: 'text-green-400',
//       bg: 'bg-green-500/10'
//     },
//     {
//       label: 'Fees Collected',
//       value: `₹${(stats.totalFeesCollected / 100000).toFixed(1)}L`,
//       icon: DollarSign,
//       color: 'text-purple-400',
//       bg: 'bg-purple-500/10'
//     },
//     {
//       label: 'Pending Complaints',
//       value: stats.pendingComplaints || '—',
//       icon: AlertCircle,
//       color: 'text-red-400',
//       bg: 'bg-red-500/10'
//     },
//   ];

//   const collectionRate =
//     stats.totalFeesCollected + stats.totalFeesPending > 0
//       ? Math.round(
//           (stats.totalFeesCollected /
//             (stats.totalFeesCollected + stats.totalFeesPending)) *
//             100
//         )
//       : 0;

//   const occupancyRate =
//     stats.totalRooms > 0
//       ? Math.round((stats.occupiedRooms / stats.totalRooms) * 100)
//       : 0;

//   return (
//     <div className="p-6">
//       {/* 🔢 Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
//         {statCards.map((stat, idx) => (
//           <div key={idx} className="bg-gray-900 rounded-xl p-6 border border-gray-800">
//             <div className={`p-2 rounded-lg ${stat.bg} inline-block mb-3`}>
//               <stat.icon size={20} className={stat.color} />
//             </div>
//             <div className="text-sm text-gray-400">{stat.label}</div>
//             <div className="text-2xl font-bold text-white">{stat.value}</div>
//           </div>
//         ))}
//       </div>

//       {/* ⚡ Quick Stats */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//         <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
//           <p className="text-xs text-gray-400">Today's Attendance</p>
//           <p className="text-2xl text-white font-bold">{stats.todayAttendance}</p>
//         </div>

//         <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
//           <p className="text-xs text-gray-400">Active Notices</p>
//           <p className="text-2xl text-white font-bold">{stats.activeNotices}</p>
//         </div>

//         <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
//           <p className="text-xs text-gray-400">Collection Rate</p>
//           <p className="text-2xl text-white font-bold">{collectionRate}%</p>
//         </div>

//         <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
//           <p className="text-xs text-gray-400">Occupancy Rate</p>
//           <p className="text-2xl text-white font-bold">{occupancyRate}%</p>
//         </div>
//       </div>

//       {/* 📋 Recent Complaints */}
//       <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
//         <h3 className="text-lg text-white font-semibold mb-4">Recent Complaints</h3>

//         {recentComplaints.length === 0 ? (
//           <p className="text-gray-400 text-sm">No complaints yet 🎉</p>
//         ) : (
//           <div className="space-y-3">
//             {recentComplaints.map((c) => (
//               <div
//                 key={c.id}
//                 className="flex justify-between p-3 bg-gray-800/50 rounded-lg"
//               >
//                 <div>
//                   <p className="text-white text-sm font-medium">{c.issue}</p>
//                   <p className="text-gray-400 text-xs">
//                     {c.studentName} • Room {c.roomNumber}
//                   </p>
//                 </div>
//                 <span
//                   className={`text-xs font-medium ${
//                     c.priority === 'high'
//                       ? 'text-red-400'
//                       : c.priority === 'medium'
//                       ? 'text-yellow-400'
//                       : 'text-green-400'
//                   }`}
//                 >
//                   {c.status}
//                 </span>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [recentComplaints, setRecentComplaints] = useState([]);

  useEffect(() => {
    // 🔥 Mock Data (guaranteed visible)
    const mockStudents = [
      { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }
    ];

    const mockRooms = [
      { status: 'full' },
      { status: 'partial' },
      { status: 'available' },
      { status: 'full' }
    ];

    const mockFees = [
      { paid: 40000, due: 0 },
      { paid: 20000, due: 20000 },
      { paid: 10000, due: 30000 }
    ];

    const mockComplaints = [
      { id: 1, issue: 'AC not working', studentName: 'Rajesh', room: 'A-101', status: 'pending' },
      { id: 2, issue: 'Water leakage', studentName: 'Priya', room: 'A-103', status: 'in-progress' },
      { id: 3, issue: 'Broken window', studentName: 'Vikram', room: 'B-101', status: 'resolved' }
    ];

    const totalStudents = mockStudents.length;
    const totalRooms = mockRooms.length;
    const occupiedRooms = mockRooms.filter(r => r.status !== 'available').length;
    const totalFeesCollected = mockFees.reduce((s, f) => s + f.paid, 0);
    const pendingComplaints = mockComplaints.filter(c => c.status === 'pending').length;

    setStats({
      totalStudents,
      totalRooms,
      occupiedRooms,
      totalFeesCollected,
      pendingComplaints,
      attendance: 3,
      notices: 5
    });

    setRecentComplaints(mockComplaints);
  }, []);

  return (
    <div>
      <h1 className="page-title">Admin Dashboard</h1>

      {/* 🔢 Stats */}
      <div className="dashboard-stats-grid">
        <div className="card">
          <div className="stat-card-label">Total Students</div>
          <div className="stat-card-value">{stats.totalStudents}</div>
        </div>

        <div className="card">
          <div className="stat-card-label">Rooms Occupied</div>
          <div className="stat-card-value">
            {stats.occupiedRooms}/{stats.totalRooms}
          </div>
        </div>

        <div className="card">
          <div className="stat-card-label">Fees Collected</div>
          <div className="stat-card-value">
            ₹{stats.totalFeesCollected}
          </div>
        </div>

        <div className="card">
          <div className="stat-card-label">Pending Complaints</div>
          <div className="stat-card-value">{stats.pendingComplaints}</div>
        </div>
      </div>

      {/* ⚡ Secondary stats */}
      <div className="dashboard-feeds-grid">
        <div className="card">
          <h3>Quick Stats</h3>
          <p>Attendance Today: {stats.attendance}</p>
          <p>Active Notices: {stats.notices}</p>
        </div>

        <div className="card">
          <h3>Recent Complaints</h3>

          {recentComplaints.map((c) => (
            <div key={c.id} className="activity-feed-item">
              <div className="activity-feed-item-title">
                {c.issue} ({c.studentName})
              </div>
              <div className="activity-feed-item-status">
                {c.status}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}