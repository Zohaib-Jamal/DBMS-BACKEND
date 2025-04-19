const { sql } = require("./config.js");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");


// Driver related functions
const createDriver = async (data) => {
  try {
    const { firstName, lastName, email, cnic, password, phoneNumber, dob } = data;
    const driverId = uuidv4();
    const hash = bcrypt.hashSync(password, 10);
    await sql.query(
      `INSERT INTO Driver (DriverID, FirstName, LastName, Email, CNIC, Rating, Password, PhoneNumber, DOB ) 
      VALUES 
      ('${driverId}','${firstName}','${lastName}', '${email}', '${cnic}', NULL, '${hash}','${phoneNumber}', '${dob}')`
    );
    return { firstName, lastName, driverId };
  } catch (err) {
    console.log(err)
    if (err.number === 2627) {
      throw new Error("Driver already exists.");
    }
    throw new Error(err.message);
  }
};

const getDriver = async (data) => {
  try {
    const { driverID } = data;
    const snap = await sql.query(
      `SELECT DriverId, firstName, lastName, rating, phoneNumber, email, dob  FROM Driver WHERE DriverID = '${driverID}'`
    );
    const driverdata = snap.recordset[0];
    console.log(driverdata)
    if (!driverdata) throw new Error("Could not Find Driver");
    else return driverdata;
  } catch (err) {

    throw new Error(err.message);
  }
};

const checkDriver = async (data) => {
  try {
    const { driverID } = data;
    const snap = await sql.query(
      `SELECT 1 FROM Driver WHERE DriverID = '${driverID}'`
    );
    return snap.recordset.length !== 0;
  } catch (Err) {
    throw new Error("Error: Could not Find Driver");
  }
};

const loginDriverPhone = async (data) => {
  try {
    const { phoneNumber, password } = data;
    const snap = await sql.query(
      `SELECT * FROM DRIVER WHERE PhoneNumber = '${phoneNumber}'`
    );
    console.log(snap);
    if (!snap.recordset[0]) throw new Error("No record found!");
    const driverData = snap.recordset[0];
    const correct = await bcrypt.compareSync(password, driverData.Password);
    if (!correct) throw new Error("Wrong Password");

    return driverData;
  } catch (err) {
    throw Error(err);
  }
};

const loginDriverEmail = async (data) => {
  try {
    const { email, password } = data;
    const snap = await sql.query(
      `SELECT * FROM DRIVER WHERE email = '${email}'`
    );
    console.log(snap);
    if (!snap.recordset[0]) throw new Error("No record found!");
    const driverData = snap.recordset[0];
    const correct = await bcrypt.compareSync(password, driverData.Password);
    if (!correct) throw new Error("Wrong Password");

    return driverData;
  } catch (err) {
    throw Error(err.message);
  }
};

const ChangeDrivername = async (data) => {
  try {
    const { firstName, lastName, driverID } = data;

    const snap = await sql.query(
      `UPDATE DRIVER SET FIRSTNAME = '${firstName}' , LASTNAME = '${lastName}' WHERE DRIVERID = '${driverID}'`
    );
  } catch (Err) {
    console.log("Error: ", Err);
    throw new Error(Err.message);
  }
};

const ChangeDriverPhoneNo = async (data) => {
  try {
    const { phoneNumber, driverID } = data;

    const snap = await sql.query(
      `UPDATE DRIVER SET PHONENUMBER = '${phoneNumber}' WHERE DRIVERID = '${driverID}'`
    );
  } catch (Err) {
    console.log("Error: ", Err);
    throw new Error(Err.message);
  }
};

const ChangeDriverPassword = async (data) => {
  try {
    const { password, driverID } = data;
    const hash = bcrypt.hashSync(password, 10);
    const snap = await sql.query(
      `UPDATE DRIVER SET Password = '${hash}' WHERE DRIVERID = '${driverID}'`
    );
  } catch (Err) {
    console.log("Error: ", Err);
    throw new Error(Err.message);
  }
};

const GetDriverHistory = async (data) => {
  try {
    const { driverID } = data;
    
    const snap = await sql.query(
      `SELECT DepartureLocation, ArrivalLocation, Fare, StartTime, RideDate, DriverRating
      FROM Ride where DriverID = '${driverID}'`
    );
    
    if (!snap.recordset[0])
      throw new Error("No record found!");
    return snap.recordset;
  } catch (Err) {
   
    throw new Error(Err.message);
  }
};

const GetDriverRides = async (data) => {
  try {
    const { driverID } = data;
    const snap = await sql.query(
      `SELECT count(*) as Rides FROM Ride where DriverID = '${driverID}'`
    );
    if (!snap.recordset[0])
      throw new Error("No record found!");
    return snap.recordset;
  } catch (Err) {

    throw new Error(Err.message);
  }
};

module.exports = {
  createDriver,
  loginDriverEmail,
  loginDriverPhone,
  ChangeDrivername,
  ChangeDriverPhoneNo,
  ChangeDriverPassword,
  checkDriver,
  getDriver,
  GetDriverHistory,
  GetDriverRides
};
