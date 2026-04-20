import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { attendanceService } from '../../services/api';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

export default function MyAttendance() {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [stats, setStats] = useState({ total: 0, present: 0, absent: 0, late: 0, rate: 0 });
  const [selectedMonth, setSelectedMonth] = useState('');
  const [loading, setLoading] = useState(true);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    const currentDate = new Date();
    const defaultMonth = months[currentDate.getMonth()];
    setSelectedMonth(defaultMonth);
  }, []);

  useEffect(() => {
    if (selectedMonth && user?.id) {
      fetchAttendance();
    }
  }, [selectedMonth, user]);

  const fetchAttendance = async () => {
    setLoading(true);
    
    // Get current year
    const year = new Date().getFullYear();
    const monthIndex = months.indexOf(selectedMonth) + 1;
    
    const response = await attendanceService.getAttendance({
      month: monthIndex,
      year: year
    });
    
    if (response.success) {
      setAttendance(response.data || []);
      setStats(response.stats || { total: 0, present: 0, absent: 0, late: 0, rate: 0 });
    }
    
    setLoading(false);
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'present': return <CheckCircle size={14} style={{ color: '#22c55e' }} />;
      case 'late': return <Clock size={14} style={{ color: '#eab308' }} />;
      default: return <XCircle size={14} style={{ color: '#ef4444' }} />;
    }
  };

  const getStatusText = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <div>Loading attendance records...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-card-label">Total Days</div>
          <div className="stat-card-value">{stats.total}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Present</div>
          <div className="stat-card-value" style={{ color: '#22c55e' }}>{stats.present}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Absent</div>
          <div className="stat-card-value" style={{ color: '#ef4444' }}>{stats.absent}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Attendance Rate</div>
          <div className="stat-card-value" style={{ color: '#3b82f6' }}>{stats.rate}%</div>
        </div>
      </div>

      <div className="attendance-container">
        <div className="attendance-header">
          <h3 style={{ marginBottom: 0 }}>Attendance Records</h3>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="form-input"
            style={{ width: 'auto', padding: '6px 12px' }}
          >
            {months.map(month => (
              <option key={month} value={month}>{month} {new Date().getFullYear()}</option>
            ))}
          </select>
        </div>
        
        {attendance.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-tertiary)' }}>
            No attendance records found for this month
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Check In Time</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map((record, idx) => (
                  <tr key={idx}>
                    <td>{new Date(record.date).toLocaleDateString()}</td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '13px' }}>
                        {getStatusIcon(record.status)} {getStatusText(record.status)}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{record.check_in_time || '—'}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{record.remarks || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}