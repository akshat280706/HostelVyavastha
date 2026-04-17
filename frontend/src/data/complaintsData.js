export const complaintsData = [
  { id: 1, studentId: 101, studentName: 'Rajesh Kumar', roomNumber: 'A-101', issue: 'AC not working', description: 'AC has been making noise and not cooling properly', date: '2026-04-05', priority: 'high', status: 'pending', assignedTo: null },
  { id: 2, studentId: 103, studentName: 'Priya Sharma', roomNumber: 'A-103', issue: 'Water leakage', description: 'Water leaking from bathroom ceiling', date: '2026-04-03', priority: 'medium', status: 'in-progress', assignedTo: 'Maintenance Team' },
  { id: 3, studentId: 105, studentName: 'Vikram Singh', roomNumber: 'B-101', issue: 'Broken window', description: 'Window glass cracked', date: '2026-04-01', priority: 'low', status: 'resolved', assignedTo: 'Maintenance Team' },
  { id: 4, studentId: 108, studentName: 'Neha Gupta', roomNumber: 'C-101', issue: 'Electricity issue', description: 'Frequent power cuts in the room', date: '2026-03-30', priority: 'high', status: 'pending', assignedTo: null },
];

export const getComplaintsByStudentId = (studentId) => complaintsData.filter(complaint => complaint.studentId === studentId);
export const getComplaintsByStatus = (status) => complaintsData.filter(complaint => complaint.status === status);