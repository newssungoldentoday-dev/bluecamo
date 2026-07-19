// core/comments.js
const Comment = require("../db/models/Comment");
const Post = require("../db/models/Post");
const User = require("../db/models/User");

function addComment(userId, postId, content) {
  if (!content || !content.trim()) throw new Error("comment cannot be empty");
  if (!Post.findById(postId)) throw new Error("post not found");
  return Comment.create({ postId, userId, content: content.trim() });
}

function listForPost(postId) {
  return Comment.forPost(postId)
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    .map((c) => ({ ...c, author: User.toPublic(User.findById(c.userId)) }));
}

function removeComment(userId, commentId, comment) {
  if (comment.userId !== userId) throw new Error("not authorized to delete this comment");
  return Comment.remove(commentId);
}

module.exports = { addComment, listForPost, removeComment };
