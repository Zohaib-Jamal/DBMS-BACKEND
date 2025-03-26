const { sql } = require("./config.js");

const ReservationData = async (data) =>{
    try{
        const {userId} = data;
        const snap = await sql.query(
            `SELECT SeatNumber, DepartureLocation, ArrivalLocation,StartTime, Fare From BusSeat BS
            JOIN BusJourney BJ ON BS.JourneyID = BJ.JourneyID
            WHERE PassengerID = ${userId} and Status = 'Pending'`
        ) 
        if(!snap.recordset[0])
            throw new Error("No record found!");
        return snap;
    }
    catch(err) {
        throw Error(err);
    }
}

const ReserveSeat = async (data) => {
  try {
    const { journeyID, seatNumber, userId } = data;
    const snap = await sql.query(
      `INSERT INTO BusSeat (JourneyID,SeatNumber,PassengerID) VALUES (${journeyID},${seatNumber},${userId})`
    );
    console.log(snap);
  } catch (err) {
    console.log("Error: ", err);
    throw new Error(err);
  }
};

const CancelSeat = async (data) =>{
    try {
        const {seatID} = data;
        const snap = await sql.query(
            `DELETE FROM BusSeat where SeatID = ${seatID}`
        )
        console.log("Seat Unreserved Succesfully");
    }
    catch (err) {
        console.log("Error: ", err);
        throw new Error(err);
    }
}

const AvailableSeats = async (data) => {
    try{
        const {journeyID} = data;
        const snap = await sql.query(
            `SELECT num AS available_seat
            FROM ( VALUES (1), (2), (3), (4), (5), (6), (7), (8), (9), (10), (11), (12), (13), (14), (15), (16), (17), (18), (19), (20)) AS v(num)
            WHERE num NOT IN ( SELECT seatnumber FROM busSeat WHERE JourneyID = ${journeyID})`
        )
        if(!snap.recordset[0])
            throw new Error("No record found!");
        return snap;
    }
    catch(err) {
        throw Error(err);
    }
}

module.exports = {
    ReservationData,
    ReserveSeat,
    CancelSeat,
    AvailableSeats
}
