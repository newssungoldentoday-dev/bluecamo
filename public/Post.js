// db/models/Post.js
const db = require("../connection");

const Post = {
  create({ userId, content, mediaUrl }) {
    return db.insert("posts", { userId, content, mediaUrl: mediaUrl || null, likeCount: 0 });
  },
  findById(id) {
    return db.find("posts", id);
  },
  allByUser(userId) {
    return db.all("posts", (p) => p.userId === Number(userId));
  },
  recent(limit = 50) {
    return db.all("posts").sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, limit);
  },
  incrementLikes(id, delta) {
    const post = db.find("posts", id);
    if (!post) return null;
    return db.update("posts", id, { likeCount: (post.likeCount || 0) + delta });
  },
  remove(id) {
    return db.remove("posts", id);
  },
};

module.exports = Post;
