import { useState, useEffect } from 'react';
import { roomService, userService } from '../../services/api';
import { Search, Users, Bed, Plus, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function AdminRooms() {
  const [rooms, setRooms] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    // Fetch rooms
    const roomsRes = await roomService.getRooms({ limit: 100 });
    if (roomsRes.success) {
      setRooms(roomsRes.data || []);
    }
    
    // Fetch students for assignment
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
      fetchData(); // Refresh data
      setShowAssignModal(false);
      setSelectedRoom(null);
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
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
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
                    fontWeight: '500',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#2563eb'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#3b82f6'}
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
                        onClick={() => toast.info('Select a room first')}
                        style={{
                          padding: '4px 12px',
                          borderRadius: '6px',
                          border: '1px solid #3b82f6',
                          background: 'white',
                          color: '#3b82f6',
                          cursor: 'pointer',
                          fontSize: '12px'
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

      {/* Assign Modal */}
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
          <div style={{
            background: 'white',
            borderRadius: '12px',
            maxWidth: '500px',
            width: '100%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #e2e8f0' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#0f172a' }}>Assign Student</h3>
                <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>Room {selectedRoom.room_number} (Capacity: {selectedRoom.capacity})</p>
              </div>
              <button onClick={() => setShowAssignModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            
            <div style={{ padding: '20px 24px' }}>
              <p style={{ fontSize: '14px', fontWeight: '500', marginBottom: '12px', color: '#0f172a' }}>Select Student:</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {unassignedStudents.map((student) => (
                  <button
                    key={student.id}
                    onClick={() => handleAssignStudent(selectedRoom.id, student.id)}
                    style={{
                      padding: '12px 16px',
                      textAlign: 'left',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#eff6ff';
                      e.currentTarget.style.borderColor = '#3b82f6';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#f8fafc';
                      e.currentTarget.style.borderColor = '#e2e8f0';
                    }}
                  >
                    <div style={{ fontWeight: '500', color: '#0f172a' }}>{student.name}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>Roll: {student.roll_number || 'N/A'} • {student.email}</div>
                  </button>
                ))}
                {unassignedStudents.length === 0 && (
                  <p style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>No unassigned students available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}