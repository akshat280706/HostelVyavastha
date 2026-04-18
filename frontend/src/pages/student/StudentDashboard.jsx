import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Calendar, DollarSign, AlertCircle, CheckCircle } from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const stats = [
    { label: 'Attendance', value: '94%', icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Fee Status', value: 'Partial', icon: DollarSign, color: 'text-yellow-500', bg: 'bg-yellow-50' },
    { label: 'Due Amount', value: '₹20,000', icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50' },
    { label: 'Room', value: user?.roomNumber, icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50' },
  ];

  const recentActivity = [
    { title: 'Attendance marked for today', date: 'Today, 09:00 AM', status: 'present' },
    { title: 'Fee payment reminder', date: 'Yesterday', status: 'pending' },
    { title: 'New notice: Hostel Maintenance', date: 'Apr 12, 2026', status: 'read' },
    { title: 'Complaint resolved: AC not working', date: 'Apr 10, 2026', status: 'resolved' },
  ];

  const upcomingEvents = [
    { title: 'Mess Committee Meeting', date: 'Apr 20, 2026', time: '6:00 PM' },
    { title: 'Room Inspection', date: 'Apr 25, 2026', time: '10:00 AM' },
    { title: 'Fee Payment Deadline', date: 'Apr 30, 2026', time: '11:59 PM' },
  ];

  const actions = [
    { label: 'View Attendance', path: '/student/attendance' },
    { label: 'Pay Fees', path: '/student/fees' },
    { label: 'Submit Complaint', path: '/student/complaints' },
    { label: 'View Notices', path: '/student/notices' },
  ];

  const statusColor = (status) => {
    if (status === 'present' || status === 'resolved') return 'var(--status-green)';
    if (status === 'pending') return 'var(--status-yellow)';
    return 'var(--text-tertiary)';
  };

  return (
    <div>
      {/* Stats */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {stats.map((stat, idx) => (
          <div key={idx} className="stat-card">
            <div className={`p-2 rounded-lg ${stat.bg} inline-block mb-3`}>
              <stat.icon size={20} className={stat.color} />
            </div>
            <div className="stat-card-label">{stat.label}</div>
            <div className="stat-card-value">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Activity + Events */}
      <div className="two-column-grid">
        <div className="activity-list">
          <h3>Recent Activity</h3>
          {recentActivity.map((activity, idx) => (
            <div key={idx} className="activity-item">
              <div className="activity-item-content">
                <div className="activity-item-title">{activity.title}</div>
                <div className="activity-item-meta">{activity.date}</div>
              </div>
              <div
                className="activity-item-time"
                style={{ color: statusColor(activity.status) }}
              >
                {activity.status}
              </div>
            </div>
          ))}
        </div>

        <div className="activity-list">
          <h3>Upcoming Events</h3>
          {upcomingEvents.map((event, idx) => (
            <div key={idx} className="activity-item">
              <div className="activity-item-content">
                <div className="activity-item-title">{event.title}</div>
                <div className="activity-item-meta">{event.time}</div>
              </div>
              <div className="activity-item-time">{event.date}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="activity-list" style={{ marginTop: '24px' }}>
        <h3>Quick Actions</h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '12px',
            marginTop: '12px',
          }}
        >
          {actions.map((action) => (
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