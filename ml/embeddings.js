// ml/embeddings.js — simple bag-of-words similarity for "related posts"
// No external ML libraries — pure JS term-frequency cosine similarity.
// Good enough for lightweight recommendations without native deps on Termux.

function tokenize(text) {
  return (text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter(Boolean);
}

function termFreq(text) {
  const freq = {};
  for (const tok of tokenize(text)) freq[tok] = (freq[tok] || 0) + 1;
  return freq;
}

function cosineSim(freqA, freqB) {
  const keys = new Set([...Object.keys(freqA), ...Object.keys(freqB)]);
  let dot = 0, magA = 0, magB = 0;
  for (const k of keys) {
    const a = freqA[k] || 0;
    const b = freqB[k] || 0;
    dot += a * b;
    magA += a * a;
    magB += b * b;
  }
  if (magA === 0 || magB === 0) return 0;
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

function findRelated(targetPost, candidatePosts, limit = 5) {
  const targetFreq = termFreq(targetPost.content);
  return candidatePosts
    .filter((p) => p.id !== targetPost.id)
    .map((p) => ({ post: p, similarity: cosineSim(targetFreq, termFreq(p.content)) }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);
}

module.exports = { tokenize, termFreq, cosineSim, findRelated };
