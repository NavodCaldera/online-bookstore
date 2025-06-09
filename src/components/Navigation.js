import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../styles/navigation.css';
import logoImg from '../assets/images/logo.webp';

function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { getTotalItems } = useCart();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const toggleMoreDropdown = () => {
    setIsMoreDropdownOpen(!isMoreDropdownOpen);
  };

  // Check authentication status on component mount and when localStorage changes
  useEffect(() => {
    const checkAuthStatus = () => {
      const authToken = localStorage.getItem('authToken');
      const userData = localStorage.getItem('userData');

      if (authToken && userData) {
        setIsLoggedIn(true);
        try {
          setUserInfo(JSON.parse(userData));
        } catch (error) {
          console.error('Error parsing user data:', error);
          setIsLoggedIn(false);
          setUserInfo(null);
        }
      } else {
        setIsLoggedIn(false);
        setUserInfo(null);
      }
    };

    checkAuthStatus();

    // Listen for storage changes (when user logs in/out in another tab)
    const handleStorageChange = (e) => {
      if (e.key === 'authToken' || e.key === 'userData') {
        checkAuthStatus();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setIsLoggedIn(false);
    setUserInfo(null);
    setIsUserDropdownOpen(false);
    navigate('/');
  };

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('menu-open');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.classList.remove('menu-open');
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('menu-open');
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.user-dropdown-container')) {
        setIsUserDropdownOpen(false);
      }
      if (!event.target.closest('.more-dropdown-container')) {
        setIsMoreDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsUserDropdownOpen(false);
    setIsMoreDropdownOpen(false);
  }, [location.pathname]);

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo/Brand */}
        <Link to="/" className="nav-logo">
          <img src={logoImg} alt="PageTurn Logo" className="nav-logo-img" />
          <span>PageTurn</span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <Link 
            to="/" 
            className={`nav-link ${isActive('/')}`}
            onClick={() => setIsMenuOpen(false)}
          >
            <i className="fas fa-home"></i>
            <span>Home</span>
          </Link>
          
          <Link 
            to="/browse" 
            className={`nav-link ${isActive('/browse')}`}
            onClick={() => setIsMenuOpen(false)}
          >
            <i className="fas fa-search"></i>
            <span>Browse Books</span>
          </Link>
          
          <Link 
            to="/buy-sell" 
            className={`nav-link ${isActive('/buy-sell')}`}
            onClick={() => setIsMenuOpen(false)}
          >
            <i className="fas fa-exchange-alt"></i>
            <span>Buy & Sell</span>
          </Link>
          
          {!isLoggedIn && (
            <Link
              to="/create-account"
              className={`nav-link ${isActive('/create-account')}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <i className="fas fa-user-plus"></i>
              <span>Sign Up</span>
            </Link>
          )}

          {/* Additional Navigation Items */}
          <div className="nav-link dropdown more-dropdown-container">
            <button
              className="more-dropdown-trigger"
              onClick={toggleMoreDropdown}
            >
              <i className="fas fa-ellipsis-h"></i>
              <span>More</span>
              <i className={`fas fa-chevron-down dropdown-arrow ${isMoreDropdownOpen ? 'open' : ''}`}></i>
            </button>
            {isMoreDropdownOpen && (
              <div className="dropdown-content">
                <Link to="/about" onClick={() => { setIsMenuOpen(false); setIsMoreDropdownOpen(false); }}>
                  <i className="fas fa-info-circle"></i>
                  About Us
                </Link>
                <Link to="/contact" onClick={() => { setIsMenuOpen(false); setIsMoreDropdownOpen(false); }}>
                  <i className="fas fa-envelope"></i>
                  Contact
                </Link>
                <Link to="/help" onClick={() => { setIsMenuOpen(false); setIsMoreDropdownOpen(false); }}>
                  <i className="fas fa-question-circle"></i>
                  Help
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* User Actions */}
        <div className="nav-actions">
          <Link to="/buy-sell?section=buy" className="nav-action-btn cart-btn">
            <i className="fas fa-shopping-cart"></i>
            <span className="cart-count">{getTotalItems()}</span>
          </Link>

          {isLoggedIn ? (
            /* Logged In User Dropdown */
            <div className="user-dropdown-container">
              <button
                className="nav-action-btn profile-btn user-dropdown-trigger"
                onClick={toggleUserDropdown}
              >
                <i className="fas fa-user-circle"></i>
                <span>{userInfo?.full_name || 'User'}</span>
                <i className={`fas fa-chevron-down dropdown-arrow ${isUserDropdownOpen ? 'open' : ''}`}></i>
              </button>

              {isUserDropdownOpen && (
                <div className="user-dropdown-menu">
                  <div className="user-dropdown-header">
                    <div className="user-avatar">
                      <i className="fas fa-user-circle"></i>
                    </div>
                    <div className="user-info">
                      <div className="user-name">{userInfo?.full_name}</div>
                      <div className="user-email">{userInfo?.email}</div>
                    </div>
                  </div>

                  <div className="user-dropdown-divider"></div>

                  <Link
                    to="/buy-sell?section=account"
                    className="user-dropdown-item"
                    onClick={() => setIsUserDropdownOpen(false)}
                  >
                    <i className="fas fa-user"></i>
                    <span>My Account</span>
                  </Link>

                  <Link
                    to="/buy-sell?section=account"
                    className="user-dropdown-item"
                    onClick={() => setIsUserDropdownOpen(false)}
                  >
                    <i className="fas fa-cog"></i>
                    <span>Account Settings</span>
                  </Link>

                  <Link
                    to="/buy-sell?section=manage"
                    className="user-dropdown-item"
                    onClick={() => setIsUserDropdownOpen(false)}
                  >
                    <i className="fas fa-list"></i>
                    <span>My Listings</span>
                  </Link>

                  <Link
                    to="/buy-sell?section=buy"
                    className="user-dropdown-item"
                    onClick={() => setIsUserDropdownOpen(false)}
                  >
                    <i className="fas fa-shopping-bag"></i>
                    <span>My Orders</span>
                  </Link>

                  <div className="user-dropdown-divider"></div>

                  <button
                    className="user-dropdown-item logout-item"
                    onClick={handleLogout}
                  >
                    <i className="fas fa-sign-out-alt"></i>
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Not Logged In - Show Login/Signup */
            <>
              <Link to="/create-account" className="nav-action-btn signup-btn">
                <i className="fas fa-user-plus"></i>
                <span>Sign Up</span>
              </Link>

              <Link to="/login" className="nav-action-btn login-btn">
                <i className="fas fa-sign-in-alt"></i>
                <span>Login</span>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className={`nav-toggle ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
