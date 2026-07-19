// db/models/Message.js
const db = require("../connection");

const Message = {
  send({ fromId, toId, body }) {
    return db.insert("messages", { fromId, toId, body, read: false });
  },
  thread(userAId, userBId) {
    return db
      .all("messages", (m) =>
        (m.fromId === userAId && m.toId === userBId) || (m.fromId === userBId && m.toId === userAId)
      )
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  },
  markRead(id) {
    return db.update("messages", id, { read: true });
  },
  unreadCount(userId) {
    return db.all("messages", (m) => m.toId === Number(userId) && !m.read).length;
  },
};

module.exports = Message;
