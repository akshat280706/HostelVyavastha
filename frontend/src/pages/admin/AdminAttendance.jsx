import { useState, useEffect } from 'react';
import { userService, attendanceService } from '../../services/api';
import { Search, CheckCircle, XCircle, Download } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function AdminAttendance() {
  const [students, setStudents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch students from backend
  useEffect(() => {
    fetchStudents();
  }, []);

  // Fetch attendance for selected date
  useEffect(() => {
    if (students.length > 0) {
      fetchAttendanceForDate();
    }
  }, [selectedDate, students]);

  const fetchStudents = async () => {
    setLoading(true);
    const response = await userService.getStudents({ limit: 100 }); // Get all students
    if (response.success) {
      const studentsList = response.data || [];
      // Initialize with absent status
      const studentsWithStatus = studentsList.map(student => ({
        ...student,
        status: 'absent',
        checkIn: null,
        attendanceId: null
      }));
      setStudents(studentsWithStatus);
    } else {
      toast.error('Failed to load students');
    }
    setLoading(false);
  };

  const fetchAttendanceForDate = async () => {
    const response = await attendanceService.getAttendance({
      startDate: selectedDate,
      endDate: selectedDate
    });
    
    if (response.success && response.data) {
      // Update students with attendance data
      setStudents(prev => prev.map(student => {
        const attendance = response.data.find(a => a.student_id === student.id);
        if (attendance) {
          return {
            ...student,
            status: attendance.status,
            checkIn: attendance.check_in_time,
            attendanceId: attendance.id
          };
        }
        return student;
      }));
    }
  };

  const markAttendance = async (studentId, status) => {
    setSubmitting(true);
    const response = await attendanceService.markAttendance({
      studentId,
      status,
      checkInTime: status === 'present' ? new Date().toLocaleTimeString() : null
    });
    
    if (response.success) {
      toast.success(`Attendance marked as ${status}`);
      // Update local state
      setStudents(prev => prev.map(student => 
        student.id === studentId 
          ? { ...student, status, checkIn: status === 'present' ? new Date().toLocaleTimeString() : null }
          : student
      ));
    } else {
      toast.error(response.message || 'Failed to mark attendance');
    }
    setSubmitting(false);
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch =
      student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.roll_number?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch && (filter === 'all' || student.status === filter);
  });

  const stats = {
    present: students.filter(s => s.status === 'present').length,
    absent: students.filter(s => s.status === 'absent').length,
    total: students.length,
    percentage: students.length > 0
      ? Math.round((students.filter(s => s.status === 'present').length / students.length) * 100)
      : 0,
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <div>Loading students...</div>
      </div>
    );
  }

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
          <button 
            className="btn-submit" 
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px' }}
            onClick={() => {
              // Export functionality
              const csv = students.map(s => `${s.name},${s.roll_number},${s.room_number},${s.status}`).join('\n');
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `attendance_${selectedDate}.csv`;
              a.click();
              URL.revokeObjectURL(url);
              toast.success('Export started');
            }}
          >
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
          <div className="stat-card-value" style={{ color: '#22c55e' }}>{stats.present}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Absent</div>
          <div className="stat-card-value" style={{ color: '#ef4444' }}>{stats.absent}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Attendance Rate</div>
          <div className="stat-card-value" style={{ color: '#3b82f6' }}>{stats.percentage}%</div>
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
                background: filter === s ? '#3b82f6' : 'white',
                color: filter === s ? 'white' : '#64748b',
                borderColor: filter === s ? '#3b82f6' : '#e2e8f0',
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
                  <td>{student.roll_number || '—'}</td>
                  <td>{student.room_number || 'Not Assigned'}</td>
                  <td>
                    {student.status === 'present' ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#22c55e', fontSize: '13px' }}>
                        <CheckCircle size={14} /> Present
                      </span>
                    ) : (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#ef4444', fontSize: '13px' }}>
                        <XCircle size={14} /> Absent
                      </span>
                    )}
                  </td>
                  <td>{student.checkIn || '—'}</td>
                  <td>
                    <div className="status-buttons">
                      <button
                        onClick={() => markAttendance(student.id, 'present')}
                        disabled={submitting}
                        className="btn-status btn-present"
                        style={{ 
                          opacity: student.status === 'present' ? 1 : 0.45,
                          padding: '4px 12px',
                          borderRadius: '6px',
                          border: 'none',
                          cursor: 'pointer',
                          background: '#22c55e',
                          color: 'white',
                          marginRight: '4px'
                        }}
                      >
                        Present
                      </button>
                      <button
                        onClick={() => markAttendance(student.id, 'absent')}
                        disabled={submitting}
                        className="btn-status btn-absent"
                        style={{ 
                          opacity: student.status === 'absent' ? 1 : 0.45,
                          padding: '4px 12px',
                          borderRadius: '6px',
                          border: 'none',
                          cursor: 'pointer',
                          background: '#ef4444',
                          color: 'white'
                        }}
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