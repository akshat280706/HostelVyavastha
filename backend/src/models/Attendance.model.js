const supabase = require('../config/supabase');

class AttendanceModel {
  // Mark or update attendance
  static async mark(studentId, status, checkInTime, markedBy) {
    const today = new Date().toISOString().split('T')[0];

    const { data: existing, error: fetchError } = await supabase
      .from('attendance')
      .select('id')
      .eq('student_id', studentId)
      .eq('date', today)
      .maybeSingle();

    if (fetchError) throw fetchError;

    if (existing) {
      const { data, error } = await supabase
        .from('attendance')
        .update({
          status,
          check_in_time: checkInTime,
          marked_by: markedBy
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase
        .from('attendance')
        .insert([{
          student_id: studentId,
          date: today,
          status,
          check_in_time: checkInTime,
          marked_by: markedBy
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  }

  // Get attendance records
  static async getRecords(filters = {}, userId = null, userRole = 'student') {
    let query = supabase
      .from('attendance')
      .select(`
        *,
        profiles:student_id (name, roll_number, room_number)
      `);

    if (userRole === 'student' && userId) {
      query = query.eq('student_id', userId);
    }

    if (filters.studentId) query = query.eq('student_id', filters.studentId);
    if (filters.startDate) query = query.gte('date', filters.startDate);
    if (filters.endDate) query = query.lte('date', filters.endDate);

    const { data, error } = await query.order('date', { ascending: false });

    if (error) throw error;
    return data;
  }

  // Get student attendance summary
  static async getStudentSummary(studentId, month, year) {
    const startDate = `${year}-${month}-01`;
    const endDate = new Date(year, month, 0).toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('attendance')
      .select('status')
      .eq('student_id', studentId)
      .gte('date', startDate)
      .lte('date', endDate);

    if (error) throw error;

    const total = data.length;
    const present = data.filter(a => a.status === 'present').length;
    const absent = data.filter(a => a.status === 'absent').length;
    const late = data.filter(a => a.status === 'late').length;

    return {
      total,
      present,
      absent,
      late,
      percentage: total > 0 ? ((present / total) * 100).toFixed(2) : 0
    };
  }
}

module.exports = AttendanceModel;

// const supabase = require('../config/supabase');

// class AttendanceModel {
//   // Mark or update attendance
//   static async mark(studentId, status, checkInTime, markedBy) {
//     const today = new Date().toISOString().split('T')[0];
    
//     // Check if exists
//     const { data: existing } = await supabase
//       .from('attendance')
//       .select('id')
//       .eq('student_id', studentId)
//       .eq('date', today)
//       .single();
    
//     if (existing) {
//       // Update
//       const { data, error } = await supabase
//         .from('attendance')
//         .update({ status, check_in_time: checkInTime, marked_by: markedBy })
//         .eq('id', existing.id)
//         .select()
//         .single();
      
//       if (error) throw error;
//       return data;
//     } else {
//       // Create
//       const { data, error } = await supabase
//         .from('attendance')
//         .insert([{
//           student_id: studentId,
//           date: today,
//           status,
//           check_in_time: checkInTime,
//           marked_by: markedBy
//         }])
//         .select()
//         .single();
      
//       if (error) throw error;
//       return data;
//     }
//   }

//   // Get attendance records
//   static async getRecords(filters = {}, userId = null, userRole = 'student') {
//     let query = supabase
//       .from('attendance')
//       .select(`
//         *,
//         profiles:student_id (name, roll_number, room_number)
//       `);
    
//     if (userRole === 'student' && userId) {
//       query = query.eq('student_id', userId);
//     }
    
//     if (filters.studentId) query = query.eq('student_id', filters.studentId);
//     if (filters.startDate) query = query.gte('date', filters.startDate);
//     if (filters.endDate) query = query.lte('date', filters.endDate);
    
//     const { data, error } = await query.order('date', { ascending: false });
    
//     if (error) throw error;
//     return data;
//   }

//   // Get student attendance summary
//   static async getStudentSummary(studentId, month, year) {
//     const startDate = `${year}-${month}-01`;
//     const endDate = `${year}-${month}-31`;
    
//     const { data, error } = await supabase
//       .from('attendance')
//       .select('status')
//       .eq('student_id', studentId)
//       .gte('date', startDate)
//       .lte('date', endDate);
    
//     if (error) throw error;
    
//     const total = data.length;
//     const present = data.filter(a => a.status === 'present').length;
//     const absent = data.filter(a => a.status === 'absent').length;
//     const late = data.filter(a => a.status === 'late').length;
    
//     return {
//       total,
//       present,
//       absent,
//       late,
//       percentage: total > 0 ? ((present / total) * 100).toFixed(2) : 0
//     };
//   }
// }

// module.exports = AttendanceModel;
