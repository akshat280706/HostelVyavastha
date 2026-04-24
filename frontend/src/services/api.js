import axios from 'axios';

// Get API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized - token expired
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ================= AUTH SERVICES =================
export const authService = {
  // Register new user
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data.success) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data));
      }
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
      };
    }
  },

  // Login user
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.success) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data));
      }
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      };
    }
  },

  // Get current user
  getMe: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get user',
      };
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

// ================= DASHBOARD SERVICES =================
export const dashboardService = {
  // Get dashboard stats
  getStats: async () => {
    try {
      const response = await api.get('/dashboard/stats');
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch stats',
      };
    }
  },

  // Get chart data
  getChartData: async (type, year) => {
    try {
      const response = await api.get('/dashboard/charts', {
        params: { type, year },
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch chart data',
      };
    }
  },
};

// ================= ATTENDANCE SERVICES =================
export const attendanceService = {
  // Mark attendance (Admin)
  markAttendance: async (data) => {
  try {
    // Make sure date is included
    const payload = {
      studentId: data.studentId,
      status: data.status,
      checkInTime: data.checkInTime || null,
      date: data.date || new Date().toISOString().split('T')[0]  // ← Add date
    };
    const response = await api.post('/attendance/mark', payload);
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to mark attendance',
    };
  }
},

  // Get all attendance records
  getAttendance: async (filters = {}) => {
    try {
      const response = await api.get('/attendance', { params: filters });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch attendance',
      };
    }
  },

  // Get student attendance (Admin view)
  getStudentAttendance: async (studentId, filters = {}) => {
    try {
      const response = await api.get(`/attendance/student/${studentId}`, {
        params: filters,
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch student attendance',
      };
    }
  },

  // Update attendance record
  updateAttendance: async (id, data) => {
    try {
      const response = await api.put(`/attendance/${id}`, data);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update attendance',
      };
    }
  },

  // Delete attendance record
  deleteAttendance: async (id) => {
    try {
      const response = await api.delete(`/attendance/${id}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete attendance',
      };
    }
  },
};

// ================= ROOM SERVICES =================
export const roomService = {
  // Get all rooms
  getRooms: async (filters = {}) => {
    try {
      const response = await api.get('/rooms', { params: filters });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch rooms',
      };
    }
  },

  // Get available rooms
  getAvailableRooms: async () => {
    try {
      const response = await api.get('/rooms/available');
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch available rooms',
      };
    }
  },

  // Get room by ID
  getRoomById: async (id) => {
    try {
      const response = await api.get(`/rooms/${id}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch room',
      };
    }
  },

  // Create room (Admin)
  createRoom: async (roomData) => {
    try {
      const response = await api.post('/rooms', roomData);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create room',
      };
    }
  },

  // Update room (Admin)
  updateRoom: async (id, roomData) => {
    try {
      const response = await api.put(`/rooms/${id}`, roomData);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update room',
      };
    }
  },

  // Delete room (Admin)
  deleteRoom: async (id) => {
    try {
      const response = await api.delete(`/rooms/${id}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete room',
      };
    }
  },

  // Assign student to room
  assignStudent: async (roomId, studentId) => {
    try {
      const response = await api.post(`/rooms/${roomId}/assign`, { studentId });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to assign student',
      };
    }
  },
};

// ================= COMPLAINT SERVICES =================
export const complaintService = {
  // Create complaint
  createComplaint: async (complaintData) => {
    try {
      const response = await api.post('/complaints', complaintData);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to submit complaint',
      };
    }
  },

  // Get all complaints
  getComplaints: async (filters = {}) => {
    try {
      const response = await api.get('/complaints', { params: filters });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch complaints',
      };
    }
  },

  // Get complaint by ID
  getComplaintById: async (id) => {
    try {
      const response = await api.get(`/complaints/${id}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch complaint',
      };
    }
  },

  // Update complaint (Admin)
  updateComplaint: async (id, data) => {
    try {
      const response = await api.put(`/complaints/${id}`, data);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update complaint',
      };
    }
  },

  // Delete complaint (Admin)
  deleteComplaint: async (id) => {
    try {
      const response = await api.delete(`/complaints/${id}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete complaint',
      };
    }
  },
};

// ================= FEE SERVICES =================
export const feeService = {
  // Create fee record (Admin)
  createFee: async (feeData) => {
    try {
      const response = await api.post('/fees', feeData);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create fee record',
      };
    }
  },

  // Get all fees
  getFees: async (filters = {}) => {
    try {
      const response = await api.get('/fees', { params: filters });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch fees',
      };
    }
  },

  // Get fee by ID
  getFeeById: async (id) => {
    try {
      const response = await api.get(`/fees/${id}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch fee record',
      };
    }
  },

  // Update fee (Admin)
  updateFee: async (id, data) => {
    try {
      const response = await api.put(`/fees/${id}`, data);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update fee record',
      };
    }
  },

  // Delete fee (Admin)
  deleteFee: async (id) => {
    try {
      const response = await api.delete(`/fees/${id}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete fee record',
      };
    }
  },

  // Get student fee summary
  getStudentFeeSummary: async (studentId) => {
    try {
      const response = await api.get(`/fees/student/${studentId}/summary`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch fee summary',
      };
    }
  },
};

// ================= NOTICE SERVICES =================
export const noticeService = {
  // Create notice (Admin)
  createNotice: async (noticeData) => {
    try {
      const response = await api.post('/notices', noticeData);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create notice',
      };
    }
  },

  // Get all notices
  getNotices: async (filters = {}) => {
    try {
      const response = await api.get('/notices', { params: filters });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch notices',
      };
    }
  },

  // Get notice by ID
  getNoticeById: async (id) => {
    try {
      const response = await api.get(`/notices/${id}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch notice',
      };
    }
  },

  // Update notice (Admin)
  updateNotice: async (id, data) => {
    try {
      const response = await api.put(`/notices/${id}`, data);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update notice',
      };
    }
  },

  // Delete notice (Admin)
  deleteNotice: async (id) => {
    try {
      const response = await api.delete(`/notices/${id}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete notice',
      };
    }
  },
};

// ================= LEAVE SERVICES =================
export const leaveService = {
  // Apply for leave
  applyLeave: async (leaveData) => {
    try {
      const response = await api.post('/leaves', leaveData);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to apply for leave',
      };
    }
  },

  // Get all leaves
  getLeaves: async (filters = {}) => {
    try {
      const response = await api.get('/leaves', { params: filters });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch leaves',
      };
    }
  },

  // Get leave by ID
  getLeaveById: async (id) => {
    try {
      const response = await api.get(`/leaves/${id}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch leave',
      };
    }
  },

  // Update leave status (Admin)
  updateLeaveStatus: async (id, status, rejectionReason) => {
    try {
      const response = await api.put(`/leaves/${id}/status`, {
        status,
        rejectionReason,
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update leave status',
      };
    }
  },

  // Delete leave
  deleteLeave: async (id) => {
    try {
      const response = await api.delete(`/leaves/${id}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete leave',
      };
    }
  },
};

// ================= USER SERVICES =================
export const userService = {
  // Get all students (Admin)
  getStudents: async (filters = {}) => {
    try {
      const response = await api.get('/users/students', { params: filters });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch students',
      };
    }
  },

  // Get user by ID
  getUserById: async (id) => {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch user',
      };
    }
  },

  // Update user (Admin)
  updateUser: async (id, userData) => {
    try {
      const response = await api.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update user',
      };
    }
  },

  // Delete user (Admin)
  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete user',
      };
    }
  },

  // Get user stats (Admin)
  getUserStats: async () => {
    try {
      const response = await api.get('/users/stats');
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch user stats',
      };
    }
  },
};

export default api;