// Load environment variables FIRST
require('dotenv').config({ path: __dirname + '/../.env' });

// Import required modules
const bcrypt = require('bcryptjs');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ ERROR: SUPABASE_URL and SUPABASE_SERVICE_KEY must be set in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

console.log('✅ Connected to Supabase\n');

// ============================================
// SAMPLE DATA
// ============================================

// Users/Profiles
const profiles = [
  {
    name: 'Admin User',
    email: 'admin@hostel.edu',
    password: 'admin123',
    phone: '9876543210',
    role: 'admin',
    hostel: 'Main Hostel'
  },
  {
    name: 'John Warden',
    email: 'warden@hostel.edu',
    password: 'warden123',
    phone: '9876543211',
    role: 'warden',
    hostel: 'Boys Hostel'
  },
  {
    name: 'Rajesh Kumar',
    email: 'rajesh@university.edu',
    password: 'student123',
    phone: '9876543212',
    role: 'student',
    hostel: 'Boys Hostel',
    roll_number: '2021001',
    room_number: 'A-101',
    parent_phone: '9876543200',
    joining_date: '2024-06-15'
  },
  {
    name: 'Priya Sharma',
    email: 'priya@university.edu',
    password: 'student123',
    phone: '9876543213',
    role: 'student',
    hostel: 'Girls Hostel',
    roll_number: '2021002',
    room_number: 'B-201',
    parent_phone: '9876543201',
    joining_date: '2024-06-16'
  },
  {
    name: 'Amit Patel',
    email: 'amit@university.edu',
    password: 'student123',
    phone: '9876543214',
    role: 'student',
    hostel: 'Boys Hostel',
    roll_number: '2021003',
    room_number: 'A-102',
    parent_phone: '9876543202',
    joining_date: '2024-06-17'
  },
  {
    name: 'Neha Singh',
    email: 'neha@university.edu',
    password: 'student123',
    phone: '9876543215',
    role: 'student',
    hostel: 'Girls Hostel',
    roll_number: '2021004',
    room_number: 'B-202',
    parent_phone: '9876543203',
    joining_date: '2024-06-18'
  },
  {
    name: 'Rahul Mehta',
    email: 'rahul@university.edu',
    password: 'student123',
    phone: '9876543216',
    role: 'student',
    hostel: 'Boys Hostel',
    roll_number: '2021005',
    room_number: 'A-101',
    parent_phone: '9876543204',
    joining_date: '2024-06-19'
  }
];

// Rooms
const rooms = [
  {
    room_number: 'A-101',
    floor: 1,
    wing: 'A',
    capacity: 3,
    current_occupancy: 2,
    type: 'AC',
    price: 15000,
    is_available: true,
    amenities: ['Bed', 'Study Table', 'Wardrobe', 'AC', 'Wi-Fi']
  },
  {
    room_number: 'A-102',
    floor: 1,
    wing: 'A',
    capacity: 2,
    current_occupancy: 1,
    type: 'Non-AC',
    price: 10000,
    is_available: true,
    amenities: ['Bed', 'Study Table', 'Wardrobe', 'Fan']
  },
  {
    room_number: 'A-103',
    floor: 1,
    wing: 'A',
    capacity: 3,
    current_occupancy: 0,
    type: 'AC',
    price: 15000,
    is_available: true,
    amenities: ['Bed', 'Study Table', 'Wardrobe', 'AC', 'Wi-Fi']
  },
  {
    room_number: 'B-201',
    floor: 2,
    wing: 'B',
    capacity: 2,
    current_occupancy: 1,
    type: 'Non-AC',
    price: 10000,
    is_available: true,
    amenities: ['Bed', 'Study Table', 'Wardrobe', 'Fan']
  },
  {
    room_number: 'B-202',
    floor: 2,
    wing: 'B',
    capacity: 3,
    current_occupancy: 1,
    type: 'AC',
    price: 15000,
    is_available: true,
    amenities: ['Bed', 'Study Table', 'Wardrobe', 'AC', 'Wi-Fi']
  },
  {
    room_number: 'C-301',
    floor: 3,
    wing: 'C',
    capacity: 4,
    current_occupancy: 0,
    type: 'AC',
    price: 18000,
    is_available: true,
    amenities: ['Bed', 'Study Table', 'Wardrobe', 'AC', 'Wi-Fi', 'Attached Bathroom']
  }
];

