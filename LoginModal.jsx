import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import './LoginModal.css';

const LoginModal = ({ onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = login(email, password);
    
    if (result.success) {
      onLoginSuccess(result.user);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="login-modal-overlay">
      <div className="login-modal">
        <button className="close-btn" onClick={onClose}>×</button>
        
        <div className="login-header">
          <h2>🩺 HealthSync Pro</h2>
          <p>Sign in to continue</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email or Phone</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="doctor@hospital.com"
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={loading} className="login-btn">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="login-footer">
            <p>Demo Credentials:</p>
            <p>Doctor: doctor@health.com / 123</p>
            <p>Patient: patient@health.com / 123</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;