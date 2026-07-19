// core/posts.js — post creation, deletion, retrieval logic
const Post = require("../db/models/Post");
const Like = require("../db/models/Like");
const User = require("../db/models/User");

function createPost(userId, { content, mediaUrl }) {
  if (!content || !content.trim()) throw new Error("post content cannot be empty");
  if (content.length > 2000) throw new Error("post content too long (max 2000 chars)");
  return Post.create({ userId, content: content.trim(), mediaUrl });
}

function getPost(id) {
  const post = Post.findById(id);
  if (!post) throw new Error("post not found");
  return post;
}

function deletePost(userId, postId) {
  const post = getPost(postId);
  if (post.userId !== userId) throw new Error("not authorized to delete this post");
  return Post.remove(postId);
}

function hydrate(post, viewerId) {
  const author = User.toPublic(User.findById(post.userId));
  return {
    ...post,
    author,
    liked: viewerId ? Like.has({ postId: post.id, userId: viewerId }) : false,
    likeCount: Like.countForPost(post.id),
  };
}

function listByUser(userId, viewerId) {
  return Post.allByUser(userId).map((p) => hydrate(p, viewerId));
}

module.exports = { createPost, getPost, deletePost, hydrate, listByUser };