// Complaints
const complaints = [
  {
    title: 'AC not working',
    description: 'The AC in room A-101 is not cooling properly since 2 days',
    type: 'Electrical',
    priority: 'high',
    status: 'in-progress'
  },
  {
    title: 'Water leakage',
    description: 'Water leakage from ceiling in bathroom',
    type: 'Plumbing',
    priority: 'urgent',
    status: 'pending'
  },
  {
    title: 'Broken chair',
    description: 'Study chair is broken and needs replacement',
    type: 'Furniture',
    priority: 'low',
    status: 'resolved'
  },
  {
    title: 'Wi-Fi issue',
    description: 'Internet connection is very slow in room B-202',
    type: 'Internet',
    priority: 'medium',
    status: 'pending'
  }
];

// Fees Records
const feesData = [
  {
    amount: 15000,
    month: 'April',
    year: 2026,
    due_date: '2026-04-30',
    status: 'paid',
    payment_date: '2026-04-10',
    payment_method: 'Credit Card',
    transaction_id: 'TXN123456'
  },
  {
    amount: 10000,
    month: 'April',
    year: 2026,
    due_date: '2026-04-30',
    status: 'pending'
  },
  {
    amount: 10000,
    month: 'April',
    year: 2026,
    due_date: '2026-04-30',
    status: 'partial',
    payment_date: '2026-04-15',
    payment_method: 'UPI',
    transaction_id: 'TXN789012'
  },
  {
    amount: 15000,
    month: 'April',
    year: 2026,
    due_date: '2026-04-30',
    status: 'pending'
  }
];

// Leaves
const leaves = [
  {
    from_date: '2026-04-25',
    to_date: '2026-04-28',
    reason: 'Going home for family function',
    leave_type: 'casual',
    status: 'approved',
    parent_contact: '9876543200'
  },
  {
    from_date: '2026-05-01',
    to_date: '2026-05-05',
    reason: 'Medical checkup',
    leave_type: 'medical',
    status: 'pending',
    parent_contact: '9876543201'
  },
  {
    from_date: '2026-04-20',
    to_date: '2026-04-22',
    reason: 'Emergency at home',
    leave_type: 'emergency',
    status: 'approved',
    parent_contact: '9876543202'
  }
];

// Notices
const notices = [
  {
    title: 'Hostel Maintenance Work',
    content: 'There will be maintenance work in Block A from April 20-22. Water supply may be affected.',
    category: 'maintenance',
    is_important: true
  },
  {
    title: 'Mess Holiday Notice',
    content: 'Mess will remain closed on April 25th due to staff training.',
    category: 'mess',
    is_important: false
  },
  {
    title: 'Annual Sports Day',
    content: 'Annual Sports Day will be held on May 10th. Register by May 5th.',
    category: 'event',
    is_important: true
  },
  {
    title: 'New Room Allocation Policy',
    content: 'Room allocation policy has been updated. Check notice board for details.',
    category: 'policy',
    is_important: false
  }
];

// ============================================
// HELPER FUNCTIONS
// ============================================

async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

async function clearDatabase() {
  console.log('🗑️  Clearing existing data...');
  
  const tables = ['attendance', 'complaints', 'fees', 'leaves', 'notices', 'rooms', 'profiles'];
  
  for (const table of tables) {
    try {
      const { error } = await supabase.from(table).delete().neq('id', 0);
      if (error && error.code !== 'PGRST116') {
        console.log(`  ⚠️  Could not clear ${table}: ${error.message}`);
      } else {
        console.log(`  ✓ Cleared ${table}`);
      }
    } catch (err) {
      console.log(`  ⚠️  Table ${table} may not exist yet`);
    }
  }
}

