// db/connection.js — Bluecamo datastore
// Zero-dependency JSON-file store. No native modules, so it builds cleanly
// on Termux, macOS, and Linux without a compiler toolchain.
// Swap this for a real SQLite/Postgres driver later; schema.sql documents
// the intended relational shape.

const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");
const TABLES = ["users", "posts", "comments", "likes", "messages", "notifications"];

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

function tablePath(table) {
  return path.join(DATA_DIR, `${table}.json`);
}

function ensureTable(table) {
  const p = tablePath(table);
  if (!fs.existsSync(p)) fs.writeFileSync(p, "[]", "utf8");
}

TABLES.forEach(ensureTable);

function readTable(table) {
  ensureTable(table);
  const raw = fs.readFileSync(tablePath(table), "utf8");
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeTable(table, rows) {
  fs.writeFileSync(tablePath(table), JSON.stringify(rows, null, 2), "utf8");
}

function nextId(rows) {
  return rows.reduce((max, r) => Math.max(max, r.id || 0), 0) + 1;
}

const db = {
  insert(table, row) {
    const rows = readTable(table);
    const record = { id: nextId(rows), created_at: new Date().toISOString(), ...row };
    rows.push(record);
    writeTable(table, rows);
    return record;
  },
  all(table, filterFn) {
    const rows = readTable(table);
    return filterFn ? rows.filter(filterFn) : rows;
  },
  find(table, id) {
    return readTable(table).find((r) => r.id === Number(id)) || null;
  },
  findOne(table, filterFn) {
    return readTable(table).find(filterFn) || null;
  },
  update(table, id, patch) {
    const rows = readTable(table);
    const idx = rows.findIndex((r) => r.id === Number(id));
    if (idx === -1) return null;
    rows[idx] = { ...rows[idx], ...patch, updated_at: new Date().toISOString() };
    writeTable(table, rows);
    return rows[idx];
  },
  remove(table, id) {
    const rows = readTable(table);
    const next = rows.filter((r) => r.id !== Number(id));
    writeTable(table, next);
    return next.length !== rows.length;
  },
};

module.exports = db;
