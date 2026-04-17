import { useState } from 'react';
import { X, UserPlus, AlertCircle } from 'lucide-react';
import StudentSearchBar from './StudentSearchBar';

export default function AllocationModal({ room, students, onClose, onAllocate }) {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [error, setError] = useState('');
  
  const handleAllocate = () => {
    if (!selectedStudent) {
      setError('Please select a student');
      return;
    }
    
    if (selectedStudent.roomNumber) {
      setError('Student is already assigned to a room');
      return;
    }
    
    if (room.occupants.length >= room.capacity) {
      setError('Room is already at full capacity');
      return;
    }
    
    onAllocate(room.id, selectedStudent);
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl w-full max-w-md border border-gray-700 shadow-xl">
        <div className="flex justify-between items-center p-5 border-b border-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-white">Allocate Room</h2>
            <p className="text-sm text-gray-400 mt-1">Room {room.number} (Capacity: {room.capacity})</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-5">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Select Student
            </label>
            <StudentSearchBar
              students={students}
              onSelectStudent={setSelectedStudent}
              selectedStudent={selectedStudent}
            />
          </div>
          
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 p-3 rounded-lg mb-4">
              <AlertCircle size={16} />
              {error}
            </div>
          )}
          
          {room.occupants.length > 0 && (
            <div className="mb-4 p-3 bg-gray-800 rounded-lg">
              <p className="text-xs text-gray-400 mb-2">Current Occupants ({room.occupants.length}/{room.capacity}):</p>
              <div className="space-y-1">
                {room.occupants.map((occupant, idx) => (
                  <p key={idx} className="text-sm text-gray-300">{occupant}</p>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex gap-3 p-5 border-t border-gray-700">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAllocate}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors flex items-center justify-center gap-2"
          >
            <UserPlus size={18} />
            Allocate
          </button>
        </div>
      </div>
    </div>
  );
}