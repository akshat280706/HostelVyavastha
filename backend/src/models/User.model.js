const supabase = require('../config/supabase');

class UserModel {
  static async findById(id) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  static async findByEmail(email) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  static async create(userData) {
    const { data, error } = await supabase
      .from('profiles')
      .insert([userData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async update(id, updates) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async delete(id) {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
}

module.exports = UserModel;

// const supabase = require('../config/supabase');

// class UserModel {
//   // Find user by ID
//   static async findById(id) {
//     const { data, error } = await supabase
//       .from('profiles')
//       .select('*')
//       .eq('id', id)
//       .single();
    
//     if (error) throw error;
//     return data;
//   }

//   // Find user by email
//   static async findByEmail(email) {
//     const { data, error } = await supabase
//       .from('profiles')
//       .select('*')
//       .eq('email', email)
//       .single();
    
//     if (error && error.code !== 'PGRST116') throw error;
//     return data;
//   }

//   // Create new user profile
//   static async create(userData) {
//     const { data, error } = await supabase
//       .from('profiles')
//       .insert([userData])
//       .select()
//       .single();
    
//     if (error) throw error;
//     return data;
//   }

//   // Update user
//   static async update(id, updates) {
//     const { data, error } = await supabase
//       .from('profiles')
//       .update(updates)
//       .eq('id', id)
//       .select()
//       .single();
    
//     if (error) throw error;
//     return data;
//   }

//   // Delete user
//   static async delete(id) {
//     const { error } = await supabase
//       .from('profiles')
//       .delete()
//       .eq('id', id);
    
//     if (error) throw error;
//     return true;
//   }

//   // Get all students with pagination
//   static async getAllStudents(page = 1, limit = 20, filters = {}) {
//     const offset = (page - 1) * limit;
    
//     let query = supabase
//       .from('profiles')
//       .select('*', { count: 'exact' })
//       .eq('role', 'student');
    
//     if (filters.hostel) query = query.eq('hostel', filters.hostel);
//     if (filters.search) {
//       query = query.or(`name.ilike.%${filters.search}%,roll_number.ilike.%${filters.search}%`);
//     }
    
//     const { data, error, count } = await query
//       .range(offset, offset + limit - 1)
//       .order('created_at', { ascending: false });
    
//     if (error) throw error;
    
//     return {
//       data,
//       total: count,
//       page,
//       limit,
//       totalPages: Math.ceil(count / limit)
//     };
//   }

//   // Update room assignment
//   static async assignRoom(studentId, roomNumber) {
//     const { data, error } = await supabase
//       .from('profiles')
//       .update({ room_number: roomNumber })
//       .eq('id', studentId)
//       .select()
//       .single();
    
//     if (error) throw error;
//     return data;
//   }
// }

// module.exports = UserModel;