const express = require('express');
const { Store, Rating } = require('../models');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { Op } = require('sequelize');

const router = express.Router();
router.use(authenticateToken, authorizeRoles('USER'));

router.get('/', async (req, res) => {
  try {
    const { search, sortBy = 'name', sortOrder = 'ASC' } = req.query;
    const userId = req.user.id;

    const whereClause = {};
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { address: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const stores = await Store.findAll({
      where: whereClause,
      order: [[sortBy, sortOrder.toUpperCase()]]
    });

    const storeData = await Promise.all(stores.map(async (store) => {
      const avgRating = await Rating.aggregate('rating', 'AVG', { where: { storeId: store.id } });
      const userRating = await Rating.findOne({ where: { storeId: store.id, userId } });

      return {
        id: store.id,
        name: store.name,
        address: store.address,
        overallRating: avgRating ? parseFloat(avgRating).toFixed(1) : 'No ratings',
        userSubmittedRating: userRating ? userRating.rating : null
      };
    }));

    res.json(storeData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:id/rate', async (req, res) => {
  try {
    const storeId = req.params.id;
    const userId = req.user.id;
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    let ratingObj = await Rating.findOne({ where: { storeId, userId } });
    if (ratingObj) {
      ratingObj.rating = rating;
      await ratingObj.save();
    } else {
      ratingObj = await Rating.create({ storeId, userId, rating });
    }

    res.json({ message: 'Rating saved successfully', ratingObj });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;