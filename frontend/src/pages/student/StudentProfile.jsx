import { useAuth } from '../../contexts/AuthContext';
import { User, Mail, Phone, Home, Calendar, Hash, Users } from 'lucide-react';
import { getRoomById } from '../../data/roomsData';

export default function StudentProfile() {
  const { user } = useAuth();
  const room = getRoomById(user?.roomId);

  const profileFields = [
    { icon: User, label: 'Full Name', value: user?.name },
    { icon: Hash, label: 'Roll Number', value: user?.rollNumber },
    { icon: Mail, label: 'Email Address', value: user?.email },
    { icon: Phone, label: 'Phone Number', value: user?.phone },
    { icon: Phone, label: 'Parent/Guardian', value: user?.parentPhone },
    { icon: Home, label: 'Room Number', value: user?.roomNumber || 'Not Assigned' },
    { icon: Users, label: 'Room Type', value: room ? `${room.capacity} Sharing` : 'N/A' },
    { icon: Calendar, label: 'Joining Date', value: user?.joiningDate },
  ];

  const cardStyle = { background: 'white', borderRadius: '12px', border: '1px solid var(--border-light)', padding: '24px', boxShadow: 'var(--shadow-sm)' };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
      <div style={{ ...cardStyle, textAlign: 'center' }}>
        <div style={{ width: '96px', height: '96px', background: '#eff6ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <User size={48} style={{ color: 'var(--accent-blue)' }} />
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>{user?.name}</h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>{user?.rollNumber}</p>
        <span style={{ display: 'inline-block', padding: '4px 12px', background: '#d1fae5', color: '#065f46', borderRadius: '20px', fontSize: '12px', fontWeight: '500', border: '1px solid #6ee7b7' }}>
          Active Student
        </span>
      </div>

      <div style={cardStyle}>
        <h3 style={{ marginBottom: '16px' }}>Personal Information</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {profileFields.map((field, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px 14px', background: 'var(--bg-surface-hover)', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
              <field.icon size={17} style={{ color: 'var(--text-tertiary)', marginTop: '2px', flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginBottom: '2px' }}>{field.label}</p>
                <p style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)' }}>{field.value || 'Not provided'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
