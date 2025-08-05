import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../App';

// PUBLIC_INTERFACE
const MagicLinkCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('Verifying your magic link...');

  useEffect(() => {
    const verifyToken = async () => {
      const token = searchParams.get('token');
      
      if (!token) {
        setStatus('error');
        setMessage('Invalid magic link. No token found.');
        return;
      }

      try {
        const response = await axios.get(`/api/auth/verify?token=${token}`);
        
        if (response.data.status === 'success') {
          const { user, token: authToken } = response.data;
          
          // Log the user in
          login(user, authToken);
          
          setStatus('success');
          setMessage('Successfully authenticated! Redirecting to dashboard...');
          
          // Redirect to dashboard after a short delay
          setTimeout(() => {
            navigate('/dashboard', { replace: true });
          }, 1500);
        } else {
          setStatus('error');
          setMessage('Authentication failed. Please try again.');
        }
      } catch (error) {
        console.error('Magic link verification failed:', error);
        setStatus('error');
        
        if (error.response?.data?.message) {
          setMessage(error.response.data.message);
        } else {
          setMessage('Magic link verification failed. The link may be expired or invalid.');
        }
      }
    };

    verifyToken();
  }, [searchParams, login, navigate]);

  const handleGoToLogin = () => {
    navigate('/login', { replace: true });
  };

  return (
    <div className="callback-container">
      <div className="callback-card">
        <div className="callback-content">
          {status === 'verifying' && (
            <>
              <div className="loading-spinner"></div>
              <h2 className="callback-title">Verifying Magic Link</h2>
              <p className="callback-message">{message}</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="success-icon">✓</div>
              <h2 className="callback-title text-success">Authentication Successful</h2>
              <p className="callback-message">{message}</p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="error-icon">⚠</div>
              <h2 className="callback-title text-error">Authentication Failed</h2>
              <p className="callback-message">{message}</p>
              <button 
                onClick={handleGoToLogin}
                className="btn btn-primary btn-large"
              >
                Go to Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MagicLinkCallback;
