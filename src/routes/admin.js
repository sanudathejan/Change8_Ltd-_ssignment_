const express = require('express');
const { verifyToken, isAdmin } = require('../middleware/auth');

const adminRouter = express.Router();

// Middleware to protect admin routes
adminRouter.use(verifyToken);
adminRouter.use(isAdmin);

// Admin dashboard stats (custom page)
adminRouter.get('/stats', async (req, res) => {
  try {
    const { User, Order, Product, OrderItem } = require('../models');

    // Get statistics
    const totalUsers = await User.count();
    const totalOrders = await Order.count();
    const totalProducts = await Product.count();
    const activeUsers = await User.count({ where: { isActive: true } });

    // Get revenue
    const orders = await Order.findAll({
      attributes: ['totalAmount'],
    });

    const totalRevenue = orders.reduce((sum, order) => {
      return sum + (parseFloat(order.totalAmount) || 0);
    }, 0);

    // Get recent orders
    const recentOrders = await Order.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
      ],
    });

    res.json({
      success: true,
      data: {
        totalUsers,
        totalOrders,
        totalProducts,
        activeUsers,
        totalRevenue: totalRevenue.toFixed(2),
        recentOrders,
      },
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard stats',
      error: error.message,
    });
  }
});

// Get all settings
adminRouter.get('/settings', async (req, res) => {
  try {
    const { Setting } = require('../models');

    const settings = await Setting.findAll();

    res.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error('Settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching settings',
      error: error.message,
    });
  }
});

// Update a setting
adminRouter.put('/settings/:id', async (req, res) => {
  try {
    const { Setting } = require('../models');
    const { value } = req.body;

    const setting = await Setting.update(
      { value },
      { where: { id: req.params.id }, returning: true }
    );

    res.json({
      success: true,
      message: 'Setting updated successfully',
      data: setting[1][0],
    });
  } catch (error) {
    console.error('Update setting error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating setting',
      error: error.message,
    });
  }
});

// Get dashboard data (admin only)
adminRouter.get('/dashboard', async (req, res) => {
  try {
    const { User } = require('../models');

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required',
      });
    }

    // Get all users for admin view
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
    });

    res.json({
      success: true,
      data: {
        role: req.user.role,
        users,
      },
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard',
      error: error.message,
    });
  }
});

// Get user dashboard (limited for regular users)
adminRouter.get('/user-dashboard', verifyToken, async (req, res) => {
  try {
    const { User, Order } = require('../models');

    // Get current user info
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
    });

    // Get user's orders if they're a regular user
    let userOrders = [];
    if (req.user.role === 'user') {
      userOrders = await Order.findAll({
        where: { userId: req.user.id },
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'firstName', 'lastName'],
          },
        ],
        limit: 10,
        order: [['createdAt', 'DESC']],
      });
    }

    res.json({
      success: true,
      data: {
        user,
        orders: userOrders,
      },
    });
  } catch (error) {
    console.error('User dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user dashboard',
      error: error.message,
    });
  }
});

module.exports = adminRouter;
