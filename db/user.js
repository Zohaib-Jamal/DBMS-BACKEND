const { sql } = require("./config.js");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

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

// User related functions
const createUser = async (data) => {
  try {
    console.log(data)
    const { firstName, lastName, email, dob, password, phoneNumber } = data;
    const userId = uuidv4();
    const formattedDob = new Date(dob).toISOString().split("T")[0];
    const hash = bcrypt.hashSync(password, 10);
    const snap = await sql.query(
      `INSERT INTO Users (UserID,firstname,lastname, email, dob, password, PhoneNumber) VALUES ('${userId}','${firstName}','${lastName}', '${email}', '${formattedDob}', '${hash}','${phoneNumber}')`
    );
    return userId
  } catch (err) {
    if (err.number === 2627) {
      throw new Error("User already exists.");
    }
    throw new Error(err);
  }
};

const ChangeUsername = async (data) => {
  try {
    const { firstName, lastName, userId } = data;

    const snap = await sql.query(
      `UPDATE USERS SET FIRSTNAME = ${firstName} , LASTNAME = ${lastName} WHERE USERID = ${userId}`
    );
  } catch (Err) {
    console.log("Error: ", Err);
    throw new Error(Err);
  }
};

const ChangeUserPhoneNo = async (data) => {
  try {
    const { phoneNumber, userId } = data;

    const snap = await sql.query(
      `UPDATE USERS SET PHONENUMBER = ${phoneNumber} WHERE USERID = ${userId}`
    );
  } catch (Err) {
    console.log("Error: ", Err);
    throw new Error(Err);
  }
};

const GetUserRides = async (data) => {
  try {
    const { userId } = data;
    const snap = await sql.query(
      `SELECT DepartureLocation, ArrivalLocation, Fare, StartTime, RideDate, Rating
      FROM Ride where PassengerID = ${userId}`
    );
    return snap;
  } catch (Err) {
    console.log("Error: ", Err);
    throw new Error(Err);
  }
};

const GetUserBusses = async (data) => {
  try {
    const { userId } = data;
    const snap = await sql.query(
      `SELECT DepartureLocation, ArrivalLocation, Fare, StartTime, RideDate, SeatNumber
      FROM Ride R JOIN BusSeat BS R.JourneyID = BS.JourneyID where PassengerID = ${userId}`
    );
    return snap;
  } catch (Err) {
    console.log("Error: ", Err);
    throw new Error(Err);
  }
};

const ChangeUserPassword = async (data) => {
  try {
    const { password, userID } = data;
    const hash = bcrypt.hashSync(password, 10);
    const snap = await sql.query(
      `UPDATE DRIVERS SET Pass = ${hash} WHERE DRIVERID = ${userID}`
    );
  } catch (Err) {
    console.log("Error: ", Err);
    throw new Error(Err);
  }
};

module.exports = {
  createUser,
  loginUser,
  ChangeUserPhoneNo,
  ChangeUsername,
  GetUserRides,
  GetUserBusses,
  ChangeUserPassword
}