async function seedDatabase() {
  console.log('🌱 Starting database seeding...\n');
  
  try {
    // 1. Insert profiles (users)
    console.log('📝 Creating users...');
    const profileIds = {};
    
    for (const profile of profiles) {
      const hashedPassword = await hashPassword(profile.password);
      
      // Check if user exists
      const { data: existing } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', profile.email)
        .maybeSingle();
      
      let userId;
      
      if (existing) {
        // Update existing user
        const { data, error } = await supabase
          .from('profiles')
          .update({
            name: profile.name,
            password: hashedPassword,
            phone: profile.phone,
            role: profile.role,
            hostel: profile.hostel,
            roll_number: profile.roll_number || null,
            room_number: profile.room_number || null,
            parent_phone: profile.parent_phone || null,
            joining_date: profile.joining_date || new Date().toISOString().split('T')[0]
          })
          .eq('id', existing.id)
          .select()
          .single();
        
        if (error) throw error;
        userId = data.id;
        console.log(`  ✓ Updated ${profile.role}: ${profile.name}`);
      } else {
        // Insert new user
        const { data, error } = await supabase
          .from('profiles')
          .insert([{
            name: profile.name,
            email: profile.email,
            password: hashedPassword,
            phone: profile.phone,
            role: profile.role,
            hostel: profile.hostel,
            roll_number: profile.roll_number || null,
            room_number: profile.room_number || null,
            parent_phone: profile.parent_phone || null,
            joining_date: profile.joining_date || new Date().toISOString().split('T')[0]
          }])
          .select()
          .single();
        
        if (error) throw error;
        userId = data.id;
        console.log(`  ✓ Created ${profile.role}: ${profile.name}`);
      }
      
      profileIds[profile.email] = userId;
    }
    
    // 2. Insert rooms
    console.log('\n🏠 Creating rooms...');
    for (const room of rooms) {
      const { error } = await supabase
        .from('rooms')
        .upsert([room], { onConflict: 'room_number' });
      
      if (error) {
        console.error(`  ❌ Error creating room ${room.room_number}:`, error.message);
      } else {
        console.log(`  ✓ Created room ${room.room_number}`);
      }
    }
    
    // 3. Insert complaints
    console.log('\n📢 Creating complaints...');
    const studentEmails = profiles.filter(p => p.role === 'student').map(p => p.email);
    
    for (let i = 0; i < complaints.length; i++) {
      const complaint = complaints[i];
      const studentEmail = studentEmails[i % studentEmails.length];
      const studentId = profileIds[studentEmail];
      
      if (studentId) {
        const { error } = await supabase
          .from('complaints')
          .insert([{
            student_id: studentId,
            title: complaint.title,
            description: complaint.description,
            type: complaint.type,
            priority: complaint.priority,
            status: complaint.status,
            created_at: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString()
          }]);
        
        if (error) {
          console.error(`  ❌ Error creating complaint:`, error.message);
        } else {
          console.log(`  ✓ Created complaint: ${complaint.title}`);
        }
      }
    }
    
    // 4. Insert fees
    console.log('\n💰 Creating fee records...');
    for (let i = 0; i < feesData.length; i++) {
      const fee = feesData[i];
      const studentEmail = studentEmails[i % studentEmails.length];
      const studentId = profileIds[studentEmail];
      const student = profiles.find(p => p.email === studentEmail);
      
      if (studentId && student) {
        const { error } = await supabase
          .from('fees')
          .insert([{
            student_id: studentId,
            student_name: student.name,
            room_number: student.room_number,
            amount: fee.amount,
            month: fee.month,
            year: fee.year,
            due_date: fee.due_date,
            status: fee.status,
            payment_date: fee.payment_date || null,
            payment_method: fee.payment_method || null,
            transaction_id: fee.transaction_id || null
          }]);
        
        if (error) {
          console.error(`  ❌ Error creating fee:`, error.message);
        } else {
          console.log(`  ✓ Created fee for ${student.name} - ${fee.month} ${fee.year}`);
        }
      }
    }
    
    // 5. Insert leaves
    console.log('\n✈️  Creating leave applications...');
    for (let i = 0; i < leaves.length; i++) {
      const leave = leaves[i];
      const studentEmail = studentEmails[i % studentEmails.length];
      const studentId = profileIds[studentEmail];
      const student = profiles.find(p => p.email === studentEmail);
      
      if (studentId && student) {
        const { error } = await supabase
          .from('leaves')
          .insert([{
            student_id: studentId,
            student_name: student.name,
            room_number: student.room_number,
            from_date: leave.from_date,
            to_date: leave.to_date,
            reason: leave.reason,
            leave_type: leave.leave_type,
            status: leave.status,
            parent_contact: leave.parent_contact,
            approved_by: leave.status === 'approved' ? profileIds['warden@hostel.edu'] : null,
            approved_at: leave.status === 'approved' ? new Date().toISOString() : null
          }]);
        
        if (error) {
          console.error(`  ❌ Error creating leave:`, error.message);
        } else {
          console.log(`  ✓ Created leave for ${student.name} (${leave.status})`);
        }
      }
    }
    
    // 6. Insert notices
    console.log('\n📰 Creating notices...');
    const adminId = profileIds['admin@hostel.edu'];
    
    for (const notice of notices) {
      const { error } = await supabase
        .from('notices')
        .insert([{
          title: notice.title,
          content: notice.content,
          category: notice.category,
          is_important: notice.is_important,
          author_id: adminId,
          is_active: true,
          created_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
        }]);
      
      if (error) {
        console.error(`  ❌ Error creating notice:`, error.message);
      } else {
        console.log(`  ✓ Created notice: ${notice.title}`);
      }
    }
    
    // 7. Summary
    console.log('\n📊 Database Seeding Summary:');
    console.log('═'.repeat(50));
    
    const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
    const { count: roomCount } = await supabase.from('rooms').select('*', { count: 'exact', head: true });
    const { count: complaintCount } = await supabase.from('complaints').select('*', { count: 'exact', head: true });
    const { count: feeCount } = await supabase.from('fees').select('*', { count: 'exact', head: true });
    const { count: leaveCount } = await supabase.from('leaves').select('*', { count: 'exact', head: true });
    const { count: noticeCount } = await supabase.from('notices').select('*', { count: 'exact', head: true });
    
    console.log(`✅ Users: ${userCount || 0}`);
    console.log(`✅ Rooms: ${roomCount || 0}`);
    console.log(`✅ Complaints: ${complaintCount || 0}`);
    console.log(`✅ Fee Records: ${feeCount || 0}`);
    console.log(`✅ Leave Applications: ${leaveCount || 0}`);
    console.log(`✅ Notices: ${noticeCount || 0}`);
    
    console.log('\n✨ Database seeding completed successfully!');
    console.log('\n🔐 Login Credentials:');
    console.log('═'.repeat(50));
    console.log('Admin:   admin@hostel.edu     / admin123');
    console.log('Warden:  warden@hostel.edu    / warden123');
    console.log('Student: rajesh@university.edu / student123');
    console.log('Student: priya@university.edu  / student123');
    console.log('Student: amit@university.edu   / student123');
    console.log('═'.repeat(50));
    
  } catch (error) {
    console.error('\n❌ Seeding failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// ============================================
// MAIN EXECUTION
// ============================================

async function main() {
  const args = process.argv.slice(2);
  const shouldDelete = args.includes('--delete');
  
  if (shouldDelete) {
    await clearDatabase();
    console.log('\n🗑️  Database cleared!');
  }
  
  await seedDatabase();
  process.exit(0);
}

// Run the seed
main();