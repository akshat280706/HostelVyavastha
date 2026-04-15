import { useAuth } from '../../contexts/AuthContext';
import { Calendar, DollarSign, Bell, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();
  
  // Sample student-specific data
  const stats = [
    { label: 'Attendance', value: '94%', icon: Calendar, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Fee Status', value: 'Partial', icon: DollarSign, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { label: 'Due Amount', value: '₹20,000', icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/10' },
    { label: 'Room', value: user?.roomNumber, icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10' },
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
  
  return (
    <div>
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
      
      <div className="two-column-grid">
        <div className="activity-list">
          <h3>Recent Activity</h3>
          {recentActivity.map((activity, idx) => (
            <div key={idx} className="activity-item">
              <div className="activity-item-content">
                <div className="activity-item-title">{activity.title}</div>
                <div className="activity-item-meta">{activity.date}</div>
              </div>
              <div className={`activity-item-time ${
                activity.status === 'present' ? 'text-green-400' :
                activity.status === 'pending' ? 'text-yellow-400' : 'text-gray-400'
              }`}>
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
      
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
        <h3>Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          <button className="p-3 bg-gray-800 rounded-lg text-sm hover:bg-gray-700 transition-colors">
            View Attendance
          </button>
          <button className="p-3 bg-gray-800 rounded-lg text-sm hover:bg-gray-700 transition-colors">
            Pay Fees
          </button>
          <button className="p-3 bg-gray-800 rounded-lg text-sm hover:bg-gray-700 transition-colors">
            Submit Complaint
          </button>
          <button className="p-3 bg-gray-800 rounded-lg text-sm hover:bg-gray-700 transition-colors">
            View Notices
          </button>
        </div>
      </div>
    </div>
  );
}