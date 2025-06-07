import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Navigation from './components/Navigation';
import './styles/home.css';

function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  // Slider data
  const slides = [
    {
      id: 1,
      type: 'welcome',
      title: 'WELCOME TO PAGE TURN',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      buttonText: 'LEARN MORE'
    },
    {
      id: 2,
      type: 'education',
      title: 'Pre-loved Books For Education',
      description: 'Affordable access to knowledge for students and book lovers alike',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      buttons: ['Shop Now', 'Sell Books']
    },
    {
      id: 3,
      type: 'how-it-works',
      title: 'How It Works',
      description: 'Three simple steps to buy or sell pre-loved educational materials'
    }
  ];

  // Featured books data - will be loaded from API
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch featured books from API
  useEffect(() => {
    const fetchFeaturedBooks = async () => {
      try {
        const response = await fetch('http://localhost:3002/api/books/featured');
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            // Transform API data to match our component structure
            const transformedBooks = data.data.slice(0, 4).map(book => ({
              id: book.id,
              title: book.title,
              author: book.author,
              currentPrice: parseFloat(book.price),
              originalPrice: parseFloat(book.price) * 1.2, // Simulate original price
              image: `https://images.unsplash.com/photo-${book.id % 4 === 0 ? '1543002588-bfa74002ed7e' :
                      book.id % 4 === 1 ? '1544716278-ca5e3f4abd8c' :
                      book.id % 4 === 2 ? '1635070041078-e363dbe005cb' :
                      '1589998059171-988d887df646'}?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80`,
              badge: book.rating >= 4.5 ? 'Popular' : book.condition === 'New' ? 'New' : 'Sale',
              condition: book.condition,
              rating: book.rating,
              category: book.category_name
            }));
            setFeaturedBooks(transformedBooks);
          }
        } else {
          // Fallback to sample data if API fails
          setFeaturedBooks([
            {
              id: 1,
              title: 'Advanced Physics',
              author: 'Robert Wilson',
              currentPrice: 5424.00,
              originalPrice: 5450.00,
              image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
              badge: 'Sale'
            },
            {
              id: 2,
              title: 'Modern Literature',
              author: 'Emily Johnson',
              currentPrice: 918.00,
              originalPrice: 2320.00,
              image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
              badge: 'New'
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching featured books:', error);
        // Fallback to sample data
        setFeaturedBooks([
          {
            id: 1,
            title: 'Advanced Physics',
            author: 'Robert Wilson',
            currentPrice: 5424.00,
            originalPrice: 5450.00,
            image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
            badge: 'Sale'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedBooks();
  }, []);

  // Slider functions
  const changeSlide = useCallback((direction) => {
    setCurrentSlide((prev) => {
      if (direction === 1) {
        return prev === slides.length - 1 ? 0 : prev + 1;
      } else {
        return prev === 0 ? slides.length - 1 : prev - 1;
      }
    });
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Auto-advance slider
  useEffect(() => {
    const interval = setInterval(() => changeSlide(1), 6000);
    return () => clearInterval(interval);
  }, [changeSlide]);

  // Search function
  const performSearch = () => {
    if (searchQuery.trim()) {
      alert("Searching for: " + searchQuery);
    } else {
      alert("Please enter a search term.");
    }
  };

  // Filter function
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  return (
    <div>
      {/* Navigation Bar */}
      <Navigation />

      {/* Main Header - REMOVE THIS ENTIRE SECTION */}
      {/* <header className="main-header">
        <div className="header-left">
          <img src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" alt="Logo" className="logo" />
          <span className="site-name">PageTurn</span>
        </div>
        <div className="header-center">
          <Link to="/"><i className="fas fa-home"></i></Link>
          <div className="search-container">
            <input
              type="text"
              id="searchInput"
              placeholder="Search books..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button onClick={performSearch}><i className="fas fa-search"></i></button>
          </div>
        </div>
        <div className="header-right">
          <Link to="/wishlist"><i className="fas fa-heart"></i> <span>(2)</span></Link>
          <Link to="/cart"><i className="fas fa-shopping-cart"></i> <span>LKR 3,200</span></Link>
          <Link to="/login">Login</Link> | <Link to="/signup">Sign Up</Link>
        </div>
      </header> */}

      {/* Navigation - KEEP THIS SECTION */}
      <nav className="main-nav">
        <ul>
          <li><Link to="/browse">Shop Now</Link></li>
          <li><Link to="/about">About Us</Link></li>
          <li><Link to="/contact">Contact Us</Link></li>
          <li><Link to="/buy-sell">My Account <i className="fas fa-user"></i></Link></li>
        </ul>
      </nav>

      {/* Slider Container */}
      <div className="slider-container" id="slider">
        {slides.map((slide, index) => (
          <div key={slide.id} className={`slide ${index === currentSlide ? 'active' : ''}`}>
            {slide.type === 'welcome' && (
              <>
                <div className="slide-content">
                  <h1>{slide.title}</h1>
                  <p>{slide.description}</p>
                  <button className="btn-outline">{slide.buttonText}</button>
                </div>
                <img src={slide.image} alt="Girl with books" />
              </>
            )}

            {slide.type === 'education' && (
              <>
                <img src={slide.image} alt="Books" />
                <div className="slide-content">
                  <h1>{slide.title}</h1>
                  <p>{slide.description}</p>
                  <button className="btn-primary">Shop Now</button>
                  <button className="btn-outline">Sell Books</button>
                </div>
              </>
            )}

            {slide.type === 'how-it-works' && (
              <div className="how-it-works">
                <h2>{slide.title}</h2>
                <p className="description">{slide.description}</p>
                <div className="steps">
                  <Link to="/create-account" className="step">
                    <i className="fas fa-user-plus"></i>
                    <h3>Create Account</h3>
                    <p>Sign up to start buying or selling pre-owned educational materials</p>
                  </Link>
                  <Link to="/browse" className="step">
                    <i className="fas fa-search"></i>
                    <h3>Browse or List</h3>
                    <p>Find educational treasures or list your used materials for others</p>
                  </Link>
                  <Link to="/buy-sell" className="step">
                    <i className="fas fa-exchange-alt"></i>
                    <h3>Buy or Sell</h3>
                    <p>Complete secure transactions and help support affordable education</p>
                  </Link>
                </div>
              </div>
            )}
          </div>
        ))}

        <div className="arrow arrow-left" onClick={() => changeSlide(-1)}>&#10094;</div>
        <div className="arrow arrow-right" onClick={() => changeSlide(1)}>&#10095;</div>

        <div className="dots">
          {slides.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            ></span>
          ))}
        </div>
      </div>

      {/* Featured Products Section */}
      <section className="featured-products">
        <div className="container">
          <div className="section-title">
            <br /><h2><center>Our Featured Books</center></h2><br /><br />
          </div>
          <div className="product-filter">
            {['All', 'Textbooks', 'Notes', 'Papers'].map((filter) => (
              <button
                key={filter}
                className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
                onClick={() => handleFilterChange(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
          {loading ? (
            <div className="loading-state">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Loading featured books...</p>
            </div>
          ) : (
            <div className="product-grid">
              {featuredBooks.map((book) => (
                <div key={book.id} className="product-card">
                  {book.badge && (
                    <div className={`product-badge ${book.badge.toLowerCase()}`}>
                      {book.badge}
                    </div>
                  )}
                  <img src={book.image} alt={book.title} />
                  <div className="product-details">
                    <h3>{book.title}</h3>
                    <p className="product-author">By {book.author}</p>
                    <div className="product-price">
                      <span className="current-price">LKR {book.currentPrice.toFixed(2)}</span>
                      <span className="original-price">LKR {book.originalPrice.toFixed(2)}</span>
                    </div>
                    <button className="add-to-cart">Add to Cart</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Info Banner */}
      <div className="info-banner">
        <div className="info-item left">
          <img src="https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&q=80" alt="Delivery Truck" />
          <span>Island wide delivery</span>
        </div>
        <div className="info-item center">
          <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&q=80" alt="Secure Payments" />
          <span>Secure payments</span>
        </div>
        <div className="info-item right">
          <img src="https://images.unsplash.com/photo-1607863680198-23d4b2565df0?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&q=80" alt="Best Price" />
          <span>Best Price</span>
        </div>
      </div>

      {/* First Footer Section */}
      <div className="footer-section">
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
              <li><a href="#">Textbooks</a></li>
              <li><a href="#">Novels</a></li>
              <li><a href="#">Comics</a></li>
              <li><a href="#">Science</a></li>
              <li><a href="#">History</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/terms">Terms & Conditions</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-right">
          <div style={{textAlign: 'right'}}>
            <img src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" alt="Site Logo" className="logo" />
            <span style={{textAlign: 'right'}}>PageTurn</span>
          </div>
          <p>Empowering education through affordable reading</p>
        </div>
      </div>

      {/* Second Footer Section */}
      <div className="footer-bottom">
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
          <img src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" alt="Logo" />
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

      {/* Copyright Footer */}
      <footer className="copyright-footer">
        <p>&copy; 2025 PageTurn Bookstore. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default HomePage;
