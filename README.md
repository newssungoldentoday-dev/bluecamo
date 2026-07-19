# Bluecamo

**Blue Camo Social Media** — a lightweight, dependency-light social platform.
Feed, posts, comments, likes, DMs, and notifications, backed by a simple
ML-assisted ranking layer. No native builds required, so it runs on Termux,
macOS, and Linux out of the box.

[![License: MIT](https://img.shields.io/badge/license-MIT-4fd1ff.svg)](LICENSE)

## Features

- **Feed** — recency-decay + engagement + trending-velocity ranking (`ml/rank.js`)
- **Posts, Comments, Likes** — full CRUD with author hydration
- **Direct Messages** — threaded 1:1 messaging
- **Notifications** — likes, comments, and messages surface as notifications
- **Related Posts** — bag-of-words cosine similarity, no external ML libs
- **Zero native dependencies** — the datastore is a JSON-file store, so there's
  no compiler toolchain needed to get running (see [Architecture Notes](#architecture-notes))

## Project Structure

```
bluecamo/
├── core/            business logic (auth, posts, comments, likes, feed, ...)
├── db/
│   ├── connection.js  JSON-file datastore
│   └── models/        User, Post, Comment, Like, Message, Notification
├── ml/              rank.js, trending.js, embeddings.js
├── middleware/      auth, error handling, rate limiting
├── routes/          Express routers, one per resource
├── public/          static frontend (login, register, feed, profile)
├── scripts/         setup.sh, seed.js
├── schema.sql       reference relational schema
├── server.js        Express entrypoint
├── Dockerfile
└── docker-compose.yml
```

## Getting Started

### Requirements

- Node.js 18+
- No database server, no native build tools

### Setup

```sh
git clone https://github.com/newssungoldentoday-dev/bluecamo.git
cd bluecamo
sh scripts/setup.sh
```

This installs dependencies, creates the `data/` directory, generates a
`.env` with a session secret, and seeds a few sample users and posts.

### Run

```sh
node server.js
```

Then open `public/login.html` (or wherever your server serves static files
from) in a browser.

### Docker

```sh
docker compose up --build
```

## API Overview

| Method | Route                        | Description              |
|--------|-------------------------------|---------------------------|
| POST   | `/api/auth/signup`            | Create an account         |
| POST   | `/api/auth/login`             | Log in, get a token       |
| POST   | `/api/auth/logout`            | Revoke current token      |
| GET    | `/api/feed`                   | Ranked home feed          |
| POST   | `/api/posts`                  | Create a post              |
| GET    | `/api/posts/:id`               | Get a single post          |
| DELETE | `/api/posts/:id`               | Delete your own post       |
| POST   | `/api/likes/:postId`           | Toggle a like               |
| POST   | `/api/comments/:postId`        | Comment on a post           |
| GET    | `/api/comments/:postId`        | List comments on a post     |
| GET    | `/api/users/:id`                | Public profile              |
| PATCH  | `/api/users/me`                 | Update your own profile     |
| POST   | `/api/messages/:toId`           | Send a direct message       |
| GET    | `/api/messages/:withUserId`     | Get a DM thread             |
| GET    | `/api/notifications`            | List your notifications     |

All authenticated routes expect `Authorization: Bearer <token>`.

## Architecture Notes

- **Datastore**: `db/connection.js` is a zero-dependency JSON-file store. It
  mimics basic table operations (insert, find, update, remove) without any
  native SQLite bindings, which are notoriously hard to compile on Termux.
  `schema.sql` documents the intended relational shape if you migrate to a
  real database later.
- **Sessions**: Auth tokens are held in-memory, which is fine for a single
  Node process. For multi-instance deployments, swap in a shared session
  store.
- **Ranking**: `ml/rank.js` combines recency decay, engagement weight, and a
  trending-velocity boost — all pure JS heuristics, no external ML runtime.

## Contributing

Please read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before opening issues or
pull requests.

## License

MIT — see [LICENSE](LICENSE).

