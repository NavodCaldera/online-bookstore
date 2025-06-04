const express = require('express');
const router = express.Router();
const { executeQuery } = require('../config/database');

// Get all categories
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT 
        c.id,
        c.name,
        c.description,
        COUNT(b.id) as book_count
      FROM categories c
      LEFT JOIN books b ON c.id = b.category_id AND b.availability = 1
      GROUP BY c.id, c.name, c.description
      ORDER BY c.name ASC
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
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get category by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT 
        c.id,
        c.name,
        c.description,
        COUNT(b.id) as book_count
      FROM categories c
      LEFT JOIN books b ON c.id = b.category_id AND b.availability = 1
      WHERE c.id = ?
      GROUP BY c.id, c.name, c.description
    `;

    const result = await executeQuery(query, [id]);

    if (!result.success) {
      return res.status(500).json({ error: 'Database error', details: result.error });
    }

    if (result.data.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json({
      success: true,
      data: result.data[0]
    });

  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get books by category
router.get('/:id/books', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      page = 1,
      limit = 12,
      sortBy = 'created_at',
      sortOrder = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;

    // Validate sort parameters
    const validSortFields = ['title', 'author', 'price', 'rating', 'created_at'];
    const validSortOrders = ['ASC', 'DESC'];
    
    const safeSortBy = validSortFields.includes(sortBy) ? sortBy : 'created_at';
    const safeSortOrder = validSortOrders.includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'DESC';

    const query = `
      SELECT 
        b.id,
        b.title,
        b.author,
        b.condition,
        b.price,
        b.rating,
        b.short_description,
        b.isbn,
        b.language,
        c.name as category_name
      FROM books b
      JOIN categories c ON b.category_id = c.id
      WHERE b.category_id = ? AND b.availability = 1
      ORDER BY b.${safeSortBy} ${safeSortOrder}
      LIMIT ? OFFSET ?
    `;

    const result = await executeQuery(query, [id, parseInt(limit), parseInt(offset)]);

    if (!result.success) {
      return res.status(500).json({ error: 'Database error', details: result.error });
    }

    // Get total count
    const countQuery = 'SELECT COUNT(*) as total FROM books WHERE category_id = ? AND availability = 1';
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
        itemsPerPage: parseInt(limit),
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error('Error fetching books by category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
