// core/likes.js
const Like = require("../db/models/Like");
const Post = require("../db/models/Post");
const Notification = require("../db/models/Notification");

function toggleLike(userId, postId) {
  const post = Post.findById(postId);
  if (!post) throw new Error("post not found");

  if (Like.has({ postId, userId })) {
    Like.remove({ postId, userId });
    Post.incrementLikes(postId, -1);
    return { liked: false };
  }

  Like.add({ postId, userId });
  Post.incrementLikes(postId, 1);
  if (post.userId !== userId) {
    Notification.create({ userId: post.userId, type: "like", payload: { postId, fromUserId: userId } });
  }
  return { liked: true };
}

module.exports = { toggleLike };
