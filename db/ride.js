const { sql } = require("./config.js");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

const createRide = async (userId, driverId, departure, arrival, fare) => {
  try {
    const rideId = uuidv4()
    await sql.query(
      `INSERT INTO RIDE (RIDEID, RideStatus,DepartureLocation, ArrivalLocation,DriverId, fare, startTime,RideDate, PassengerId, userRating, driverRating) 
      VALUES('${rideId}', 'Ongoing','${departure}','${arrival}','${driverId}',${fare},CAST(GETDATE() AS TIME),CAST(GETDATE() AS DATE),'${userId}',NULL, NULL)`
    );
    return rideId
  } catch (err) {
    if (err.number === 2627) {
      throw new Error("Ride already exists.");
    }

    throw Error(err.message);
  }
};

const cancelRide = async (rideId) => {
  try {

    await sql.query(
      `UPDATE RIDE SET RideStatus = 'Cancelled' WHERE RIDEID='${rideId}'`
    );

  } catch (err) {
    throw Error(err.message);
  }
};

const completeRide = async (rideId) => {
  try {

    await sql.query(
      `UPDATE RIDE SET RideStatus = 'Completed' WHERE RIDEID='${rideId}'`
    );

  } catch (err) {
    throw Error(err.message);
  }
};

const getRideData = async (rideId) => {
  try {

    const snap = await sql.query(
      `SELECT * FROM RIDE WHERE RIDEID = '${rideId}'`
    );
    const data = snap.recordset[0]
    if (!data) throw new Error("No ride found!")
    return data
  } catch (err) {
    throw Error(err.message);
  }
};

const setUserRating = async (data) => {
  try {
    const { rideID, rating } = data;
    await sql.query(
      `UPDATE RIDE SET userrating = ${rating} WHERE RIDEID='${rideID}'`
    );

  } catch (err) {
    if (err.number === 2627) {
      throw new Error("Out of Range");
    }
    throw new Error(err.message);
  }
};

const setDriverRating = async (data) => {
  try {
    const { rideID, rating } = data;
    await sql.query(
      `UPDATE RIDE SET driverrating = ${rating} WHERE RIDEID='${rideID}'`
    );

  } catch (err) {
    if (err.number === 2627) {
      throw new Error("Out of Range");
    }
    throw new Error(err.message);
  }
};

const addComment = async (data) => {
  try {

    const { rideID, message } = data;
    await sql.query(
      `INSERT INTO Comments (rideID, message, createdAt) VALUES ('${rideID}','${message}', GETDATE())`
    );

  } catch (err) {
    if (err.number === 2627) {
      throw new Error("Comment already exists.");
    }
    throw new Error(err.message);
  }
};


module.exports = {
  createRide,
  cancelRide,
  completeRide,
  getRideData,
  addComment,
  setUserRating,
  setDriverRating
}