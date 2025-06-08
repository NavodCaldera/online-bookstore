const mysql = require('mysql2/promise');
require('dotenv').config();

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'bookstore_db',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

// Execute query with error handling
async function executeQuery(query, params = []) {
  try {
    const [results] = await pool.execute(query, params);
    return { success: true, data: results };
  } catch (error) {
    console.error('Database query error:', error);
    return { success: false, error: error.message };
  }
}

// Get connection from pool
async function getConnection() {
  try {
    return await pool.getConnection();
  } catch (error) {
    console.error('Error getting database connection:', error);
    throw error;
  }
}

// Initialize database (create tables if they don't exist)
async function initializeDatabase() {
  try {
    console.log('🔄 Initializing database...');

    // Read and execute schema file
    const fs = require('fs');
    const path = require('path');
    const schemaPath = path.join(__dirname, '../database/bookstore_schema.sql');

    if (fs.existsSync(schemaPath)) {
      const schema = fs.readFileSync(schemaPath, 'utf8');

      // Split by semicolon and execute each statement
      const statements = schema.split(';').filter(stmt => stmt.trim().length > 0);

      // Get a direct connection for executing statements
      const connection = await getConnection();

      for (const statement of statements) {
        const trimmedStatement = statement.trim();
        if (trimmedStatement) {
          try {
            // Skip USE statements as they're not needed with connection pool
            if (trimmedStatement.toUpperCase().startsWith('USE ')) {
              continue;
            }

            // Use query instead of execute for DDL statements
            await connection.query(trimmedStatement);
          } catch (error) {
            // Log error but continue with other statements
            if (!error.message.includes('already exists')) {
              console.log(`⚠️ Statement skipped: ${error.message}`);
            }
          }
        }
      }

      connection.release();
      console.log('✅ Database schema initialized successfully');
    } else {
      console.log('⚠️ Schema file not found, skipping initialization');
    }
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
  }
}

// Close all connections
async function closeConnections() {
  try {
    await pool.end();
    console.log('Database connections closed');
  } catch (error) {
    console.error('Error closing database connections:', error);
  }
}

module.exports = {
  pool,
  executeQuery,
  getConnection,
  testConnection,
  initializeDatabase,
  closeConnections
};
