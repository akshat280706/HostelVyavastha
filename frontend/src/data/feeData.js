export const feeData = [
  { id: 1, studentId: 101, name: 'Rajesh Kumar', rollNumber: '2021001', roomNumber: 'A-101', accommodationFee: 25000, messFee: 15000, total: 40000, paid: 40000, due: 0, status: 'paid', lastPayment: '2026-01-15' },
  { id: 2, studentId: 102, name: 'Amit Patel', rollNumber: '2021002', roomNumber: 'A-101', accommodationFee: 25000, messFee: 15000, total: 40000, paid: 20000, due: 20000, status: 'partial', lastPayment: '2026-02-20' },
  { id: 3, studentId: 103, name: 'Priya Sharma', rollNumber: '2021003', roomNumber: 'A-103', accommodationFee: 25000, messFee: 15000, total: 40000, paid: 0, due: 40000, status: 'due', lastPayment: null },
  { id: 4, studentId: 104, name: 'Sneha Reddy', rollNumber: '2021004', roomNumber: 'B-101', accommodationFee: 25000, messFee: 15000, total: 40000, paid: 40000, due: 0, status: 'paid', lastPayment: '2026-01-10' },
  { id: 5, studentId: 105, name: 'Vikram Singh', rollNumber: '2021005', roomNumber: 'B-101', accommodationFee: 25000, messFee: 15000, total: 40000, paid: 25000, due: 15000, status: 'partial', lastPayment: '2026-03-05' },
  { id: 6, studentId: 106, name: 'Ananya Desai', rollNumber: '2021006', roomNumber: 'B-101', accommodationFee: 25000, messFee: 15000, total: 40000, paid: 40000, due: 0, status: 'paid', lastPayment: '2026-01-18' },
  { id: 7, studentId: 107, name: 'Rahul Mehta', rollNumber: '2021007', roomNumber: 'B-103', accommodationFee: 25000, messFee: 15000, total: 40000, paid: 10000, due: 30000, status: 'partial', lastPayment: '2026-02-10' },
  { id: 8, studentId: 108, name: 'Neha Gupta', rollNumber: '2021008', roomNumber: 'C-101', accommodationFee: 25000, messFee: 15000, total: 40000, paid: 40000, due: 0, status: 'paid', lastPayment: '2026-01-22' },
  { id: 9, studentId: 109, name: 'Kunal Verma', rollNumber: '2021009', roomNumber: 'C-101', accommodationFee: 25000, messFee: 15000, total: 40000, paid: 0, due: 40000, status: 'due', lastPayment: null },
  { id: 10, studentId: 110, name: 'Divya Sharma', rollNumber: '2021010', roomNumber: 'C-103', accommodationFee: 25000, messFee: 15000, total: 40000, paid: 30000, due: 10000, status: 'partial', lastPayment: '2026-03-15' },
  { id: 11, studentId: 111, name: 'Arjun Reddy', rollNumber: '2021011', roomNumber: 'D-101', accommodationFee: 25000, messFee: 15000, total: 40000, paid: 40000, due: 0, status: 'paid', lastPayment: '2026-01-25' },
  { id: 12, studentId: 112, name: 'Pooja Singh', rollNumber: '2021012', roomNumber: 'D-101', accommodationFee: 25000, messFee: 15000, total: 40000, paid: 20000, due: 20000, status: 'partial', lastPayment: '2026-02-28' },
];

export const getFeeByStudentId = (studentId) => feeData.find(fee => fee.studentId === studentId);
export const getFeesByStatus = (status) => feeData.filter(fee => fee.status === status);