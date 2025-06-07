import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import '../styles/browse.css';
import '../styles/home.css';

function BrowseList() {
  const [activeTab, setActiveTab] = useState('browse');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 3000]); // Updated for 1 USD = 50 LKR conversion
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([
    { value: 'all', label: 'All Categories' }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);
  const [sortBy, setSortBy] = useState('newest');

  // List item form state
  const [listForm, setListForm] = useState({
    title: '',
    author: '',
    category_id: '',
    price: '',
    condition: 'Used',
    edition: '',
    published_year: '',
    isbn: '',
    language: 'English',
    short_description: ''
  });
  const [listLoading, setListLoading] = useState(false);
  const [listSuccess, setListSuccess] = useState(false);

  // Add error boundary
  console.log('BrowseList component rendering...');

  // Handle list form input changes
  const handleListFormChange = (e) => {
    const { name, value } = e.target;
    setListForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleListFormSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted!', listForm); // Debug log
    setListLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!listForm.title || !listForm.author || !listForm.price || !listForm.category_id) {
        throw new Error('Please fill in all required fields (Title, Author, Category, Price)');
      }

      // Find category ID from category name
      const selectedCategoryObj = categories.find(cat => cat.value === listForm.category_id);
      console.log('Selected category:', selectedCategoryObj); // Debug log

      // Map category value to database ID
      const categoryMapping = {
        'fiction': 1,
        'non-fiction': 2,
        'science': 3,
        'mathematics': 4,
        'history': 5,
        'literature': 6,
        'technology': 7,
        'arts': 8,
        'business': 9,
        'philosophy': 10,
        'psychology': 11,
        'reference': 12
      };

      const categoryId = categoryMapping[listForm.category_id] || 1;

      // Prepare book data
      const bookData = {
        title: listForm.title.trim(),
        author: listForm.author.trim(),
        category_id: categoryId,
        price: parseFloat(listForm.price),
        condition: listForm.condition,
        edition: listForm.edition.trim() || '1st',
        published_year: parseInt(listForm.published_year) || new Date().getFullYear(),
        isbn: listForm.isbn.trim() || `978-${Math.floor(Math.random() * 1000000000)}`,
        language: listForm.language,
        short_description: listForm.short_description.trim() || `${listForm.title} by ${listForm.author}`,
        seller_id: 1 // Default seller ID (in real app, get from logged-in user)
      };

      console.log('Sending book data:', bookData); // Debug log

      // Submit to API
      const response = await fetch(`${API_BASE_URL}/books`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookData)
      });

      console.log('API response status:', response.status); // Debug log

      if (!response.ok) {
        const errorData = await response.text();
        console.error('API error:', errorData);
        throw new Error(`Failed to list book: ${response.status}`);
      }

      const result = await response.json();
      console.log('API result:', result); // Debug log

      if (result.success) {
        setListSuccess(true);
        // Reset form
        setListForm({
          title: '',
          author: '',
          category_id: '',
          price: '',
          condition: 'Used',
          edition: '',
          published_year: '',
          isbn: '',
          language: 'English',
          short_description: ''
        });

        // Refresh books list to show new book
        fetchBooks();

        // Hide success message after 3 seconds
        setTimeout(() => setListSuccess(false), 3000);
      } else {
        throw new Error(result.message || 'Failed to list book');
      }

    } catch (error) {
      console.error('Error listing book:', error);
      setError(error.message);
    } finally {
      setListLoading(false);
    }
  };

  // API configuration
  const API_BASE_URL = 'http://localhost:3002/api';

  // Fetch books from API
  const fetchBooks = async () => {
    console.log('Fetching books from API...');
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 20,
        availability: 1
      });

      if (selectedCategory !== 'all') {
        // Convert category value back to proper case for API
        const categoryName = categories.find(cat => cat.value === selectedCategory)?.label;
        if (categoryName && categoryName !== 'All Categories') {
          params.append('category', categoryName);
        }
      }
      if (searchQuery) {
        params.append('search', searchQuery);
      }

      // Add price filtering
      if (priceRange[0] > 0) {
        params.append('minPrice', priceRange[0]);
      }
      if (priceRange[1] < 3000) {
        params.append('maxPrice', priceRange[1]);
      }

      // Add sorting parameters
      const sortMapping = {
        'newest': { sortBy: 'created_at', sortOrder: 'DESC' },
        'oldest': { sortBy: 'created_at', sortOrder: 'ASC' },
        'price-low': { sortBy: 'price', sortOrder: 'ASC' },
        'price-high': { sortBy: 'price', sortOrder: 'DESC' },
        'title': { sortBy: 'title', sortOrder: 'ASC' },
        'rating': { sortBy: 'rating', sortOrder: 'DESC' },
        'condition': { sortBy: 'condition', sortOrder: 'ASC' }
      };

      const sortConfig = sortMapping[sortBy] || sortMapping['newest'];
      params.append('sortBy', sortConfig.sortBy);
      params.append('sortOrder', sortConfig.sortOrder);
      if (priceRange[0] > 0) {
        params.append('minPrice', priceRange[0]);
      }
      if (priceRange[1] < 10000) {
        params.append('maxPrice', priceRange[1]);
      }

      const apiUrl = `${API_BASE_URL}/books?${params}`;
      console.log('🔍 API URL:', apiUrl);

      const response = await fetch(apiUrl);
      if (response.ok) {
        const data = await response.json();
        console.log('📊 API Response:', {
          totalItems: data.pagination?.totalItems,
          currentPage: data.pagination?.currentPage,
          totalPages: data.pagination?.totalPages,
          booksReturned: data.data?.length
        });

        if (data.success) {
          // Transform API data to match component structure
          const transformedBooks = data.data.map(book => ({
            id: book.id,
            title: book.title,
            author: book.author,
            category: book.category_name?.toLowerCase().replace(/\s+/g, '-') || 'general',
            categoryName: book.category_name || 'General',
            price: parseFloat(book.price),
            originalPrice: parseFloat(book.price) * 1.3, // Simulate original price
            condition: book.condition || 'Good',
            image: `https://images.unsplash.com/photo-${book.id % 4 === 0 ? '1543002588-bfa74002ed7e' :
                    book.id % 4 === 1 ? '1544716278-ca5e3f4abd8c' :
                    book.id % 4 === 2 ? '1635070041078-e363dbe005cb' :
                    '1589998059171-988d887df646'}?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80`,
            seller: book.seller_name || 'Anonymous',
            location: 'Sri Lanka',
            description: book.short_description || 'Educational material in good condition',
            rating: parseFloat(book.rating) || 4.0,
            isbn: book.isbn,
            language: book.language || 'English'
          }));
          setBooks(transformedBooks);

          // Handle pagination data
          if (data.pagination) {
            setTotalPages(data.pagination.totalPages);
            setTotalBooks(data.pagination.totalItems);
            setCurrentPage(data.pagination.currentPage);
          }
        }
      } else {
        console.error('Failed to fetch books from API');
        setBooks([]); // Set empty array if API fails
      }
    } catch (error) {
      console.error('Error fetching books:', error);
      setError(`Failed to load books: ${error.message}`);
      setBooks([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  // Categories are now loaded from API in useEffect

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery, priceRange, sortBy]);

  // Fetch books when page or filters change
  useEffect(() => {
    fetchBooks();
  }, [selectedCategory, searchQuery, priceRange, sortBy, currentPage]);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/categories`);
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            const apiCategories = data.data.map(cat => ({
              value: cat.name.toLowerCase().replace(/\s+/g, '-'),
              label: cat.name
            }));
            setCategories([{ value: 'all', label: 'All Categories' }, ...apiCategories]);
          }
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Since API handles filtering, we don't need to filter again on frontend
  // Just use the books directly from API
  const filteredBooks = books;

  const handleSearch = (e) => {
    e.preventDefault();
    // Search functionality is handled by the filter above
  };

  return (
    <div className="browse-container">
      {/* Navigation Bar */}
      <Navigation />

      {/* Header */}
      <div className="browse-header">
        <h1>Educational Materials Marketplace</h1>
        <p>Find educational treasures or list your used materials for others</p>
        {error && (
          <div style={{ color: 'red', padding: '10px', background: '#ffe6e6', margin: '10px 0' }}>
            Error: {error}
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button 
          className={`tab-button ${activeTab === 'browse' ? 'active' : ''}`}
          onClick={() => setActiveTab('browse')}
        >
          <i className="fas fa-search"></i>
          Browse Materials
        </button>
        <button 
          className={`tab-button ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => setActiveTab('list')}
        >
          <i className="fas fa-plus"></i>
          List Your Items
        </button>
      </div>

      {activeTab === 'browse' ? (
        <div className="browse-content">
          {/* Search and Filters */}
          <div className="search-filters">
            <form onSubmit={handleSearch} className="search-form">
              <div className="search-input-group">
                <input
                  type="text"
                  placeholder="Search by title, author, or subject..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                <button type="submit" className="search-button">
                  <i className="fas fa-search"></i>
                </button>
              </div>
            </form>

            <div className="filters">
              <div className="filter-group">
                <label>Category</label>
                <select 
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="filter-select"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Price Range: LKR {priceRange[0]} - {priceRange[1]}</label>
                <div className="price-range">
                  <input
                    type="range"
                    min="0"
                    max="3000"
                    step="100"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                    className="range-slider"
                  />
                  <input
                    type="range"
                    min="0"
                    max="3000"
                    step="100"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="range-slider"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="results-section">
            <div className="results-header">
              <h3>Available Materials ({totalBooks.toLocaleString()})</h3>
              <div className="sort-options">
                <select
                  className="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="title">Title A-Z</option>
                  <option value="rating">Highest Rated</option>
                  <option value="condition">Best Condition</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="loading-state">
                <i className="fas fa-spinner fa-spin"></i>
                <p>Loading materials...</p>
              </div>
            ) : (
              <div className="books-grid">
                {filteredBooks.map(book => (
                  <div key={book.id} className="book-card">
                    <div className="book-image">
                      <img src={book.image} alt={book.title} />
                      <div className="condition-badge">{book.condition}</div>
                    </div>
                    <div className="book-details">
                      <h4>{book.title}</h4>
                      <p className="author">by {book.author}</p>
                      <p className="description">{book.description}</p>
                      <div className="book-meta">
                        <span className="seller">
                          <i className="fas fa-user"></i>
                          {book.seller}
                        </span>
                        <span className="location">
                          <i className="fas fa-map-marker-alt"></i>
                          {book.location}
                        </span>
                      </div>
                      <div className="price-section">
                        <span className="current-price">LKR {book.price.toLocaleString()}</span>
                        <span className="original-price">LKR {book.originalPrice.toLocaleString()}</span>
                        <span className="savings">
                          Save {Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)}%
                        </span>
                      </div>
                      <div className="book-actions">
                        <button className="btn-primary">
                          <i className="fas fa-shopping-cart"></i>
                          Add to Cart
                        </button>
                        <button className="btn-secondary">
                          <i className="fas fa-heart"></i>
                        </button>
                        <button className="btn-secondary">
                          <i className="fas fa-eye"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {!loading && filteredBooks.length > 0 && totalPages > 1 && (
              <div className="pagination-container">
                <div className="pagination-info">
                  <p>
                    Showing {((currentPage - 1) * 20) + 1} to {Math.min(currentPage * 20, totalBooks)} of {totalBooks} books
                  </p>
                </div>
                <div className="pagination-controls">
                  <button
                    className="pagination-btn"
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                  >
                    <i className="fas fa-angle-double-left"></i>
                  </button>
                  <button
                    className="pagination-btn"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <i className="fas fa-angle-left"></i>
                    Previous
                  </button>

                  <div className="page-numbers">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          className={`page-number ${currentPage === pageNum ? 'active' : ''}`}
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    className="pagination-btn"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <i className="fas fa-angle-right"></i>
                  </button>
                  <button
                    className="pagination-btn"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                  >
                    <i className="fas fa-angle-double-right"></i>
                  </button>
                </div>
              </div>
            )}

            {!loading && filteredBooks.length === 0 && (
              <div className="no-results">
                <i className="fas fa-search"></i>
                <h3>No materials found</h3>
                <p>Try adjusting your search criteria or browse all categories</p>
                <button 
                  className="btn-primary"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setPriceRange([0, 3000]);
                    setSortBy('newest');
                  }}
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="list-content">
          <div className="list-header">
            <h2>List Your Educational Materials</h2>
            <p>Turn your unused books into cash and help other students learn</p>
          </div>

          <div className="listing-benefits">
            <div className="benefit-card">
              <i className="fas fa-money-bill-wave"></i>
              <h3>Earn Money</h3>
              <p>Get paid for books you no longer need</p>
            </div>
            <div className="benefit-card">
              <i className="fas fa-recycle"></i>
              <h3>Help Environment</h3>
              <p>Give books a second life instead of throwing them away</p>
            </div>
            <div className="benefit-card">
              <i className="fas fa-graduation-cap"></i>
              <h3>Help Students</h3>
              <p>Make education more affordable for others</p>
            </div>
          </div>

          <div className="quick-list-section">
            <h3>Quick List Your Item</h3>

            {listSuccess && (
              <div className="success-message">
                <i className="fas fa-check-circle"></i>
                Book listed successfully! It will appear in the browse section.
              </div>
            )}

            <form className="quick-list-form" onSubmit={handleListFormSubmit}>
              <div className="form-row">
                <input
                  type="text"
                  name="title"
                  placeholder="Book Title *"
                  className="form-input"
                  value={listForm.title}
                  onChange={handleListFormChange}
                  required
                />
                <input
                  type="text"
                  name="author"
                  placeholder="Author *"
                  className="form-input"
                  value={listForm.author}
                  onChange={handleListFormChange}
                  required
                />
              </div>

              <div className="form-row">
                <select
                  name="category_id"
                  className="form-select"
                  value={listForm.category_id}
                  onChange={handleListFormChange}
                  required
                >
                  <option value="">Select Category *</option>
                  {categories.filter(cat => cat.value !== 'all').map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  name="price"
                  placeholder="Price (LKR) *"
                  className="form-input"
                  value={listForm.price}
                  onChange={handleListFormChange}
                  min="50"
                  max="3000"
                  required
                />
              </div>

              <div className="form-row">
                <select
                  name="condition"
                  className="form-select"
                  value={listForm.condition}
                  onChange={handleListFormChange}
                >
                  <option value="New">New</option>
                  <option value="Used">Used</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                </select>
                <input
                  type="text"
                  name="edition"
                  placeholder="Edition (e.g., 2nd, Revised)"
                  className="form-input"
                  value={listForm.edition}
                  onChange={handleListFormChange}
                />
              </div>

              <div className="form-row">
                <input
                  type="number"
                  name="published_year"
                  placeholder="Publication Year"
                  className="form-input"
                  value={listForm.published_year}
                  onChange={handleListFormChange}
                  min="1900"
                  max={new Date().getFullYear()}
                />
                <select
                  name="language"
                  className="form-select"
                  value={listForm.language}
                  onChange={handleListFormChange}
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="German">German</option>
                  <option value="French">French</option>
                  <option value="Chinese">Chinese</option>
                  <option value="Japanese">Japanese</option>
                </select>
              </div>

              <input
                type="text"
                name="isbn"
                placeholder="ISBN (optional)"
                className="form-input"
                value={listForm.isbn}
                onChange={handleListFormChange}
                style={{marginBottom: '1rem'}}
              />

              <textarea
                name="short_description"
                placeholder="Description and condition details..."
                className="form-textarea"
                value={listForm.short_description}
                onChange={handleListFormChange}
                rows="4"
              ></textarea>

              <div className="form-actions">
                <button type="button" className="btn-secondary" disabled>
                  <i className="fas fa-camera"></i>
                  Add Photos (Coming Soon)
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={listLoading}
                  onClick={(e) => {
                    console.log('Button clicked!'); // Debug log
                    // Don't prevent default here, let form handle it
                  }}
                >
                  <i className={listLoading ? "fas fa-spinner fa-spin" : "fas fa-plus"}></i>
                  {listLoading ? 'Listing...' : 'List Item'}
                </button>
              </div>
            </form>
          </div>

          <div className="listing-tips">
            <h3>Tips for Better Listings</h3>
            <ul>
              <li><i className="fas fa-check"></i> Take clear, well-lit photos</li>
              <li><i className="fas fa-check"></i> Describe the condition honestly</li>
              <li><i className="fas fa-check"></i> Set competitive prices</li>
              <li><i className="fas fa-check"></i> Respond quickly to inquiries</li>
              <li><i className="fas fa-check"></i> Package items carefully</li>
            </ul>
          </div>
        </div>
      )}

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

export default BrowseList;
