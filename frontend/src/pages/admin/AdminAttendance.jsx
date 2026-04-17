import { useState, useEffect } from 'react';
import { studentsData } from '../../data/studentsData';
import { attendanceRecords } from '../../data/attendanceData';
import { Search, CheckCircle, XCircle, Download } from 'lucide-react';

export default function AdminAttendance() {
  const [students, setStudents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const todayRecords = attendanceRecords.filter(r => r.date === selectedDate);
    const studentsWithAttendance = studentsData.map(student => {
      const record = todayRecords.find(r => r.studentId === student.id);
      return { ...student, status: record?.status || 'absent', checkIn: record?.checkIn };
    });
    setStudents(studentsWithAttendance);
  }, [selectedDate]);

  const filteredStudents = students.filter(student => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch && (filter === 'all' || student.status === filter);
  });

  const toggleAttendance = (studentId, newStatus) => {
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, status: newStatus } : s));
  };

  const stats = {
    present: students.filter(s => s.status === 'present').length,
    absent: students.filter(s => s.status === 'absent').length,
    total: students.length,
    percentage: students.length > 0
      ? Math.round((students.filter(s => s.status === 'present').length / students.length) * 100)
      : 0,
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <h1 className="page-title" style={{ margin: 0 }}>Attendance</h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="form-input"
            style={{ width: 'auto', padding: '6px 12px' }}
          />
          <button className="btn-submit" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px' }}>
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-card-label">Total Students</div>
          <div className="stat-card-value">{stats.total}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Present</div>
          <div className="stat-card-value" style={{ color: 'var(--status-green)' }}>{stats.present}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Absent</div>
          <div className="stat-card-value" style={{ color: 'var(--status-red)' }}>{stats.absent}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Attendance Rate</div>
          <div className="stat-card-value" style={{ color: 'var(--accent-blue)' }}>{stats.percentage}%</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, position: 'relative', minWidth: '200px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
          <input
            type="text"
            placeholder="Search by name or roll number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '40px' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['all', 'present', 'absent'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              style={{
                padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '500',
                cursor: 'pointer', border: '1px solid', textTransform: 'capitalize', transition: 'all 0.15s ease',
                background: filter === s ? 'var(--accent-blue)' : 'white',
                color: filter === s ? 'white' : 'var(--text-secondary)',
                borderColor: filter === s ? 'var(--accent-blue)' : 'var(--border-medium)',
              }}
            >
              {s} ({s === 'all' ? stats.total : s === 'present' ? stats.present : stats.absent})
            </button>
          ))}
        </div>
      </div>

      <div className="attendance-container">
        <div style={{ overflowX: 'auto' }}>
          <table className="attendance-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Roll Number</th>
                <th>Room</th>
                <th>Status</th>
                <th>Check In</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td><div className="student-name">{student.name}</div></td>
                  <td>{student.rollNumber}</td>
                  <td>{student.roomNumber || 'Not Assigned'}</td>
                  <td>
                    {student.status === 'present' ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--status-green)', fontSize: '13px' }}>
                        <CheckCircle size={14} /> Present
                      </span>
                    ) : (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--status-red)', fontSize: '13px' }}>
                        <XCircle size={14} /> Absent
                      </span>
                    )}
                  </td>
                  <td>{student.checkIn || '—'}</td>
                  <td>
                    <div className="status-buttons">
                      <button
                        onClick={() => toggleAttendance(student.id, 'present')}
                        className="btn-status btn-present"
                        style={{ opacity: student.status === 'present' ? 1 : 0.45 }}
                      >
                        Present
                      </button>
                      <button
                        onClick={() => toggleAttendance(student.id, 'absent')}
                        className="btn-status btn-absent"
                        style={{ opacity: student.status === 'absent' ? 1 : 0.45 }}
                      >
                        Absent
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
