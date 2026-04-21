import { useEffect, useState } from 'react';
import { Users, Building2, DollarSign, AlertCircle, Calendar, Bell, TrendingUp, Clock } from 'lucide-react';
import { dashboardService, userService, complaintService, attendanceService, feeService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalStudents: 0,
    occupiedRooms: 0,
    totalRooms: 0,
    feesCollected: 0,
    pendingComplaints: 0,
    todayAttendance: 0,
    activeNotices: 0,
    collectionRate: 0
  });
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    
    try {  // ← ADD THIS (was missing)
      // Fetch students (ADD THIS SECTION)
      const studentsRes = await userService.getStudents({ limit: 100, page: 1 });
      if (studentsRes.success) {
        const totalStudents = studentsRes.pagination?.total || studentsRes.data?.length || 0;
        setStats(prev => ({ ...prev, totalStudents: totalStudents }));
        console.log('Total students:', totalStudents);
      }
      
      // Fetch rooms
      const roomsRes = await fetch('http://localhost:5000/api/rooms', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      }).then(res => res.json());
      
      if (roomsRes.success) {
        const rooms = roomsRes.data;
        const totalRooms = rooms.length;
        const occupiedRooms = rooms.filter(r => !r.is_available || r.current_occupancy > 0).length;
        setStats(prev => ({ ...prev, totalRooms, occupiedRooms }));
      }
      
      // Fetch complaints
      const complaintsRes = await complaintService.getComplaints();
      if (complaintsRes.success) {
        const complaints = complaintsRes.data || [];
        const pendingComplaints = complaints.filter(c => c.status === 'pending').length;
        setStats(prev => ({ ...prev, pendingComplaints }));
        setRecentComplaints(complaints.slice(0, 5));
      }
      
      // Fetch attendance for today
      const attendanceRes = await attendanceService.getAttendance();
      if (attendanceRes.success) {
        const today = new Date().toISOString().split('T')[0];
        const todayAttendance = attendanceRes.data?.filter(a => a.date === today && a.status === 'present').length || 0;
        setStats(prev => ({ ...prev, todayAttendance }));
      }
      
      // Fetch fees
      const feesRes = await feeService.getFees({ limit: 100 }); // Added limit
      if (feesRes.success) {
        const fees = feesRes.data || [];
        const feesCollected = fees.filter(f => f.status === 'paid').reduce((sum, f) => sum + (f.amount || 0), 0);
        const totalFees = fees.reduce((sum, f) => sum + (f.amount || 0), 0);
        const collectionRate = totalFees > 0 ? Math.round((feesCollected / totalFees) * 100) : 0;
        setStats(prev => ({ ...prev, feesCollected, collectionRate }));
      }
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Total Students', value: stats.totalStudents, icon: Users, color: '#3b82f6', bg: '#eff6ff' },
    { label: 'Rooms Occupied', value: `${stats.occupiedRooms}/${stats.totalRooms}`, icon: Building2, color: '#22c55e', bg: '#d1fae5' },
    { label: 'Fees Collected', value: `₹${(stats.feesCollected / 1000).toFixed(0)}k`, icon: DollarSign, color: '#8b5cf6', bg: '#ede9fe' },
    { label: 'Pending Complaints', value: stats.pendingComplaints, icon: AlertCircle, color: '#ef4444', bg: '#fee2e2' },
  ];

  const quickStats = [
    { label: "Today's Attendance", value: stats.todayAttendance, icon: Calendar, color: '#3b82f6' },
    { label: 'Active Notices', value: stats.activeNotices, icon: Bell, color: '#8b5cf6' },
    { label: 'Collection Rate', value: `${stats.collectionRate}%`, icon: TrendingUp, color: '#22c55e' },
    { label: 'Occupancy Rate', value: stats.totalRooms > 0 ? `${Math.round((stats.occupiedRooms / stats.totalRooms) * 100)}%` : '0%', icon: Building2, color: '#eab308' },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <div>Loading dashboard data...</div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <h1 className="page-title">Dashboard</h1>
      <p className="page-subtitle">Welcome back, {user?.name}! Here's what's happening in your hostel today.</p>

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
                  <div className="activity-item-title">{c.title}</div>
                  <div className="activity-item-meta">Student ID: {c.student_id}</div>
                </div>
                <span className={`complaint-status status-${c.status}`}>{c.status}</span>
              </div>
            ))
          )}
        </div>

        <div className="activity-list">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ margin: 0 }}>Quick Overview</h3>
            <Clock size={14} color="var(--text-muted)" />
          </div>
          <div className="activity-item">
            <div className="activity-item-content">
              <div className="activity-item-title">Total Students</div>
              <div className="activity-item-meta">registered</div>
            </div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)' }}>{stats.totalStudents}</div>
          </div>
          <div className="activity-item">
            <div className="activity-item-content">
              <div className="activity-item-title">Available Rooms</div>
              <div className="activity-item-meta">beds open</div>
            </div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)' }}>{stats.totalRooms - stats.occupiedRooms}</div>
          </div>
          <div className="activity-item">
            <div className="activity-item-content">
              <div className="activity-item-title">Pending Fees</div>
              <div className="activity-item-meta">total due</div>
            </div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)' }}>₹{(stats.feesCollected > 0 ? (stats.feesCollected / stats.collectionRate * (100 - stats.collectionRate) / 100) : 0).toFixed(0)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}