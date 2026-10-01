const bcrypt = require('bcryptjs');
const { sequelize, User, Store } = require('./models');

const seedDatabase = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });

    const adminPassword = await bcrypt.hash('Admin@1234', 10);
    const userPassword = await bcrypt.hash('User@1234', 10);
    const ownerPassword = await bcrypt.hash('Owner@1234', 10);

    const admin = await User.create({
      name: 'System Administrator Account',
      email: 'admin@storerating.com',
      password: adminPassword,
      address: '123 Tech Park, Suite 400, Innovation Way, San Francisco, CA',
      role: 'ADMIN',
    });

    const normalUser = await User.create({
      name: 'Johnathon Doe Registered User',
      email: 'user@storerating.com',
      password: userPassword,
      address: '456 Elm Street, Apartment 2B, Brooklyn, NY',
      role: 'USER',
    });

    const storeOwner = await User.create({
      name: 'Robert Smith Store Owner Acc',
      email: 'owner@storerating.com',
      password: ownerPassword,
      address: '789 Market Street, Floor 5, Chicago, IL',
      role: 'OWNER',
    });

    await Store.create({
      name: 'Apex Supermarket Central Branch',
      email: 'contact@apexsupermarket.com',
      address: '100 Commercial Boulevard, Downtown Center, Chicago, IL',
      ownerId: storeOwner.id,
    });

    console.log('Seeding Completed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();