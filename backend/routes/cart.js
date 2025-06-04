const express = require('express');
const router = express.Router();
const { executeQuery } = require('../config/database');

// Get user's cart
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const query = `
      SELECT 
        c.id as cart_id,
        c.quantity,
        c.created_at as added_at,
        b.id as book_id,
        b.title,
        b.author,
        b.condition,
        b.price,
        b.availability,
        cat.name as category_name,
        u.full_name as seller_name
      FROM cart c
      JOIN books b ON c.book_id = b.id
      LEFT JOIN categories cat ON b.category_id = cat.id
      LEFT JOIN users u ON b.seller_id = u.id
      WHERE c.user_id = ? AND b.availability = 1
      ORDER BY c.created_at DESC
    `;

    const result = await executeQuery(query, [userId]);

    if (!result.success) {
      return res.status(500).json({ error: 'Database error', details: result.error });
    }

    // Calculate totals
    const items = result.data;
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = 300; // Fixed delivery fee
    const total = subtotal + deliveryFee;

    res.json({
      success: true,
      data: {
        items,
        summary: {
          itemCount: items.length,
          totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
          subtotal: subtotal.toFixed(2),
          deliveryFee: deliveryFee.toFixed(2),
          total: total.toFixed(2)
        }
      }
    });

  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add item to cart
router.post('/', async (req, res) => {
  try {
    const { user_id, book_id, quantity = 1 } = req.body;

    if (!user_id || !book_id) {
      return res.status(400).json({ error: 'user_id and book_id are required' });
    }

    // Check if book exists and is available
    const bookQuery = 'SELECT id, availability, title FROM books WHERE id = ?';
    const bookResult = await executeQuery(bookQuery, [book_id]);

    if (!bookResult.success) {
      return res.status(500).json({ error: 'Database error', details: bookResult.error });
    }

    if (bookResult.data.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }

    if (!bookResult.data[0].availability) {
      return res.status(400).json({ error: 'Book is not available' });
    }

    // Check if item already exists in cart
    const existingQuery = 'SELECT id, quantity FROM cart WHERE user_id = ? AND book_id = ?';
    const existingResult = await executeQuery(existingQuery, [user_id, book_id]);

    if (!existingResult.success) {
      return res.status(500).json({ error: 'Database error', details: existingResult.error });
    }

    let result;
    if (existingResult.data.length > 0) {
      // Update existing item
      const newQuantity = existingResult.data[0].quantity + quantity;
      const updateQuery = 'UPDATE cart SET quantity = ? WHERE user_id = ? AND book_id = ?';
      result = await executeQuery(updateQuery, [newQuantity, user_id, book_id]);
    } else {
      // Insert new item
      const insertQuery = 'INSERT INTO cart (user_id, book_id, quantity) VALUES (?, ?, ?)';
      result = await executeQuery(insertQuery, [user_id, book_id, quantity]);
    }

    if (!result.success) {
      return res.status(500).json({ error: 'Database error', details: result.error });
    }

    res.status(201).json({
      success: true,
      message: 'Item added to cart successfully'
    });

  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update cart item quantity
router.put('/:cartId', async (req, res) => {
  try {
    const { cartId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: 'Quantity must be at least 1' });
    }

    const query = 'UPDATE cart SET quantity = ? WHERE id = ?';
    const result = await executeQuery(query, [quantity, cartId]);

    if (!result.success) {
      return res.status(500).json({ error: 'Database error', details: result.error });
    }

    if (result.data.affectedRows === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    res.json({
      success: true,
      message: 'Cart item updated successfully'
    });

  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Remove item from cart
router.delete('/:cartId', async (req, res) => {
  try {
    const { cartId } = req.params;

    const query = 'DELETE FROM cart WHERE id = ?';
    const result = await executeQuery(query, [cartId]);

    if (!result.success) {
      return res.status(500).json({ error: 'Database error', details: result.error });
    }

    if (result.data.affectedRows === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    res.json({
      success: true,
      message: 'Item removed from cart successfully'
    });

  } catch (error) {
    console.error('Error removing cart item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Clear entire cart
router.delete('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const query = 'DELETE FROM cart WHERE user_id = ?';
    const result = await executeQuery(query, [userId]);

    if (!result.success) {
      return res.status(500).json({ error: 'Database error', details: result.error });
    }

    res.json({
      success: true,
      message: 'Cart cleared successfully',
      itemsRemoved: result.data.affectedRows
    });

  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
