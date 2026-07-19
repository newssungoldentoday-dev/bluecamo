#!/usr/bin/env sh
# scripts/setup.sh — one-shot dev environment setup
# POSIX sh, works in Termux, macOS, and Linux without extra deps.

set -e

echo "== Bluecamo setup =="

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js not found. Install it first (Termux: pkg install nodejs)."
  exit 1
fi

echo "Node version: $(node -v)"

if [ ! -f package.json ]; then
  echo "No package.json found — run this from the project root."
  exit 1
fi

echo "Installing dependencies..."
npm install --no-audit --no-fund

mkdir -p data
echo "Data directory ready at ./data"

if [ ! -f .env ]; then
  echo "BLUECAMO_SECRET=$(node -e "console.log(require('crypto').randomBytes(24).toString('hex'))")" > .env
  echo "Created .env with a generated secret."
fi

echo "Seeding sample data..."
node scripts/seed.js || echo "(seed skipped/failed, continuing)"

echo "== Setup complete. Run: node server.js =="
