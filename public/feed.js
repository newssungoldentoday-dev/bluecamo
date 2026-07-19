// core/feed.js — assembles the ranked home feed
const Post = require("../db/models/Post");
const { hydrate } = require("./posts");
const { rank } = require("../ml/rank");

function getFeed(viewerId, { limit = 30 } = {}) {
  const posts = Post.recent(300).map((p) => hydrate(p, viewerId));
  const ranked = rank(posts, { viewerId });
  return ranked.slice(0, limit);
}

module.exports = { getFeed };
