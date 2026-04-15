import { useAuth } from '../../contexts/AuthContext';
import { Users, Bed, Wifi, Droplet, Thermometer, Shield } from 'lucide-react';

export default function MyRoom() {
  const { user } = useAuth();
  
  const roomDetails = {
    number: user?.roomNumber,
    floor: 'A',
    block: 'A Block',
    sharing: 'Triple Sharing',
    currentOccupants: ['Rajesh Kumar (You)', 'Amit Patel', 'Rahul Mehta'],
    facilities: ['Bed', 'Study Table', 'Wardrobe', 'Fan', 'Light', 'Wi-Fi'],
    amenities: ['24/7 Water Supply', 'Power Backup', 'Security', 'Cleaning Service']
  };
  
  const maintenanceRequests = [
    { id: 1, issue: 'AC not cooling', status: 'in-progress', date: 'Apr 05, 2026' },
    { id: 2, issue: 'Light bulb fused', status: 'resolved', date: 'Apr 01, 2026' },
  ];
  
  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 mb-6">
            <h3>Room {roomDetails.number}</h3>
            <p className="text-gray-400 text-sm mb-4">{roomDetails.block}, Floor {roomDetails.floor}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-3 bg-gray-800 rounded-lg">
                <div className="text-xs text-gray-400 mb-1">Room Type</div>
                <div className="text-white font-medium">{roomDetails.sharing}</div>
              </div>
              <div className="p-3 bg-gray-800 rounded-lg">
                <div className="text-xs text-gray-400 mb-1">Occupants</div>
                <div className="text-white font-medium">{roomDetails.currentOccupants.length}/3</div>
              </div>
            </div>
            
            <h4 className="text-sm font-medium text-gray-300 mb-3">Current Occupants</h4>
            <div className="space-y-2 mb-6">
              {roomDetails.currentOccupants.map((occupant, idx) => (
                <div key={idx} className="flex items-center gap-3 p-2 bg-gray-800/50 rounded-lg">
                  <Users size={16} className="text-gray-400" />
                  <span className="text-white text-sm">{occupant}</span>
                </div>
              ))}
            </div>
            
            <h4 className="text-sm font-medium text-gray-300 mb-3">Room Facilities</h4>
            <div className="grid grid-cols-2 gap-2 mb-6">
              {roomDetails.facilities.map((facility, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                  <Bed size={14} className="text-gray-500" />
                  {facility}
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <h3>Maintenance Requests</h3>
            <div className="mt-4 space-y-3">
              {maintenanceRequests.map((request) => (
                <div key={request.id} className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                  <div>
                    <p className="text-white text-sm">{request.issue}</p>
                    <p className="text-xs text-gray-500">{request.date}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    request.status === 'resolved' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {request.status}
                  </span>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors">
              Report Maintenance Issue
            </button>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <h3>Room Amenities</h3>
            <div className="mt-4 space-y-3">
              {roomDetails.amenities.map((amenity, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm text-gray-300">
                  <Shield size={14} className="text-green-400" />
                  {amenity}
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mt-4">
            <h4 className="text-sm font-medium text-yellow-400 mb-2">Room Rules</h4>
            <ul className="text-xs text-gray-300 space-y-1">
              <li>• No visitors after 10 PM</li>
              <li>• Maintain cleanliness</li>
              <li>• Report damages immediately</li>
              <li>• No loud music after 11 PM</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}