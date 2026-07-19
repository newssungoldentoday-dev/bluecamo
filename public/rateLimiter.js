// middleware/rateLimiter.js — simple in-memory sliding-window limiter
// No Redis dependency; fine for single-process deploys.

function rateLimiter({ windowMs = 60000, max = 60 } = {}) {
  const hits = new Map(); // key -> [timestamps]

  return function (req, res, next) {
    const key = req.userId || req.ip;
    const now = Date.now();
    const timestamps = (hits.get(key) || []).filter((t) => now - t < windowMs);

    if (timestamps.length >= max) {
      return res.status(429).json({ error: "too many requests, slow down" });
    }

    timestamps.push(now);
    hits.set(key, timestamps);
    next();
  };
}

module.exports = rateLimiter;
