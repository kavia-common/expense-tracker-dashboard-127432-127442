import React, { useState, useEffect } from 'react';
import axios from 'axios';

// PUBLIC_INTERFACE
const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: ''
  });

  useEffect(() => {
    loadProfile();
    loadUserStats();
  }, []);

  // PUBLIC_INTERFACE
  const loadProfile = async () => {
    try {
      const response = await axios.get('/api/user/profile');
      if (response.data.status === 'success') {
        setProfile(response.data.data);
        setFormData({
          name: response.data.data.name || ''
        });
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
      setError('Failed to load profile information.');
    } finally {
      setLoading(false);
    }
  };

  // PUBLIC_INTERFACE
  const loadUserStats = async () => {
    try {
      const response = await axios.get('/api/user/stats');
      if (response.data.status === 'success') {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Failed to load user stats:', error);
    }
  };

  // PUBLIC_INTERFACE
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // PUBLIC_INTERFACE
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }

    if (formData.name.length < 2) {
      setError('Name must be at least 2 characters long');
      return;
    }

    setUpdating(true);

    try {
      const response = await axios.put('/api/user/profile', {
        name: formData.name.trim()
      });

      if (response.data.status === 'success') {
        setProfile(response.data.data);
        setSuccess('Profile updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.data?.details) {
        setError(error.response.data.details.map(d => d.message).join(', '));
      } else {
        setError('Failed to update profile. Please try again.');
      }
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1 className="profile-title">Profile Settings</h1>
        <p className="profile-subtitle">Manage your account information and view statistics</p>
      </div>

      <div className="profile-content">
        <div className="profile-grid">
          {/* Profile Information Card */}
          <div className="card profile-info-card">
            <div className="card-header">
              <h2 className="card-title">Profile Information</h2>
            </div>
            <div className="card-body">
              {error && (
                <div className="alert alert-error">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="alert alert-success">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="profile-avatar-section">
                  <div className="profile-avatar-large">
                    {profile?.name?.charAt(0)?.toUpperCase() || profile?.email?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="avatar-info">
                    <p className="avatar-email">{profile?.email}</p>
                    <p className="avatar-joined">Joined {formatDate(profile?.created_at)}</p>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    Display Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-input"
                    placeholder="Enter your display name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={updating}
                    required
                    minLength={2}
                    maxLength={100}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    value={profile?.email || ''}
                    disabled
                    readOnly
                  />
                  <small className="form-help">
                    Email address cannot be changed. Contact support if needed.
                  </small>
                </div>

                <div className="form-actions">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={updating}
                  >
                    {updating ? (
                      <>
                        <div className="loading-spinner-small"></div>
                        Updating...
                      </>
                    ) : (
                      'Update Profile'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Statistics Card */}
          <div className="card profile-stats-card">
            <div className="card-header">
              <h2 className="card-title">Your Statistics</h2>
            </div>
            <div className="card-body">
              {stats ? (
                <div className="stats-list">
                  <div className="stat-item">
                    <div className="stat-icon">📊</div>
                    <div className="stat-details">
                      <span className="stat-value">{stats.total_expenses}</span>
                      <span className="stat-name">Total Expenses</span>
                    </div>
                  </div>

                  <div className="stat-item">
                    <div className="stat-icon">💰</div>
                    <div className="stat-details">
                      <span className="stat-value">${stats.total_amount?.toFixed(2)}</span>
                      <span className="stat-name">Total Amount</span>
                    </div>
                  </div>

                  <div className="stat-item">
                    <div className="stat-icon">📈</div>
                    <div className="stat-details">
                      <span className="stat-value">${stats.average_amount?.toFixed(2)}</span>
                      <span className="stat-name">Average Expense</span>
                    </div>
                  </div>

                  <div className="stat-item">
                    <div className="stat-icon">📁</div>
                    <div className="stat-details">
                      <span className="stat-value">{stats.categories_used}</span>
                      <span className="stat-name">Categories Used</span>
                    </div>
                  </div>

                  <div className="stat-item">
                    <div className="stat-icon">📅</div>
                    <div className="stat-details">
                      <span className="stat-value">${stats.monthly_total?.toFixed(2)}</span>
                      <span className="stat-name">This Month</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="stats-loading">
                  <div className="loading-spinner-small"></div>
                  <p>Loading statistics...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
