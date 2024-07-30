// db.js
const mysql = require("mysql");
require("dotenv").config();

/*const db = mysql.createPool({
  host: "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "tenutefarina",
});*/
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "tenutefarina",
});

module.exports = db;
