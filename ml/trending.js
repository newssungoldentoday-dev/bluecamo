// ml/trending.js — velocity-based trending score
// Rewards posts gaining likes quickly relative to their age, not just total volume.

function trendingScore(post) {
  const ageHrs = Math.max((Date.now() - new Date(post.created_at).getTime()) / 3600000, 0.1);
  const likes = post.likeCount || 0;
  return likes / Math.pow(ageHrs + 2, 1.5);
}

function topTrending(posts, limit = 10) {
  return [...posts].sort((a, b) => trendingScore(b) - trendingScore(a)).slice(0, limit);
}

module.exports = { trendingScore, topTrending };
