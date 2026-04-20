import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const result = await login(email, password);
    
    if (result.success) {
      // Get user from localStorage after login
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user.role === 'admin' || user.role === 'warden') {
          navigate('/admin/dashboard');
        } else {
          navigate('/student/dashboard');
        }
      }
    }
    
    setIsLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Sign in to access your dashboard</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm mb-4 p-3 bg-red-500/10 rounded-lg">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="btn-submit full-width"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Demo credentials note */}
        <div className="demo-note" style={{ marginTop: '20px', padding: '12px', background: '#f0fdf4', borderRadius: '8px' }}>
          <p className="text-xs text-green-800 mb-1">Demo Credentials:</p>
          <p className="text-xs text-green-700">Admin: admin@hostel.edu / password123</p>
          <p className="text-xs text-green-700">Student: student@university.edu / password123</p>
          <p className="text-xs text-gray-500 mt-2">Note: Create users via registration or add them in Supabase</p>
        </div>
      </div>
    </div>
  );
}