import React, { useState } from 'react';
import './AdminLogin.css';

function AdminLogin() {
  const [username, setUsername] = useState('');
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
    if (!username || !password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    // Simulate admin login
    setTimeout(() => {
      if (username === 'admin' && password === 'admin123') {
        setSuccess(`Welcome Admin! Logging in...`);
        if (rememberMe) {
          localStorage.setItem('adminUsername', username);
        }
        setUsername('');
        setPassword('');
        setIsLoading(false);
        // In production, redirect to admin dashboard
        // window.location.href = '/admin';
      } else {
        setError('Invalid username or password');
        setIsLoading(false);
      }
    }, 1500);
  };

  const handleSecurityQuestion = () => {
    setSuccess('Security code sent to your registered phone number');
    setError('');
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-wrapper">
        {/* Top Bar */}
        <div className="admin-top-bar">
          <div className="admin-header">
            <span className="admin-logo">👨‍💼</span>
            <h1>Admin Control Panel</h1>
          </div>
          <div className="admin-badge">ADMIN</div>
        </div>

        {/* Main Content */}
        <div className="admin-login-content">
          {/* Left - Info */}
          <div className="admin-login-info">
            <div className="info-card">
              <div className="info-icon">🔐</div>
              <h3>Secure Access</h3>
              <p>Multi-factor authentication enabled</p>
            </div>
            <div className="info-card">
              <div className="info-icon">📊</div>
              <h3>Full Control</h3>
              <p>Manage schemes, users, and reports</p>
            </div>
            <div className="info-card">
              <div className="info-icon">📝</div>
              <h3>Audit Logs</h3>
              <p>Complete activity tracking</p>
            </div>
            <div className="info-card">
              <div className="info-icon">⚙️</div>
              <h3>Settings</h3>
              <p>Configure system parameters</p>
            </div>
          </div>

          {/* Right - Form */}
          <div className="admin-login-form-section">
            <div className="form-container">
              <h2>Administrator Login</h2>
              <p className="form-subtitle">Restricted Access - Authorized Personnel Only</p>

              {error && (
                <div className="alert alert-error">
                  <span className="alert-icon">⚠️</span>
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
                {/* Username Field */}
                <div className="form-group">
                  <label htmlFor="username">
                    <span>Admin Username</span>
                    <span className="required">*</span>
                  </label>
                  <div className="input-wrapper">
                    <span className="input-icon">👤</span>
                    <input
                      type="text"
                      id="username"
                      placeholder="Enter admin username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="form-group">
                  <label htmlFor="password">
                    <span>Admin Password</span>
                    <span className="required">*</span>
                  </label>
                  <div className="input-wrapper">
                    <span className="input-icon">🔑</span>
                    <input
                      type="password"
                      id="password"
                      placeholder="Enter admin password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Form Options */}
                <div className="form-options">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      disabled={isLoading}
                    />
                    <span>Remember this device</span>
                  </label>
                  <button
                    type="button"
                    className="security-btn"
                    onClick={handleSecurityQuestion}
                    disabled={isLoading}
                  >
                    2FA Code
                  </button>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="admin-login-btn"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner"></span>
                      Authenticating...
                    </>
                  ) : (
                    <>
                      Access Admin Panel
                      <span className="arrow">→</span>
                    </>
                  )}
                </button>
              </form>

              {/* Security Notice */}
              <div className="security-notice">
                <div className="notice-header">
                  <span>🛡️</span>
                  <h3>Security Notice</h3>
                </div>
                <ul>
                  <li>This is a restricted admin-only area</li>
                  <li>All activities are logged and monitored</li>
                  <li>Unauthorized access attempts are recorded</li>
                  <li>Please keep your credentials secure</li>
                </ul>
              </div>

              {/* Demo Credentials */}
              <div className="demo-credentials">
                <p>Demo Credentials:</p>
                <div className="credential-box">
                  <p><strong>Username:</strong> admin</p>
                  <p><strong>Password:</strong> admin123</p>
                </div>
              </div>

              {/* Support */}
              <div className="admin-support">
                <p>
                  Need assistance?{' '}
                  <a href="/admin-support" className="support-link">
                    Contact Admin Support
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="admin-footer">
          <p>
            <a href="/">Back to Portal</a> • 
            <a href="/privacy">Privacy</a> • 
            <a href="/terms">Terms</a> • 
            <a href="/security">Security</a>
          </p>
          <p>© 2026 Farmer Scheme Portal - Admin Access</p>
        </div>
      </div>

      {/* Session Timer (Optional) */}
      <div className="session-info">
        <p>⏱️ Admin sessions expire after 30 minutes of inactivity</p>
      </div>
    </div>
  );
}

export default AdminLogin;
