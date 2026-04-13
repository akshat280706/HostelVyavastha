const supabase = require('../config/supabase');

class RoomModel {
  // Get all rooms
  static async getAll(filters = {}) {
    let query = supabase.from('rooms').select('*');

    if (filters.type) query = query.eq('type', filters.type);
    if (filters.isAvailable !== undefined) {
      query = query.eq('is_available', filters.isAvailable);
    }
    if (filters.wing) query = query.eq('wing', filters.wing);

    const { data, error } = await query.order('room_number');

    if (error) throw error;
    return data;
  }

  // ✅ FIXED FUNCTION
  static async getAvailable() {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('is_available', true);

    if (error) throw error;
    return data;
  }

  // Get room by ID
  static async findById(id) {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;

    const { data: students } = await supabase
      .from('profiles')
      .select('id, name, roll_number, phone')
      .eq('room_number', data.room_number);

    data.current_students = students || [];
    return data;
  }

  // Create room
  static async create(roomData) {
    const { data, error } = await supabase
      .from('rooms')
      .insert([{
        room_number: roomData.roomNumber,
        floor: roomData.floor,
        wing: roomData.wing,
        capacity: roomData.capacity,
        current_occupancy: 0,
        type: roomData.type,
        price: roomData.price,
        is_available: true,
        amenities: roomData.amenities || []
      }])
      .select()
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  // Update room
  static async update(id, updates) {
    const { data, error } = await supabase
      .from('rooms')
      .update(updates)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  // Delete room
  static async delete(id) {
    const { error } = await supabase
      .from('rooms')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }

  // Check availability
  static async checkAvailability(roomNumber) {
    const { data, error } = await supabase
      .from('rooms')
      .select('capacity, current_occupancy, is_available')
      .eq('room_number', roomNumber)
      .maybeSingle();

    if (error) throw error;

    return {
      isAvailable: data.is_available && data.current_occupancy < data.capacity,
      availableSeats: data.capacity - data.current_occupancy,
      totalCapacity: data.capacity,
      currentOccupancy: data.current_occupancy
    };
  }
}

module.exports = RoomModel;

// const supabase = require('../config/supabase');

// class RoomModel {
//   // Get all rooms
//   static async getAll(filters = {}) {
//     let query = supabase.from('rooms').select('*');
    
//     if (filters.type) query = query.eq('type', filters.type);
//     if (filters.isAvailable !== undefined) {
//       query = query.eq('is_available', filters.isAvailable);
//     }
//     if (filters.wing) query = query.eq('wing', filters.wing);
    
//     const { data, error } = await query.order('room_number');
    
//     if (error) throw error;
//     return data;
//   }

//   // Get available rooms
//   static async getAvailable() {
//     const { data, error } = await supabase
//       .from('rooms')
//       .select('*')
//       .eq('is_available', true)
//       .lt('current_occupancy', supabase.raw('capacity'));
    
//     if (error) throw error;
//     return data;
//   }

//   // Get room by ID
//   static async findById(id) {
//     const { data, error } = await supabase
//       .from('rooms')
//       .select('*')
//       .eq('id', id)
//       .single();
    
//     if (error) throw error;
    
//     // Get students in this room
//     const { data: students } = await supabase
//       .from('profiles')
//       .select('id, name, roll_number, phone')
//       .eq('room_number', data.room_number);
    
//     data.current_students = students || [];
//     return data;
//   }

//   // Create room
//   static async create(roomData) {
//     const { data, error } = await supabase
//       .from('rooms')
//       .insert([{
//         room_number: roomData.roomNumber,
//         floor: roomData.floor,
//         wing: roomData.wing,
//         capacity: roomData.capacity,
//         current_occupancy: 0,
//         type: roomData.type,
//         price: roomData.price,
//         is_available: true,
//         amenities: roomData.amenities || []
//       }])
//       .select()
//       .single();
    
//     if (error) throw error;
//     return data;
//   }

//   // Update room
//   static async update(id, updates) {
//     const { data, error } = await supabase
//       .from('rooms')
//       .update(updates)
//       .eq('id', id)
//       .select()
//       .single();
    
//     if (error) throw error;
//     return data;
//   }

//   // Delete room
//   static async delete(id) {
//     const { error } = await supabase
//       .from('rooms')
//       .delete()
//       .eq('id', id);
    
//     if (error) throw error;
//     return true;
//   }

//   // Check availability
//   static async checkAvailability(roomNumber) {
//     const { data, error } = await supabase
//       .from('rooms')
//       .select('capacity, current_occupancy, is_available')
//       .eq('room_number', roomNumber)
//       .single();
    
//     if (error) throw error;
    
//     return {
//       isAvailable: data.is_available && data.current_occupancy < data.capacity,
//       availableSeats: data.capacity - data.current_occupancy,
//       totalCapacity: data.capacity,
//       currentOccupancy: data.current_occupancy
//     };
//   }
// }

// module.exports = RoomModel;

