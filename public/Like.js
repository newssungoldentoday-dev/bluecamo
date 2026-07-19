// db/models/Like.js
const db = require("../connection");

const Like = {
  add({ postId, userId }) {
    const existing = db.findOne("likes", (l) => l.postId === postId && l.userId === userId);
    if (existing) return existing;
    return db.insert("likes", { postId, userId });
  },
  remove({ postId, userId }) {
    const existing = db.findOne("likes", (l) => l.postId === postId && l.userId === userId);
    if (!existing) return false;
    return db.remove("likes", existing.id);
  },
  has({ postId, userId }) {
    return !!db.findOne("likes", (l) => l.postId === postId && l.userId === userId);
  },
  countForPost(postId) {
    return db.all("likes", (l) => l.postId === Number(postId)).length;
  },
};

module.exports = Like;
