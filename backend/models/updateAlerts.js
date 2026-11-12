
const db = require("../config/database");

// Check existing columns before adding new ones
const columns = db.prepare("PRAGMA table_info(machine_alerts)").all();
const columnNames = columns.map(column => column.name);

// Add alert status
if (!columnNames.includes("status")) {
    db.exec(`
        ALTER TABLE machine_alerts
        ADD COLUMN status TEXT NOT NULL DEFAULT 'OPEN'
    `);
}

// Add acknowledgement timestamp
if (!columnNames.includes("acknowledged_at")) {
    db.exec(`
        ALTER TABLE machine_alerts
        ADD COLUMN acknowledged_at DATETIME
    `);
}

// Add resolution timestamp
if (!columnNames.includes("resolved_at")) {
    db.exec(`
        ALTER TABLE machine_alerts
        ADD COLUMN resolved_at DATETIME
    `);
}

console.log("AURA alert management database migration completed!");

db.close();
