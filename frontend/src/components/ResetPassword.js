import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import './Auth.css';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password strength
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
    if (!passwordRegex.test(formData.password)) {
      setError('Password must contain at least one uppercase letter, one lowercase letter, and one number');
      return;
    }

    setLoading(true);

    try {
      await authAPI.resetPassword(token, formData.password);
      setSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (error) {
      setError(error.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-container">
        <div className="auth-wrapper">
          <div className="auth-left">
            <div className="auth-image">
              <div className="image-content">
                <div className="main-illustration">
                  <div className="illustration-bg"></div>
                  <div className="illustration-text">
                    <h2>Password Reset Successful!</h2>
                    <p>Your password has been successfully updated. You can now sign in with your new password.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="auth-right">
            <div className="auth-form-container">
              <div className="auth-header">
                <div className="logo">
                  <span className="logo-text">TaxPal</span>
                </div>
                <h1 className="auth-title">Success!</h1>
                <p className="auth-subtitle">Your password has been reset successfully</p>
              </div>

              <div className="success-message-banner celebrate">
                ✅ Password reset successfully! Redirecting to login...
              </div>

              <div className="auth-footer">
                <p><Link to="/login" className="auth-link">Continue to Sign In</Link></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        {/* Left Side - Image/Illustration */}
        <div className="auth-left">
          <div className="auth-image">
            <div className="image-content">
              <div className="main-illustration">
                <div className="illustration-bg"></div>
                <div className="illustration-text">
                  <h2>Create New Password</h2>
                  <p>Enter your new password below. Make sure it's strong and secure to protect your account.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="auth-right">
          <div className="auth-form-container">
            <div className="auth-header">
              <div className="logo">
                <span className="logo-text">TaxPal</span>
              </div>
              <h1 className="auth-title">Reset Password</h1>
              <p className="auth-subtitle">Enter your new password</p>
            </div>

            {error && (
              <div className={`error-message ${error.includes('Password must contain') ? 'critical' : ''}`}>
                {error}
              </div>
            )}

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="password" className="form-label">New Password</label>
                <div className="input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Enter your new password"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                <div className="input-wrapper">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Confirm your new password"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <div className="password-requirements">
                <p>Password must contain:</p>
                <ul>
                  <li className={formData.password.length >= 6 ? 'valid' : ''}>
                    At least 6 characters
                  </li>
                  <li className={/[a-z]/.test(formData.password) ? 'valid' : ''}>
                    One lowercase letter
                  </li>
                  <li className={/[A-Z]/.test(formData.password) ? 'valid' : ''}>
                    One uppercase letter
                  </li>
                  <li className={/\d/.test(formData.password) ? 'valid' : ''}>
                    One number
                  </li>
                </ul>
              </div>

              <button type="submit" className="auth-button primary" disabled={loading}>
                {loading ? 'Resetting Password...' : 'Reset Password'}
              </button>
            </form>

            <div className="auth-footer">
              <p>Remember your password? <Link to="/login" className="auth-link">Back to Sign In</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
