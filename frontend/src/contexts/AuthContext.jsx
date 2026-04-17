import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Sample student data for demo
const studentUser = {
  id: 101,
  name: 'Rajesh Kumar',
  role: 'student',
  rollNumber: '2021001',
  roomNumber: 'A-101',
  email: 'rajesh@university.edu',
  phone: '9876543210',
  parentPhone: '9876543200',
  address: 'Room A-101, Hostel Block A',
  joiningDate: '2024-06-15'
};

const adminUser = {
  id: 1,
  name: 'Warden',
  role: 'admin',
  email: 'admin@hostel.edu'
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for existing session
    const savedUser = localStorage.getItem('hostelUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password, role) => {
    // Demo login - in real app, this would be an API call
    let userData = null;
    
    if (role === 'admin' && email === 'admin@hostel.edu') {
      userData = adminUser;
    } else if (role === 'student') {
      userData = { ...studentUser, email };
    }
    
    if (userData) {
      setUser(userData);
      localStorage.setItem('hostelUser', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hostelUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}