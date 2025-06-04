const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const paymentRoutes = require('./routes/payment');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/payments', paymentRoutes);

// Special handling for Stripe webhook
app.use('/api/payments/webhook', express.raw({type: 'application/json'}));

// Create MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'online_bookstore',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}).promise();

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: 'Access denied' });
  
  jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret', (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Check admin role
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Requires admin privileges' });
  }
  next();
};

// API Routes

// Get all books
app.get('/api/books', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT b.*, c.name as category_name 
      FROM books b 
      LEFT JOIN categories c ON b.category_id = c.id
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get featured books
app.get('/api/books/featured', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT b.*, c.name as category_name 
      FROM books b 
      LEFT JOIN categories c ON b.category_id = c.id
      WHERE b.featured = TRUE
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching featured books:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get book by ID
app.get('/api/books/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT b.*, c.name as category_name 
      FROM books b 
      LEFT JOIN categories c ON b.category_id = c.id
      WHERE b.id = ?
    `, [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get books by category
app.get('/api/categories/:id/books', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT b.*, c.name as category_name 
      FROM books b 
      LEFT JOIN categories c ON b.category_id = c.id
      WHERE b.category_id = ?
    `, [req.params.id]);
    
    res.json(rows);
  } catch (error) {
    console.error('Error fetching books by category:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all categories
app.get('/api/categories', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM categories');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// User registration
app.post('/api/auth/register', async (req, res) => {
  const { username, email, password, full_name } = req.body;
  
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Please provide username, email and password' });
  }
  
  try {
    // Check if user already exists
    const [existingUsers] = await pool.query(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [username, email]
    );
    
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Insert new user
    const [result] = await pool.query(
      'INSERT INTO users (username, email, password, full_name) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, full_name]
    );
    
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// User login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }
  
  try {
    // Find user by email
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (users.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const user = users[0];
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Create JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1d' }
    );
    
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user profile
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT id, username, email, full_name, address, phone, role, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(users[0]);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
app.put('/api/profile', authenticateToken, async (req, res) => {
  const { full_name, address, phone } = req.body;
  
  try {
    await pool.query(
      'UPDATE users SET full_name = ?, address = ?, phone = ? WHERE id = ?',
      [full_name, address, phone, req.user.id]
    );
    
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new order
app.post('/api/orders', authenticateToken, async (req, res) => {
  const { total_amount, shipping_address, payment_method, items } = req.body;
  
  if (!total_amount || !shipping_address || !payment_method || !items || items.length === 0) {
    return res.status(400).json({ message: 'Missing required order information' });
  }
  
  try {
    // Start transaction
    await pool.query('START TRANSACTION');
    
    // Create order
    const [orderResult] = await pool.query(
      'INSERT INTO orders (user_id, total_amount, shipping_address, payment_method) VALUES (?, ?, ?, ?)',
      [req.user.id, total_amount, shipping_address, payment_method]
    );
    
    const orderId = orderResult.insertId;
    
    // Add order items
    for (const item of items) {
      await pool.query(
        'INSERT INTO order_items (order_id, book_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.book_id, item.quantity, item.price]
      );
      
      // Update book stock
      await pool.query(
        'UPDATE books SET stock = stock - ? WHERE id = ?',
        [item.quantity, item.book_id]
      );
    }
    
    // Commit transaction
    await pool.query('COMMIT');
    
    res.status(201).json({ 
      message: 'Order created successfully',
      order_id: orderId
    });
  } catch (error) {
    // Rollback transaction on error
    await pool.query('ROLLBACK');
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user orders
app.get('/api/orders', authenticateToken, async (req, res) => {
  try {
    const [orders] = await pool.query(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    
    // Get order items for each order
    for (let order of orders) {
      const [items] = await pool.query(`
        SELECT oi.*, b.title, b.author, b.image_url
        FROM order_items oi
        JOIN books b ON oi.book_id = b.id
        WHERE oi.order_id = ?
      `, [order.id]);
      
      order.items = items;
    }
    
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get order by ID
app.get('/api/orders/:id', authenticateToken, async (req, res) => {
  try {
    const [orders] = await pool.query(
      'SELECT * FROM orders WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    
    if (orders.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    const order = orders[0];
    
    // Get order items
    const [items] = await pool.query(`
      SELECT oi.*, b.title, b.author, b.image_url
      FROM order_items oi
      JOIN books b ON oi.book_id = b.id
      WHERE oi.order_id = ?
    `, [order.id]);
    
    order.items = items;
    
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a book review
app.post('/api/books/:id/reviews', authenticateToken, async (req, res) => {
  const { rating, comment } = req.body;
  const bookId = req.params.id;
  
  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }
  
  try {
    // Check if book exists
    const [books] = await pool.query('SELECT * FROM books WHERE id = ?', [bookId]);
    
    if (books.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    // Check if user already reviewed this book
    const [existingReviews] = await pool.query(
      'SELECT * FROM reviews WHERE book_id = ? AND user_id = ?',
      [bookId, req.user.id]
    );
    
    if (existingReviews.length > 0) {
      return res.status(400).json({ message: 'You have already reviewed this book' });
    }
    
    // Add review
    await pool.query(
      'INSERT INTO reviews (book_id, user_id, rating, comment) VALUES (?, ?, ?, ?)',
      [bookId, req.user.id, rating, comment]
    );
    
    res.status(201).json({ message: 'Review added successfully' });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get book reviews
app.get('/api/books/:id/reviews', async (req, res) => {
  try {
    const [reviews] = await pool.query(`
      SELECT r.*, u.username 
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.book_id = ?
      ORDER BY r.created_at DESC
    `, [req.params.id]);
    
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search books
app.get('/api/search', async (req, res) => {
  const { query } = req.query;
  
  if (!query) {
    return res.status(400).json({ message: 'Search query is required' });
  }
  
  try {
    const [rows] = await pool.query(`
      SELECT b.*, c.name as category_name 
      FROM books b 
      LEFT JOIN categories c ON b.category_id = c.id
      WHERE b.title LIKE ? OR b.author LIKE ? OR b.description LIKE ?
    `, [`%${query}%`, `%${query}%`, `%${query}%`]);
    
    res.json(rows);
  } catch (error) {
    console.error('Error searching books:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ADMIN ROUTES

// Add a new book (admin only)
app.post('/api/admin/books', authenticateToken, isAdmin, async (req, res) => {
  const { title, author, description, price, image_url, stock, category_id, featured } = req.body;
  
  if (!title || !author || !price || !category_id) {
    return res.status(400).json({ message: 'Missing required book information' });
  }
  
  try {
    const [result] = await pool.query(
      'INSERT INTO books (title, author, description, price, image_url, stock, category_id, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [title, author, description, price, image_url, stock || 0, category_id, featured || false]
    );
    
    res.status(201).json({ 
      message: 'Book added successfully',
      book_id: result.insertId
    });
  } catch (error) {
    console.error('Error adding book:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a book (admin only)
app.put('/api/admin/books/:id', authenticateToken, isAdmin, async (req, res) => {
  const { title, author, description, price, image_url, stock, category_id, featured } = req.body;
  
  try {
    await pool.query(
      'UPDATE books SET title = ?, author = ?, description = ?, price = ?, image_url = ?, stock = ?, category_id = ?, featured = ? WHERE id = ?',
      [title, author, description, price, image_url, stock, category_id, featured, req.params.id]
    );
    
    res.json({ message: 'Book updated successfully' });
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a book (admin only)
app.delete('/api/admin/books/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    // Check if book exists
    const [books] = await pool.query('SELECT * FROM books WHERE id = ?', [req.params.id]);
    
    if (books.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    // Delete book
    await pool.query('DELETE FROM books WHERE id = ?', [req.params.id]);
    
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a new category (admin only)
app.post('/api/admin/categories', authenticateToken, isAdmin, async (req, res) => {
  const { name, description } = req.body;
  
  if (!name) {
    return res.status(400).json({ message: 'Category name is required' });
  }
  
  try {
    const [result] = await pool.query(
      'INSERT INTO categories (name, description) VALUES (?, ?)',
      [name, description]
    );
    
    res.status(201).json({ 
      message: 'Category added successfully',
      category_id: result.insertId
    });
  } catch (error) {
    console.error('Error adding category:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all orders (admin only)
app.get('/api/admin/orders', authenticateToken, isAdmin, async (req, res) => {
  try {
    const [orders] = await pool.query(`
      SELECT o.*, u.username, u.email 
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `);
    
    res.json(orders);
  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update order status (admin only)
app.put('/api/admin/orders/:id', authenticateToken, isAdmin, async (req, res) => {
  const { status } = req.body;
  
  if (!status || !['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }
  
  try {
    await pool.query(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, req.params.id]
    );
    
    res.json({ message: 'Order status updated successfully' });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users (admin only)
app.get('/api/admin/users', authenticateToken, isAdmin, async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT id, username, email, full_name, role, created_at FROM users'
    );
    
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



