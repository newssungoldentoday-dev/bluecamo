// db/models/Notification.js
const db = require("../connection");

const Notification = {
  create({ userId, type, payload }) {
    return db.insert("notifications", { userId, type, payload, read: false });
  },
  forUser(userId, { unreadOnly = false } = {}) {
    return db
      .all("notifications", (n) => n.userId === Number(userId) && (!unreadOnly || !n.read))
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },
  markRead(id) {
    return db.update("notifications", id, { read: true });
  },
};

module.exports = Notification;
