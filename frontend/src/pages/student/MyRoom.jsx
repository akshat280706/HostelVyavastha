import { useAuth } from '../../contexts/AuthContext';
import { Users, Bed, Shield } from 'lucide-react';

export default function MyRoom() {
  const { user } = useAuth();

  const roomDetails = {
    number: user?.roomNumber,
    floor: 'A',
    block: 'A Block',
    sharing: 'Triple Sharing',
    currentOccupants: ['Rajesh Kumar (You)', 'Amit Patel', 'Rahul Mehta'],
    facilities: ['Bed', 'Study Table', 'Wardrobe', 'Fan', 'Light', 'Wi-Fi'],
    amenities: ['24/7 Water Supply', 'Power Backup', 'Security', 'Cleaning Service'],
  };

  const maintenanceRequests = [
    { id: 1, issue: 'AC not cooling', status: 'in-progress', date: 'Apr 05, 2026' },
    { id: 2, issue: 'Light bulb fused', status: 'resolved', date: 'Apr 01, 2026' },
  ];

  const requestStatusStyle = (status) =>
    status === 'resolved'
      ? { background: '#d1fae5', color: '#065f46', border: '1px solid #6ee7b7' }
      : { background: '#fef3c7', color: '#92400e', border: '1px solid #fcd34d' };

  const cardStyle = { background: 'white', borderRadius: '12px', border: '1px solid var(--border-light)', padding: '20px', boxShadow: 'var(--shadow-sm)' };
  const subItemStyle = { background: 'var(--bg-surface-hover)', borderRadius: '8px', padding: '10px 14px', border: '1px solid var(--border-light)' };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
      <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={cardStyle}>
          <h3>Room {roomDetails.number}</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '16px' }}>{roomDetails.block}, Floor {roomDetails.floor}</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
            <div style={subItemStyle}>
              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginBottom: '4px' }}>Room Type</div>
              <div style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{roomDetails.sharing}</div>
            </div>
            <div style={subItemStyle}>
              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginBottom: '4px' }}>Occupants</div>
              <div style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{roomDetails.currentOccupants.length}/3</div>
            </div>
          </div>

          <h4 style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '10px' }}>Current Occupants</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
            {roomDetails.currentOccupants.map((occupant, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', ...subItemStyle }}>
                <Users size={15} style={{ color: 'var(--text-tertiary)' }} />
                <span style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{occupant}</span>
              </div>
            ))}
          </div>

          <h4 style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '10px' }}>Room Facilities</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {roomDetails.facilities.map((facility, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <Bed size={13} style={{ color: 'var(--text-tertiary)' }} />
                {facility}
              </div>
            ))}
          </div>
        </div>

        <div style={cardStyle}>
          <h3>Maintenance Requests</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
            {maintenanceRequests.map((request) => (
              <div key={request.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', ...subItemStyle }}>
                <div>
                  <p style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: '500' }}>{request.issue}</p>
                  <p style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>{request.date}</p>
                </div>
                <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '4px', fontWeight: '500', textTransform: 'capitalize', ...requestStatusStyle(request.status) }}>
                  {request.status}
                </span>
              </div>
            ))}
          </div>
          <button className="btn-submit full-width" style={{ marginTop: '16px', padding: '10px' }}>
            Report Maintenance Issue
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={cardStyle}>
          <h3>Room Amenities</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
            {roomDetails.amenities.map((amenity, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <Shield size={13} style={{ color: 'var(--status-green)' }} />
                {amenity}
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: '#fffbeb', borderRadius: '12px', border: '1px solid #fcd34d', padding: '16px' }}>
          <h4 style={{ fontSize: '13px', fontWeight: '600', color: '#92400e', marginBottom: '10px' }}>Room Rules</h4>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {['No visitors after 10 PM', 'Maintain cleanliness', 'Report damages immediately', 'No loud music after 11 PM'].map((rule, idx) => (
              <li key={idx} style={{ fontSize: '12px', color: '#78350f', listStyle: 'none' }}>• {rule}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
