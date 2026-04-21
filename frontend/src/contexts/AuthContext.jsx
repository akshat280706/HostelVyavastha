import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check for existing session on app load
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      
      if (token && savedUser) {
        try {
          // Verify token is still valid
          const response = await authService.getMe();
          if (response.success) {
            setUser(response.data);
          } else {
            // Token invalid, clear storage
            authService.logout();
            setUser(null);
          }
        } catch (err) {
          authService.logout();
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    setError(null);
    const response = await authService.login(email, password);
    
    if (response.success) {
      setUser(response.data);
      return { success: true };
    } else {
      setError(response.message);
      return { success: false, error: response.message };
    }
  };

  // Register function
  const register = async (userData) => {
    setError(null);
    const response = await authService.register(userData);
    
    if (response.success) {
      setUser(response.data);
      return { success: true };
    } else {
      setError(response.message);
      return { success: false, error: response.message };
    }
  };

  // Logout function
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  // Update user in state
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isWarden: user?.role === 'warden',
    isStudent: user?.role === 'student',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}