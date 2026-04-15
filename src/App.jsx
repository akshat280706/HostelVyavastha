import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Admin Pages
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminAttendance from './pages/admin/AdminAttendance';
import AdminRooms from './pages/admin/AdminRooms';
import AdminFees from './pages/admin/AdminFees';
import AdminNotices from './pages/admin/AdminNotices';
import AdminComplaints from './pages/admin/AdminComplaints';

// Student Pages
import StudentLayout from './layouts/StudentLayout';
import StudentDashboard from './pages/student/StudentDashboard';
import MyAttendance from './pages/student/MyAttendance';
import MyRoom from './pages/student/MyRoom';
import MyFees from './pages/student/MyFees';
import StudentNotices from './pages/student/StudentNotices';
import SubmitComplaint from './pages/student/SubmitComplaint';
import StudentProfile from './pages/student/StudentProfile';

// Auth Pages
import Login from './pages/Login';

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  // Admin Routes
  if (user.role === 'admin') {
    return (
      <Routes>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="attendance" element={<AdminAttendance />} />
          <Route path="rooms" element={<AdminRooms />} />
          <Route path="fees" element={<AdminFees />} />
          <Route path="notices" element={<AdminNotices />} />
          <Route path="complaints" element={<AdminComplaints />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/admin/dashboard" />} />
      </Routes>
    );
  }

  // Student Routes
  return (
    <Routes>
      <Route path="/student" element={<StudentLayout />}>
        <Route index element={<Navigate to="/student/dashboard" />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="attendance" element={<MyAttendance />} />
        <Route path="room" element={<MyRoom />} />
        <Route path="fees" element={<MyFees />} />
        <Route path="notices" element={<StudentNotices />} />
        <Route path="complaints" element={<SubmitComplaint />} />
        <Route path="profile" element={<StudentProfile />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<Navigate to="/student/dashboard" />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );

}

export default App;