const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

// Database configuration - Use SQLite for development
const dbPath = path.join(__dirname, '../database/bookstore.db');

// Create SQLite database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error opening database:', err.message);
  } else {
    console.log('✅ Connected to SQLite database');
  }
});

// Test database connection
async function testConnection() {
  return new Promise((resolve) => {
    db.get("SELECT 1", (err) => {
      if (err) {
        console.error('❌ Database connection failed:', err.message);
        resolve(false);
      } else {
        console.log('✅ Database connected successfully');
        resolve(true);
      }
    });
  });
}

// Execute query with error handling
async function executeQuery(query, params = []) {
  return new Promise((resolve) => {
    // Handle different query types
    if (query.trim().toUpperCase().startsWith('SELECT')) {
      db.all(query, params, (err, rows) => {
        if (err) {
          console.error('Database query error:', err);
          resolve({ success: false, error: err.message });
        } else {
          resolve({ success: true, data: rows });
        }
      });
    } else if (query.trim().toUpperCase().startsWith('INSERT')) {
      db.run(query, params, function(err) {
        if (err) {
          console.error('Database query error:', err);
          resolve({ success: false, error: err.message });
        } else {
          resolve({ success: true, data: { insertId: this.lastID, affectedRows: this.changes } });
        }
      });
    } else {
      db.run(query, params, function(err) {
        if (err) {
          console.error('Database query error:', err);
          resolve({ success: false, error: err.message });
        } else {
          resolve({ success: true, data: { affectedRows: this.changes } });
        }
      });
    }
  });
}

// Get connection (for SQLite, just return the db instance)
async function getConnection() {
  return db;
}

