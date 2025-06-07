import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import '../styles/buysell.css';
import '../styles/home.css';

function BuySell() {
  const [activeSection, setActiveSection] = useState('overview');
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      title: 'Advanced Mathematics',
      author: 'John Smith',
      price: 2500,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      seller: 'Sarah K.'
    },
    {
      id: 2,
      title: 'Physics Practical Guide',
      author: 'Dr. Wilson',
      price: 1200,
      quantity: 2,
      image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      seller: 'Mike R.'
    }
  ]);

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

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity === 0) {
      setCartItems(cartItems.filter(item => item.id !== id));
    } else {
      setCartItems(cartItems.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    alert('Proceeding to checkout...');
  };

  const renderOverview = () => (
    <div className="overview-section">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon buy">
            <i className="fas fa-shopping-cart"></i>
          </div>
          <div className="stat-content">
            <h3>Buying</h3>
            <div className="stat-number">{cartItems.length}</div>
            <p>Items in cart</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon sell">
            <i className="fas fa-tag"></i>
          </div>
          <div className="stat-content">
            <h3>Selling</h3>
            <div className="stat-number">{myListings.length}</div>
            <p>Active listings</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon earnings">
            <i className="fas fa-coins"></i>
          </div>
          <div className="stat-content">
            <h3>Earnings</h3>
            <div className="stat-number">LKR 12,500</div>
            <p>Total earned</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon savings">
            <i className="fas fa-piggy-bank"></i>
          </div>
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
          <button 
            className="action-btn buy-btn"
            onClick={() => setActiveSection('buy')}
          >
            <i className="fas fa-shopping-cart"></i>
            <span>View Cart & Buy</span>
            <small>{cartItems.length} items</small>
          </button>
          
          <button 
            className="action-btn sell-btn"
            onClick={() => setActiveSection('sell')}
          >
            <i className="fas fa-plus"></i>
            <span>List New Item</span>
            <small>Start selling</small>
          </button>
          
          <button className="action-btn browse-btn">
            <i className="fas fa-search"></i>
            <span>Browse Materials</span>
            <small>Find books</small>
          </button>
          
          <button 
            className="action-btn manage-btn"
            onClick={() => setActiveSection('manage')}
          >
            <i className="fas fa-cog"></i>
            <span>Manage Listings</span>
            <small>{myListings.filter(item => item.status === 'active').length} active</small>
          </button>
        </div>
      </div>

      <div className="recent-activity">
        <h3>Recent Activity</h3>
        <div className="activity-list">
          <div className="activity-item">
            <i className="fas fa-shopping-cart activity-icon buy"></i>
            <div className="activity-content">
              <p><strong>Added to cart:</strong> Physics Practical Guide</p>
              <small>2 hours ago</small>
            </div>
          </div>
          <div className="activity-item">
            <i className="fas fa-eye activity-icon view"></i>
            <div className="activity-content">
              <p><strong>Your listing viewed:</strong> Chemistry Textbook</p>
              <small>5 hours ago</small>
            </div>
          </div>
          <div className="activity-item">
            <i className="fas fa-check activity-icon success"></i>
            <div className="activity-content">
              <p><strong>Item sold:</strong> Biology Notes for LKR 900</p>
              <small>1 day ago</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

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
          <button className="btn-primary">Browse Materials</button>
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
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="quantity-btn"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="quantity-btn"
                  >
                    +
                  </button>
                </div>
                <div className="item-price">
                  <span>LKR {(item.price * item.quantity).toLocaleString()}</span>
                </div>
                <button 
                  onClick={() => updateQuantity(item.id, 0)}
                  className="remove-btn"
                >
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
        <form className="sell-form">
          <div className="form-section">
            <h3>Item Details</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Title *</label>
                <input type="text" placeholder="Enter book title" required />
              </div>
              <div className="form-group">
                <label>Author *</label>
                <input type="text" placeholder="Enter author name" required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category *</label>
                <select required>
                  <option value="">Select category</option>
                  <option value="textbooks">Textbooks</option>
                  <option value="notes">Study Notes</option>
                  <option value="papers">Past Papers</option>
                  <option value="reference">Reference Books</option>
                </select>
              </div>
              <div className="form-group">
                <label>Subject</label>
                <input type="text" placeholder="e.g., Mathematics, Physics" />
              </div>
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea 
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
                <select required>
                  <option value="">Select condition</option>
                  <option value="excellent">Excellent - Like new</option>
                  <option value="good">Good - Minor wear</option>
                  <option value="fair">Fair - Noticeable wear</option>
                  <option value="poor">Poor - Heavy wear</option>
                </select>
              </div>
              <div className="form-group">
                <label>Original Price (LKR)</label>
                <input type="number" placeholder="0" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Your Price (LKR) *</label>
                <input type="number" placeholder="0" required />
              </div>
              <div className="form-group">
                <label>Negotiable?</label>
                <select>
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
              <div className={`status ${listing.status}`}>
                {listing.status === 'active' ? 'Active' : 'Sold'}
              </div>
            </div>
            <div className="listing-stats">
              <div className="stat">
                <i className="fas fa-eye"></i>
                <span>{listing.views} views</span>
              </div>
              <div className="stat">
                <i className="fas fa-comment"></i>
                <span>{listing.inquiries} inquiries</span>
              </div>
            </div>
            <div className="listing-actions">
              {listing.status === 'active' ? (
                <>
                  <button className="btn-small">Edit</button>
                  <button className="btn-small danger">Remove</button>
                </>
              ) : (
                <button className="btn-small">View Details</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="buysell-container">
      {/* Navigation Bar */}
      <Navigation />

      <div className="buysell-header">
        <h1>Buy & Sell Educational Materials</h1>
        <p>Complete secure transactions and help support affordable education</p>
      </div>

      <div className="buysell-navigation">
        <button 
          className={`nav-btn ${activeSection === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveSection('overview')}
        >
          <i className="fas fa-chart-line"></i>
          Overview
        </button>
        <button 
          className={`nav-btn ${activeSection === 'buy' ? 'active' : ''}`}
          onClick={() => setActiveSection('buy')}
        >
          <i className="fas fa-shopping-cart"></i>
          Buy ({cartItems.length})
        </button>
        <button 
          className={`nav-btn ${activeSection === 'sell' ? 'active' : ''}`}
          onClick={() => setActiveSection('sell')}
        >
          <i className="fas fa-tag"></i>
          Sell
        </button>
        <button 
          className={`nav-btn ${activeSection === 'manage' ? 'active' : ''}`}
          onClick={() => setActiveSection('manage')}
        >
          <i className="fas fa-cog"></i>
          Manage
        </button>
      </div>

      <div className="buysell-content">
        {activeSection === 'overview' && renderOverview()}
        {activeSection === 'buy' && renderBuySection()}
        {activeSection === 'sell' && renderSellSection()}
        {activeSection === 'manage' && renderManageSection()}
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
                <li><Link to="/browse">Sell Book</Link></li>
                <li><Link to="/buy-sell">My Account</Link></li>
                <li><Link to="/help">Help</Link></li>
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

export default BuySell;
