/**
 * AdminJS Integration
 * 
 * This provides a manual integration of admin dashboard features without relying on
 * @adminjs/core, @adminjs/express packages (which have npm compatibility issues)
 * 
 * Instead, we use custom REST endpoints for admin functionality
 */

const express = require('express');
const { Models } = require('../models');
const { verifyToken, isAdmin } = require('../middleware/auth');

const adminRouter = express.Router();

// Apply middleware to all admin routes
adminRouter.use(verifyToken);
adminRouter.use(isAdmin);

/**
 * GET /api/admin/resources
 * List all available admin resources (for a future UI dashboard)
 */
adminRouter.get('/resources', async (req, res) => {
  try {
    res.json({
      resources: [
        { name: 'Users', endpoint: '/api/admin/resources/users', model: 'User' },
        { name: 'Categories', endpoint: '/api/admin/resources/categories', model: 'Category' },
        { name: 'Products', endpoint: '/api/admin/resources/products', model: 'Product' },
        { name: 'Orders', endpoint: '/api/admin/resources/orders', model: 'Order' },
        { name: 'OrderItems', endpoint: '/api/admin/resources/order-items', model: 'OrderItem' },
        { name: 'Settings', endpoint: '/api/admin/resources/settings', model: 'Setting' },
      ],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * CRUD Operations for Admin Resources
 * Using dynamic resource endpoints: /api/admin/resources/:resource
 */

// Read all records for a resource
adminRouter.get('/resources/:resource', async (req, res) => {
  try {
    const { resource } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    // Map resource names to models
    const modelMap = {
      'users': 'User',
      'categories': 'Category',
      'products': 'Product',
      'orders': 'Order',
      'order-items': 'OrderItem',
      'settings': 'Setting',
    };

    const modelName = modelMap[resource.toLowerCase()];
    if (!modelName) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    // This would work if database is connected
    // For now, returning mock structure
    res.json({
      resource,
      message: 'This endpoint requires database connection',
      structure: 'Available after database is configured',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Admin Dashboard Configuration
 */
const adminConfig = {
  title: 'Role-Based eCommerce Admin',
  logo: '/logo.png', // placeholder
  branding: {
    companyName: 'Change8 Ltd',
    projectName: 'eCommerce Admin Dashboard',
  },
  resources: [
    {
      resource: 'User',
      options: {
        navigation: { name: 'Users' },
        listProperties: ['id', 'email', 'role', 'isActive', 'createdAt'],
        filterProperties: ['email', 'role', 'isActive'],
        properties: {
          password: { isVisible: { list: false, filter: false, show: false, edit: false } },
        },
      },
    },
    {
      resource: 'Category',
      options: {
        navigation: { name: 'Categories' },
        listProperties: ['id', 'name', 'isActive', 'createdAt'],
      },
    },
    {
      resource: 'Product',
      options: {
        navigation: { name: 'Products' },
        listProperties: ['id', 'name', 'price', 'stock', 'isActive', 'createdAt'],
      },
    },
    {
      resource: 'Order',
      options: {
        navigation: { name: 'Orders' },
        listProperties: ['id', 'orderNumber', 'userId', 'status', 'totalAmount', 'createdAt'],
        filterProperties: ['status', 'createdAt'],
      },
    },
    {
      resource: 'Setting',
      options: {
        navigation: { name: 'Settings' },
        listProperties: ['id', 'key', 'value', 'description'],
        filterProperties: ['key'],
      },
    },
  ],
};

/**
 * GET /api/admin/config
 * Returns AdminJS configuration for frontend integration
 */
adminRouter.get('/config', (req, res) => {
  res.json(adminConfig);
});

/**
 * Custom Dashboard Summary
 */
adminRouter.get('/dashboard-summary', async (req, res) => {
  try {
    res.json({
      title: 'Admin Dashboard',
      message: 'Database connection required to display statistics',
      sections: [
        { title: 'Users', endpoint: '/api/admin/resources/users' },
        { title: 'Orders', endpoint: '/api/admin/resources/orders' },
        { title: 'Products', endpoint: '/api/admin/resources/products' },
        { title: 'Revenue', endpoint: '/api/admin/stats' },
      ],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = {
  adminRouter,
  adminConfig,
};
