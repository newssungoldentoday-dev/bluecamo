// db/models/User.js
const db = require("../connection");
const crypto = require("crypto");

function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
}

const User = {
  create({ username, email, password }) {
    const salt = crypto.randomBytes(16).toString("hex");
    const passwordHash = hashPassword(password, salt);
    return db.insert("users", {
      username,
      email,
      salt,
      passwordHash,
      bio: "",
      avatar: "",
    });
  },
  verifyPassword(user, password) {
    return hashPassword(password, user.salt) === user.passwordHash;
  },
  findByUsername(username) {
    return db.findOne("users", (u) => u.username === username);
  },
  findByEmail(email) {
    return db.findOne("users", (u) => u.email === email);
  },
  findById(id) {
    return db.find("users", id);
  },
  toPublic(user) {
    if (!user) return null;
    const { passwordHash, salt, ...pub } = user;
    return pub;
  },
};

module.exports = User;