// Initialize database (create tables if they don't exist)
async function initializeDatabase() {
  try {
    console.log('🔄 Initializing database...');

    // Create tables directly for SQLite
    const createTables = `
      -- Categories table
      CREATE TABLE IF NOT EXISTS categories (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name VARCHAR(100) NOT NULL,
          description TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- Users table
      CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          full_name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          phone VARCHAR(20),
          user_type TEXT DEFAULT 'buyer' CHECK(user_type IN ('buyer', 'seller', 'both')),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- Books table
      CREATE TABLE IF NOT EXISTS books (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title VARCHAR(255) NOT NULL,
          author VARCHAR(255) NOT NULL,
          condition TEXT DEFAULT 'Used' CHECK(condition IN ('New', 'Used', 'Fair', 'Poor')),
          published_year INTEGER,
          edition VARCHAR(50),
          short_description TEXT,
          availability BOOLEAN DEFAULT 1,
          category_id INTEGER,
          rating DECIMAL(2,1) DEFAULT 0.0,
          price DECIMAL(10,2) NOT NULL,
          isbn VARCHAR(20),
          language VARCHAR(50) DEFAULT 'English',
          seller_id INTEGER,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (category_id) REFERENCES categories(id),
          FOREIGN KEY (seller_id) REFERENCES users(id)
      );

      -- Newsletter subscriptions table
      CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email VARCHAR(255) UNIQUE NOT NULL,
          status TEXT DEFAULT 'active' CHECK(status IN ('active', 'unsubscribed')),
          subscription_date DATETIME DEFAULT CURRENT_TIMESTAMP,
          unsubscribe_date DATETIME,
          source VARCHAR(100) DEFAULT 'footer_form'
      );
    `;

    // Execute table creation
    const statements = createTables.split(';').filter(stmt => stmt.trim().length > 0);

    for (const statement of statements) {
      const trimmedStatement = statement.trim();
      if (trimmedStatement) {
        await executeQuery(trimmedStatement);
      }
    }

    // Insert default categories
    await insertDefaultData();

    console.log('✅ Database schema initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
  }
}

// Insert default data
async function insertDefaultData() {
  try {
    // Check if categories already exist
    const categoriesResult = await executeQuery('SELECT COUNT(*) as count FROM categories');
    if (categoriesResult.success && categoriesResult.data[0].count === 0) {
      console.log('🔄 Inserting default categories...');

      const categories = [
        [1, 'Fiction', 'Fictional literature and novels'],
        [2, 'Non-Fiction', 'Educational and informational books'],
        [3, 'Science', 'Scientific and technical books'],
        [4, 'Mathematics', 'Mathematics and related subjects'],
        [5, 'History', 'Historical books and references'],
        [6, 'Literature', 'Classic and modern literature'],
        [7, 'Technology', 'Computer science and technology'],
        [8, 'Arts', 'Art, music, and creative subjects'],
        [9, 'Business', 'Business and economics'],
        [10, 'Philosophy', 'Philosophy and ethics'],
        [11, 'Psychology', 'Psychology and behavioral sciences'],
        [12, 'Reference', 'Reference books and encyclopedias']
      ];

      for (const [id, name, description] of categories) {
        await executeQuery(
          'INSERT OR IGNORE INTO categories (id, name, description) VALUES (?, ?, ?)',
          [id, name, description]
        );
      }

      console.log('✅ Default categories inserted');
    }

    // Insert sample books
    const booksResult = await executeQuery('SELECT COUNT(*) as count FROM books');
    if (booksResult.success && booksResult.data[0].count === 0) {
      console.log('🔄 Inserting sample books...');
      await insertSampleBooks();
      console.log('✅ Sample books inserted');
    }

    // Create default user
    const usersResult = await executeQuery('SELECT COUNT(*) as count FROM users');
    if (usersResult.success && usersResult.data[0].count === 0) {
      console.log('🔄 Creating default user...');
      await executeQuery(
        'INSERT INTO users (full_name, email, password_hash, phone, user_type) VALUES (?, ?, ?, ?, ?)',
        ['Default Seller', 'seller@bookstore.com', 'hashed_password', '+94771234567', 'seller']
      );
      console.log('✅ Default user created');
    }
  } catch (error) {
    console.error('Error inserting default data:', error);
  }
}

// Insert sample books
async function insertSampleBooks() {
  const sampleBooks = [
    ['Introduction to Computer Science', 'John Smith', 'New', 2020, '1st', 'Comprehensive guide to computer science fundamentals', 1, 7, 4.5, 2500.00, '978-1-234-56789-0', 'English', 1],
    ['Advanced Mathematics', 'Jane Doe', 'Used', 2019, '2nd', 'Advanced mathematical concepts and applications', 1, 4, 4.2, 1800.00, '978-1-234-56789-1', 'English', 1],
    ['World History', 'Robert Johnson', 'Fair', 2018, '3rd', 'Comprehensive world history textbook', 1, 5, 4.0, 1500.00, '978-1-234-56789-2', 'English', 1],
    ['Modern Literature', 'Emily Brown', 'New', 2021, '1st', 'Collection of modern literary works', 1, 6, 4.7, 2200.00, '978-1-234-56789-3', 'English', 1],
    ['Business Management', 'Michael Davis', 'Used', 2017, '4th', 'Principles of business management', 1, 9, 3.8, 1200.00, '978-1-234-56789-4', 'English', 1],
    ['Psychology Basics', 'Sarah Wilson', 'Fair', 2020, '2nd', 'Introduction to psychological concepts', 1, 11, 4.3, 1900.00, '978-1-234-56789-5', 'English', 1],
    ['Art History', 'David Miller', 'New', 2019, '1st', 'Survey of art through the ages', 1, 8, 4.1, 2100.00, '978-1-234-56789-6', 'English', 1],
    ['Philosophy 101', 'Lisa Garcia', 'Used', 2018, '3rd', 'Introduction to philosophical thinking', 1, 10, 3.9, 1400.00, '978-1-234-56789-7', 'English', 1],
    ['Science Encyclopedia', 'James Anderson', 'Fair', 2020, '5th', 'Comprehensive science reference', 1, 12, 4.6, 2800.00, '978-1-234-56789-8', 'English', 1],
    ['Fiction Anthology', 'Maria Rodriguez', 'New', 2021, '1st', 'Collection of contemporary fiction', 1, 1, 4.4, 1600.00, '978-1-234-56789-9', 'English', 1]
  ];

  for (const book of sampleBooks) {
    await executeQuery(
      `INSERT INTO books (title, author, condition, published_year, edition, short_description, availability, category_id, rating, price, isbn, language, seller_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      book
    );
  }
}

// Close all connections
async function closeConnections() {
  return new Promise((resolve) => {
    db.close((err) => {
      if (err) {
        console.error('Error closing database connections:', err);
      } else {
        console.log('Database connections closed');
      }
      resolve();
    });
  });
}

module.exports = {
  db,
  executeQuery,
  getConnection,
  testConnection,
  initializeDatabase,
  closeConnections
};
