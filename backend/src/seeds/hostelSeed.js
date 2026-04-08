const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Room = require('../models/Room');
const Complaint = require('../models/Complaint');
const Attendance = require('../models/Attendance');
const Notice = require('../models/Notice');
const Fee = require('../models/Fee');

const connectDB = require('../config/db');

const generateDummyData = async () => {
  try {
    await connectDB();
    
    // Check if we should delete existing data
    const shouldDelete = process.argv.includes('--delete');
    
    if (shouldDelete) {
      console.log('🗑️  Clearing existing data...');
      await User.deleteMany();
      await Room.deleteMany();
      await Complaint.deleteMany();
      await Attendance.deleteMany();
      await Notice.deleteMany();
      await Fee.deleteMany();
      console.log('✅ Existing data cleared');
    }
    
    // 1. Create 50 Rooms
    console.log('📦 Creating rooms...');
    const rooms = [];
    for (let i = 1; i <= 50; i++) {
      const capacity = [2, 3, 4][Math.floor(Math.random() * 3)];
      rooms.push({
        roomNumber: `${String.fromCharCode(65 + Math.floor((i-1)/10))}-${i}`,
        floor: Math.ceil(i / 10),
        wing: String.fromCharCode(65 + Math.floor((i-1)/10)),
        capacity: capacity,
        currentOccupancy: Math.floor(Math.random() * (capacity + 1)),
        type: Math.random() > 0.7 ? 'AC' : 'Non-AC',
        price: Math.random() > 0.7 ? 6000 : 4000,
        isAvailable: Math.random() > 0.2,
        amenities: ['Bed', 'Table', 'Chair', 'Fan'].slice(0, Math.floor(Math.random() * 4) + 1)
      });
    }
    const savedRooms = await Room.insertMany(rooms);
    console.log(`✅ ${savedRooms.length} rooms created`);
    
    // 2. Create Users (Admin, Wardens, Students)
    console.log('👥 Creating users...');
    const users = [];
    
    // Create 2 Admins
    for (let i = 1; i <= 2; i++) {
      users.push({
        name: `Admin ${i}`,
        email: `admin${i}@hostel.com`,
        password: await bcrypt.hash('admin123', 10),
        role: 'admin',
        phone: `98765${10000 + i}`,
        hostel: 'Boys Hostel A'
      });
    }
    
    // Create 3 Wardens
    const hostels = ['Boys Hostel A', 'Boys Hostel B', 'Girls Hostel C', 'Girls Hostel D'];
    for (let i = 1; i <= 3; i++) {
      users.push({
        name: `Warden ${i}`,
        email: `warden${i}@hostel.com`,
        password: await bcrypt.hash('warden123', 10),
        role: 'warden',
        phone: `98765${20000 + i}`,
        hostel: hostels[i % hostels.length]
      });
    }
    
    // Create 150 Students
    const firstNames = ['Raj', 'Priya', 'Amit', 'Neha', 'Vikram', 'Pooja', 'Rahul', 'Anjali', 'Suresh', 'Deepa', 'Manish', 'Kavita', 'Rohan', 'Simran', 'Arjun'];
    const lastNames = ['Sharma', 'Verma', 'Gupta', 'Singh', 'Kumar', 'Patel', 'Reddy', 'Joshi', 'Khan', 'Malhotra'];
    
    for (let i = 1; i <= 150; i++) {
      const randomRoom = savedRooms[Math.floor(Math.random() * savedRooms.length)];
      const firstName = firstNames[i % firstNames.length];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const bloodGroups = ['A+', 'B+', 'O+', 'AB+', 'A-', 'B-'];
      
      users.push({
        name: `${firstName} ${lastName}`,
        email: `student${i}@hostel.com`,
        password: await bcrypt.hash('student123', 10),
        role: 'student',
        rollNumber: `2024CS${String(i).padStart(3, '0')}`,
        phone: `98765${30000 + i}`,
        roomNumber: randomRoom.roomNumber,
        hostel: hostels[Math.floor(Math.random() * hostels.length)],
        parentPhone: `99887${40000 + i}`,
        address: `${Math.floor(Math.random() * 100)} ${['Main St', 'Park Ave', 'Lake Rd', 'Hill Dr'][Math.floor(Math.random() * 4)]}, ${['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata'][Math.floor(Math.random() * 5)]}`,
        joiningDate: new Date(2024, Math.floor(Math.random() * 6), Math.floor(Math.random() * 28) + 1),
        feeStatus: ['paid', 'pending', 'partial'][Math.floor(Math.random() * 3)],
        emergencyContact: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
        bloodGroup: bloodGroups[Math.floor(Math.random() * bloodGroups.length)]
      });
    }
    
    const savedUsers = await User.insertMany(users);
    console.log(`✅ ${savedUsers.length} users created`);
    
    // Get student IDs for reference
    const students = savedUsers.filter(u => u.role === 'student');
    
    // 3. Create 200 Complaints
    console.log('📝 Creating complaints...');
    const complaintTypes = ['Plumbing', 'Electrical', 'Furniture', 'Cleaning', 'Food', 'Internet', 'Others'];
    const statuses = ['pending', 'in-progress', 'resolved', 'rejected'];
    const priorities = ['low', 'medium', 'high', 'urgent'];
    
    const complaints = [];
    for (let i = 1; i <= 200; i++) {
      const student = students[Math.floor(Math.random() * students.length)];
      complaints.push({
        studentId: student._id,
        studentName: student.name,
        roomNumber: student.roomNumber,
        title: `${complaintTypes[i % complaintTypes.length]} Issue - ${Math.floor(Math.random() * 100)}`,
        description: `This is a detailed description of the ${complaintTypes[i % complaintTypes.length].toLowerCase()} problem. The issue needs immediate attention.`,
        type: complaintTypes[i % complaintTypes.length],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        images: [],
        createdAt: new Date(2024, Math.floor(Math.random() * 3), Math.floor(Math.random() * 28) + 1),
        resolvedAt: Math.random() > 0.6 ? new Date() : null
      });
    }
    const savedComplaints = await Complaint.insertMany(complaints);
    console.log(`✅ ${savedComplaints.length} complaints created`);
    
    // 4. Create Attendance Records (last 30 days for all students)
    console.log('📊 Creating attendance records...');
    const attendance = [];
    const today = new Date();
    const statusOptions = ['present', 'absent', 'late', 'half-day'];
    const weights = [0.8, 0.1, 0.05, 0.05]; // 80% present, 10% absent, etc.
    
    for (const student of students) {
      for (let day = 0; day < 30; day++) {
        const date = new Date(today);
        date.setDate(today.getDate() - day);
        
        // Skip Sundays (optional)
        if (date.getDay() === 0) continue;
        
        // Weighted random selection
        let status = 'present';
        const rand = Math.random();
        let sum = 0;
        for (let i = 0; i < weights.length; i++) {
          sum += weights[i];
          if (rand < sum) {
            status = statusOptions[i];
            break;
          }
        }
        
        attendance.push({
          studentId: student._id,
          studentName: student.name,
          roomNumber: student.roomNumber,
          date: date,
          status: status,
          checkInTime: status !== 'absent' ? `${Math.floor(Math.random() * 4) + 7}:${Math.floor(Math.random() * 60)}` : null,
          markedBy: savedUsers.find(u => u.role === 'warden')?._id
        });
      }
    }
    
    const savedAttendance = await Attendance.insertMany(attendance);
    console.log(`✅ ${savedAttendance.length} attendance records created`);
    
    // 5. Create 50 Notices
    console.log('📢 Creating notices...');
    const notices = [];
    const noticeTitles = [
      'Hostel Meeting', 'Maintenance Work', 'Festival Celebration', 
      'Exam Schedule', 'Mess Timing Change', 'Security Alert',
      'Room Inspection', 'Fee Payment Deadline', 'Cultural Event'
    ];
    
    for (let i = 1; i <= 50; i++) {
      notices.push({
        title: `${noticeTitles[i % noticeTitles.length]} - ${i}`,
        content: `This is a detailed notice regarding ${noticeTitles[i % noticeTitles.length].toLowerCase()}. All students are requested to follow the guidelines mentioned. For any queries, contact the hostel office.`,
        category: ['general', 'emergency', 'event', 'maintenance', 'academic'][Math.floor(Math.random() * 5)],
        author: savedUsers.find(u => u.role === 'admin' || u.role === 'warden')._id,
        authorName: savedUsers.find(u => u.role === 'admin' || u.role === 'warden').name,
        isImportant: Math.random() > 0.8,
        createdAt: new Date(2024, Math.floor(Math.random() * 3), Math.floor(Math.random() * 28) + 1),
        expiryDate: new Date(2024, 5, 30)
      });
    }
    const savedNotices = await Notice.insertMany(notices);
    console.log(`✅ ${savedNotices.length} notices created`);
    
    // 6. Create Fee Records
    console.log('💰 Creating fee records...');
    const fees = [];
    const months = ['January', 'February', 'March', 'April', 'May', 'June'];
    
    for (const student of students) {
      for (let month of months) {
        const isPaid = Math.random() > 0.3;
        fees.push({
          studentId: student._id,
          studentName: student.name,
          roomNumber: student.roomNumber,
          amount: 5000,
          month: month,
          year: 2024,
          dueDate: new Date(2024, months.indexOf(month), 10),
          paymentDate: isPaid ? new Date(2024, months.indexOf(month), Math.floor(Math.random() * 10) + 1) : null,
          status: isPaid ? 'paid' : (Math.random() > 0.5 ? 'pending' : 'overdue'),
          paymentMethod: isPaid ? ['cash', 'online', 'card'][Math.floor(Math.random() * 3)] : null,
          transactionId: isPaid ? `TXN${Math.random().toString(36).substring(7).toUpperCase()}` : null
        });
      }
    }
    const savedFees = await Fee.insertMany(fees);
    console.log(`✅ ${savedFees.length} fee records created`);
    
    // Final Summary
    console.log('\n🎉 -------- DATABASE SEEDING COMPLETED --------');
    console.log(` Final Statistics:`);
    console.log(`   • Rooms: ${savedRooms.length}`);
    console.log(`   • Users: ${savedUsers.length} (${students.length} students, ${savedUsers.filter(u => u.role === 'warden').length} wardens, ${savedUsers.filter(u => u.role === 'admin').length} admins)`);
    console.log(`   • Complaints: ${savedComplaints.length}`);
    console.log(`   • Attendance Records: ${savedAttendance.length}`);
    console.log(`   • Notices: ${savedNotices.length}`);
    console.log(`   • Fee Records: ${savedFees.length}`);
    console.log('\n🔑 Login Credentials:');
    console.log('   Admin: admin1@hostel.com / admin123');
    console.log('   Warden: warden1@hostel.com / warden123');
    console.log('   Student: student1@hostel.com / student123');
    console.log('--------------------------------\n');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
generateDummyData();