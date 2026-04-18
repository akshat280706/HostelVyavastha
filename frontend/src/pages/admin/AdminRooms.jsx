import { useState } from 'react';

export default function AdminRooms() {
  const mockStudents = [
    { id: 1, name: 'Rajesh', roomNumber: 'A-101' },
    { id: 2, name: 'Priya', roomNumber: null },
    { id: 3, name: 'Amit', roomNumber: null },
    { id: 4, name: 'Neha', roomNumber: 'A-102' },
  ];

  const mockRooms = [
    { id: 1, number: 'A-101', status: 'full' },
    { id: 2, number: 'A-102', status: 'partial' },
    { id: 3, number: 'A-103', status: 'available' },
  ];

  const [studentSearch, setStudentSearch] = useState('');

  const unassignedStudents = mockStudents.filter(s => !s.roomNumber);
  const searchedStudents = studentSearch.trim()
    ? mockStudents.filter(s => s.name.toLowerCase().includes(studentSearch.toLowerCase()))
    : unassignedStudents;

  const roomStatusStyle = (status) => {
    switch (status) {
      case 'full': return { background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5' };
      case 'partial': return { background: '#fef3c7', color: '#92400e', border: '1px solid #fcd34d' };
      default: return { background: '#d1fae5', color: '#065f46', border: '1px solid #6ee7b7' };
    }
  };

  return (
    <div>
      <h1 className="page-title">Room Management</h1>

      <div className="form-card" style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search students..."
          value={studentSearch}
          onChange={(e) => setStudentSearch(e.target.value)}
          className="form-input"
        />
      </div>

      <div className="two-column-grid">
        <div className="activity-list">
          <h3>Unassigned Students</h3>
          {searchedStudents.length === 0 ? (
            <p style={{ color: 'var(--text-tertiary)', fontSize: '14px' }}>No students found</p>
          ) : (
            searchedStudents.map((s) => (
              <div key={s.id} className="activity-item">
                <div className="activity-item-title">{s.name}</div>
                <span style={{ fontSize: '12px', padding: '2px 8px', borderRadius: '4px', background: s.roomNumber ? '#d1fae5' : '#f1f5f9', color: s.roomNumber ? '#065f46' : 'var(--text-tertiary)', border: '1px solid', borderColor: s.roomNumber ? '#6ee7b7' : 'var(--border-light)' }}>
                  {s.roomNumber || 'No Room'}
                </span>
              </div>
            ))
          )}
        </div>

        <div className="activity-list">
          <h3>Rooms</h3>
          {mockRooms.map((room) => (
            <div key={room.id} className="activity-item">
              <div className="activity-item-title">Room {room.number}</div>
              <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '4px', fontWeight: '500', textTransform: 'capitalize', ...roomStatusStyle(room.status) }}>
                {room.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
