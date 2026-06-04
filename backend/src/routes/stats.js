const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const DATA_PATH = path.join(__dirname, '../../../data/items.json');

let cache = null;

// Invalidate cache whenever the data file changes
fs.watch(DATA_PATH, () => {
  cache = null;
});

// GET /api/stats
router.get('/', async (req, res, next) => {
  try {
    if (!cache) {
      const raw = await fs.promises.readFile(DATA_PATH);
      const items = JSON.parse(raw);
      // Intentional heavy CPU calculation
      cache = {
        total: items.length,
        averagePrice: items.reduce((acc, cur) => acc + cur.price, 0) / items.length,
      };
    }
    res.json(cache);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
