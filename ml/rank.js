// ml/rank.js — lightweight feed ranking (no ML deps, pure heuristics)
// Score = recency decay + engagement weight + trending boost.
const { trendingScore } = require("./trending");

function ageHours(post) {
  return (Date.now() - new Date(post.created_at).getTime()) / 3600000;
}

function recencyDecay(post) {
  // Half-life of ~12 hours
  return Math.pow(0.5, ageHours(post) / 12);
}

function score(post) {
  const engagement = (post.likeCount || 0) + (post.commentCount || 0) * 1.5;
  return recencyDecay(post) * (1 + engagement) + trendingScore(post) * 0.3;
}

function rank(posts) {
  return [...posts].sort((a, b) => score(b) - score(a));
}

module.exports = { rank, score };
