const AdminJS = require('adminjs');
const AdminJSExpress = require('@adminjs/express');
const { User, Category, Product, Order, OrderItem, Setting } = require('../models');

// Configure resource options for all models
const configureResources = () => {
  return [
    {
      resource: User,
      options: {
        properties: {
          password: { isVisible: { list: false, filter: false, show: false, edit: true } },
        },
        actions: {
          new: {
            before: async (request) => {
              // Hash password before creating
              if (request.payload.password) {
                const bcrypt = require('bcryptjs');
                request.payload.password = await bcrypt.hash(request.payload.password, 10);
              }
              return request;
            },
          },
        },
      },
    },
    {
      resource: Category,
      options: {
        properties: {
          name: { isVisible: true },
          description: { isVisible: true },
          isActive: { isVisible: true },
        },
      },
    },
    {
      resource: Product,
      options: {
        properties: {
          name: { isVisible: true },
          description: { isVisible: true },
          price: { isVisible: true },
          stock: { isVisible: true },
          categoryId: { isVisible: true },
          isActive: { isVisible: true },
        },
      },
    },
    {
      resource: Order,
      options: {
        properties: {
          userId: { isVisible: true },
          totalAmount: { isVisible: true },
          status: { isVisible: true },
          orderNumber: { isVisible: true },
        },
      },
    },
    {
      resource: OrderItem,
      options: {
        properties: {
          orderId: { isVisible: true },
          productId: { isVisible: true },
          quantity: { isVisible: true },
          price: { isVisible: true },
        },
      },
    },
    {
      resource: Setting,
      options: {
        properties: {
          key: { isVisible: true },
          value: { isVisible: true },
          description: { isVisible: true },
        },
      },
    },
  ];
};

// Initialize AdminJS
const initializeAdmin = async () => {
  try {
    const adminJs = new AdminJS({
      resources: configureResources(),
      branding: {
        companyName: 'eCommerce Admin Dashboard',
        logo: false,
        softwareBrothers: false,
      },
      rootPath: '/admin',
    });

    const adminRouter = AdminJSExpress.buildRouter(adminJs);

    return { adminJs, adminRouter };
  } catch (error) {
    console.error('❌ Error initializing AdminJS:', error);
    throw error;
  }
};

module.exports = { initializeAdmin };
