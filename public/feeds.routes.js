// routes/feed.routes.js
const express = require("express");
const router = express.Router();
const feed = require("../core/feed");
const { optionalAuth } = require("../middleware/authMiddleware");

router.get("/", optionalAuth, (req, res, next) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 30, 100);
    res.json(feed.getFeed(req.userId, { limit }));
  } catch (err) {
    next(err);
  }
});

module.exports = router;
