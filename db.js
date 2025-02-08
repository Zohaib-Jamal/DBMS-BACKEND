const sql = require("mssql");
/*
const config = {
  server: "DESKTOP-D1OATJQ",
  database: "DB_EXPRESS",
  port: 1433, //TCP/IP
  options: {
    trustServerCertificate: true,
    enableArithAbort: true,
  },
  user: "express_user",
  password: "expresspass",
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};*/

const config = {
  server: "92.113.25.36",
  database: "DB_EXPRESS",
  port: 1433,
  authentication: {
    type: "default",
  },
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
  user: "express_user",
  password: "Expresspass1",
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

async function connectDB() {
  try {
    await sql.connect(config);
    console.log("Connected to SQL Server!");
  } catch (err) {
    console.error("Database connection failed:", err);
  }
}

module.exports = { sql, connectDB };
