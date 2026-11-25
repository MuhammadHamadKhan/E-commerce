const { Pool } = require("pg");
const { db } = require("./index"); // also loads .env

// One pool is shared by the whole app. pg reuses connections for us,
// so we do not open/close a connection for every query.
const pool = new Pool(db);

// A dead idle connection should be logged, not crash the process.
pool.on("error", (err) => {
  console.error("Unexpected error on idle PostgreSQL client:", err.message);
});

// Test the database connection on startup.
// Runs SELECT NOW() and prints a clear message (never logs password).
async function connectDB() {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log(
      `PostgreSQL connected to ${db.database} as ${db.user} at ${db.host}:${db.port}`
    );
    return result.rows[0];
  } catch (error) {
    console.error("PostgreSQL connection failed:", error.message);
    process.exit(1);
  }
}

// Usage (from src/): const pool = require("./config/db");
//        (from db/): const pool = require("../src/config/db");
module.exports = pool;
module.exports.connectDB = connectDB;
