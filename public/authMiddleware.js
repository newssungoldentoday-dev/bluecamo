// middleware/authMiddleware.js
const { verifyToken } = require("../core/auth");

function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : req.cookies?.bc_token;
  const userId = token ? verifyToken(token) : null;

  if (!userId) {
    return res.status(401).json({ error: "authentication required" });
  }

  req.userId = userId;
  next();
}

function optionalAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : req.cookies?.bc_token;
  req.userId = token ? verifyToken(token) : null;
  next();
}

module.exports = { requireAuth, optionalAuth };
