import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import Navigation from '../components/Navigation';
import '../styles/buysell.css';
import '../styles/home.css';

function BuySell() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');
  const { cartItems, updateQuantity, getTotalPrice } = useCart();
  const { showToast } = useToast();

  const [userProfile, setUserProfile] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editFormData, setEditFormData] = useState({
    full_name: '',
    phone: '',
    user_type: 'buyer'
  });

  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  const [sellFormData, setSellFormData] = useState({
    title: '',
    author: '',
    category_id: '',
    subject: '',
    description: '',
    condition: '',
    original_price: '',
    price: '',
    negotiable: 'yes'
  });

  const [myListings, setMyListings] = useState([
    {
      id: 1,
      title: 'Chemistry Textbook',
      price: 1800,
      status: 'active',
      views: 45,
      inquiries: 3,
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
    },
    {
      id: 2,
      title: 'Biology Notes',
      price: 900,
      status: 'sold',
      views: 67,
      inquiries: 8,
      image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
    }
  ]);

  // ADDED: A helper constant to determine if the user has selling privileges.
  const canSell = userProfile && (userProfile.user_type === 'seller' || userProfile.user_type === 'both');

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const section = searchParams.get('section');
    if (section && ['buy', 'sell', 'overview', 'manage', 'account'].includes(section)) {
      setActiveSection(section);
    }
  }, [location.search]);

  useEffect(() => {
    loadUserProfile();
    loadCategories();
  }, []);

  // ADDED: This effect protects the 'sell' and 'manage' routes from unauthorized access.
  useEffect(() => {
    if (isLoadingProfile) {
      return;
    }
    
    if ((activeSection === 'sell' || activeSection === 'manage') && !canSell) {
      showToast('You must be a seller to access this page.', 'error');
      setActiveSection('account');
      navigate('/buy-sell?section=account', { replace: true });
    }
  }, [activeSection, canSell, isLoadingProfile, navigate, showToast]);

  const loadUserProfile = async () => {
    try {
      const userData = localStorage.getItem('userData');
      const authToken = localStorage.getItem('authToken');

      if (!userData || !authToken) {
        showToast('Please log in to view your account', 'error');
        navigate('/login');
        return;
      }

      const user = JSON.parse(userData);
      setUserProfile(user);
      setEditFormData({
        full_name: user.full_name || '',
        phone: user.phone || '',
        user_type: user.user_type || 'buyer'
      });

      const response = await fetch(`http://localhost:3002/api/users/profile/${user.id}`, {
        headers: { 'Authorization': `Bearer ${authToken}`, 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUserProfile(data.data);
          setEditFormData({
            full_name: data.data.full_name || '',
            phone: data.data.phone || '',
            user_type: data.data.user_type || 'buyer'
          });
          localStorage.setItem('userData', JSON.stringify(data.data));
        }
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      showToast('Error loading profile data', 'error');
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await fetch('http://localhost:3002/api/categories');
      const data = await response.json();

      if (response.ok && data.success) {
        setCategories(data.data);
      } else {
        showToast('Failed to load categories', 'error');
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      showToast('Error loading categories', 'error');
    } finally {
      setIsLoadingCategories(false);
    }
  };


  const handleSaveProfile = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken || !userProfile) {
        showToast('Authentication required', 'error');
        return;
      }

      const response = await fetch(`http://localhost:3002/api/users/profile/${userProfile.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editFormData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showToast('Profile updated successfully!', 'success');
        setIsEditingProfile(false);
        // Reload profile data
        await loadUserProfile();
      } else {
        showToast(data.error || 'Failed to update profile', 'error');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast('Error updating profile', 'error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    showToast('Logged out successfully', 'success');
    navigate('/');
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSellFormChange = (e) => {
    const { name, value } = e.target;
    setSellFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSellFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const authToken = localStorage.getItem('authToken');
      const userData = localStorage.getItem('userData');

      if (!authToken || !userData) {
        showToast('Please log in to list items', 'error');
        navigate('/login');
        return;
      }

      const user = JSON.parse(userData);

      // Prepare the book data for submission
      const bookData = {
        title: sellFormData.title,
        author: sellFormData.author,
        condition: sellFormData.condition,
        published_year: new Date().getFullYear(),
        edition: '1st',
        short_description: sellFormData.description,
        availability: 1,
        category_id: parseInt(sellFormData.category_id),
        rating: 0.0,
        price: parseFloat(sellFormData.price),
        isbn: '',
        language: 'English',
        seller_id: user.id
      };

      console.log('Submitting book data:', bookData);
      showToast('Book listing functionality will be implemented soon!', 'info');

      // TODO: Implement actual API call to create book listing
    } catch (error) {
      console.error('Error submitting book listing:', error);
      showToast('Error submitting listing', 'error');
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      showToast('Your cart is empty. Add some items first!', 'error');
      return;
    }

    // Check if user is logged in
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      showToast('Please log in to proceed to checkout', 'error');
      navigate('/login');
      return;
    }

    // Show loading message and navigate to checkout page
    showToast('Redirecting to checkout...', 'info');
    navigate('/checkout');
  };

  const handleEditProfile = () => {
    setIsEditingProfile(true);
  };

  const handleCancelEdit = () => {
    setIsEditingProfile(false);
    if (userProfile) {
      setEditFormData({
        full_name: userProfile.full_name || '',
        phone: userProfile.phone || '',
        user_type: userProfile.user_type || 'buyer'
      });
    }
  };

  const renderOverview = () => (
    <div className="overview-section">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon buy"><i className="fas fa-shopping-cart"></i></div>
          <div className="stat-content">
            <h3>Buying</h3>
            <div className="stat-number">{cartItems.length}</div>
            <p>Items in cart</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon sell"><i className="fas fa-tag"></i></div>
          <div className="stat-content">
            <h3>Selling</h3>
            <div className="stat-number">{myListings.length}</div>
            <p>Active listings</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon earnings"><i className="fas fa-coins"></i></div>
          <div className="stat-content">
            <h3>Earnings</h3>
            <div className="stat-number">LKR 12,500</div>
            <p>Total earned</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon savings"><i className="fas fa-piggy-bank"></i></div>
          <div className="stat-content">
            <h3>Savings</h3>
            <div className="stat-number">LKR 8,200</div>
            <p>Money saved</p>
          </div>
        </div>
      </div>
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <button className="action-btn buy-btn" onClick={() => setActiveSection('buy')}>
            <i className="fas fa-shopping-cart"></i>
            <span>View Cart & Buy</span>
            <small>{cartItems.length} items</small>
          </button>
          {canSell && (
            <button className="action-btn sell-btn" onClick={() => setActiveSection('sell')}>
              <i className="fas fa-plus"></i>
              <span>List New Item</span>
              <small>Start selling</small>
            </button>
          )}
          <button className="action-btn browse-btn" onClick={() => navigate('/browse')}>
            <i className="fas fa-search"></i>
            <span>Browse Materials</span>
            <small>Find books</small>
          </button>
          {canSell && (
            <button className="action-btn manage-btn" onClick={() => setActiveSection('manage')}>
              <i className="fas fa-cog"></i>
              <span>Manage Listings</span>
              <small>{myListings.filter(item => item.status === 'active').length} active</small>
            </button>
          )}
        </div>
      </div>
      {/* ... other content ... */}
    </div>
  );

  // FIXED: The content of this function has been restored
  const renderBuySection = () => (
    <div className="buy-section">
      <div className="section-header">
        <h2>Your Shopping Cart</h2>
        <p>Review your items and proceed to checkout</p>
      </div>
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <i className="fas fa-shopping-cart"></i>
          <h3>Your cart is empty</h3>
          <p>Browse our collection to find educational materials</p>
          <button className="btn-primary" onClick={() => navigate('/browse')}>Browse Materials</button>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.title} className="item-image" />
                <div className="item-details">
                  <h4>{item.title}</h4>
                  <p>by {item.author}</p>
                  <p className="seller">Sold by: {item.seller}</p>
                </div>
                <div className="item-quantity">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="quantity-btn">-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="quantity-btn">+</button>
                </div>
                <div className="item-price">
                  <span>LKR {(item.price * item.quantity).toLocaleString()}</span>
                </div>
                <button onClick={() => updateQuantity(item.id, 0)} className="remove-btn">
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <div className="summary-card">
              <h3>Order Summary</h3>
              <div className="summary-line">
                <span>Subtotal:</span>
                <span>LKR {getTotalPrice().toLocaleString()}</span>
              </div>
              <div className="summary-line">
                <span>Delivery:</span>
                <span>LKR 300</span>
              </div>
              <div className="summary-line total">
                <span>Total:</span>
                <span>LKR {(getTotalPrice() + 300).toLocaleString()}</span>
              </div>
              <button className="checkout-btn" onClick={handleCheckout}>
                <i className="fas fa-credit-card"></i>
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderSellSection = () => (
    <div className="sell-section">
      <div className="section-header">
        <h2>Sell Your Educational Materials</h2>
        <p>Complete secure transactions and help support affordable education</p>
      </div>

      <div className="sell-form-container">
        <form className="sell-form" onSubmit={handleSellFormSubmit}>
          <div className="form-section">
            <h3>Item Details</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  name="title"
                  value={sellFormData.title}
                  onChange={handleSellFormChange}
                  placeholder="Enter book title"
                  required
                />
              </div>
              <div className="form-group">
                <label>Author *</label>
                <input
                  type="text"
                  name="author"
                  value={sellFormData.author}
                  onChange={handleSellFormChange}
                  placeholder="Enter author name"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category *</label>
                <select
                  name="category_id"
                  value={sellFormData.category_id}
                  onChange={handleSellFormChange}
                  required
                >
                  <option value="">Select category</option>
                  {isLoadingCategories ? (
                    <option disabled>Loading categories...</option>
                  ) : (
                    categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))
                  )}
                </select>
              </div>
              <div className="form-group">
                <label>Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={sellFormData.subject}
                  onChange={handleSellFormChange}
                  placeholder="e.g., Mathematics, Physics"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                name="description"
                value={sellFormData.description}
                onChange={handleSellFormChange}
                placeholder="Describe the condition, edition, and any additional details..."
                rows="4"
                required
              ></textarea>
            </div>
          </div>

          <div className="form-section">
            <h3>Pricing & Condition</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Condition *</label>
                <select
                  name="condition"
                  value={sellFormData.condition}
                  onChange={handleSellFormChange}
                  required
                >
                  <option value="">Select condition</option>
                  <option value="New">New - Brand new condition</option>
                  <option value="Used">Used - Good condition with minor wear</option>
                  <option value="Fair">Fair - Noticeable wear but functional</option>
                  <option value="Poor">Poor - Heavy wear, still usable</option>
                </select>
              </div>
              <div className="form-group">
                <label>Original Price (LKR)</label>
                <input
                  type="number"
                  name="original_price"
                  value={sellFormData.original_price}
                  onChange={handleSellFormChange}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Your Price (LKR) *</label>
                <input
                  type="number"
                  name="price"
                  value={sellFormData.price}
                  onChange={handleSellFormChange}
                  placeholder="0"
                  required
                />
              </div>
              <div className="form-group">
                <label>Negotiable?</label>
                <select
                  name="negotiable"
                  value={sellFormData.negotiable}
                  onChange={handleSellFormChange}
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Photos</h3>
            <div className="photo-upload">
              <div className="upload-area">
                <i className="fas fa-camera"></i>
                <p>Click to upload photos</p>
                <small>Add up to 5 photos (JPG, PNG)</small>
                <input type="file" multiple accept="image/*" />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary">Save as Draft</button>
            <button type="submit" className="btn-primary">
              <i className="fas fa-plus"></i>
              List Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // FIXED: The content of this function has been restored
  const renderManageSection = () => (
    <div className="manage-section">
      <div className="section-header">
        <h2>Manage Your Listings</h2>
        <p>Track performance and manage your items</p>
      </div>
      <div className="listings-grid">
        {myListings.map(listing => (
          <div key={listing.id} className="listing-card">
            <img src={listing.image} alt={listing.title} />
            <div className="listing-info">
              <h4>{listing.title}</h4>
              <p className="price">LKR {listing.price.toLocaleString()}</p>
              <div className={`status ${listing.status}`}>{listing.status === 'active' ? 'Active' : 'Sold'}</div>
            </div>
            <div className="listing-stats">
              <div className="stat"><i className="fas fa-eye"></i><span>{listing.views} views</span></div>
              <div className="stat"><i className="fas fa-comment"></i><span>{listing.inquiries} inquiries</span></div>
            </div>
            <div className="listing-actions">
              {listing.status === 'active' ? (
                <><button className="btn-small">Edit</button><button className="btn-small danger">Remove</button></>
              ) : (<button className="btn-small">View Details</button>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  
  const renderAccountSection = () => {
    if (isLoadingProfile) {
      return (
        <div className="account-section">
          <div className="loading-spinner">
            <i className="fas fa-spinner fa-spin"></i>
            <p>Loading account details...</p>
          </div>
        </div>
      );
    }

    if (!userProfile) {
      return (
        <div className="account-section">
          <div className="error-message">
            <i className="fas fa-exclamation-triangle"></i>
            <p>Unable to load account details. Please try logging in again.</p>
            <button className="btn-primary" onClick={() => navigate('/login')}>
              Go to Login
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="account-section">
        <div className="section-header">
          <h2>My Account</h2>
          <p>Manage your profile and account settings</p>
        </div>

        <div className="account-content">
          {/* Profile Card */}
          <div className="profile-card">
            <div className="profile-header">
              <div className="profile-avatar">
                <i className="fas fa-user-circle"></i>
              </div>
              <div className="profile-info">
                <h3>{userProfile.full_name}</h3>
                <p className="user-type">{userProfile.user_type?.charAt(0).toUpperCase() + userProfile.user_type?.slice(1)}</p>
                <p className="member-since">
                  Member since {new Date(userProfile.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long'
                  })}
                </p>
              </div>
              <div className="profile-actions">
                {!isEditingProfile ? (
                  <button className="btn-secondary" onClick={handleEditProfile}>
                    <i className="fas fa-edit"></i>
                    Edit Profile
                  </button>
                ) : (
                  <div className="edit-actions">
                    <button className="btn-primary" onClick={handleSaveProfile}>
                      <i className="fas fa-save"></i>
                      Save
                    </button>
                    <button className="btn-secondary" onClick={handleCancelEdit}>
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Profile Details */}
            <div className="profile-details">
              {!isEditingProfile ? (
                <div className="details-grid">
                  <div className="detail-item">
                    <label>Full Name</label>
                    <p>{userProfile.full_name}</p>
                  </div>
                  <div className="detail-item">
                    <label>Email Address</label>
                    <p>{userProfile.email}</p>
                  </div>
                  <div className="detail-item">
                    <label>Phone Number</label>
                    <p>{userProfile.phone || 'Not provided'}</p>
                  </div>
                  <div className="detail-item">
                    <label>Account Type</label>
                    <p>{userProfile.user_type?.charAt(0).toUpperCase() + userProfile.user_type?.slice(1)}</p>
                  </div>
                </div>
              ) : (
                <div className="edit-form">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      name="full_name"
                      value={editFormData.full_name}
                      onChange={handleEditFormChange}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      value={userProfile.email}
                      disabled
                      className="disabled"
                      title="Email cannot be changed"
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={editFormData.phone}
                      onChange={handleEditFormChange}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div className="form-group">
                    <label>Account Type</label>
                    <select
                      name="user_type"
                      value={editFormData.user_type}
                      onChange={handleEditFormChange}
                    >
                      <option value="buyer">Buyer</option>
                      <option value="seller">Seller</option>
                      <option value="both">Both</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Account Statistics */}
          <div className="account-stats">
            <h3>Account Statistics</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-shopping-bag"></i>
                </div>
                <div className="stat-content">
                  <div className="stat-number">0</div>
                  <p>Items Purchased</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-tag"></i>
                </div>
                <div className="stat-content">
                  <div className="stat-number">{myListings.length}</div>
                  <p>Items Listed</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-check-circle"></i>
                </div>
                <div className="stat-content">
                  <div className="stat-number">{myListings.filter(item => item.status === 'sold').length}</div>
                  <p>Items Sold</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-star"></i>
                </div>
                <div className="stat-content">
                  <div className="stat-number">4.8</div>
                  <p>Rating</p>
                </div>
              </div>
            </div>
          </div>

          {/* Account Actions */}
          <div className="account-actions">
            <h3>Account Actions</h3>
            <div className="actions-grid">
              <button className="action-card" onClick={() => setActiveSection('buy')}>
                <i className="fas fa-shopping-cart"></i>
                <div>
                  <h4>View Cart</h4>
                  <p>Check items in your cart</p>
                </div>
              </button>
              <button className="action-card" onClick={() => setActiveSection('sell')}>
                <i className="fas fa-plus"></i>
                <div>
                  <h4>List New Item</h4>
                  <p>Sell your educational materials</p>
                </div>
              </button>
              <button className="action-card" onClick={() => setActiveSection('manage')}>
                <i className="fas fa-cog"></i>
                <div>
                  <h4>Manage Listings</h4>
                  <p>Edit your active listings</p>
                </div>
              </button>
              <button className="action-card logout" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt"></i>
                <div>
                  <h4>Logout</h4>
                  <p>Sign out of your account</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="buysell-container">
      <Navigation />
      <div className="buysell-header">
        <h1>Buy & Sell Educational Materials</h1>
        <p>Complete secure transactions and help support affordable education</p>
      </div>
      <div className="buysell-navigation">
        <button className={`nav-btn ${activeSection === 'overview' ? 'active' : ''}`} onClick={() => setActiveSection('overview')}>
          <i className="fas fa-chart-line"></i> Overview
        </button>
        <button className={`nav-btn ${activeSection === 'account' ? 'active' : ''}`} onClick={() => setActiveSection('account')}>
          <i className="fas fa-user"></i> Account
        </button>
        <button className={`nav-btn ${activeSection === 'buy' ? 'active' : ''}`} onClick={() => setActiveSection('buy')}>
          <i className="fas fa-shopping-cart"></i> Buy ({cartItems.length})
        </button>
        <button
          className={`nav-btn ${activeSection === 'sell' ? 'active' : ''} ${!canSell ? 'disabled' : ''}`}
          onClick={() => {
            if (canSell) {
              setActiveSection('sell');
            } else {
              showToast('Please upgrade to a seller account to access this feature', 'info');
              setActiveSection('account');
            }
          }}
          title={!canSell ? 'Upgrade to seller account to access this feature' : ''}
        >
          <i className="fas fa-tag"></i> Sell
          {!canSell && <i className="fas fa-lock" style={{marginLeft: '0.5rem', fontSize: '0.8rem'}}></i>}
        </button>
        <button
          className={`nav-btn ${activeSection === 'manage' ? 'active' : ''} ${!canSell ? 'disabled' : ''}`}
          onClick={() => {
            if (canSell) {
              setActiveSection('manage');
            } else {
              showToast('Please upgrade to a seller account to access this feature', 'info');
              setActiveSection('account');
            }
          }}
          title={!canSell ? 'Upgrade to seller account to access this feature' : ''}
        >
          <i className="fas fa-cog"></i> Manage
          {!canSell && <i className="fas fa-lock" style={{marginLeft: '0.5rem', fontSize: '0.8rem'}}></i>}
        </button>
      </div>
      <div className="buysell-content">
        {activeSection === 'overview' && renderOverview()}
        {activeSection === 'account' && renderAccountSection()}
        {activeSection === 'buy' && renderBuySection()}
        {activeSection === 'sell' && canSell && renderSellSection()}
        {activeSection === 'manage' && canSell && renderManageSection()}
      </div>
      {/* ... footers ... */}
    </div>
  );
}

export default BuySell;