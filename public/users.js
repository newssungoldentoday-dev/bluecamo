// core/users.js — profile read/update logic
const User = require("../db/models/User");
const db = require("../db/connection");

function getProfile(id) {
  const user = User.findById(id);
  if (!user) throw new Error("user not found");
  return User.toPublic(user);
}

function updateProfile(userId, { bio, avatar }) {
  const patch = {};
  if (typeof bio === "string") patch.bio = bio.slice(0, 280);
  if (typeof avatar === "string") patch.avatar = avatar;
  const updated = db.update("users", userId, patch);
  if (!updated) throw new Error("user not found");
  return User.toPublic(updated);
}

module.exports = { getProfile, updateProfile };
