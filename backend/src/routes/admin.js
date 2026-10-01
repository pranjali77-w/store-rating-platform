const express = require('express');
const bcrypt = require('bcryptjs');
const { User, Store, Rating } = require('../models');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { validateRegister } = require('../middleware/validation');
const { Op, Sequelize } = require('sequelize');

const router = express.Router();
router.use(authenticateToken, authorizeRoles('ADMIN'));

router.get('/dashboard', async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalStores = await Store.count();
    const totalRatings = await Rating.count();
    res.json({ totalUsers, totalStores, totalRatings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/users', validateRegister, async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, address, role: role || 'USER' });
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/stores', async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;
    const store = await Store.create({ name, email, address, ownerId: ownerId || null });
    res.status(201).json(store);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/users', async (req, res) => {
  try {
    const { name, email, address, role, sortBy = 'name', sortOrder = 'ASC' } = req.query;
    const whereClause = {};

    if (name) whereClause.name = { [Op.iLike]: `%${name}%` };
    if (email) whereClause.email = { [Op.iLike]: `%${email}%` };
    if (address) whereClause.address = { [Op.iLike]: `%${address}%` };
    if (role) whereClause.role = role;

    const users = await User.findAll({
      where: whereClause,
      order: [[sortBy, sortOrder.toUpperCase()]],
      attributes: { exclude: ['password'] }
    });

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/stores', async (req, res) => {
  try {
    const { name, email, address, sortBy = 'name', sortOrder = 'ASC' } = req.query;
    const whereClause = {};

    if (name) whereClause.name = { [Op.iLike]: `%${name}%` };
    if (email) whereClause.email = { [Op.iLike]: `%${email}%` };
    if (address) whereClause.address = { [Op.iLike]: `%${address}%` };

    const stores = await Store.findAll({
      where: whereClause,
      attributes: [
        'id', 'name', 'email', 'address',
        [Sequelize.fn('AVG', Sequelize.col('Ratings.rating')), 'rating']
      ],
      include: [{ model: Rating, attributes: [] }],
      group: ['Store.id'],
      order: [[sortBy, sortOrder.toUpperCase()]]
    });

    res.json(stores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;