import { useEffect, useState } from 'react';
import { Users, Building2, DollarSign, AlertCircle, Calendar, Bell, TrendingUp, Clock } from 'lucide-react';
import { studentsData } from '../../data/studentsData';
import { roomsData } from '../../data/roomsData';
import { feeData } from '../../data/feeData';
import { complaintsData } from '../../data/complaintsData';
import { attendanceRecords } from '../../data/attendanceData';
import { noticesData } from '../../data/noticesData';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0, occupiedRooms: 0, totalRooms: 0,
    feesCollected: 0, pendingComplaints: 0,
    todayAttendance: 0, activeNotices: 0, collectionRate: 0,
  });
  const [recentComplaints, setRecentComplaints] = useState([]);

  useEffect(() => {
    const totalStudents = studentsData.filter(s => s.status === 'active').length;
    const totalRooms = roomsData.length;
    const occupiedRooms = roomsData.filter(r => r.status !== 'available').length;
    const feesCollected = feeData.reduce((s, f) => s + f.paid, 0);
    const totalFees = feeData.reduce((s, f) => s + f.paid + f.due, 0);
    const pendingComplaints = complaintsData.filter(c => c.status === 'pending').length;
    const today = attendanceRecords[0]?.date || '';
    const todayAttendance = attendanceRecords.filter(a => a.date === today && a.status === 'present').length;
    const activeNotices = noticesData.length;
    const collectionRate = totalFees > 0 ? Math.round((feesCollected / totalFees) * 100) : 0;

    setStats({ totalStudents, occupiedRooms, totalRooms, feesCollected, pendingComplaints, todayAttendance, activeNotices, collectionRate });
    setRecentComplaints(complaintsData.slice(0, 5));
  }, []);

  const statCards = [
    { label: 'Total Students', value: stats.totalStudents, icon: Users, color: 'var(--primary)', bg: 'var(--primary-light)' },
    { label: 'Rooms Occupied', value: `${stats.occupiedRooms}/${stats.totalRooms}`, icon: Building2, color: 'var(--success)', bg: 'var(--success-light)' },
    { label: 'Fees Collected', value: `₹${(stats.feesCollected / 1000).toFixed(0)}k`, icon: DollarSign, color: '#8b5cf6', bg: '#ede9fe' },
    { label: 'Pending Complaints', value: stats.pendingComplaints, icon: AlertCircle, color: 'var(--danger)', bg: 'var(--danger-light)' },
  ];

  const quickStats = [
    { label: "Today's Attendance", value: stats.todayAttendance, icon: Calendar, color: 'var(--info)' },
    { label: 'Active Notices', value: stats.activeNotices, icon: Bell, color: '#8b5cf6' },
    { label: 'Collection Rate', value: `${stats.collectionRate}%`, icon: TrendingUp, color: 'var(--success)' },
    { label: 'Occupancy Rate', value: stats.totalRooms > 0 ? `${Math.round((stats.occupiedRooms / stats.totalRooms) * 100)}%` : '0%', icon: Building2, color: 'var(--warning)' },
  ];

  const statusClass = (status) => {
    if (status === 'resolved') return 'status-resolved';
    if (status === 'in-progress') return 'status-in-progress';
    return 'status-pending';
  };

  return (
    <div className="fade-in">
      <h1 className="page-title">Dashboard</h1>
      <p className="page-subtitle">Welcome back — here's what's happening in your hostel today.</p>

      <div className="stats-grid">
        {statCards.map((card, idx) => (
          <div key={idx} className="stat-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <card.icon size={18} color={card.color} />
              </div>
            </div>
            <div className="stat-card-label">{card.label}</div>
            <div className="stat-card-value">{card.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px', marginBottom: '24px' }}>
        {quickStats.map((qs, idx) => (
          <div key={idx} style={{ background: 'white', border: '1px solid var(--border-light)', borderRadius: '10px', padding: '16px', boxShadow: 'var(--shadow-xs)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <qs.icon size={14} color={qs.color} />
              <span style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontWeight: '500' }}>{qs.label}</span>
            </div>
            <div style={{ fontSize: '22px', fontWeight: '700', fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>{qs.value}</div>
          </div>
        ))}
      </div>

      <div className="two-column-grid">
        <div className="activity-list">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ margin: 0 }}>Recent Complaints</h3>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{recentComplaints.length} items</span>
          </div>
          {recentComplaints.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', padding: '24px 0', textAlign: 'center' }}>No complaints yet</p>
          ) : (
            recentComplaints.map((c) => (
              <div key={c.id} className="activity-item">
                <div className="activity-item-content">
                  <div className="activity-item-title">{c.issue}</div>
                  <div className="activity-item-meta">{c.studentName} · Room {c.roomNumber}</div>
                </div>
                <span className={`complaint-status ${statusClass(c.status)}`}>{c.status}</span>
              </div>
            ))
          )}
        </div>

        <div className="activity-list">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ margin: 0 }}>Quick Overview</h3>
            <Clock size={14} color="var(--text-muted)" />
          </div>
          {[
            { label: 'Available Rooms', value: stats.totalRooms - stats.occupiedRooms, note: 'beds open' },
            { label: 'Fees Pending', value: feeData.reduce((s, f) => s + f.due, 0), note: 'total due', prefix: '₹' },
            { label: 'Students Present', value: stats.todayAttendance, note: 'today' },
            { label: 'Notices Active', value: stats.activeNotices, note: 'published' },
          ].map((item, idx) => (
            <div key={idx} className="activity-item">
              <div className="activity-item-content">
                <div className="activity-item-title">{item.label}</div>
                <div className="activity-item-meta">{item.note}</div>
              </div>
              <div style={{ fontSize: '18px', fontWeight: '700', fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                {item.prefix}{item.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
