// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3002';

// API Endpoints
export const API_ENDPOINTS = {
  BOOKS: '/api/books',
  FEATURED_BOOKS: '/api/books/featured',
  CATEGORIES: '/api/categories',
  USERS: '/api/users',
  CART: '/api/cart',
  NEWSLETTER: '/api/newsletter',
  HEALTH: '/api/health'
};

// Application Constants
export const APP_CONFIG = {
  NAME: 'PageTurn',
  DESCRIPTION: 'Educational Bookstore Platform',
  VERSION: '1.0.0',
  DEFAULT_PORT: 3001,
  ITEMS_PER_PAGE: 20,
  FEATURED_BOOKS_PER_PAGE: 4
};

// Book Categories
export const BOOK_CATEGORIES = [
  { id: 1, name: 'Fiction', description: 'Fictional literature and novels' },
  { id: 2, name: 'Non-Fiction', description: 'Educational and informational books' },
  { id: 3, name: 'Science', description: 'Scientific and technical books' },
  { id: 4, name: 'Mathematics', description: 'Mathematics and related subjects' },
  { id: 5, name: 'History', description: 'Historical books and references' },
  { id: 6, name: 'Literature', description: 'Classic and modern literature' },
  { id: 7, name: 'Technology', description: 'Computer science and technology' },
  { id: 8, name: 'Arts', description: 'Art, music, and creative subjects' },
  { id: 9, name: 'Business', description: 'Business and economics' },
  { id: 10, name: 'Philosophy', description: 'Philosophy and ethics' },
  { id: 11, name: 'Psychology', description: 'Psychology and behavioral sciences' },
  { id: 12, name: 'Reference', description: 'Reference books and encyclopedias' }
];

// Book Conditions
export const BOOK_CONDITIONS = [
  'New',
  'Used',
  'Fair',
  'Poor'
];

// User Types
export const USER_TYPES = [
  'buyer',
  'seller',
  'both'
];

// Currency
export const CURRENCY = {
  CODE: 'LKR',
  SYMBOL: 'Rs.',
  NAME: 'Sri Lankan Rupee'
};

// Toast Types
export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// Navigation Links
export const NAV_LINKS = [
  { path: '/', label: 'Home', icon: 'fas fa-home' },
  { path: '/browse', label: 'Browse', icon: 'fas fa-search' },
  { path: '/buy-sell', label: 'Buy & Sell', icon: 'fas fa-exchange-alt' }
];

// More Menu Links
export const MORE_LINKS = [
  { path: '/about', label: 'About Us', icon: 'fas fa-info-circle' },
  { path: '/contact', label: 'Contact', icon: 'fas fa-envelope' },
  { path: '/help', label: 'Help', icon: 'fas fa-question-circle' }
];

// User Menu Links
export const USER_MENU_LINKS = [
  { path: '/profile', label: 'My Account', icon: 'fas fa-user' },
  { path: '/settings', label: 'Account Settings', icon: 'fas fa-cog' },
  { path: '/my-listings', label: 'My Listings', icon: 'fas fa-list' },
  { path: '/my-orders', label: 'My Orders', icon: 'fas fa-shopping-bag' }
];

// Form Validation
export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[+]?[\d\s\-()]+$/,
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50
};

// Local Storage Keys
export const STORAGE_KEYS = {
  USER_TOKEN: 'pageturn_user_token',
  USER_DATA: 'pageturn_user_data',
  CART_ITEMS: 'pageturn_cart_items',
  WISHLIST_ITEMS: 'pageturn_wishlist_items'
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  EMAIL_REQUIRED: 'Email is required.',
  PASSWORD_REQUIRED: 'Password is required.',
  NAME_REQUIRED: 'Name is required.',
  PHONE_REQUIRED: 'Phone number is required.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  INVALID_PHONE: 'Please enter a valid phone number.',
  PASSWORD_TOO_SHORT: `Password must be at least ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} characters long.`
};

// Success Messages
export const SUCCESS_MESSAGES = {
  ACCOUNT_CREATED: 'Account created successfully!',
  LOGIN_SUCCESS: 'Login successful!',
  LOGOUT_SUCCESS: 'Logout successful!',
  NEWSLETTER_SUBSCRIBED: 'Successfully subscribed to newsletter!',
  BOOK_ADDED_TO_CART: 'Book added to cart!',
  BOOK_ADDED_TO_WISHLIST: 'Book added to wishlist!',
  PROFILE_UPDATED: 'Profile updated successfully!'
};
