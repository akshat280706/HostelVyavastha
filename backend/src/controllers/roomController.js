const supabase = require('../config/supabase');

// GET ALL ROOMS
const getRooms = async (req, res) => {
  try {
    const { type, isAvailable, wing } = req.query;

    let query = supabase.from('rooms').select('*');

    if (type) query = query.eq('type', type);
    if (isAvailable !== undefined) {
      query = query.eq('is_available', isAvailable === 'true');
    }
    if (wing) query = query.eq('wing', wing);

    const { data: rooms, error } = await query.order('room_number');

    if (error) throw error;

    res.json({
      success: true,
      data: rooms
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



// FIXED: GET AVAILABLE ROOMS
const getAvailableRooms = async (req, res) => {
  try {
    const { data: rooms, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('is_available', true);

    if (error) throw error;

    res.json({
      success: true,
      data: rooms
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



// GET ROOM BY ID
const getRoomById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: room, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error || !room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Get students in this room
    const { data: students } = await supabase
      .from('profiles')
      .select('id, name, roll_number, phone')
      .eq('room_number', room.room_number);

    room.current_students = students || [];

    res.json({
      success: true,
      data: room
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



// CREATE ROOM
const createRoom = async (req, res) => {
  try {
    const { roomNumber, floor, wing, capacity, type, price, amenities } = req.body;

    if (!roomNumber || !capacity || !type || !price) {
      return res.status(400).json({
        success: false,
        message: 'Required fields missing'
      });
    }

    const { data: room, error } = await supabase
      .from('rooms')
      .insert([{
        room_number: roomNumber,
        floor,
        wing,
        capacity,
        current_occupancy: 0,
        type,
        price,
        is_available: true,
        amenities: amenities || []
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: 'Room created successfully',
      data: room
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};



// UPDATE ROOM
const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const { data: room, error } = await supabase
      .from('rooms')
      .update(updates)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) throw error;

    res.json({
      success: true,
      message: 'Room updated successfully',
      data: room
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



// DELETE ROOM
const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('rooms')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({
      success: true,
      message: 'Room deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



// ASSIGN STUDENT TO ROOM
const assignStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { studentId } = req.body;

    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: 'studentId is required'
      });
    }

    // Get room
    const { data: room, error: roomError } = await supabase
      .from('rooms')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (roomError || !room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Check capacity
    if (room.current_occupancy >= room.capacity) {
      return res.status(400).json({
        success: false,
        message: 'Room is full'
      });
    }

    // Assign room to student
    const { error: studentError } = await supabase
      .from('profiles')
      .update({ room_number: room.room_number })
      .eq('id', studentId);

    if (studentError) throw studentError;

    // ⚠️ NOTE:
    // Ideally DB trigger should handle occupancy (you already have it)
    // So this manual update is optional—but kept for now

    const { data: updatedRoom, error: updateError } = await supabase
      .from('rooms')
      .update({
        current_occupancy: room.current_occupancy + 1,
        is_available: room.current_occupancy + 1 < room.capacity
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) throw updateError;

    res.json({
      success: true,
      message: 'Student assigned successfully',
      data: updatedRoom
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getRooms,
  getAvailableRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  assignStudent
};

// const supabase = require('../config/supabase');

// // @desc    Get all rooms
// // @route   GET /api/rooms
// // @access  Private
// const getRooms = async (req, res) => {
//   try {
//     const { type, isAvailable, wing } = req.query;
    
//     let query = supabase.from('rooms').select('*');
    
//     if (type) query = query.eq('type', type);
//     if (isAvailable !== undefined) query = query.eq('is_available', isAvailable === 'true');
//     if (wing) query = query.eq('wing', wing);
    
//     const { data: rooms, error } = await query.order('room_number');
    
//     if (error) throw error;
    
//     res.json({
//       success: true,
//       data: rooms
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @desc    Get available rooms
// // @route   GET /api/rooms/available
// // @access  Private
// const getAvailableRooms = async (req, res) => {
//   try {
//     const { data: rooms, error } = await supabase
//       .from('rooms')
//       .select('*')
//       .eq('is_available', true)
//       .lt('current_occupancy', supabase.raw('capacity'));
    
//     if (error) throw error;
    
//     res.json({
//       success: true,
//       data: rooms
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @desc    Get single room
// // @route   GET /api/rooms/:id
// // @access  Private
// const getRoomById = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     const { data: room, error } = await supabase
//       .from('rooms')
//       .select('*')
//       .eq('id', id)
//       .single();
    
//     if (error || !room) {
//       return res.status(404).json({
//         success: false,
//         message: 'Room not found'
//       });
//     }
    
//     // Get current students in room
//     const { data: students } = await supabase
//       .from('profiles')
//       .select('id, name, roll_number, phone')
//       .eq('room_number', room.room_number);
    
//     room.current_students = students || [];
    
//     res.json({
//       success: true,
//       data: room
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @desc    Create room
// // @route   POST /api/rooms
// // @access  Private (Admin)
// const createRoom = async (req, res) => {
//   try {
//     const { roomNumber, floor, wing, capacity, type, price, amenities } = req.body;
    
//     const { data: room, error } = await supabase
//       .from('rooms')
//       .insert([{
//         room_number: roomNumber,
//         floor,
//         wing,
//         capacity,
//         current_occupancy: 0,
//         type,
//         price,
//         is_available: true,
//         amenities: amenities || []
//       }])
//       .select()
//       .single();
    
//     if (error) throw error;
    
//     res.status(201).json({
//       success: true,
//       message: 'Room created successfully',
//       data: room
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @desc    Update room
// // @route   PUT /api/rooms/:id
// // @access  Private (Admin)
// const updateRoom = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updates = req.body;
    
//     const { data: room, error } = await supabase
//       .from('rooms')
//       .update(updates)
//       .eq('id', id)
//       .select()
//       .single();
    
//     if (error) {
//       return res.status(400).json({
//         success: false,
//         message: error.message
//       });
//     }
    
//     res.json({
//       success: true,
//       message: 'Room updated successfully',
//       data: room
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @desc    Delete room
// // @route   DELETE /api/rooms/:id
// // @access  Private (Admin)
// const deleteRoom = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     const { error } = await supabase
//       .from('rooms')
//       .delete()
//       .eq('id', id);
    
//     if (error) throw error;
    
//     res.json({
//       success: true,
//       message: 'Room deleted successfully'
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @desc    Assign student to room
// // @route   POST /api/rooms/:id/assign
// // @access  Private (Admin/Warden)
// const assignStudent = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { studentId } = req.body;
    
//     // Get room details
//     const { data: room, error: roomError } = await supabase
//       .from('rooms')
//       .select('*')
//       .eq('id', id)
//       .single();
    
//     if (roomError || !room) {
//       return res.status(404).json({
//         success: false,
//         message: 'Room not found'
//       });
//     }
    
//     // Check if room has capacity
//     if (room.current_occupancy >= room.capacity) {
//       return res.status(400).json({
//         success: false,
//         message: 'Room is full'
//       });
//     }
    
//     // Update student's room
//     const { error: studentError } = await supabase
//       .from('profiles')
//       .update({ room_number: room.room_number })
//       .eq('id', studentId);
    
//     if (studentError) throw studentError;
    
//     // Update room occupancy
//     const { data: updatedRoom, error: updateError } = await supabase
//       .from('rooms')
//       .update({ 
//         current_occupancy: room.current_occupancy + 1,
//         is_available: room.current_occupancy + 1 < room.capacity
//       })
//       .eq('id', id)
//       .select()
//       .single();
    
//     if (updateError) throw updateError;
    
//     res.json({
//       success: true,
//       message: 'Student assigned successfully',
//       data: updatedRoom
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// module.exports = { 
//   getRooms, 
//   getAvailableRooms, 
//   getRoomById,
//   createRoom, 
//   updateRoom, 
//   deleteRoom,
//   assignStudent
// };