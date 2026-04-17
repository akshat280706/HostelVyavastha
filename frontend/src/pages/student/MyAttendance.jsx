import { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

export default function MyAttendance() {
  const [selectedMonth, setSelectedMonth] = useState('April 2026');

  const attendanceData = [
    { date: 'Apr 01, 2026', status: 'present', subject: 'Regular Day' },
    { date: 'Apr 02, 2026', status: 'present', subject: 'Regular Day' },
    { date: 'Apr 03, 2026', status: 'absent', subject: 'Medical Leave' },
    { date: 'Apr 04, 2026', status: 'present', subject: 'Weekend' },
    { date: 'Apr 05, 2026', status: 'present', subject: 'Weekend' },
    { date: 'Apr 06, 2026', status: 'present', subject: 'Regular Day' },
    { date: 'Apr 07, 2026', status: 'present', subject: 'Regular Day' },
    { date: 'Apr 08, 2026', status: 'present', subject: 'Regular Day' },
    { date: 'Apr 09, 2026', status: 'absent', subject: 'Late Night' },
    { date: 'Apr 10, 2026', status: 'present', subject: 'Regular Day' },
  ];

  const presentCount = attendanceData.filter(a => a.status === 'present').length;
  const totalDays = attendanceData.length;
  const percentage = Math.round((presentCount / totalDays) * 100);

  return (
    <div>
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-card-label">Total Days</div>
          <div className="stat-card-value">{totalDays}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Present</div>
          <div className="stat-card-value" style={{ color: 'var(--status-green)' }}>{presentCount}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Attendance Rate</div>
          <div className="stat-card-value" style={{ color: 'var(--accent-blue)' }}>{percentage}%</div>
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
            <option>April 2026</option>
            <option>March 2026</option>
            <option>February 2026</option>
          </select>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="attendance-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Status</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((record, idx) => (
                <tr key={idx}>
                  <td>{record.date}</td>
                  <td>
                    {record.status === 'present' ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--status-green)', fontSize: '13px' }}>
                        <CheckCircle size={14} /> Present
                      </span>
                    ) : (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--status-red)', fontSize: '13px' }}>
                        <XCircle size={14} /> Absent
                      </span>
                    )}
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>{record.subject}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
