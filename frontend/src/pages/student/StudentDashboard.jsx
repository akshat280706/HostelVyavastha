import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { dashboardService, attendanceService, feeService } from '../../services/api';
import { Calendar, DollarSign, AlertCircle, CheckCircle, Users, Home } from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    attendance: { rate: 0, present: 0, total: 0 },
    fees: { total: 0, paid: 0, due: 0 },
    complaints: { total: 0, pending: 0, resolved: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    
    // Fetch attendance for current student
    const attendanceRes = await attendanceService.getAttendance();
    if (attendanceRes.success) {
      setStats(prev => ({
        ...prev,
        attendance: attendanceRes.stats || { rate: 0, present: 0, total: 0 }
      }));
      
      // Create recent activity from attendance
      const recent = attendanceRes.data?.slice(0, 5).map(a => ({
        title: `Attendance marked as ${a.status}`,
        date: new Date(a.date).toLocaleDateString(),
        status: a.status
      })) || [];
      setRecentActivity(recent);
    }
    
    // Fetch fees for current student
    if (user?.id) {
      const feesRes = await feeService.getStudentFeeSummary(user.id);
      if (feesRes.success && feesRes.data) {
        setStats(prev => ({
          ...prev,
          fees: {
            total: feesRes.data.totalFees || 0,
            paid: feesRes.data.paidFees || 0,
            due: feesRes.data.pendingFees || 0
          }
        }));
      }
    }
    
    setLoading(false);
  };

  const statCards = [
    { 
      label: 'Attendance', 
      value: `${stats.attendance.rate}%`, 
      icon: Calendar, 
      color: '#3b82f6',
      bg: '#eff6ff'
    },
    { 
      label: 'Fee Status', 
      value: stats.fees.due > 0 ? 'Pending' : 'Paid', 
      icon: DollarSign, 
      color: stats.fees.due > 0 ? '#eab308' : '#22c55e',
      bg: stats.fees.due > 0 ? '#fef3c7' : '#d1fae5'
    },
    { 
      label: 'Due Amount', 
      value: `₹${stats.fees.due.toLocaleString()}`, 
      icon: AlertCircle, 
      color: stats.fees.due > 0 ? '#ef4444' : '#22c55e',
      bg: stats.fees.due > 0 ? '#fee2e2' : '#d1fae5'
    },
    { 
      label: 'Room', 
      value: user?.room_number || 'Not Assigned', 
      icon: Home, 
      color: '#8b5cf6',
      bg: '#ede9fe'
    },
  ];

  const quickActions = [
    { label: 'View Attendance', path: '/student/attendance' },
    { label: 'Pay Fees', path: '/student/fees' },
    { label: 'Submit Complaint', path: '/student/complaints' },
    { label: 'View Notices', path: '/student/notices' },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <div>Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Welcome Section */}
      <div style={{ marginBottom: '24px' }}>
        <h1 className="page-title">Welcome back, {user?.name}!</h1>
        <p className="page-subtitle">Here's your hostel activity summary</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {statCards.map((stat, idx) => (
          <div key={idx} className="stat-card">
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
              <stat.icon size={18} color={stat.color} />
            </div>
            <div className="stat-card-label">{stat.label}</div>
            <div className="stat-card-value">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="activity-list" style={{ marginTop: '24px' }}>
        <h3>Recent Activity</h3>
        {recentActivity.length === 0 ? (
          <p style={{ color: 'var(--text-tertiary)', textAlign: 'center', padding: '32px' }}>
            No recent activity
          </p>
        ) : (
          recentActivity.map((activity, idx) => (
            <div key={idx} className="activity-item">
              <div className="activity-item-content">
                <div className="activity-item-title">{activity.title}</div>
                <div className="activity-item-meta">{activity.date}</div>
              </div>
              <div
                className="activity-item-time"
                style={{ color: activity.status === 'present' ? '#22c55e' : '#ef4444' }}
              >
                {activity.status}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Quick Actions */}
      <div className="activity-list" style={{ marginTop: '24px' }}>
        <h3>Quick Actions</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginTop: '12px' }}>
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => navigate(action.path)}
              style={{
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid var(--border-light)',
                background: 'var(--bg-surface-hover)',
                color: 'var(--text-secondary)',
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                fontWeight: '500',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.color = 'var(--accent-blue)';
                e.currentTarget.style.borderColor = 'var(--accent-blue)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--bg-surface-hover)';
                e.currentTarget.style.color = 'var(--text-secondary)';
                e.currentTarget.style.borderColor = 'var(--border-light)';
              }}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}