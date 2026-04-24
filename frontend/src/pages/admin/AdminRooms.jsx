import { useState, useEffect } from 'react';
import { roomService, userService } from '../../services/api';
import { Search, Plus, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function AdminRooms() {
  const [rooms, setRooms] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedStudentForRoom, setSelectedStudentForRoom] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showAssignRoomModal, setShowAssignRoomModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    const roomsRes = await roomService.getRooms({ limit: 100 });
    if (roomsRes.success) {
      setRooms(roomsRes.data || []);
    }
    
    const studentsRes = await userService.getStudents({ limit: 100 });
    if (studentsRes.success) {
      setStudents(studentsRes.data || []);
    }
    
    setLoading(false);
  };

  const handleAssignStudent = async (roomId, studentId) => {
    const response = await roomService.assignStudent(roomId, studentId);
    if (response.success) {
      toast.success('Student assigned successfully');
      fetchData();
      setShowAssignModal(false);
      setShowAssignRoomModal(false);
      setSelectedRoom(null);
      setSelectedStudentForRoom(null);
    } else {
      toast.error(response.message || 'Failed to assign student');
    }
  };

  const filteredRooms = rooms.filter(room =>
    room.room_number?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const unassignedStudents = students.filter(s => !s.room_number);

  const getRoomStatus = (room) => {
    if (room.current_occupancy >= room.capacity) return 'full';
    if (room.current_occupancy > 0) return 'partial';
    return 'available';
  };

  const getStatusStyle = (status) => {
    switch(status) {
      case 'full':
        return { background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5' };
      case 'partial':
        return { background: '#fef3c7', color: '#92400e', border: '1px solid #fcd34d' };
      default:
        return { background: '#d1fae5', color: '#065f46', border: '1px solid #6ee7b7' };
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <div>Loading rooms data...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 className="page-title" style={{ margin: 0 }}>Room Management</h1>
        <button 
          className="btn-submit" 
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 18px' }}
          onClick={() => toast.info('Add room feature coming soon')}
        >
          <Plus size={16} /> Add Room
        </button>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: '24px', maxWidth: '400px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search rooms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '40px' }}
          />
        </div>
      </div>

      {/* Rooms Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {filteredRooms.map((room) => {
          const status = getRoomStatus(room);
          const statusStyle = getStatusStyle(status);
          
          return (
            <div 
              key={room.id} 
              style={{ 
                background: 'white', 
                borderRadius: '12px', 
                border: '1px solid #e2e8f0',
                padding: '20px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#0f172a', marginBottom: '4px' }}>
                    Room {room.room_number}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#64748b' }}>Floor {room.floor} • {room.wing} Wing</p>
                </div>
                <span style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '20px', fontWeight: '500', ...statusStyle }}>
                  {status === 'full' ? 'Full' : status === 'partial' ? 'Partially Filled' : 'Available'}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', padding: '12px 0', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
                <div>
                  <p style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>Capacity</p>
                  <p style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a' }}>{room.capacity}</p>
                </div>
                <div>
                  <p style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>Occupancy</p>
                  <p style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a' }}>{room.current_occupancy || 0}/{room.capacity}</p>
                </div>
                <div>
                  <p style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>Type</p>
                  <p style={{ fontSize: '14px', fontWeight: '500', color: '#0f172a' }}>{room.type || 'Standard'}</p>
                </div>
              </div>

              {status !== 'full' && (
                <button
                  onClick={() => {
                    setSelectedRoom(room);
                    setShowAssignModal(true);
                  }}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  Allocate Student
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Unassigned Students Section */}
      <div style={{ marginTop: '32px' }}>
        <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600', color: '#0f172a' }}>
          Unassigned Students ({unassignedStudents.length})
        </h3>
        <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left' }}>Name</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left' }}>Roll Number</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left' }}>Email</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {unassignedStudents.map((student) => (
                  <tr key={student.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '12px 16px', fontWeight: '500' }}>{student.name}</td>
                    <td style={{ padding: '12px 16px', color: '#64748b' }}>{student.roll_number || '—'}</td>
                    <td style={{ padding: '12px 16px', color: '#64748b' }}>{student.email}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <button
                        onClick={() => {
                          setSelectedStudentForRoom(student);
                          setShowAssignRoomModal(true);
                        }}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '6px',
                          border: 'none',
                          background: '#22c55e',
                          color: 'white',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}
                      >
                        Assign to Room
                      </button>
                    </td>
                  </tr>
                ))}
                {unassignedStudents.length === 0 && (
                  <tr>
                    <td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                      No unassigned students
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal: Assign Student to Room (from room card) */}
      {showAssignModal && selectedRoom && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          padding: '16px'
        }}>
          <div style={{ background: 'white', borderRadius: '12px', maxWidth: '500px', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #e2e8f0' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '600' }}>Assign Student to Room</h3>
                <p style={{ fontSize: '13px', color: '#64748b' }}>Room {selectedRoom.room_number} (Capacity: {selectedRoom.capacity - selectedRoom.current_occupancy} seats left)</p>
              </div>
              <button onClick={() => setShowAssignModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }}>✕</button>
            </div>
            <div style={{ padding: '20px 24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Select Student</label>
              <select
                id="studentSelect"
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
              >
                <option value="">-- Select a student --</option>
                {unassignedStudents.map(student => (
                  <option key={student.id} value={student.id}>
                    {student.name} ({student.email})
                  </option>
                ))}
              </select>
            </div>
            <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowAssignModal(false)} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer' }}>Cancel</button>
              <button
                onClick={() => {
                  const studentId = document.getElementById('studentSelect').value;
                  if (!studentId) {
                    toast.error('Please select a student');
                    return;
                  }
                  handleAssignStudent(selectedRoom.id, studentId);
                }}
                style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#3b82f6', color: 'white', cursor: 'pointer' }}
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Assign Student to Room (from unassigned students table) */}
      {showAssignRoomModal && selectedStudentForRoom && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          padding: '16px'
        }}>
          <div style={{ background: 'white', borderRadius: '12px', maxWidth: '500px', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #e2e8f0' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '600' }}>Assign Student to Room</h3>
                <p style={{ fontSize: '13px', color: '#64748b' }}>Student: {selectedStudentForRoom.name}</p>
              </div>
              <button onClick={() => setShowAssignRoomModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }}>✕</button>
            </div>
            <div style={{ padding: '20px 24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Select Room</label>
              <select
                id="roomSelect"
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
              >
                <option value="">-- Select a room --</option>
                {rooms.filter(room => room.current_occupancy < room.capacity).map(room => (
                  <option key={room.id} value={room.id}>
                    Room {room.room_number} - {room.capacity - room.current_occupancy} seats available
                  </option>
                ))}
              </select>
            </div>
            <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowAssignRoomModal(false)} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer' }}>Cancel</button>
              <button
                onClick={() => {
                  const roomId = document.getElementById('roomSelect').value;
                  if (!roomId) {
                    toast.error('Please select a room');
                    return;
                  }
                  handleAssignStudent(roomId, selectedStudentForRoom.id);
                }}
                style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#3b82f6', color: 'white', cursor: 'pointer' }}
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}