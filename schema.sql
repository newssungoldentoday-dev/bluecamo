-- Bluecamo SQL Schema (Postgres / SQLite compatible)
-- Run this in Supabase SQL editor or local sqlite

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  content_md TEXT NOT NULL, -- Markdown supported!
  image_url TEXT,
  likes INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS likes (
  user_id TEXT REFERENCES users(id),
  post_id TEXT REFERENCES posts(id),
  PRIMARY KEY (user_id, post_id)
);

CREATE TABLE IF NOT EXISTS follows (
  follower_id TEXT REFERENCES users(id),
  following_id TEXT REFERENCES users(id),
  PRIMARY KEY (follower_id, following_id)
);

-- Indexes for feed speed
CREATE INDEX IF NOT EXISTS idx_posts_created ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_user ON posts(user_id);

-- Sample data
INSERT OR IGNORE INTO users (id, username, display_name, bio) VALUES 
('u1', 'rogge', 'Rogge', 'Founder @ Bluecamo - Baguio based'),
('u2', 'blue', 'Blue', 'First tester');

INSERT OR IGNORE INTO posts (id, user_id, content_md, likes) VALUES
('p1', 'u1', '# Welcome to Bluecamo \n\nThis is a **markdown** post. You can write:\n\n- **bold** - *italic* - `code` - lists and \n> quotes\n\nStay calm. Stay camo.', 12),
('p2', 'u2', 'Just dropped my first fit pic in Baguio fog. \n\n`#bluecamo #baguio`', 5);
