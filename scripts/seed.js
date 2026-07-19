// scripts/seed.js — populates sample users/posts for local development
const { signup } = require("../core/auth");
const { createPost } = require("../core/posts");
const User = require("../db/models/User");

const sampleUsers = [
  { username: "camo_alpha", email: "alpha@bluecamo.dev", password: "password123" },
  { username: "night_owl", email: "owl@bluecamo.dev", password: "password123" },
  { username: "signal", email: "signal@bluecamo.dev", password: "password123" },
];

const samplePosts = [
  "First one in. Testing the feed.",
  "Blue camo, green signal. All systems nominal.",
  "Anyone else building on Termux? Curious about your setup.",
];

function seed() {
  const created = sampleUsers.map((u) => {
    if (User.findByUsername(u.username)) {
      console.log(`user ${u.username} already exists, skipping`);
      return null;
    }
    return signup(u).user;
  }).filter(Boolean);

  created.forEach((user, i) => {
    createPost(user.id, { content: samplePosts[i % samplePosts.length] });
  });

  console.log(`Seeded ${created.length} users and ${created.length} posts.`);
}

seed();
                   
