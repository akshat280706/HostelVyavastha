import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    hostel: '',
    rollNumber: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { register, error } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const result = await register(formData);
    
    if (result.success) {
      navigate('/student/dashboard');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-card" style={{ maxWidth: '500px' }}>
        <div className="login-header">
          <h1>Create Account</h1>
          <p>Register as a new student</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              className="form-input"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              name="phone"
              className="form-input"
              value={formData.phone}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Hostel Name</label>
            <input
              type="text"
              name="hostel"
              className="form-input"
              value={formData.hostel}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Roll Number</label>
            <input
              type="text"
              name="rollNumber"
              className="form-input"
              value={formData.rollNumber}
              onChange={handleChange}
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
            {isLoading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <Link to="/login" style={{ color: 'var(--accent-blue)', textDecoration: 'none', fontSize: '14px' }}>
            Already have an account? Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}