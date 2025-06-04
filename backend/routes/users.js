const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { executeQuery } = require('../config/database');

// Register new user
router.post('/register', async (req, res) => {
  try {
    const {
      full_name,
      email,
      password,
      phone,
      user_type = 'buyer'
    } = req.body;

    // Validate required fields
    if (!full_name || !email || !password) {
      return res.status(400).json({
        error: 'Missing required fields: full_name, email, password'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Check if user already exists
    const existingUserQuery = 'SELECT id FROM users WHERE email = ?';
    const existingUser = await executeQuery(existingUserQuery, [email]);

    if (!existingUser.success) {
      return res.status(500).json({ error: 'Database error', details: existingUser.error });
    }

    if (existingUser.data.length > 0) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Insert new user
    const insertQuery = `
      INSERT INTO users (full_name, email, password_hash, phone, user_type)
      VALUES (?, ?, ?, ?, ?)
    `;

    const result = await executeQuery(insertQuery, [
      full_name, email, password_hash, phone, user_type
    ]);

    if (!result.success) {
      return res.status(500).json({ error: 'Database error', details: result.error });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: result.data.insertId, 
        email: email,
        user_type: user_type 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: result.data.insertId,
        full_name,
        email,
        user_type
      },
      token
    });

  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user by email
    const query = 'SELECT * FROM users WHERE email = ?';
    const result = await executeQuery(query, [email]);

    if (!result.success) {
      return res.status(500).json({ error: 'Database error', details: result.error });
    }

    if (result.data.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = result.data[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        user_type: user.user_type 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        user_type: user.user_type
      },
      token
    });

  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user profile
router.get('/profile/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT 
        id, full_name, email, phone, user_type, created_at
      FROM users 
      WHERE id = ?
    `;

    const result = await executeQuery(query, [id]);

    if (!result.success) {
      return res.status(500).json({ error: 'Database error', details: result.error });
    }

    if (result.data.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      data: result.data[0]
    });

  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
router.put('/profile/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, phone, user_type } = req.body;

    const query = `
      UPDATE users SET
        full_name = COALESCE(?, full_name),
        phone = COALESCE(?, phone),
        user_type = COALESCE(?, user_type),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    const result = await executeQuery(query, [full_name, phone, user_type, id]);

    if (!result.success) {
      return res.status(500).json({ error: 'Database error', details: result.error });
    }

    if (result.data.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully'
    });

  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's books (for sellers)
router.get('/:id/books', async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const query = `
      SELECT 
        b.id,
        b.title,
        b.author,
        b.condition,
        b.price,
        b.availability,
        b.rating,
        b.created_at,
        c.name as category_name
      FROM books b
      LEFT JOIN categories c ON b.category_id = c.id
      WHERE b.seller_id = ?
      ORDER BY b.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const result = await executeQuery(query, [id, parseInt(limit), parseInt(offset)]);

    if (!result.success) {
      return res.status(500).json({ error: 'Database error', details: result.error });
    }

    // Get total count
    const countQuery = 'SELECT COUNT(*) as total FROM books WHERE seller_id = ?';
    const countResult = await executeQuery(countQuery, [id]);
    
    const total = countResult.success ? countResult.data[0].total : 0;
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: result.data,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Error fetching user books:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
