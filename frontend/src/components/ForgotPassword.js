import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import './Auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authAPI.forgotPassword(email);
      setIsSubmitted(true);
    } catch (error) {
      setError(error.message || 'Failed to send password reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
                  <h2>Reset Your Password</h2>
                  <p>Don't worry! It happens to the best of us. Enter your email and we'll send you a link to reset your password.</p>
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
              <h1 className="auth-title">Forgot Password?</h1>
              <p className="auth-subtitle">
                {isSubmitted 
                  ? "Check your email for reset instructions"
                  : "Enter your email to reset your password"
                }
              </p>
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            {!isSubmitted ? (
              <form className="auth-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                    placeholder="Enter your email address"
                    required
                  />
                </div>

                <button type="submit" className="auth-button primary" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            ) : (
              <div className="success-message">
                <div className="success-icon">✓</div>
                <h3>Email Sent!</h3>
                <p>We've sent a password reset link to <strong>{email}</strong></p>
                <p>Please check your email and follow the instructions to reset your password.</p>
                
                <div className="reset-actions">
                  <button 
                    className="auth-button secondary"
                    onClick={() => setIsSubmitted(false)}
                  >
                    Try Another Email
                  </button>
                </div>
              </div>
            )}

            <div className="auth-footer">
              <p>Remember your password? <Link to="/login" className="auth-link">Back to Sign In</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
