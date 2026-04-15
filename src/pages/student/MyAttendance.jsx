import { useState } from 'react';
import { Calendar, CheckCircle, XCircle } from 'lucide-react';

export default function MyAttendance() {
  const [selectedMonth, setSelectedMonth] = useState('March 2026');
  
  // Sample attendance data for a student
  const attendanceData = [
    { date: 'Apr 01, 2026', status: 'present', subject: 'Regular Day' },
    { date: 'Apr 02, 2026', status: 'present', subject: 'Regular Day' },
    { date: 'Apr 03, 2026', status: 'absent', subject: 'Medical Leave' },
    { date: 'Apr 04, 2026', status: 'present', subject: 'Weekend' },
    { date: 'Apr 05, 2026', status: 'present', subject: 'Weekend' },
    { date: 'Apr 06, 2026', status: 'present', subject: 'Regular Day' },
    { date: 'Apr 07, 2026', status: 'present', subject: 'Regular Day' },
    { date: 'Apr 08, 2026', status: 'present', subject: 'Regular Day' },
    { date: 'Apr 09, 2026', status: 'absent', subject: 'Late Night' },
    { date: 'Apr 10, 2026', status: 'present', subject: 'Regular Day' },
  ];
  
  const presentCount = attendanceData.filter(a => a.status === 'present').length;
  const totalDays = attendanceData.length;
  const percentage = Math.round((presentCount / totalDays) * 100);
  
  return (
    <div>
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="stat-card">
          <div className="stat-card-label">Total Days</div>
          <div className="stat-card-value">{totalDays}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Present</div>
          <div className="stat-card-value text-green-400">{presentCount}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Attendance Rate</div>
          <div className="stat-card-value">{percentage}%</div>
        </div>
      </div>
      
      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <div className="p-5 border-b border-gray-800 flex justify-between items-center">
          <h3>Attendance Records</h3>
          <select className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1 text-sm">
            <option>March 2026</option>
            <option>February 2026</option>
            <option>January 2026</option>
          </select>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Date</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((record, idx) => (
                <tr key={idx} className="border-b border-gray-800 hover:bg-gray-800/50">
                  <td className="py-3 px-4 text-white">{record.date}</td>
                  <td className="py-3 px-4">
                    {record.status === 'present' ? (
                      <span className="inline-flex items-center gap-1 text-green-400">
                        <CheckCircle size={14} /> Present
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red-400">
                        <XCircle size={14} /> Absent
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-gray-400 text-sm">{record.subject}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}