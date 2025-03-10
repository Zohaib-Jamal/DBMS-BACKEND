const { query } = require("express");
const sql = require("mssql");
const { v4: uuidv4 } = require("uuid");

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

/*

const sqlConfig = {
  user: "sa",
  password: "40021191Zz",
  database: "DB_EXPRESS",
  server: "localhost",
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    trustServerCertificate: true,
  },
};
*/

const connectDB = async () => {
  try {
    await sql.connect(sqlConfig);

    console.log("SQL Connected...");
  } catch (err) {
    console.log("SQL Error...", err);
  }
};

const createUser = async (data) => {
  try {
    const { firstName,lastName, email, dob, pass } = data;
    const userId = uuidv4();
    const formattedDob = new Date(dob).toISOString().split("T")[0];
    const snap = await sql.query(
      `INSERT INTO Users (UserID,firstname,lastname, email, dob, password) VALUES ('${userId}','${firstName}','${lastName}', '${email}', '${formattedDob}', '${pass}')`
    );
    console.log(snap);
  } catch (err) {
    console.log("Error: ", err);
    throw new Error(err);
    
  }
};

const checkUser = async (data) => {
  try {
    const {userName, password} = data;
    const snap = await sql.query(
      `SELECT * FROM USERS WHERE email = '${userName}'`
    );
    console.log(snap);
    
    if(!snap.recordset[0]) throw new Error("No record found!")

    return snap.recordset
  } catch (err) {
    throw Error(err);

  }
};

module.exports = { connectDB, createUser, checkUser };
