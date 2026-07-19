// routes/posts.routes.js
const express = require("express");
const router = express.Router();
const posts = require("../core/posts");
const { requireAuth, optionalAuth } = require("../middleware/authMiddleware");

router.post("/", requireAuth, (req, res, next) => {
  try {
    res.status(201).json(posts.createPost(req.userId, req.body));
  } catch (err) {
    next(err);
  }
});

router.get("/:id", optionalAuth, (req, res, next) => {
  try {
    res.json(posts.hydrate(posts.getPost(req.params.id), req.userId));
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", requireAuth, (req, res, next) => {
  try {
    posts.deletePost(req.userId, Number(req.params.id));
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

router.get("/user/:userId", optionalAuth, (req, res, next) => {
  try {
    res.json(posts.listByUser(Number(req.params.userId), req.userId));
  } catch (err) {
    next(err);
  }
});

module.exports = router;
