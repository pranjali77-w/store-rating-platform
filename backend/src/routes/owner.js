const express = require('express');
const { Store, Rating, User } = require('../models');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();
router.use(authenticateToken, authorizeRoles('OWNER'));

router.get('/dashboard', async (req, res) => {
  try {
    const ownerId = req.user.id;
    const store = await Store.findOne({ where: { ownerId } });

    if (!store) return res.status(404).json({ message: 'No store associated with this owner.' });

    const avgRating = await Rating.aggregate('rating', 'AVG', { where: { storeId: store.id } });
    const ratingsList = await Rating.findAll({
      where: { storeId: store.id },
      include: [{ model: User, attributes: ['name', 'email', 'address'] }]
    });

    res.json({
      storeName: store.name,
      averageRating: avgRating ? parseFloat(avgRating).toFixed(1) : 'No ratings yet',
      ratings: ratingsList.map(r => ({
        userName: r.User.name,
        userEmail: r.User.email,
        rating: r.rating,
        createdAt: r.createdAt
      }))
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;