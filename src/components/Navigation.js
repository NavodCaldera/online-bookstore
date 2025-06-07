import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/navigation.css';

function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo/Brand */}
        <Link to="/" className="nav-logo">
          <i className="fas fa-book-open"></i>
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
          
          {/* Additional Navigation Items */}
          <div className="nav-link dropdown">
            <i className="fas fa-ellipsis-h"></i>
            <span>More</span>
            <div className="dropdown-content">
              <Link to="/about" onClick={() => setIsMenuOpen(false)}>
                <i className="fas fa-info-circle"></i>
                About Us
              </Link>
              <Link to="/contact" onClick={() => setIsMenuOpen(false)}>
                <i className="fas fa-envelope"></i>
                Contact
              </Link>
              <Link to="/help" onClick={() => setIsMenuOpen(false)}>
                <i className="fas fa-question-circle"></i>
                Help
              </Link>
            </div>
          </div>
        </div>

        {/* User Actions */}
        <div className="nav-actions">
          <Link to="/wishlist" className="nav-action-btn">
            <i className="fas fa-heart"></i>
            <span className="count-badge">2</span>
          </Link>
          
          <Link to="/cart" className="nav-action-btn cart-btn">
            <i className="fas fa-shopping-cart"></i>
            <span className="cart-count">0</span>
          </Link>
          
          <Link to="/login" className="nav-action-btn login-btn">
            <i className="fas fa-sign-in-alt"></i>
            <span>Login</span>
          </Link>
          
          <Link to="/signup" className="nav-action-btn signup-btn">
            <i className="fas fa-user-plus"></i>
            <span>Sign Up</span>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="nav-toggle" onClick={toggleMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
