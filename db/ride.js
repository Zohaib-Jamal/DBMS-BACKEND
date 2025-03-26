const { sql } = require("./config.js");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

const createRide = async (userId, driverId, departure, arrival, km) => {
  try {
    const rideId = uuidv4()
    await sql.query(
      `INSERT INTO RIDE (RIDEID, RideStatus,DepartureLocation, ArrivalLocation,DriverId, fare, startTime,RideDate, PassengerId, Rating) 
      VALUES(${rideId}, 'Ongoing',${departure},${arrival},${driverId},${km * 15},CAST(GETDATE() AS TIME),CAST(GETDATE() AS DATE),${userId},NULL)`
    );

  } catch (err) {
    throw Error(err);
  }
};

const cancelRide = async (rideId) => {
  try {

    await sql.query(
      `UPDATE RIDE SET RideStatus = 'CANCELED' WHERE RIDEID=${rideId}`
    );

  } catch (err) {
    throw Error(err);
  }
};

const completeRide = async (rideId) => {
  try {

    await sql.query(
      `UPDATE RIDE SET RideStatus = 'Completed' WHERE RIDEID=${rideId}`
    );

  } catch (err) {
    throw Error(err);
  }
};

const getRideData = async (rideId) => {
  try {

    const snap = await sql.query(
      `SELECT * FROM RIDE WHERE RIDERID = ${rideId}`
    );
    const data = snap.recordset[0]
    if (!data) throw new Error("No ride found!")
    return data
  } catch (err) {
    throw Error(err);
  }
};

const SetRating = async (rideId, rating) => {
  try {

    await sql.query(
      `UPDATE RIDE SET rating = ${rating} WHERE RIDEID=${rideId}`
    );

  } catch (err) {
    throw Error(err);
  }
};


module.exports = {
  createRide,
  cancelRide,
  completeRide,
  getRideData,
  SetRating

}