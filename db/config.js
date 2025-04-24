const sql = require("mssql");

const sqlConfig = {
  user: "express_user",
  password: "Expresspass1",
  database: "DB_EXPRESS",
  server: "92.113.25.36",
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    trustServerCertificate: true,
  },
};



const connectDB = async () => {
  try {
    await sql.connect(sqlConfig);

    console.log("SQL Connected...");
  } catch (err) {
    console.log("SQL Error...", err);
  }
};


module.exports = {
  sql,
  connectDB
};
