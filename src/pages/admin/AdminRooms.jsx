import { useState } from 'react';

export default function AdminRooms() {
  // 🔹 Mock Data (safe fallback)
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

  // ✅ SAFE: define first
  const getUnassignedStudents = () =>
    mockStudents.filter((s) => !s.roomNumber);

  const searchStudents = (query) =>
    mockStudents.filter((s) =>
      s.name.toLowerCase().includes(query.toLowerCase())
    );

  // ✅ SAFE VARIABLES (no crash possible)
  const unassignedStudents = getUnassignedStudents() || [];

  const searchedStudents =
    studentSearch.trim() !== ''
      ? searchStudents(studentSearch) || []
      : unassignedStudents;

  return (
    <div>
      <h1 className="page-title">Room Management</h1>

      {/* 🔍 Search */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search students..."
          value={studentSearch}
          onChange={(e) => setStudentSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            background: '#0f172a',
            border: '1px solid #1f2937',
            color: 'white',
            borderRadius: '6px',
          }}
        />
      </div>

      {/* 🧑 Students */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <h3>Unassigned Students</h3>

        {searchedStudents.length === 0 ? (
          <p style={{ color: '#9ca3af' }}>No students found</p>
        ) : (
          searchedStudents.map((s) => (
            <div
              key={s.id}
              className="activity-feed-item"
            >
              <div className="activity-feed-item-title">
                {s.name}
              </div>
              <div className="activity-feed-item-status">
                {s.roomNumber || 'No Room'}
              </div>
            </div>
          ))
        )}
      </div>

      {/* 🏠 Rooms */}
      <div className="card">
        <h3>Rooms</h3>

        {mockRooms.length === 0 ? (
          <p style={{ color: '#9ca3af' }}>No rooms available</p>
        ) : (
          mockRooms.map((room) => (
            <div
              key={room.id}
              className="activity-feed-item"
            >
              <div className="activity-feed-item-title">
                Room {room.number}
              </div>
              <div className="activity-feed-item-status">
                {room.status}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}