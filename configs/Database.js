// db.js
const mysql = require("mysql");

const db = mysql.createPool({
  host: "localhost",
  user: "tenutefarinadbmanager",
  password: process.env.DB_PASSWORD,
  database: "tenutefarina",
});

module.exports = db;
