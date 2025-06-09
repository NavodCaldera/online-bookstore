const express = require('express');
const router = express.Router();
const { executeQuery } = require('../config/database');

// Get all books with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      search,
      minPrice,
      maxPrice,
      condition,
      language,
      availability,
      sortBy = 'created_at',
      sortOrder = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;
    let whereConditions = [];
    let queryParams = [];

    // Only filter by availability if specified
    if (availability !== undefined) {
      whereConditions.push('b.availability = ?');
      queryParams.push(availability);
    }

    // Build WHERE conditions
    if (category && category !== 'all') {
      whereConditions.push('c.name = ?');
      queryParams.push(category);
    }

    if (search) {
      whereConditions.push('(b.title LIKE ? OR b.author LIKE ? OR b.short_description LIKE ?)');
      const searchTerm = `%${search}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm);
    }

    if (minPrice) {
      whereConditions.push('b.price >= ?');
      queryParams.push(parseFloat(minPrice));
    }

    if (maxPrice) {
      whereConditions.push('b.price <= ?');
      queryParams.push(parseFloat(maxPrice));
    }

    if (condition) {
      whereConditions.push('b.condition = ?');
      queryParams.push(condition);
    }

    if (language) {
      whereConditions.push('b.language = ?');
      queryParams.push(language);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Validate sort parameters
    const validSortFields = ['title', 'author', 'price', 'rating', 'created_at', 'published_year'];
    const validSortOrders = ['ASC', 'DESC'];
    
    const safeSortBy = validSortFields.includes(sortBy) ? sortBy : 'created_at';
    const safeSortOrder = validSortOrders.includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'DESC';

    // Main query
    const query = `
      SELECT 
        b.id,
        b.title,
        b.author,
        b.condition,
        b.published_year,
        b.edition,
        b.short_description,
        b.availability,
        b.rating,
        b.price,
        b.isbn,
        b.language,
        b.created_at,
        c.name as category_name,
        c.id as category_id,
        u.full_name as seller_name
      FROM books b
      LEFT JOIN categories c ON b.category_id = c.id
      LEFT JOIN users u ON b.seller_id = u.id
      ${whereClause}
      ORDER BY b.${safeSortBy} ${safeSortOrder}
      LIMIT ? OFFSET ?
    `;

    queryParams.push(parseInt(limit), parseInt(offset));

    const result = await executeQuery(query, queryParams);

    if (!result.success) {
      return res.status(500).json({ error: 'Database error', details: result.error });
    }

    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(*) as total
      FROM books b
      LEFT JOIN categories c ON b.category_id = c.id
      ${whereClause}
    `;

    const countParams = queryParams.slice(0, -2); // Remove limit and offset
    const countResult = await executeQuery(countQuery, countParams);

    const total = countResult.success ? countResult.data[0].total : 0;
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: result.data,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: total,
        itemsPerPage: parseInt(limit),
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get featured books
router.get('/featured', async (req, res) => {
  try {
    const query = `
      SELECT 
        b.id,
        b.title,
        b.author,
        b.condition,
        b.price,
        b.rating,
        b.short_description,
        c.name as category_name
      FROM books b
      LEFT JOIN categories c ON b.category_id = c.id
      WHERE b.availability = 1 AND b.rating >= 4.0
      ORDER BY b.rating DESC, b.created_at DESC
      LIMIT 20
    `;

    const result = await executeQuery(query);

    if (!result.success) {
      return res.status(500).json({ error: 'Database error', details: result.error });
    }

    res.json({
      success: true,
      data: result.data
    });

  } catch (error) {
    console.error('Error fetching featured books:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get book by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT 
        b.*,
        c.name as category_name,
        u.full_name as seller_name,
        u.email as seller_email,
        u.phone as seller_phone
      FROM books b
      LEFT JOIN categories c ON b.category_id = c.id
      LEFT JOIN users u ON b.seller_id = u.id
      WHERE b.id = ?
    `;

    const result = await executeQuery(query, [id]);

    if (!result.success) {
      return res.status(500).json({ error: 'Database error', details: result.error });
    }

    if (result.data.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json({
      success: true,
      data: result.data[0]
    });

  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new book (for sellers)
router.post('/', async (req, res) => {
  try {
    const {
      title,
      author,
      condition,
      published_year,
      edition,
      short_description,
      category_id,
      price,
      isbn,
      language = 'English',
      seller_id
    } = req.body;

    // Validate required fields
    if (!title || !author || !price || !seller_id) {
      return res.status(400).json({ 
        error: 'Missing required fields: title, author, price, seller_id' 
      });
    }

    const query = `
      INSERT INTO books (
        title, author, \`condition\`, published_year, edition, 
        short_description, category_id, price, isbn, language, seller_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      title, author, condition, published_year, edition,
      short_description, category_id, price, isbn, language, seller_id
    ];

    const result = await executeQuery(query, params);

    if (!result.success) {
      return res.status(500).json({ error: 'Database error', details: result.error });
    }

    res.status(201).json({
      success: true,
      message: 'Book created successfully',
      bookId: result.data.insertId
    });

  } catch (error) {
    console.error('Error creating book:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update book
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      author,
      condition,
      published_year,
      edition,
      short_description,
      category_id,
      price,
      isbn,
      language,
      availability
    } = req.body;

    const query = `
      UPDATE books SET
        title = COALESCE(?, title),
        author = COALESCE(?, author),
        \`condition\` = COALESCE(?, \`condition\`),
        published_year = COALESCE(?, published_year),
        edition = COALESCE(?, edition),
        short_description = COALESCE(?, short_description),
        category_id = COALESCE(?, category_id),
        price = COALESCE(?, price),
        isbn = COALESCE(?, isbn),
        language = COALESCE(?, language),
        availability = COALESCE(?, availability),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    const params = [
      title, author, condition, published_year, edition,
      short_description, category_id, price, isbn, language, availability, id
    ];

    const result = await executeQuery(query, params);

    if (!result.success) {
      return res.status(500).json({ error: 'Database error', details: result.error });
    }

    if (result.data.affectedRows === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json({
      success: true,
      message: 'Book updated successfully'
    });

  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete book
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const query = 'DELETE FROM books WHERE id = ?';
    const result = await executeQuery(query, [id]);

    if (!result.success) {
      return res.status(500).json({ error: 'Database error', details: result.error });
    }

    if (result.data.affectedRows === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json({
      success: true,
      message: 'Book deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
