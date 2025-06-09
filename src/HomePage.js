import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from './context/CartContext';
import { useToast } from './context/ToastContext';
import Navigation from './components/Navigation';
import NewsletterSubscription from './components/NewsletterSubscription';
import './styles/home.css';

function HomePage() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [isFiltering, setIsFiltering] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [currentBookIndex, setCurrentBookIndex] = useState(0);
  const { addToCart, getTotalItems, getTotalPrice } = useCart();
  const { showToast } = useToast();

  // Slider data
  const slides = [
    {
      id: 1,
      type: 'welcome',
      title: 'WELCOME TO PAGE TURN',
      description: 'PageTurn reduces financial burden on students by providing access to educational materials at 50-70% lower prices than retail while enabling income generation through resale opportunities.',
      image: '/welcome.jpg',
      buttonText: 'LEARN MORE'
    },
    {
      id: 2,
      type: 'education',
      title: 'Pre-loved Books For Education',
      description: 'Affordable access to knowledge for students and book lovers alike',
      image: '/slider2.jpg',
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

  // Load wishlist from localStorage on component mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('bookstore_wishlist');
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('bookstore_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Fetch featured books from API
  useEffect(() => {
    const fetchFeaturedBooks = async () => {
      try {
        const response = await fetch('http://localhost:3002/api/books/featured');
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            // Transform API data to match our component structure
            const transformedBooks = data.data.slice(0, 20).map(book => ({
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
              badge: 'Sale',
              category: 'Mathematics',
              rating: 4.5,
              condition: 'Used'
            },
            {
              id: 2,
              title: 'Modern Literature',
              author: 'Emily Johnson',
              currentPrice: 918.00,
              originalPrice: 2320.00,
              image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
              badge: 'New',
              category: 'Literature',
              rating: 4.3,
              condition: 'New'
            },
            {
              id: 3,
              title: 'Oxford Dictionary',
              author: 'Oxford Press',
              currentPrice: 2500.00,
              originalPrice: 3000.00,
              image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
              badge: 'Popular',
              category: 'Reference',
              rating: 4.9,
              condition: 'New'
            },
            {
              id: 4,
              title: 'AI Programming Guide',
              author: 'Tech Authors',
              currentPrice: 2800.00,
              originalPrice: 3200.00,
              image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
              badge: 'New',
              category: 'Technology',
              rating: 4.8,
              condition: 'New'
            },
            {
              id: 5,
              title: 'World History',
              author: 'History Experts',
              currentPrice: 1800.00,
              originalPrice: 2200.00,
              image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
              badge: 'Sale',
              category: 'History',
              rating: 4.6,
              condition: 'Used'
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
            badge: 'Sale',
            category: 'Mathematics',
            rating: 4.5,
            condition: 'Used'
          },
          {
            id: 2,
            title: 'Oxford Dictionary',
            author: 'Oxford Press',
            currentPrice: 2500.00,
            originalPrice: 3000.00,
            image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
            badge: 'Popular',
            category: 'Reference',
            rating: 4.9,
            condition: 'New'
          },
          {
            id: 3,
            title: 'AI Programming Guide',
            author: 'Tech Authors',
            currentPrice: 2800.00,
            originalPrice: 3200.00,
            image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
            badge: 'New',
            category: 'Technology',
            rating: 4.8,
            condition: 'New'
          },
          {
            id: 4,
            title: 'World History',
            author: 'History Experts',
            currentPrice: 1800.00,
            originalPrice: 2200.00,
            image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
            badge: 'Sale',
            category: 'History',
            rating: 4.6,
            condition: 'Used'
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
    if (filter === activeFilter) return; // Don't filter if same filter is clicked

    setIsFiltering(true);
    setCurrentBookIndex(0); // Reset to first page when filter changes

    // Add a small delay for smooth transition
    setTimeout(() => {
      setActiveFilter(filter);
      setIsFiltering(false);
    }, 200);
  };

  // Filter books based on active filter
  const filteredBooks = featuredBooks.filter(book => {
    if (activeFilter === 'All') {
      return true;
    }
    return book.category && book.category.toLowerCase() === activeFilter.toLowerCase();
  });

  // Book carousel functions
  const booksPerPage = 4;
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  const nextBooks = () => {
    setCurrentBookIndex((prev) => {
      const nextIndex = prev + booksPerPage;
      return nextIndex >= filteredBooks.length ? 0 : nextIndex;
    });
  };

  const prevBooks = () => {
    setCurrentBookIndex((prev) => {
      const prevIndex = prev - booksPerPage;
      return prevIndex < 0 ? Math.max(0, filteredBooks.length - booksPerPage) : prevIndex;
    });
  };

  // Reset book index if it's beyond the filtered results
  useEffect(() => {
    if (currentBookIndex >= filteredBooks.length && filteredBooks.length > 0) {
      setCurrentBookIndex(0);
    }
  }, [filteredBooks.length, currentBookIndex]);

  // Get count for each category
  const getCategoryCount = (category) => {
    if (category === 'All') {
      return featuredBooks.length;
    }
    return featuredBooks.filter(book =>
      book.category && book.category.toLowerCase() === category.toLowerCase()
    ).length;
  };

  // Wishlist functions
  const addToWishlist = (book) => {
    const isAlreadyInWishlist = wishlist.some(item => item.id === book.id);

    if (!isAlreadyInWishlist) {
      const wishlistItem = {
        id: book.id,
        title: book.title,
        author: book.author,
        currentPrice: book.currentPrice,
        originalPrice: book.originalPrice,
        image: book.image,
        category: book.category,
        addedAt: new Date().toISOString()
      };

      setWishlist(prev => [...prev, wishlistItem]);
      showToast(`"${book.title}" added to wishlist!`, 'success');
    } else {
      showToast(`"${book.title}" is already in your wishlist!`, 'info');
    }
  };

  const removeFromWishlist = (bookId) => {
    const book = wishlist.find(item => item.id === bookId);
    setWishlist(prev => prev.filter(item => item.id !== bookId));
    if (book) {
      showToast(`"${book.title}" removed from wishlist!`, 'success');
    }
  };

  const isInWishlist = (bookId) => {
    return wishlist.some(item => item.id === bookId);
  };

  const toggleWishlist = (book) => {
    if (isInWishlist(book.id)) {
      removeFromWishlist(book.id);
    } else {
      addToWishlist(book);
    }
  };

  const handleWishlistClick = () => {
    if (wishlist.length === 0) {
      showToast('Your wishlist is empty! Add some books to your wishlist by clicking the heart icon on any book.', 'info');
    } else {
      const recentBook = wishlist[wishlist.length - 1];
      showToast(`You have ${wishlist.length} item${wishlist.length > 1 ? 's' : ''} in your wishlist! Most recent: "${recentBook.title}"`, 'info');
    }
  };

  // Add to cart function
  const handleAddToCart = (book) => {
    const cartItem = {
      id: book.id,
      title: book.title,
      author: book.author,
      price: book.currentPrice,
      image: book.image,
      seller: 'PageTurn Store' // Default seller for featured books
    };

    addToCart(cartItem);

    // Show success message
    showToast(`${book.title} has been added to your cart!`, 'success');
  };



  return (
    <div>
      {/* Navigation Bar */}
      <Navigation />

      {/* Main Header */}
      <header className="main-header">
        <div className="header-left">
          <Link to="/">
            <img src="/logo.webp" alt="Logo" className="logo" />
          </Link>
          <span className="site-name">PageTurn</span>
        </div>
        <div className="header-center">
          <a href="#"><i className="fas fa-home"></i></a>
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
          <a
            href="#"
            data-count={wishlist.length}
            onClick={(e) => { e.preventDefault(); handleWishlistClick(); }}
            title={`Wishlist (${wishlist.length} item${wishlist.length !== 1 ? 's' : ''})`}
          >
            <i className="fas fa-heart"></i>
            <span>({wishlist.length})</span>
          </a>
          <Link to="/buy-sell?section=buy"><i className="fas fa-shopping-cart"></i> <span>LKR {getTotalPrice().toLocaleString()}</span></Link>
        </div>
      </header>

      {/* Navigation */}
      <nav className="main-nav">
        <div className="main-nav-container">
          <ul>
            <li><Link to="/browse">Shop Now</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/buy-sell?section=account">My Account <i className="fas fa-user"></i></Link></li>
          </ul>
        </div>
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
                  <button className="btn-outline" onClick={() => navigate('/about')}>{slide.buttonText}</button>
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
                  <button className="btn-primary" onClick={() => navigate('/browse')}>Shop Now</button>
                  <button className="btn-outline" onClick={() => navigate('/buy-sell?section=sell')}>Sell Books</button>
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
            <h2><span className="underline">Our Featured Books</span></h2>
            <br />
          </div>
          <div className="product-filter">
            {['All', 'Mathematics', 'Reference', 'Technology', 'History', 'Literature'].map((filter) => {
              const count = getCategoryCount(filter);
              return (
                <button
                  key={filter}
                  className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
                  onClick={() => handleFilterChange(filter)}
                  disabled={count === 0 && filter !== 'All'}
                >
                  {filter} {count > 0 && <span className="count">({count})</span>}
                </button>
              );
            })}
          </div>
          {loading ? (
            <div className="loading-state">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Loading featured books...</p>
            </div>
          ) : isFiltering ? (
            <div className="loading-state">
              <i className="fas fa-filter fa-spin"></i>
              <p>Filtering books...</p>
            </div>
          ) : filteredBooks.length > 0 ? (
            <>
              <div className="featured-books-container">
                {filteredBooks.length > booksPerPage && (
                  <button
                    className="book-nav-btn book-nav-prev"
                    onClick={prevBooks}
                    disabled={currentBookIndex === 0}
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>
                )}

                <div className="product-grid">
                  {filteredBooks.slice(currentBookIndex, currentBookIndex + booksPerPage).map((book) => (
                  <div key={book.id} className="product-card">
                    {book.badge && (
                      <div className={`product-badge ${book.badge.toLowerCase()}`}>
                        {book.badge}
                      </div>
                    )}
                    <img src={book.image} alt={book.title} />
                    <div className="product-details">
                      <div className="product-header">
                        <h3>{book.title}</h3>
                        <button
                          className={`wishlist-btn ${isInWishlist(book.id) ? 'active' : ''}`}
                          onClick={() => toggleWishlist(book)}
                          title={isInWishlist(book.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                        >
                          <i className={`fas fa-heart ${isInWishlist(book.id) ? 'filled' : ''}`}></i>
                        </button>
                      </div>
                      <p className="product-author">By {book.author}</p>
                      <div className="product-price">
                        <span className="current-price">LKR {book.currentPrice.toFixed(2)}</span>
                        <span className="original-price">LKR {book.originalPrice.toFixed(2)}</span>
                      </div>
                      <button
                        className="add-to-cart"
                        onClick={() => handleAddToCart(book)}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
                </div>

                {filteredBooks.length > booksPerPage && (
                  <button
                    className="book-nav-btn book-nav-next"
                    onClick={nextBooks}
                    disabled={currentBookIndex + booksPerPage >= filteredBooks.length}
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                )}
              </div>

              {/* Page Indicators */}
              {filteredBooks.length > booksPerPage && (
                <div className="book-pagination-info">
                  <div className="book-page-indicators">
                    {Array.from({ length: totalPages }, (_, index) => (
                      <span
                        key={index}
                        className={`page-dot ${Math.floor(currentBookIndex / booksPerPage) === index ? 'active' : ''}`}
                        onClick={() => setCurrentBookIndex(index * booksPerPage)}
                      ></span>
                    ))}
                  </div>
                  <div className="page-info">
                    Showing {currentBookIndex + 1}-{Math.min(currentBookIndex + booksPerPage, filteredBooks.length)} of {filteredBooks.length} books
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="no-books-message">
              <i className="fas fa-book-open"></i>
              <h3>No books found in {activeFilter} category</h3>
              <p>Try selecting a different category or check back later for new arrivals.</p>
              <button
                className="btn-primary"
                onClick={() => handleFilterChange('All')}
              >
                View All Books
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Info Banner */}
      <div className="info-banner">
        <div className="info-item left">
          <img src="/shipped.png" alt="Delivery Truck" />
          <span>Island wide delivery</span>
        </div>
        <div className="info-item center">
          <img src="/credit-card.png" alt="Secure Payments" />
          <span>Secure payments</span>
        </div>
        <div className="info-item right">
          <img src="/best-price.png" alt="Best Price" />
          <span>Best Price</span>
        </div>
      </div>

      {/* First Footer Section */}
      <div className="footer-section">
        <div className="container">
          <div className="footer-left">
            <h2>Receive The Latest Offers & Updates Via Email</h2>
            <NewsletterSubscription source="homepage_footer" />
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
                <li><Link to="/buy-sell?section=account">My Account</Link></li>
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

export default HomePage;
