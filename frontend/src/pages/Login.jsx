import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    const success = login(email, password, role);
    
    if (success) {
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } else {
      setError('Invalid credentials. Use admin@hostel.edu for admin or any email for student.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Sign in to access your dashboard</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="role-selector">
            <button
              type="button"
              className={`role-btn ${role === 'student' ? 'active' : ''}`}
              onClick={() => setRole('student')}
            >
              Student
            </button>
            <button
              type="button"
              className={`role-btn ${role === 'admin' ? 'active' : ''}`}
              onClick={() => setRole('admin')}
            >
              Admin
            </button>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder={role === 'admin' ? 'admin@hostel.edu' : 'your.email@university.edu'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm mb-4 p-3 bg-red-500/10 rounded-lg">
              {error}
            </div>
          )}

          <button type="submit" className="btn-submit full-width">
            Sign In
          </button>
        </form>

        <div className="demo-note">
          <p className="text-xs text-gray-500 mb-1">Demo Credentials:</p>
          <p className="text-xs text-gray-500">Admin: admin@hostel.edu / any password</p>
          <p className="text-xs text-gray-500">Student: any email / any password</p>
        </div>
      </div>
    </div>
  );
}