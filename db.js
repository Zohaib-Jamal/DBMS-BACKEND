const { query } = require("express");
const sql = require("mssql");
const { v4: uuidv4 } = require("uuid");
const { bcrypt } = require("bcrypt");

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
    const { firstName, lastName, email, dob, pass } = data;
    const userId = uuidv4();
    const formattedDob = new Date(dob).toISOString().split("T")[0];
    const hash = bcrypt.hashSync(pass, 10);
    const snap = await sql.query(
      `INSERT INTO Users (UserID,firstname,lastname, email, dob, password) VALUES ('${userId}','${firstName}','${lastName}', '${email}', '${formattedDob}', '${hash}')`
    );
    console.log(snap);
  } catch (err) {
    console.log("Error: ", err);
    throw new Error(err);
  }
};

const loginUser = async (data) => {
  try {
    const { email, password } = data;
    const snap = await sql.query(
      `SELECT * FROM USERS WHERE email = '${email}'`
    );

    if (!snap.recordset[0]) throw new Error("No record found!");

    const userData = snap.recordset[0];

    const correct = await bcrypt.compareSync(password, userData.password);
    if (!correct) throw new Error("Wrong Password");
    return userData;
  } catch (err) {
    throw Error(err);
  }
};

const loginDriver = async (data) => {
  try {
    const { email, password } = data;
    const snap = await sql.query(
      `SELECT * FROM DRIVERS WHERE email = '${email}'`
    );
    console.log(snap);

    if (!snap.recordset[0]) throw new Error("No record found!");
    const driverData = snap.recordset[0];
    const correct = await bcrypt.compareSync(password, userData.password);
    if (!correct) throw new Error("Wrong Password");
    
    return driverData;
  } catch (err) {
    throw Error(err);
  }
};

const createDriver = async (data) => {
  try {
    const { firstName, lastName, email, dob, pass, cnic } = data;
    const driverId = uuidv4();
    const formattedDob = new Date(dob).toISOString().split("T")[0];
    const hash = bcrypt.hashSync(pass, 10);
    const snap = await sql.query(
      `INSERT INTO Drivers (driverID,firstname,lastname, email, dob, password, cnic) VALUES ('${driverId}','${firstName}','${lastName}', '${email}', '${formattedDob}', '${hash}', '${cnic}')`
    );
    return { firstName, lastName, driverId };
  } catch (Err) {
    throw new Error("Error creating driver")
  }
};

const createVehicle = async (data) => {
  try {
    const { DriverID, Type, PlateNo, Model } = data;
    const VehicleID = uuidv4();
    const snap = await sql.query(
      `INSERT INTO VEHICLE (DriverID , Type, PlateNo, Model) VALUES ('${DriverID}', '${Type}', '${PlateNo}', '${Model}')`
    );
    
  } catch (Err) {
    throw new Error("Error creating vehicle")
  }
};

module.exports = {
  connectDB,
  createUser,
  checkUser,
  createVehicle,
  createDriver,
  loginDriver,
  loginUser,
};
