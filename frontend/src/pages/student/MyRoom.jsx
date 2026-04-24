import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { userService } from '../../services/api';
import { Users, Bed, Shield, Home } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function MyRoom() {
  const { user } = useAuth();
  const [roomDetails, setRoomDetails] = useState(null);
  const [roommates, setRoommates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.room_number) {
      fetchRoomDetails();
      fetchRoommates();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchRoomDetails = async () => {
    // Fetch room details from rooms table
    try {
      const response = await fetch(`http://localhost:5000/api/rooms?room_number=${user.room_number}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      if (data.success && data.data.length > 0) {
        setRoomDetails(data.data[0]);
      }
    } catch (error) {
      console.error('Error fetching room details:', error);
    }
  };

  const fetchRoommates = async () => {
    // Fetch all students in the same room
    const response = await userService.getStudents({ limit: 100 });
    if (response.success) {
      const sameRoom = response.data.filter(s => 
        s.room_number === user.room_number && s.id !== user.id
      );
      setRoommates(sameRoom);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <div>Loading room details...</div>
      </div>
    );
  }

  if (!user?.room_number) {
    return (
      <div className="form-card" style={{ textAlign: 'center', padding: '48px' }}>
        <Home size={48} style={{ marginBottom: '16px', color: '#64748b' }} />
        <h3>No Room Assigned</h3>
        <p style={{ color: '#64748b' }}>You haven't been assigned a room yet. Please contact the hostel administration.</p>
      </div>
    );
  }

  const facilities = ['Bed', 'Study Table', 'Wardrobe', 'Fan', 'Light', 'Wi-Fi'];
  const amenities = ['24/7 Water Supply', 'Power Backup', 'Security', 'Cleaning Service'];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
      {/* Main Room Info - spans 2 columns */}
      <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginBottom: '4px' }}>Room {user.room_number}</h3>
          <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '16px' }}>
            {roomDetails?.wing || 'A'} Block, Floor {roomDetails?.floor || 1}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
            <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '12px 16px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>Room Type</div>
              <div style={{ fontWeight: '500', color: '#0f172a' }}>{roomDetails?.type || 'Standard'} Sharing</div>
            </div>
            <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '12px 16px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>Total Occupants</div>
              <div style={{ fontWeight: '500', color: '#0f172a' }}>{roommates.length + 1} / {roomDetails?.capacity || 3}</div>
            </div>
          </div>

          <h4 style={{ fontSize: '13px', fontWeight: '500', color: '#64748b', marginBottom: '10px' }}>Roommates</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f8fafc', borderRadius: '8px', padding: '10px 14px', border: '1px solid #e2e8f0' }}>
              <Users size={15} style={{ color: '#64748b' }} />
              <span style={{ fontSize: '14px', color: '#0f172a' }}>{user.name} (You)</span>
            </div>
            {roommates.map((mate, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f8fafc', borderRadius: '8px', padding: '10px 14px', border: '1px solid #e2e8f0' }}>
                <Users size={15} style={{ color: '#64748b' }} />
                <span style={{ fontSize: '14px', color: '#0f172a' }}>{mate.name}</span>
              </div>
            ))}
          </div>

          <h4 style={{ fontSize: '13px', fontWeight: '500', color: '#64748b', marginBottom: '10px' }}>Room Facilities</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {facilities.map((facility, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#64748b' }}>
                <Bed size={13} style={{ color: '#94a3b8' }} />
                {facility}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Amenities & Rules - spans 1 column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginBottom: '12px' }}>Room Amenities</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {amenities.map((amenity, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#64748b' }}>
                <Shield size={13} style={{ color: '#22c55e' }} />
                {amenity}
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: '#fffbeb', borderRadius: '12px', border: '1px solid #fcd34d', padding: '20px' }}>
          <h4 style={{ fontSize: '13px', fontWeight: '600', color: '#92400e', marginBottom: '10px' }}>Room Rules</h4>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '6px', margin: 0, paddingLeft: '16px' }}>
            <li style={{ fontSize: '12px', color: '#78350f' }}>No visitors after 10 PM</li>
            <li style={{ fontSize: '12px', color: '#78350f' }}>Maintain cleanliness</li>
            <li style={{ fontSize: '12px', color: '#78350f' }}>Report damages immediately</li>
            <li style={{ fontSize: '12px', color: '#78350f' }}>No loud music after 11 PM</li>
          </ul>
        </div>
      </div>
    </div>
  );
}