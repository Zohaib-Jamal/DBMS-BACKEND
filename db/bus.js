const { sql } = require("./config.js");

const ReservationData = async (data) => {
    try {
        const { userId } = data;
        const snap = await sql.query(
            `SELECT SeatNumber, DepartureLocation, ArrivalLocation,StartTime, Fare From BusSeat BS
            JOIN BusJourney BJ ON BS.JourneyID = BJ.JourneyID
            WHERE PassengerID = '${userId}' and Status = 'Pending'`
        )
        if (!snap.recordset[0])
            throw new Error("No record found!");
        return snap.recordset;
    }
    catch (err) {
        throw Error(err.message);
    }
}

const ReserveSeat = async (data) => {
    try {
        console.log(data)
        const { journeyID, seatNumber, userId } = data;
        const snap = await sql.query(
            `INSERT INTO BusSeat (JourneyID,SeatNumber,PassengerID) VALUES (${journeyID},${seatNumber},'${userId}')`
        );
        console.log(snap);
    } catch (err) {

        if (err.number === 547)
            throw new Error("Journey does not Exists!");
        else if (err.number === 2627)
            throw new Error("Seat Already Booked!");
        throw new Error("An Error Occured!");
    }
};

const CancelSeat = async (data) => {
    try {
        const { seatID } = data;
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
    try {
        const { journeyID } = data;
        console.log("id", journeyID)
        const snap = await sql.query(
            `EXEC getAvailableSeats @journey_id = ${journeyID}`
        )
        if (!snap.recordset[0])
            throw new Error("No record found!");
        if (snap.recordset[0].seat === 'Journey Does Not Exists!')
            throw new Error('Journey Does Not Exists!');
        return snap.recordset;
    }
    catch (err) {
        throw new Error(err.message);
    }
}

module.exports = {
    ReservationData,
    ReserveSeat,
    CancelSeat,
    AvailableSeats
}
