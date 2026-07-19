// core/notifications.js
const Notification = require("../db/models/Notification");

function listFor(userId, unreadOnly = false) {
  return Notification.forUser(userId, { unreadOnly });
}

function markRead(id) {
  return Notification.markRead(id);
}

module.exports = { listFor, markRead };
