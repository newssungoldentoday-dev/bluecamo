import express from 'express';
import Database from 'better-sqlite3';
import { marked } from 'marked';
import cors from 'cors';
import path from 'path';
import fs from 'fs';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const db = new Database('bluecamo.db');
const schema = fs.readFileSync('schema.sql', 'utf8');
db.exec(schema);

// API: Get feed (SQL + JS)
app.get('/api/feed', (req, res) => {
  const posts = db.prepare(`
    SELECT posts.*, users.username, users.display_name, users.avatar_url
    FROM posts JOIN users ON posts.user_id = users.id
    ORDER BY posts.created_at DESC LIMIT 50
  `).all();
  // Convert Markdown to HTML in JS
  const withHtml = posts.map(p => ({
    ...p,
    content_html: marked.parse(p.content_md)
  }));
  res.json(withHtml);
});

// API: Create post (Markdown in)
app.post('/api/posts', (req, res) => {
  const { user_id, content_md, image_url } = req.body;
  const id = 'p_' + Date.now();
  db.prepare('INSERT INTO posts (id, user_id, content_md, image_url) VALUES (?, ?, ?, ?)')
    .run(id, user_id || 'u1', content_md, image_url || null);
  res.json({ id, ok: true });
});

// API: Like
app.post('/api/like/:id', (req, res) => {
  db.prepare('UPDATE posts SET likes = likes + 1 WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Bluecamo running on http://localhost:${PORT}`));
