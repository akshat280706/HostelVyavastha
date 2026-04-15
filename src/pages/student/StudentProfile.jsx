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
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Profile Card */}
      <div className="lg:col-span-1">
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 text-center">
          <div className="w-24 h-24 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <User size={48} className="text-blue-400" />
          </div>
          <h2 className="text-xl font-semibold text-white">{user?.name}</h2>
          <p className="text-gray-400 text-sm mb-2">{user?.rollNumber}</p>
          <span className="inline-block px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-xs">
            Active Student
          </span>
        </div>
      </div>
      
      {/* Profile Details */}
      <div className="lg:col-span-2">
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profileFields.map((field, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-gray-800 rounded-lg">
                <field.icon size={18} className="text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">{field.label}</p>
                  <p className="text-white text-sm">{field.value || 'Not provided'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}