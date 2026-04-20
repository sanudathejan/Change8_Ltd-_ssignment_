const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Global error handler for database errors
let dbConnected = false;

// Health check route
app.get('/', (req, res) => {
  res.json({
    message: 'eCommerce Admin Dashboard API',
    version: '1.0.0',
    status: 'Server is running',
    database: dbConnected ? 'connected' : 'disconnected (development mode)',
  });
});

// API Routes (these will fail gracefully if DB is unavailable)
app.use('/api', authRoutes);
app.use('/api/admin', adminRoutes);

// Test endpoint that doesn't require DB
app.get('/api/health', (req, res) => {
  res.json({
    database: dbConnected ? 'connected' : 'offline',
    server: 'running',
    timestamp: new Date(),
    message: dbConnected ? '✅ All systems operational' : '⚠️ Database connection unavailable. See console for details.',
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  if (err.name === 'SequelizeConnectionError' || err.name === 'SequelizeAccessDeniedError') {
    return res.status(503).json({
      error: 'Database connection error',
      message: 'The database is currently unavailable. Please check PostgreSQL configuration.',
      hint: 'Run: npm run setup-db',
    });
  }
  
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

// Initialize server
const startServer = async () => {
  try {
    // Try to sync database
    try {
      const { sequelize, syncDatabase } = require('./models');
      const { seedDatabase } = require('./config/seed');

      await syncDatabase();
      await seedDatabase();
      dbConnected = true;
      console.log('✅ Database connected and synced');
    } catch (dbError) {
      dbConnected = false;
      console.error('⚠️ Database Error:', dbError.message);
      console.error('   API endpoints will return database-related errors');
      console.error('   To fix: Run "npm run setup-db" first\n');
    }

    // Start server regardless of DB status (for development)
    app.listen(PORT, () => {
      console.log(`\n✅ Server is running on http://localhost:${PORT}`);
      console.log(`\n📚 API Endpoints:\n`);
      console.log(`   🔐 Authentication:`);
      console.log(`      POST   http://localhost:${PORT}/api/login - User login`);
      console.log(`      POST   http://localhost:${PORT}/api/register - User registration`);
      console.log(`      GET    http://localhost:${PORT}/api/profile - Get user profile (requires token)`);
      console.log(`\n   📊 Admin Dashboard (requires admin token):`);
      console.log(`      GET    http://localhost:${PORT}/api/admin/stats - Dashboard statistics`);
      console.log(`      GET    http://localhost:${PORT}/api/admin/dashboard - Admin dashboard (all users)`);
      console.log(`      GET    http://localhost:${PORT}/api/admin/user-dashboard - User dashboard (limited)`);
      console.log(`      GET    http://localhost:${PORT}/api/admin/settings - Get all settings`);
      console.log(`      PUT    http://localhost:${PORT}/api/admin/settings/:id - Update setting`);
      console.log(`\n   🏥 Health: GET http://localhost:${PORT}/api/health`);
      console.log(`\n📝 Test Credentials:`);
      console.log(`   Admin:  admin@example.com / admin123`);
      console.log(`   User:   user@example.com / user123\n`);
      
      if (!dbConnected) {
        console.log('⚠️ DATABASE STATUS: NOT CONNECTED');
        console.log('   API will return database errors until DB is configured');
        console.log('   To fix: Run "npm run setup-db"\n');
      }
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
