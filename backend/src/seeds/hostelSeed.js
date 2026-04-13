const supabase = require('../config/supabase');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
  console.log('Starting database seeding...');
  
  try {
    // 1. Create Rooms
    console.log('Creating rooms...');
    const rooms = [];
    for (let i = 1; i <= 50; i++) {
      const capacity = [2, 3, 4][Math.floor(Math.random() * 3)];
      rooms.push({
        room_number: `${String.fromCharCode(65 + Math.floor((i-1)/10))}-${i}`,
        floor: Math.ceil(i / 10),
        wing: String.fromCharCode(65 + Math.floor((i-1)/10)),
        capacity: capacity,
        current_occupancy: Math.floor(Math.random() * capacity),
        type: Math.random() > 0.7 ? 'AC' : 'Non-AC',
        price: Math.random() > 0.7 ? 6000 : 4000,
        is_available: Math.random() > 0.2,
        amenities: ['Bed', 'Table', 'Chair', 'Fan'].slice(0, Math.floor(Math.random() * 4) + 1)
      });
    }
    
    const { error: roomError } = await supabase.from('rooms').insert(rooms);
    if (roomError) throw roomError;
    console.log(`Created ${rooms.length} rooms`);
    
    // 2. Create Users (Admin, Warden, Students)
    console.log('Creating users...');
    
    // Create admin user in Supabase Auth
    const { data: adminAuth, error: adminAuthError } = await supabase.auth.admin.createUser({
      email: 'admin@hostel.com',
      password: 'Admin123!',
      email_confirm: true,
      user_metadata: { name: 'System Admin', role: 'admin' }
    });
    
    if (adminAuthError) throw adminAuthError;
    
    // Create admin profile
    await supabase.from('profiles').insert([{
      id: adminAuth.user.id,
      name: 'System Admin',
      email: 'admin@hostel.com',
      phone: '9999999999',
      hostel: 'Admin Office',
      role: 'admin'
    }]);
    
    // Create warden
    const { data: wardenAuth } = await supabase.auth.admin.createUser({
      email: 'warden@hostel.com',
      password: 'Warden123!',
      email_confirm: true,
      user_metadata: { name: 'John Warden', role: 'warden' }
    });
    
    await supabase.from('profiles').insert([{
      id: wardenAuth.user.id,
      name: 'John Warden',
      email: 'warden@hostel.com',
      phone: '9888888888',
      hostel: 'Boys Hostel A',
      role: 'warden'
    }]);
    
    // Create 50 students
    const students = [];
    const firstNames = ['Raj', 'Priya', 'Amit', 'Neha', 'Vikram', 'Pooja', 'Rahul', 'Anjali'];
    const lastNames = ['Sharma', 'Verma', 'Gupta', 'Singh', 'Kumar'];
    const hostels = ['Boys Hostel A', 'Boys Hostel B', 'Girls Hostel C'];
    
    for (let i = 1; i <= 50; i++) {
      const name = `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`;
      const email = `student${i}@hostel.com`;
      const room = rooms[Math.floor(Math.random() * rooms.length)];
      
      const { data: studentAuth } = await supabase.auth.admin.createUser({
        email,
        password: 'Student123!',
        email_confirm: true,
        user_metadata: { name, role: 'student' }
      });
      
      await supabase.from('profiles').insert([{
        id: studentAuth.user.id,
        name,
        email,
        phone: `98765${40000 + i}`,
        roll_number: `2024CS${String(i).padStart(3, '0')}`,
        room_number: room.room_number,
        hostel: hostels[i % hostels.length],
        role: 'student'
      }]);
      
      students.push(studentAuth.user);
    }
    
    console.log(`Created users: 1 Admin, 1 Warden, ${students.length} Students`);
    
    // 3. Create Complaints
    console.log('Creating complaints...');
    const complaints = [];
    const complaintTypes = ['Plumbing', 'Electrical', 'Furniture', 'Cleaning', 'Food', 'Internet'];
    const statuses = ['pending', 'in-progress', 'resolved'];
    
    for (let i = 1; i <= 100; i++) {
      const student = students[Math.floor(Math.random() * students.length)];
      complaints.push({
        student_id: student.id,
        title: `${complaintTypes[i % complaintTypes.length]} Issue`,
        description: `Detailed description of complaint ${i}. Need immediate attention.`,
        type: complaintTypes[i % complaintTypes.length],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
        created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
      });
    }
    
    const { error: complaintError } = await supabase.from('complaints').insert(complaints);
    if (complaintError) throw complaintError;
    console.log(`Created ${complaints.length} complaints`);
    
    // 4. Create Notices
    console.log('📢 Creating notices...');
    const notices = [];
    const noticeTitles = ['Hostel Meeting', 'Maintenance Work', 'Festival Celebration', 'Exam Schedule', 'Fee Deadline'];
    
    for (let i = 1; i <= 20; i++) {
      notices.push({
        title: `${noticeTitles[i % noticeTitles.length]} - ${i}`,
        content: `This is notice number ${i} about ${noticeTitles[i % noticeTitles.length]}. All students must follow the guidelines.`,
        category: ['general', 'event', 'maintenance'][Math.floor(Math.random() * 3)],
        is_important: Math.random() > 0.8,
        author_id: adminAuth.user.id,
        created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
      });
    }
    
    const { error: noticeError } = await supabase.from('notices').insert(notices);
    if (noticeError) throw noticeError;
    console.log(`Created ${notices.length} notices`);
    
    console.log('\n ---------- SEEDING COMPLETED ----------');
    console.log('Summary:');
    console.log(`   • Rooms: ${rooms.length}`);
    console.log(`   • Users: ${students.length + 2}`);
    console.log(`   • Complaints: ${complaints.length}`);
    console.log(`   • Notices: ${notices.length}`);
    console.log('\n Login Credentials:');
    console.log('   Admin: admin@hostel.com / Admin123!');
    console.log('   Warden: warden@hostel.com / Warden123!');
    console.log('   Student: student1@hostel.com / Student123!');
    console.log('----------------------------------------\n');
    
  } catch (error) {
    console.error('Seeding error:', error);
  }
};

seedDatabase();