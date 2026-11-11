
const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "../aura.db");

const db = new Database(dbPath);

// Enable foreign key relationships
db.pragma("foreign_keys = ON");

// Enable WAL mode
db.pragma("journal_mode = WAL");

console.log("AURA SQLite database connected successfully!");

module.exports = db;
