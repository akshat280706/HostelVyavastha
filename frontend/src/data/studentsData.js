export const studentsData = [
  { id: 101, name: 'Rajesh Kumar', rollNumber: 'CS2021001', email: 'rajesh@hostel.edu', phone: '9876543210', roomNumber: 'A-101', status: 'active', joinDate: '2021-08-15', course: 'Computer Science', year: '3rd Year' },
  { id: 102, name: 'Amit Patel', rollNumber: 'CS2021002', email: 'amit@hostel.edu', phone: '9876543211', roomNumber: 'A-102', status: 'active', joinDate: '2021-08-15', course: 'Computer Science', year: '3rd Year' },
  { id: 103, name: 'Priya Sharma', rollNumber: 'EC2021001', email: 'priya@hostel.edu', phone: '9876543212', roomNumber: 'A-103', status: 'active', joinDate: '2021-08-15', course: 'Electronics', year: '3rd Year' },
  { id: 104, name: 'Rohan Verma', rollNumber: 'ME2021001', email: 'rohan@hostel.edu', phone: '9876543213', roomNumber: 'B-101', status: 'active', joinDate: '2021-08-15', course: 'Mechanical', year: '3rd Year' },
  { id: 105, name: 'Vikram Singh', rollNumber: 'CS2022001', email: 'vikram@hostel.edu', phone: '9876543214', roomNumber: 'B-102', status: 'active', joinDate: '2022-08-15', course: 'Computer Science', year: '2nd Year' },
  { id: 106, name: 'Anjali Reddy', rollNumber: 'EC2022001', email: 'anjali@hostel.edu', phone: '9876543215', roomNumber: 'B-103', status: 'active', joinDate: '2022-08-15', course: 'Electronics', year: '2nd Year' },
  { id: 107, name: 'Karthik Iyer', rollNumber: 'ME2022001', email: 'karthik@hostel.edu', phone: '9876543216', roomNumber: 'C-101', status: 'active', joinDate: '2022-08-15', course: 'Mechanical', year: '2nd Year' },
  { id: 108, name: 'Neha Gupta', rollNumber: 'CS2023001', email: 'neha@hostel.edu', phone: '9876543217', roomNumber: 'C-102', status: 'active', joinDate: '2023-08-15', course: 'Computer Science', year: '1st Year' },
  { id: 109, name: 'Arjun Nair', rollNumber: 'EC2023001', email: 'arjun@hostel.edu', phone: '9876543218', roomNumber: 'C-103', status: 'active', joinDate: '2023-08-15', course: 'Electronics', year: '1st Year' },
  { id: 110, name: 'Sneha Joshi', rollNumber: 'ME2023001', email: 'sneha@hostel.edu', phone: '9876543219', roomNumber: 'D-101', status: 'active', joinDate: '2023-08-15', course: 'Mechanical', year: '1st Year' },
];
export const searchStudents = (query) => {
  return studentsData.filter(student =>
    student.name.toLowerCase().includes(query.toLowerCase()) ||
    student.rollNumber.toLowerCase().includes(query.toLowerCase())
  );
};
export const getUnassignedStudents = () =>
  studentsData.filter(student => !student.roomNumber);
export const getStudentById = (id) => studentsData.find(student => student.id === id);
export const getStudentsByRoom = (roomNumber) => studentsData.filter(student => student.roomNumber === roomNumber);
export const getActiveStudents = () => studentsData.filter(student => student.status === 'active');