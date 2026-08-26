const mysql = require("mysql2");
require("dotenv").config();

const dbHost = process.env.DB_HOST || "localhost";
const dbUser = process.env.DB_USER || "root";
const dbPassword = process.env.DB_PASS || process.env.DB_PASSWORD || "manobeast2307";
const dbName = process.env.DB_NAME || "campus_research_db";
const dbPort = process.env.DB_PORT || 3306;

const db = mysql.createConnection({
  host: dbHost,
  user: dbUser,
  password: dbPassword,
  database: dbName,
  port: dbPort,
});

db.connect((err) => {
  if (err) {
    console.warn("MySQL DB Notice:", err.message);
  } else {
    console.log("Connected to campus_research_db database successfully");
  }
});

module.exports = db;
