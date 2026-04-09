import React, { useState } from 'react';
import './FarmerLogin.css';

function FarmerLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    // Validation
    if (!email || !password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    // Simulate login
    setTimeout(() => {
      setSuccess(`Welcome back! Logging in as ${email}`);
      if (rememberMe) {
        localStorage.setItem('farmerEmail', email);
      }
      // Reset form
      setEmail('');
      setPassword('');
      setIsLoading(false);
      // In production, redirect to dashboard
      // window.location.href = '/dashboard';
    }, 1500);
  };

  const handleForgotPassword = () => {
    if (!email) {
      setError('Please enter your email address first');
      return;
    }
    setSuccess(`Password reset link sent to ${email}`);
    setError('');
  };

  return (
    <div className="farmer-login-container">
      <div className="login-wrapper">
        {/* Left Side - Branding */}
        <div className="login-left">
          <div className="login-logo">
            <div className="logo-circle">🌾</div>
            <h1>Farmer Scheme Portal</h1>
            <p>Access government schemes for farmers</p>
          </div>

          <div className="login-features">
            <div className="feature-item">
              <div className="feature-icon">📋</div>
              <div>
                <h3>Discover Schemes</h3>
                <p>Browse and compare government schemes</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">✅</div>
              <div>
                <h3>Easy Application</h3>
                <p>Apply for schemes with just a few clicks</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">📊</div>
              <div>
                <h3>Track Status</h3>
                <p>Monitor your applications in real-time</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🔔</div>
              <div>
                <h3>Get Alerts</h3>
                <p>Receive notifications about deadlines</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="login-right">
          <div className="login-form-wrapper">
            <h2>Farmer Login</h2>
            <p className="login-subtitle">Sign in to your account</p>

            {error && (
              <div className="alert alert-error">
                <span className="alert-icon">❌</span>
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="alert alert-success">
                <span className="alert-icon">✅</span>
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Email Field */}
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-wrapper">
                  <span className="input-icon">📧</span>
                  <input
                    type="email"
                    id="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    type="password"
                    id="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="form-options">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={isLoading}
                  />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  className="forgot-password-btn"
                  onClick={handleForgotPassword}
                  disabled={isLoading}
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="login-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner"></span>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <span className="arrow">→</span>
                  </>
                )}
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="signup-section">
              <p>Don't have an account?</p>
              <a href="/register" className="signup-link">
                Create account here
              </a>
            </div>

            {/* Divider */}
            <div className="divider">
              <span>or</span>
            </div>

            {/* Social Login (Optional) */}
            <div className="social-login">
              <button type="button" className="social-btn google-btn">
                <span>🔵</span>
                Continue with Google
              </button>
            </div>

            {/* Demo Credentials */}
            <div className="demo-info">
              <p>Demo Account:</p>
              <p className="demo-text">
                Email: farmer@example.com
                <br />
                Password: password123
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="login-footer">
            <p>Need help? <a href="/help">Contact support</a></p>
            <p><a href="/terms">Terms</a> • <a href="/privacy">Privacy</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FarmerLogin;
