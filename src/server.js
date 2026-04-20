const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import database and models
const { sequelize, syncDatabase } = require('./models');
const { seedDatabase } = require('./config/seed');

// Import routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/', (req, res) => {
  res.json({
    message: 'eCommerce Admin Dashboard API',
    version: '1.0.0',
    status: 'Server is running',
  });
});

// Database status route
app.get('/api/health', (req, res) => {
  res.json({
    database: 'connected',
    server: 'running',
    timestamp: new Date(),
  });
});

// API Routes
app.use('/api', authRoutes);
app.use('/api/admin', adminRoutes);

// Initialize server
const startServer = async () => {
  try {
    // Sync database
    await syncDatabase();

    // Seed database with default users
    await seedDatabase();

    // Start server
    app.listen(PORT, () => {
      console.log(`\n✅ Server is running on http://localhost:${PORT}`);
      console.log(`\n📚 API Endpoints:`);
      console.log(`\n   🔐 Authentication:`);
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
      console.log(`\n📝 Test Login:`);
      console.log(`   Admin:  admin@example.com / admin123`);
      console.log(`   User:   user@example.com / user123\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
