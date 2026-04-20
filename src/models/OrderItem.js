module.exports = (sequelize, DataTypes) => {
  const OrderItem = sequelize.define('OrderItem', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // Note: We don't manually define orderId and productId here.
    // Sequelize will automatically add them when we define associations
    // in models/index.js. This keeps the code cleaner.
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    }
  }, {
    timestamps: true,
    tableName: 'order_items',
  });

  return OrderItem;
};