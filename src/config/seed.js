const bcrypt = require('bcryptjs');
const { User } = require('../models');

// Seed database with default admin user
const seedDatabase = async () => {
  try {
    // Check if admin user already exists
    const adminExists = await User.findOne({
      where: { email: 'admin@example.com' },
    });

    if (!adminExists) {
      // Hash the default admin password
      const hashedPassword = await bcrypt.hash('admin123', 10);

      // Create admin user
      await User.create({
        email: 'admin@example.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        isActive: true,
      });

      console.log('✅ Default admin user created:');
      console.log('   Email: admin@example.com');
      console.log('   Password: admin123');
      console.log('   Role: admin');
    } else {
      console.log('✓ Admin user already exists');
    }

    // Create sample regular user (optional)
    const userExists = await User.findOne({
      where: { email: 'user@example.com' },
    });

    if (!userExists) {
      const hashedPassword = await bcrypt.hash('user123', 10);

      await User.create({
        email: 'user@example.com',
        password: hashedPassword,
        firstName: 'Regular',
        lastName: 'User',
        role: 'user',
        isActive: true,
      });

      console.log('✅ Sample regular user created:');
      console.log('   Email: user@example.com');
      console.log('   Password: user123');
      console.log('   Role: user');
    } else {
      console.log('✓ Regular user already exists');
    }
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
};

module.exports = { seedDatabase };
