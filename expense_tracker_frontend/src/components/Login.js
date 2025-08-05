import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../App';

// PUBLIC_INTERFACE
const Login = () => {
  const { isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success', 'error', 'info'
  const [magicLink, setMagicLink] = useState('');

  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // PUBLIC_INTERFACE
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setMessage('Please enter your email address');
      setMessageType('error');
      return;
    }

    if (!email.includes('@')) {
      setMessage('Please enter a valid email address');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');
    setMagicLink('');

    try {
      const response = await axios.post('/api/auth/magic-link', { email });
      
      if (response.data.status === 'success') {
        setMessage(response.data.message);
        setMessageType('success');
        
        // In development, show the magic link for easy testing
        if (response.data.magicLink) {
          setMagicLink(response.data.magicLink);
        }
      }
    } catch (error) {
      console.error('Magic link request failed:', error);
      
      if (error.response?.data?.message) {
        setMessage(error.response.data.message);
      } else if (error.response?.data?.details) {
        setMessage(error.response.data.details.map(d => d.message).join(', '));
      } else {
        setMessage('Failed to send magic link. Please try again.');
      }
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo">
            <h1 className="logo-text">ExpenseTracker</h1>
            <p className="logo-subtitle">Track your expenses with ease</p>
          </div>
        </div>

        <div className="login-form">
          <h2 className="form-title">Welcome Back</h2>
          <p className="form-subtitle">
            Enter your email address and we'll send you a magic link to sign in.
          </p>

          {message && (
            <div className={`alert alert-${messageType}`}>
              {message}
            </div>
          )}

          {magicLink && (
            <div className="magic-link-dev">
              <p className="text-sm text-muted mb-2">
                <strong>Development Mode:</strong> Click the link below to sign in:
              </p>
              <a 
                href={magicLink} 
                className="magic-link-url"
                target="_blank"
                rel="noopener noreferrer"
              >
                {magicLink}
              </a>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="form-input"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-large login-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="loading-spinner-small"></div>
                  Sending Magic Link...
                </>
              ) : (
                'Send Magic Link'
              )}
            </button>
          </form>

          <div className="login-footer">
            <p className="text-sm text-muted">
              We'll send you a secure link that will sign you in instantly.
              No password required!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
