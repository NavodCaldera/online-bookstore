import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import Navigation from '../components/Navigation';
import '../styles/auth.css';
import '../styles/home.css';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

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

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
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
      const response = await fetch('http://localhost:3002/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Store user data and token
        if (data.token) {
          localStorage.setItem('authToken', data.token);
          localStorage.setItem('userData', JSON.stringify(data.user));
        }

        showToast('Login successful! Welcome back.', 'success');

        // Reset form
        setFormData({
          email: '',
          password: '',
          rememberMe: false
        });

        // Redirect to dashboard or previous page
        setTimeout(() => {
          navigate('/buy-sell');
        }, 1000);

      } else {
        showToast(data.error || 'Login failed. Please check your credentials.', 'error');
      }
    } catch (error) {
      console.error('Login error:', error);
      showToast('Login failed. Please check your connection and try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Navigation Bar */}
      <Navigation />

      <div className="auth-header">
        <h1>Welcome Back</h1>
        <p>Sign in to your PageTurn account</p>
      </div>

      <div className="auth-content">
        <div className="auth-form-container">
          <form onSubmit={handleSubmit} className="auth-form">
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
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={errors.password ? 'error' : ''}
                placeholder="Enter your password"
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                />
                <span className="checkmark"></span>
                Remember me
              </label>
              <Link to="/forgot-password" className="forgot-password-link">
                Forgot Password?
              </Link>
            </div>

            <button 
              type="submit" 
              className={`auth-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Signing In...
                </>
              ) : (
                <>
                  <i className="fas fa-sign-in-alt"></i>
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>Don't have an account? <Link to="/create-account" className="link">Create one here</Link></p>
          </div>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <div className="social-login">
            <button className="social-btn google-btn" disabled>
              <i className="fab fa-google"></i>
              Continue with Google
            </button>
            <button className="social-btn facebook-btn" disabled>
              <i className="fab fa-facebook-f"></i>
              Continue with Facebook
            </button>
          </div>
        </div>

        <div className="auth-benefits">
          <h3>Why Choose PageTurn?</h3>
          <div className="benefits-list">
            <div className="benefit-item">
              <i className="fas fa-money-bill-wave"></i>
              <div>
                <h4>Save Money</h4>
                <p>Get educational materials at 50-70% lower prices</p>
              </div>
            </div>
            <div className="benefit-item">
              <i className="fas fa-recycle"></i>
              <div>
                <h4>Eco-Friendly</h4>
                <p>Give books a second life and reduce waste</p>
              </div>
            </div>
            <div className="benefit-item">
              <i className="fas fa-users"></i>
              <div>
                <h4>Community</h4>
                <p>Connect with fellow students and educators</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
