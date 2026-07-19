// routes/comments.routes.js
const express = require("express");
const router = express.Router();
const comments = require("../core/comments");
const { requireAuth } = require("../middleware/authMiddleware");

router.post("/:postId", requireAuth, (req, res, next) => {
  try {
    res.status(201).json(comments.addComment(req.userId, Number(req.params.postId), req.body.content));
  } catch (err) {
    next(err);
  }
});

router.get("/:postId", (req, res, next) => {
  try {
    res.json(comments.listForPost(Number(req.params.postId)));
  } catch (err) {
    next(err);
  }
});

module.exports = router;
