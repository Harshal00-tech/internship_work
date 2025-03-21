const mysql = require("mysql2");

const pool = mysql.createPool({
  user: "root",
  host: "localhost",
  database: "node-complete",
  password: "ChangeMe007",
});

module.exports = pool.promise();
