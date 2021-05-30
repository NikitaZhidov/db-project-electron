const sql = require("mssql");
const CONFIG_DB = require("./config");

async function getDB() {
  const db = await sql.connect(CONFIG_DB);
  return db;
}

module.exports = getDB;
