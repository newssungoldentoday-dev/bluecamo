// routes/likes.routes.js
const express = require("express");
const router = express.Router();
const likes = require("../core/likes");
const { requireAuth } = require("../middleware/authMiddleware");

router.post("/:postId", requireAuth, (req, res, next) => {
  try {
    res.json(likes.toggleLike(req.userId, Number(req.params.postId)));
  } catch (err) {
    next(err);
  }
});

module.exports = router;
