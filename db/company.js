const { sql } = require("./config.js");

const AllCompanies = async (data) => {
  try {
    const snap = await sql.query(`SELECT Name FROM Company`);
    if (!snap.recordset[0]) throw new Error("No record found!");
    return snap.recordset;
  } catch (err) {
    throw Error(err.message);
  }
};

const LocationBusses = async (data) => {
  try {
    const { departureLocation, arrivalLocation } = data;

    const snap = await sql.query(
      `SELECT DepartureLocation, ArrivalLocation, StartTime, Fare,STATUS FROM BusJourney
            WHERE DepartureLocation = '${departureLocation}' and ArrivalLocation = '${arrivalLocation}' and StartTime > GETDATE()`
    );
    if (!snap.recordset[0]) throw new Error("No record found!");
    return snap.recordset;
  } catch (err) {
    throw Error(err.message);
  }
};

const CompanyBusses = async (data) => {
  try {
    const { departureLocation, arrivalLocation, companyID } = data;

    const snap = await sql.query(
      `SELECT DepartureLocation, ArrivalLocation, StartTime, Fare, STATUS FROM BusJourney BJ
            JOIN Bus B ON B.BusID = BJ.BusID JOIN Company C ON C.CompanyID = B.CompanyID
            WHERE C.CompanyID = ${companyID} and DepartureLocation = '${departureLocation}' and ArrivalLocation = '${arrivalLocation}' and StartTime > GETDATE()`
    );
    if (!snap.recordset[0]) throw new Error("No record found!");
    return snap.recordset;
  } catch (err) {
    throw Error(err.message);
  }
};

module.exports = {
  AllCompanies,
  LocationBusses,
  CompanyBusses,
};
