const express = require('express');
const router = express.Router();
const { executeQuery } = require('../config/database');

// Create newsletter table if it doesn't exist
async function ensureNewsletterTable() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email VARCHAR(255) UNIQUE NOT NULL,
      status TEXT DEFAULT 'active' CHECK(status IN ('active', 'unsubscribed')),
      subscription_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      unsubscribe_date DATETIME,
      source VARCHAR(100) DEFAULT 'footer_form'
    )
  `;
  
  try {
    await executeQuery(createTableQuery);
    console.log('✅ Newsletter table ensured');
  } catch (error) {
    console.error('❌ Error creating newsletter table:', error);
  }
}

// Initialize table on module load
ensureNewsletterTable();

// Subscribe to newsletter
router.post('/subscribe', async (req, res) => {
  try {
    const { email, source = 'footer_form' } = req.body;

    // Validate email
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email is required' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid email format' 
      });
    }

    // Check if email already exists
    const existingQuery = 'SELECT id, status FROM newsletter_subscriptions WHERE email = ?';
    const existingResult = await executeQuery(existingQuery, [email]);

    if (!existingResult.success) {
      return res.status(500).json({ 
        success: false, 
        error: 'Database error', 
        details: existingResult.error 
      });
    }

    if (existingResult.data.length > 0) {
      const existing = existingResult.data[0];
      
      if (existing.status === 'active') {
        return res.status(200).json({ 
          success: true, 
          message: 'You are already subscribed to our newsletter!' 
        });
      } else {
        // Reactivate subscription
        const reactivateQuery = `
          UPDATE newsletter_subscriptions 
          SET status = 'active', subscription_date = CURRENT_TIMESTAMP, unsubscribe_date = NULL 
          WHERE email = ?
        `;
        const reactivateResult = await executeQuery(reactivateQuery, [email]);
        
        if (reactivateResult.success) {
          return res.status(200).json({ 
            success: true, 
            message: 'Welcome back! Your subscription has been reactivated.' 
          });
        } else {
          return res.status(500).json({ 
            success: false, 
            error: 'Failed to reactivate subscription' 
          });
        }
      }
    }

    // Insert new subscription
    const insertQuery = `
      INSERT INTO newsletter_subscriptions (email, source) 
      VALUES (?, ?)
    `;
    const insertResult = await executeQuery(insertQuery, [email, source]);

    if (!insertResult.success) {
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to subscribe', 
        details: insertResult.error 
      });
    }

    res.status(201).json({ 
      success: true, 
      message: 'Thank you for subscribing! You will receive the latest offers and updates via email.' 
    });

  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

// Unsubscribe from newsletter
router.post('/unsubscribe', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email is required' 
      });
    }

    const updateQuery = `
      UPDATE newsletter_subscriptions 
      SET status = 'unsubscribed', unsubscribe_date = CURRENT_TIMESTAMP 
      WHERE email = ? AND status = 'active'
    `;
    const result = await executeQuery(updateQuery, [email]);

    if (!result.success) {
      return res.status(500).json({ 
        success: false, 
        error: 'Database error', 
        details: result.error 
      });
    }

    if (result.data.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Email not found or already unsubscribed' 
      });
    }

    res.json({ 
      success: true, 
      message: 'You have been successfully unsubscribed from our newsletter.' 
    });

  } catch (error) {
    console.error('Error unsubscribing from newsletter:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

// Get newsletter statistics (admin only)
router.get('/stats', async (req, res) => {
  try {
    const statsQuery = `
      SELECT 
        COUNT(*) as total_subscriptions,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_subscriptions,
        COUNT(CASE WHEN status = 'unsubscribed' THEN 1 END) as unsubscribed,
        COUNT(CASE WHEN DATE(subscription_date) = DATE('now') THEN 1 END) as today_subscriptions
      FROM newsletter_subscriptions
    `;
    
    const result = await executeQuery(statsQuery);

    if (!result.success) {
      return res.status(500).json({ 
        success: false, 
        error: 'Database error', 
        details: result.error 
      });
    }

    res.json({ 
      success: true, 
      data: result.data[0] 
    });

  } catch (error) {
    console.error('Error getting newsletter stats:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

// Get all subscribers (admin only)
router.get('/subscribers', async (req, res) => {
  try {
    const { status = 'active', page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;

    const query = `
      SELECT email, status, subscription_date, unsubscribe_date, source
      FROM newsletter_subscriptions 
      WHERE status = ?
      ORDER BY subscription_date DESC
      LIMIT ? OFFSET ?
    `;
    
    const result = await executeQuery(query, [status, parseInt(limit), parseInt(offset)]);

    if (!result.success) {
      return res.status(500).json({ 
        success: false, 
        error: 'Database error', 
        details: result.error 
      });
    }

    res.json({ 
      success: true, 
      data: result.data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: result.data.length
      }
    });

  } catch (error) {
    console.error('Error getting subscribers:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

module.exports = router;
