const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'PageTurn BookStore API is running!',
    version: '1.0.0',
    endpoints: {
      books: '/api/books',
      categories: '/api/categories',
      users: '/api/users',
      cart: '/api/cart'
    }
  });
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const { testConnection } = require('./config/database');
    const dbStatus = await testConnection();
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      database: dbStatus ? 'Connected' : 'Disconnected',
      uptime: process.uptime()
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      error: error.message
    });
  }
});

// Import and use routes
const booksRoutes = require('./routes/books');
const categoriesRoutes = require('./routes/categories');
const usersRoutes = require('./routes/users');
const cartRoutes = require('./routes/cart');

// API Routes
app.use('/api/books', booksRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/cart', cartRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The route ${req.method} ${req.originalUrl} does not exist`
  });
});

// Initialize database and start server
async function startServer() {
  try {
    console.log('🚀 Starting PageTurn BookStore API...');

    // Import database functions
    const { testConnection, initializeDatabase } = require('./config/database');

    // Test database connection
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.log('⚠️ Database connection failed. Server will start but database features may not work.');
      console.log('💡 Make sure MySQL is running and check your .env file');
    } else {
      console.log('✅ Database connected successfully');
      // Initialize database schema
      await initializeDatabase();
    }

    // Start server
    app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
      console.log(`📚 API Documentation: http://localhost:${PORT}/`);
      console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
      console.log(`📖 Books API: http://localhost:${PORT}/api/books`);
      console.log(`📂 Categories API: http://localhost:${PORT}/api/categories`);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    console.log('🔄 Starting server without database initialization...');

    // Start server anyway
    app.listen(PORT, () => {
      console.log(`⚠️ Server running on port ${PORT} (database features may be limited)`);
    });
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...');
  try {
    const { closeConnections } = require('./config/database');
    await closeConnections();
  } catch (error) {
    console.log('Database cleanup skipped');
  }
  process.exit(0);
});

// Start the server
startServer();
