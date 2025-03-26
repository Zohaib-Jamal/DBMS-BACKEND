const { sql } = require("./config.js");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");


// Driver related functions
const createDriver = async (data) => {
  try {
    const { firstName, lastName, email, cnic, password, phoneNumber } = data;
    const driverId = uuidv4();
    const hash = bcrypt.hashSync(password, 10);
    const snap = await sql.query(
      `INSERT INTO Driver (DriverID, FirstName, LastName, Email, CNIC, Rating, Password, PhoneNumber ) 
      VALUES 
      ('${driverId}','${firstName}','${lastName}', '${email}', '${cnic}', NULL, '${password}','${phoneNumber}')`
    );
    return { firstName, lastName, driverId };
  } catch (err) {
    console.log(err)
    if (err.number === 2627) {
      throw new Error("Driver already exists.");
    }
    throw new Error(err);
  }
};

const getDriver = async (data) => {
  try {
    const { driverID } = data;
    const snap = await sql.query(
      `SELECT * FROM Driver WHERE DriverID = '${driverID}'`
    );
    const driverdata = snap.recordset[0];
    if (!driverdata) return false;
    else return driverdata;
  } catch (Err) {
    throw new Error("Error: Could not Find Driver");
  }
};

const checkDriver = async (data) => {
  try {
    const { driverID } = data;
    const snap = await sql.query(
      `SELECT 1 FROM Driver WHERE DriverID = '${driverID}'`
    );
    return snap.recordset.length !== 0; // Returns true if found, else false
  } catch (Err) {
    throw new Error("Error: Could not Find Driver");
  }
};

const loginDriver = async (data) => {
  try {
    const { phoneNumber, password } = data;
    const snap = await sql.query(
      `SELECT * FROM DRIVER WHERE PhoneNumber = '${phoneNumber}'`
    );
    console.log(snap);
    if (!snap.recordset[0]) throw new Error("No record found!");
    const driverData = snap.recordset[0];
    const correct = await bcrypt.compareSync(password, driverData.password);
    if (!correct) throw new Error("Wrong Password");

    return driverData;
  } catch (err) {
    throw Error(err);
  }
};

const ChangeDrivername = async (data) => {
  try {
    const { firstName, lastName, driverID } = data;

    const snap = await sql.query(
      `UPDATE USERS SET FIRSTNAME = ${firstName} , LASTNAME = ${lastName} WHERE DRIVERID = ${driverID}`
    );
  } catch (Err) {
    console.log("Error: ", Err);
    throw new Error(Err);
  }
};

const ChangeDriverPhoneNo = async (data) => {
  try {
    const { phoneNumber, driverID } = data;

    const snap = await sql.query(
      `UPDATE USERS SET PHONENUMBER = ${phoneNumber} WHERE DRIVERID = ${driverID}`
    );
  } catch (Err) {
    console.log("Error: ", Err);
    throw new Error(Err);
  }
};

const ChangeDriverPassword = async (data) => {
  try {
    const { password, driverID } = data;
    const hash = bcrypt.hashSync(password, 10);
    const snap = await sql.query(
      `UPDATE DRIVER SET Pass = ${hash} WHERE DRIVERID = ${driverID}`
    );
  } catch (Err) {
    console.log("Error: ", Err);
    throw new Error(Err);
  }
};

const GetDriverHistory = async (data) => {
  try {
    const { driverID } = data;
    const snap = await sql.query(
      `SELECT DepartureLocation, ArrivalLocation, Fare, StartTime, RideDate, Rating
      FROM Ride where DriverID = ${driverID}`
    );
    return snap;
  } catch (Err) {
    console.log("Error: ", Err);
    throw new Error(Err);
  }
};

module.exports = {
  createDriver,
  loginDriver,
  ChangeDrivername,
  ChangeDriverPhoneNo,
  ChangeDriverPassword,
  checkDriver,
  getDriver,
  GetDriverHistory
};
