import { useState } from 'react';
import { Search, User, Hash } from 'lucide-react';

export default function StudentSearchBar({ students, onSelectStudent, selectedStudent }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search by name or roll number..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
        />
      </div>
      
      {isOpen && searchTerm && (
        <div className="absolute z-10 w-full mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-64 overflow-y-auto">
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student) => (
              <button
                key={student.id}
                onClick={() => {
                  onSelectStudent(student);
                  setSearchTerm('');
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-3 hover:bg-gray-700 transition-colors border-b border-gray-700 last:border-0"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">{student.name}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Hash size={10} />
                        {student.rollNumber}
                      </span>
                      {student.roomNumber && (
                        <span className="text-xs text-gray-500">Room: {student.roomNumber}</span>
                      )}
                    </div>
                  </div>
                  {!student.roomNumber && (
                    <span className="text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded">Unassigned</span>
                  )}
                </div>
              </button>
            ))
          ) : (
            <div className="px-4 py-3 text-gray-400 text-sm">No students found</div>
          )}
        </div>
      )}
      
      {selectedStudent && (
        <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">{selectedStudent.name}</p>
              <p className="text-xs text-gray-400">Roll: {selectedStudent.rollNumber}</p>
            </div>
            <button
              onClick={() => onSelectStudent(null)}
              className="text-xs text-gray-400 hover:text-white"
            >
              Change
            </button>
          </div>
        </div>
      )}
    </div>
  );
}