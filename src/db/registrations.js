const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");

const dataDirectory = path.join(__dirname, "..", "..", "data");
fs.mkdirSync(dataDirectory, { recursive: true });
const database = new Database(path.join(dataDirectory, "cips77.sqlite"));
database.pragma("journal_mode = WAL");
database.exec(`CREATE TABLE IF NOT EXISTS registrations (
  id TEXT PRIMARY KEY,
  payload TEXT NOT NULL,
  created_at TEXT NOT NULL
)`);

function readBookings() {
  return database
    .prepare("SELECT payload FROM registrations ORDER BY created_at DESC")
    .all()
    .map((row) => JSON.parse(row.payload));
}

function writeBookings(items) {
  const upsert = database.prepare(`
    INSERT INTO registrations (id, payload, created_at)
    VALUES (?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      payload = excluded.payload, created_at = excluded.created_at
  `);
  const keepIds = new Set(items.map((item) => item.id));
  const transaction = database.transaction(() => {
    for (const item of items) {
      upsert.run(item.id, JSON.stringify(item), item.createdAt || new Date().toISOString());
    }
    const storedIds = database.prepare("SELECT id FROM registrations").all();
    for (const { id } of storedIds) {
      if (!keepIds.has(id)) database.prepare("DELETE FROM registrations WHERE id = ?").run(id);
    }
  });
  transaction();
}

module.exports = { readBookings, writeBookings };
