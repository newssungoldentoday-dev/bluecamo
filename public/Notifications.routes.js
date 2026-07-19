// routes/notifications.routes.js
const express = require("express");
const router = express.Router();
const notifications = require("../core/notifications");
const { requireAuth } = require("../middleware/authMiddleware");

router.get("/", requireAuth, (req, res) => {
  const unreadOnly = req.query.unread === "true";
  res.json(notifications.listFor(req.userId, unreadOnly));
});

router.post("/:id/read", requireAuth, (req, res) => {
  res.json(notifications.markRead(Number(req.params.id)));
});

module.exports = router;
