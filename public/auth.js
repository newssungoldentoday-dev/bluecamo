// core/auth.js — signup/login/session token logic
const crypto = require("crypto");
const User = require("../db/models/User");

const SESSION_SECRET = process.env.BLUECAMO_SECRET || "bluecamo-dev-secret-change-me";
const sessions = new Map(); // token -> userId (in-memory; fine for single-process dev/small deploys)

function makeToken(userId) {
  const raw = `${userId}.${Date.now()}.${crypto.randomBytes(12).toString("hex")}`;
  const sig = crypto.createHmac("sha256", SESSION_SECRET).update(raw).digest("hex");
  const token = Buffer.from(`${raw}.${sig}`).toString("base64url");
  sessions.set(token, userId);
  return token;
}

function verifyToken(token) {
  if (!sessions.has(token)) return null;
  return sessions.get(token);
}

function revokeToken(token) {
  sessions.delete(token);
}

function signup({ username, email, password }) {
  if (!username || !email || !password) throw new Error("username, email, password required");
  if (User.findByUsername(username)) throw new Error("username already taken");
  if (User.findByEmail(email)) throw new Error("email already registered");
  if (password.length < 8) throw new Error("password must be at least 8 characters");
  const user = User.create({ username, email, password });
  const token = makeToken(user.id);
  return { user: User.toPublic(user), token };
}

function login({ username, password }) {
  const user = User.findByUsername(username);
  if (!user || !User.verifyPassword(user, password)) throw new Error("invalid credentials");
  const token = makeToken(user.id);
  return { user: User.toPublic(user), token };
}

module.exports = { signup, login, verifyToken, revokeToken, makeToken };
  
