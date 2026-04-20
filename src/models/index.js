const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Import model definitions
const UserModel = require('./User');
const CategoryModel = require('./Category');
const ProductModel = require('./Product');
const OrderModel = require('./Order');
const OrderItemModel = require('./OrderItem');
const SettingModel = require('./Setting');

// Initialize all models
const User = UserModel(sequelize, DataTypes);
const Category = CategoryModel(sequelize, DataTypes);
const Product = ProductModel(sequelize, DataTypes);
const Order = OrderModel(sequelize, DataTypes);
const OrderItem = OrderItemModel(sequelize, DataTypes);
const Setting = SettingModel(sequelize, DataTypes);

// Define Associations
// User -> Order (One to Many)
User.hasMany(Order, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

Order.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

// Order -> OrderItem (One to Many)
Order.hasMany(OrderItem, {
  foreignKey: 'orderId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

OrderItem.belongsTo(Order, {
  foreignKey: 'orderId',
  as: 'order',
});

// Product -> OrderItem (One to Many)
Product.hasMany(OrderItem, {
  foreignKey: 'productId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

OrderItem.belongsTo(Product, {
  foreignKey: 'productId',
  as: 'product',
});

// Category -> Product (One to Many)
Category.hasMany(Product, {
  foreignKey: 'categoryId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

Product.belongsTo(Category, {
  foreignKey: 'categoryId',
  as: 'category',
});

// Database synchronization function
const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('✅ Database tables synchronized successfully.');
  } catch (error) {
    console.error('❌ Error synchronizing database:', error);
  }
};

module.exports = {
  sequelize,
  User,
  Category,
  Product,
  Order,
  OrderItem,
  Setting,
  syncDatabase,
};
