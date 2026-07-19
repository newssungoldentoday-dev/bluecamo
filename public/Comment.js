// db/models/Comment.js
const db = require("../connection");

const Comment = {
  create({ postId, userId, content }) {
    return db.insert("comments", { postId, userId, content });
  },
  forPost(postId) {
    return db.all("comments", (c) => c.postId === Number(postId));
  },
  remove(id) {
    return db.remove("comments", id);
  },
};

module.exports = Comment;
