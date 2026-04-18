import { Users, Wrench, CheckCircle, AlertCircle } from 'lucide-react';

export default function RoomCard({ room, onAllocate }) {
  const occupancyPercentage = (room.occupants.length / room.capacity) * 100;
  
  const getStatusColor = () => {
    if (room.status === 'available') return 'border-green-500/30 bg-green-500/5';
    if (room.status === 'partial') return 'border-yellow-500/30 bg-yellow-500/5';
    return 'border-red-500/30 bg-red-500/5';
  };
  
  const getStatusBadge = () => {
    if (room.status === 'available') return { text: 'Available', color: 'text-green-400 bg-green-500/10' };
    if (room.status === 'partial') return { text: 'Partially Filled', color: 'text-yellow-400 bg-yellow-500/10' };
    return { text: 'Full', color: 'text-red-400 bg-red-500/10' };
  };
  
  const statusBadge = getStatusBadge();
  
  return (
    <div className={`rounded-xl border p-5 transition-all hover:shadow-md ${getStatusColor()}`}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold text-white">Room {room.number}</h3>
          <p className="text-sm text-gray-400">Floor {room.floor}</p>
        </div>
        <span className={`px-2 py-1 rounded-md text-xs font-medium ${statusBadge.color}`}>
          {statusBadge.text}
        </span>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Capacity</span>
          <span className="text-white font-medium">{room.capacity} students</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Occupancy</span>
          <span className="text-white font-medium">{room.occupants.length}/{room.capacity}</span>
        </div>
      </div>
      
      <div className="w-full bg-gray-700 rounded-full h-1.5 mb-4">
        <div 
          className={`h-1.5 rounded-full transition-all ${
            room.status === 'available' ? 'bg-green-500' : 
            room.status === 'partial' ? 'bg-yellow-500' : 'bg-red-500'
          }`}
          style={{ width: `${occupancyPercentage}%` }}
        />
      </div>
      
      {room.occupants.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-gray-400 mb-2">Current Occupants:</p>
          <div className="space-y-1">
            {room.occupants.slice(0, 2).map((occupant, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                <Users size={12} />
                <span>{occupant}</span>
              </div>
            ))}
            {room.occupants.length > 2 && (
              <p className="text-xs text-gray-500">+{room.occupants.length - 2} more</p>
            )}
          </div>
        </div>
      )}
      
      {room.status !== 'full' && (
        <button
          onClick={() => onAllocate(room)}
          className="w-full mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
        >
          Allocate Student
        </button>
      )}
      
      {room.status === 'full' && (
        <button
          disabled
          className="w-full mt-2 px-4 py-2 bg-gray-700 rounded-lg text-sm font-medium cursor-not-allowed opacity-50"
        >
          Room Full
        </button>
      )}
    </div>
  );
}