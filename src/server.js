const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import database and models
const { sequelize, syncDatabase } = require('./models');

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
    database: sequelize.authenticate() ? 'connected' : 'disconnected',
    server: 'running',
    timestamp: new Date(),
  });
});

// Routes will be added in later phases

// Initialize server
const startServer = async () => {
  try {
    // Sync database
    await syncDatabase();

    // Start server
    app.listen(PORT, () => {
      console.log(`✅ Server is running on http://localhost:${PORT}`);
      console.log(`📊 Admin Dashboard will be available at http://localhost:${PORT}/admin`);
      console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
