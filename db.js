const sql = require("mssql");
require("dotenv").config();
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
};
*/
const config = {
  server: process.env.SERVER_IP,
  database: process.env.DATABASE_NAME,
  port: Number(process.env.PORT),
  authentication: {
    type: "default",
  },
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
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

const createUser = async (data) => {
  try {
    let snap = await sql.query(
      `SELECT USERNAME FROM USERS WHERE USERNAME = '${data.username}'`
    );

    if (snap.recordset.length > 0) {
      console.log(snap.recordset);
      throw new Error("User alreasy exists");
    }

    await sql.query(
      `INSERT INTO USERS VALUES('${data.username}',  '${data.password}')`
    );
    console.log("user inserted");
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = { sql, connectDB, createUser };
