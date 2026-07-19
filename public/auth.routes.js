// routes/auth.routes.js
const express = require("express");
const router = express.Router();
const auth = require("../core/auth");

router.post("/signup", (req, res, next) => {
  try {
    res.json(auth.signup(req.body));
  } catch (err) {
    next(err);
  }
});

router.post("/login", (req, res, next) => {
  try {
    res.json(auth.login(req.body));
  } catch (err) {
    next(err);
  }
});

router.post("/logout", (req, res) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : req.cookies?.bc_token;
  if (token) auth.revokeToken(token);
  res.json({ ok: true });
});

module.exports = router;
