// routes/users.routes.js
const express = require("express");
const router = express.Router();
const users = require("../core/users");
const { requireAuth } = require("../middleware/authMiddleware");

router.get("/:id", (req, res, next) => {
  try {
    res.json(users.getProfile(Number(req.params.id)));
  } catch (err) {
    next(err);
  }
});

router.patch("/me", requireAuth, (req, res, next) => {
  try {
    res.json(users.updateProfile(req.userId, req.body));
  } catch (err) {
    next(err);
  }
});

module.exports = router;
