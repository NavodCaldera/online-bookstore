const mysql = require('mysql2/promise');
require('dotenv').config();

async function initializeDatabase() {
  console.log('Initializing database...');
  
  // Create connection to MySQL server
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || ''
  });

  try {
    // Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'online_bookstore'}`);
    console.log(`Database '${process.env.DB_NAME || 'online_bookstore'}' created or already exists`);
    
    // Use the database
    await connection.query(`USE ${process.env.DB_NAME || 'online_bookstore'}`);
    
    // Create categories table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Categories table created or already exists');
    
    // Create books table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS books (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        image_url VARCHAR(255),
        stock INT DEFAULT 0,
        category_id INT,
        featured BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id)
      )
    `);
    console.log('Books table created or already exists');
    
    // Create users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        full_name VARCHAR(100),
        address TEXT,
        phone VARCHAR(20),
        role ENUM('customer', 'admin') DEFAULT 'customer',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Users table created or already exists');
    
    // Create orders table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        total_amount DECIMAL(10, 2) NOT NULL,
        status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
        shipping_address TEXT NOT NULL,
        payment_method VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);
    console.log('Orders table created or already exists');
    
    // Update orders table to include payment fields
    await connection.query(`
      ALTER TABLE orders 
      ADD COLUMN payment_intent_id VARCHAR(255) DEFAULT NULL,
      ADD COLUMN payment_status VARCHAR(50) DEFAULT 'pending',
      MODIFY COLUMN status ENUM('pending', 'payment_failed', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending'
    `);
    console.log('Orders table updated with payment fields');
    
    // Create order_items table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        book_id INT NOT NULL,
        quantity INT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id),
        FOREIGN KEY (book_id) REFERENCES books(id)
      )
    `);
    console.log('Order items table created or already exists');
    
    // Create reviews table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        book_id INT NOT NULL,
        user_id INT NOT NULL,
        rating INT NOT NULL,
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (book_id) REFERENCES books(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);
    console.log('Reviews table created or already exists');
    
    // Insert sample data (optional)
    // Insert a sample category
    const [categoryResult] = await connection.query(`
      INSERT INTO categories (name, description) 
      VALUES ('Fiction', 'Fictional books including novels and short stories')
    `);
    console.log('Sample category added');
    
    // Insert a sample book
    await connection.query(`
      INSERT INTO books (title, author, description, price, image_url, stock, category_id, featured) 
      VALUES (
        'Sample Book', 
        'John Doe', 
        'This is a sample book description', 
        19.99, 
        'https://via.placeholder.com/150', 
        10, 
        1, 
        TRUE
      )
    `);
    console.log('Sample book added');
    
    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await connection.end();
  }
}

// Run the initialization
initializeDatabase();
