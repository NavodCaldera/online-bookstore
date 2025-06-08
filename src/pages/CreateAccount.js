import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import '../styles/auth.css';
import '../styles/home.css';

function CreateAccount() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    userType: 'buyer',
    agreeToTerms: false
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3002/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: formData.fullName,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          user_type: formData.userType
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert('Account created successfully! You can now log in.');

        // Store user data and token if needed
        if (data.token) {
          localStorage.setItem('authToken', data.token);
          localStorage.setItem('userData', JSON.stringify(data.user));
        }

        // Reset form
        setFormData({
          fullName: '',
          email: '',
          password: '',
          confirmPassword: '',
          phone: '',
          userType: 'buyer',
          agreeToTerms: false
        });

        // Redirect to login or dashboard
        // window.location.href = '/browse';
      } else {
        alert(data.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Navigation Bar */}
      <Navigation />

      <div className="auth-header">
        <h1>Create Your Account</h1>
        <p>Sign up to start buying or selling pre-owned educational materials</p>
      </div>

      <div className="auth-content">
        <div className="auth-form-container">
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className={errors.fullName ? 'error' : ''}
                placeholder="Enter your full name"
              />
              {errors.fullName && <span className="error-message">{errors.fullName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={errors.email ? 'error' : ''}
                placeholder="Enter your email address"
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={errors.phone ? 'error' : ''}
                placeholder="Enter your phone number"
              />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={errors.password ? 'error' : ''}
                  placeholder="Create a password"
                />
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={errors.confirmPassword ? 'error' : ''}
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
              </div>
            </div>

            <div className="form-group">
              <label>Account Type</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="userType"
                    value="buyer"
                    checked={formData.userType === 'buyer'}
                    onChange={handleInputChange}
                  />
                  <span className="radio-custom"></span>
                  Buyer - I want to purchase books
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="userType"
                    value="seller"
                    checked={formData.userType === 'seller'}
                    onChange={handleInputChange}
                  />
                  <span className="radio-custom"></span>
                  Seller - I want to sell books
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="userType"
                    value="both"
                    checked={formData.userType === 'both'}
                    onChange={handleInputChange}
                  />
                  <span className="radio-custom"></span>
                  Both - I want to buy and sell
                </label>
              </div>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  className={errors.agreeToTerms ? 'error' : ''}
                />
                <span className="checkbox-custom"></span>
                I agree to the <a href="#" className="link">Terms and Conditions</a> and <a href="#" className="link">Privacy Policy</a>
              </label>
              {errors.agreeToTerms && <span className="error-message">{errors.agreeToTerms}</span>}
            </div>

            <button 
              type="submit" 
              className={`auth-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Creating Account...
                </>
              ) : (
                <>
                  <i className="fas fa-user-plus"></i>
                  Create Account
                </>
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>Already have an account? <a href="/login" className="link">Sign in here</a></p>
          </div>
        </div>

        <div className="auth-benefits">
          <h3>Why Join PageTurn?</h3>
          <div className="benefits-list">
            <div className="benefit-item">
              <i className="fas fa-book"></i>
              <div>
                <h4>Vast Collection</h4>
                <p>Access thousands of pre-owned educational materials at affordable prices</p>
              </div>
            </div>
            <div className="benefit-item">
              <i className="fas fa-money-bill-wave"></i>
              <div>
                <h4>Earn Money</h4>
                <p>Sell your used books and educational materials to other students</p>
              </div>
            </div>
            <div className="benefit-item">
              <i className="fas fa-shield-alt"></i>
              <div>
                <h4>Secure Transactions</h4>
                <p>Safe and secure payment processing for all transactions</p>
              </div>
            </div>
            <div className="benefit-item">
              <i className="fas fa-shipping-fast"></i>
              <div>
                <h4>Island-wide Delivery</h4>
                <p>Fast and reliable delivery across Sri Lanka</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* First Footer Section */}
      <div className="footer-section">
        <div className="container">
          <div className="footer-left">
            <h2>Receive The Latest Offers & Updates Via Email</h2>
            <form className="subscribe-form">
              <input type="email" placeholder="Enter your email" required />
              <button type="submit">Subscribe</button>
            </form>
          </div>

          <div className="footer-center">
            <div className="footer-column">
              <h3>Categories</h3>
              <ul>
                <li><Link to="/browse?category=mathematics">Mathematics</Link></li>
                <li><Link to="/browse?category=reference">Reference</Link></li>
                <li><Link to="/browse?category=technology">Technology</Link></li>
                <li><Link to="/browse?category=literature">Literature</Link></li>
                <li><Link to="/browse?category=non-fiction">Non-Fiction</Link></li>
              </ul>
            </div>
            <div className="footer-column">
              <h3>Quick Links</h3>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/buy-sell?section=buy">Buy Books</Link></li>
                <li><Link to="/buy-sell?section=sell">Sell Books</Link></li>
                <li><a href="#">My Account</a></li>
                <li><a href="#">Help</a></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
            </div>
          </div>

          <div className="footer-right">
            <div style={{textAlign: 'right'}}>
              <Link to="/">
                <img src="/logo.webp" alt="Site Logo" className="logo" />
              </Link>
              <span style={{textAlign: 'right'}}>PageTurn</span>
            </div>
            <p>Empowering education through affordable reading</p>
          </div>
        </div>
      </div>

      {/* Second Footer Section */}
      <div className="footer-bottom">
        <div className="container">
          <div className="footer-social">
            <h4>Follow Us</h4>
            <div className="social-icons">
              <a href="#"><i className="fab fa-facebook-f"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
              <a href="#"><i className="fab fa-twitter"></i></a>
              <a href="#"><i className="fab fa-linkedin-in"></i></a>
            </div>
          </div>

          <div className="footer-center-logo">
            <Link to="/">
              <img src="/logo.webp" alt="Logo" />
            </Link>
            <span>PageTurn</span>
          </div>

          <div className="footer-payments">
            <h4>We accept</h4>
            <div className="payment-icons">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="MasterCard" />
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Footer */}
      <footer className="copyright-footer">
        <p>&copy; 2025 PageTurn Bookstore. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default CreateAccount;
