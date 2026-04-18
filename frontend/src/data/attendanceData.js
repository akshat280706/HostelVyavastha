export const attendanceRecords = [
  { id: 1, studentId: 101, name: 'Rajesh Kumar', date: '2026-04-01', status: 'present', checkIn: '08:30 AM', checkOut: '08:30 PM' },
  { id: 2, studentId: 101, name: 'Rajesh Kumar', date: '2026-04-02', status: 'present', checkIn: '08:45 AM', checkOut: '08:30 PM' },
  { id: 3, studentId: 101, name: 'Rajesh Kumar', date: '2026-04-03', status: 'absent', checkIn: null, checkOut: null },
  { id: 4, studentId: 102, name: 'Amit Patel', date: '2026-04-01', status: 'present', checkIn: '09:00 AM', checkOut: '08:30 PM' },
  { id: 5, studentId: 102, name: 'Amit Patel', date: '2026-04-02', status: 'absent', checkIn: null, checkOut: null },
  { id: 6, studentId: 103, name: 'Priya Sharma', date: '2026-04-01', status: 'present', checkIn: '08:15 AM', checkOut: '08:30 PM' },
];

export const getAttendanceByStudentId = (studentId) => attendanceRecords.filter(record => record.studentId === studentId);
export const getAttendanceByDate = (date) => attendanceRecords.filter(record => record.date === date);