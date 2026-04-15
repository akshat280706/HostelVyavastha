import { useState, useEffect } from 'react';
import { studentsData } from '../../data/studentsData';
import { attendanceRecords } from '../../data/attendanceData';
import { Search, Calendar, CheckCircle, XCircle, Download } from 'lucide-react';

export default function AdminAttendance() {
  const [students, setStudents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  
  useEffect(() => {
    // Load students with today's attendance status
    const todayRecords = attendanceRecords.filter(r => r.date === selectedDate);
    const studentsWithAttendance = studentsData.map(student => {
      const record = todayRecords.find(r => r.studentId === student.id);
      return {
        ...student,
        status: record?.status || 'absent',
        checkIn: record?.checkIn,
        checkOut: record?.checkOut
      };
    });
    setStudents(studentsWithAttendance);
  }, [selectedDate]);
  
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || student.status === filter;
    return matchesSearch && matchesFilter;
  });
  
  const toggleAttendance = (studentId, newStatus) => {
    setStudents(prev => prev.map(student =>
      student.id === studentId ? { ...student, status: newStatus } : student
    ));
  };
  
  const stats = {
    present: filteredStudents.filter(s => s.status === 'present').length,
    absent: filteredStudents.filter(s => s.status === 'absent').length,
    total: filteredStudents.length,
    percentage: Math.round((filteredStudents.filter(s => s.status === 'present').length / filteredStudents.length) * 100) || 0
  };
  
  return (
    <div>
      {/* Header with Date Picker */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-white">Mark Attendance</h2>
          <p className="text-gray-400 text-sm">Track daily student attendance</p>
        </div>
        <div className="flex gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm"
          />
          <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm flex items-center gap-2">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>
      
      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <p className="text-xs text-gray-400">Total Students</p>
          <p className="text-2xl font-bold text-white">{stats.total}</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <p className="text-xs text-gray-400">Present</p>
          <p className="text-2xl font-bold text-green-400">{stats.present}</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <p className="text-xs text-gray-400">Absent</p>
          <p className="text-2xl font-bold text-red-400">{stats.absent}</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <p className="text-xs text-gray-400">Attendance Rate</p>
          <p className="text-2xl font-bold text-blue-400">{stats.percentage}%</p>
        </div>
      </div>
      
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by name or roll number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'present', 'absent'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {status} ({status === 'all' ? stats.total : status === 'present' ? stats.present : stats.absent})
            </button>
          ))}
        </div>
      </div>
      
      {/* Attendance Table */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-800/50">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Student Name</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Roll Number</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Room</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Check In</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id} className="border-b border-gray-800 hover:bg-gray-800/30">
                  <td className="py-3 px-4">
                    <p className="text-white font-medium">{student.name}</p>
                  </td>
                  <td className="py-3 px-4 text-gray-300 text-sm">{student.rollNumber}</td>
                  <td className="py-3 px-4 text-gray-300 text-sm">{student.roomNumber || 'Not Assigned'}</td>
                  <td className="py-3 px-4">
                    {student.status === 'present' ? (
                      <span className="inline-flex items-center gap-1 text-green-400 text-sm">
                        <CheckCircle size={14} /> Present
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red-400 text-sm">
                        <XCircle size={14} /> Absent
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-gray-300 text-sm">{student.checkIn || '—'}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleAttendance(student.id, 'present')}
                        className={`px-3 py-1 rounded text-xs transition-colors ${
                          student.status === 'present'
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-green-600/50'
                        }`}
                      >
                        Present
                      </button>
                      <button
                        onClick={() => toggleAttendance(student.id, 'absent')}
                        className={`px-3 py-1 rounded text-xs transition-colors ${
                          student.status === 'absent'
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-red-600/50'
                        }`}
                      >
                        Absent
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}