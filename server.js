import express from 'express';
import Database from 'better-sqlite3';
import { marked } from 'marked';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const db = new Database('bluecamo.db');

app.get('/api/feed', (req, res) => {
  const posts = db.prepare(`
    SELECT posts.*, users.username FROM posts
    JOIN users ON posts.user_id = users.id
    ORDER BY created_at DESC LIMIT 50
  `).all();
  res.json(posts.map(p => ({...p, content_html: marked.parse(p.content_md)})));
});

app.post('/api/posts', (req, res) => {
  const { content_md } = req.body;
  const id = 'p_' + Date.now();
  db.prepare('INSERT INTO posts (id, user_id, content_md) VALUES (?,?,?)')
   .run(id, 'u1', content_md);
  res.json({ id, ok: true });
});

app.listen(3000, () => console.log('Bluecamo running'));
