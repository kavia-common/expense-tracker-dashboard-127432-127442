import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';

// PUBLIC_INTERFACE
const Navbar = ({ theme, toggleTheme }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  // PUBLIC_INTERFACE
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo and Brand */}
        <div className="navbar-brand">
          <Link to="/dashboard" className="brand-link">
            <div className="brand-icon">💰</div>
            <div className="brand-text">
              <span className="brand-name">ExpenseTracker</span>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="navbar-nav">
          <Link 
            to="/dashboard" 
            className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
          >
            <span className="nav-icon">📊</span>
            Dashboard
          </Link>
          <Link 
            to="/profile" 
            className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
          >
            <span className="nav-icon">👤</span>
            Profile
          </Link>
        </div>

        {/* Right side - Theme toggle and User menu */}
        <div className="navbar-actions">
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="theme-toggle-btn"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          {/* User Menu */}
          <div className="user-menu">
            <button 
              className="user-menu-trigger"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className="user-avatar">
                {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <span className="user-name">
                {user?.name || user?.email || 'User'}
              </span>
              <span className="dropdown-arrow">▼</span>
            </button>

            {showUserMenu && (
              <div className="user-menu-dropdown">
                <div className="user-menu-header">
                  <div className="user-info">
                    <p className="user-display-name">{user?.name || 'User'}</p>
                    <p className="user-email">{user?.email}</p>
                  </div>
                </div>
                <div className="user-menu-divider"></div>
                <div className="user-menu-items">
                  <Link 
                    to="/profile" 
                    className="user-menu-item"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <span className="menu-icon">👤</span>
                    Profile Settings
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="user-menu-item logout-item"
                  >
                    <span className="menu-icon">🚪</span>
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile overlay to close menu */}
      {showUserMenu && (
        <div 
          className="menu-overlay"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;
