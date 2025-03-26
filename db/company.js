const { sql } = require("./config.js");

const AllCompanies = async (data) => {
  try {
    const snap = await sql.query(`SELECT Name FROM Company`);
    if (!snap.recordset[0]) throw new Error("No record found!");
    return snap.recordset[0];
  } catch (err) {
    throw Error(err);
  }
};

const LocationBusses = async (data) => {
  try {
    const { departureLocation, arrivalLocation } = data;

    const snap = await sql.query(
      `SELECT DepartureLocation, ArrivalLocation, StartTime, Fare FROM BusJourney
            WHERE DepartureLocation = ${departureLocation} and ArrivalLocation = ${arrivalLocation} and StartTime > GETDATE()`
    );
    if (!snap.recordset[0]) throw new Error("No record found!");
    return snap.recordset[0];
  } catch (err) {
    throw Error(err);
  }
};

const CompanyBusses = async (data) => {
  try {
    const { departureLocation, arrivalLocation, companyID } = data;

    const snap = await sql.query(
      `SELECT DepartureLocation, ArrivalLocation, StartTime, Fare FROM BusJourney BJ
            JOIN Bus B ON B.BusID = BJ.BusID JOIN Company C ON C.CompanyID = B.CompanyID
            WHERE CompanyID = ${companyID} and DepartureLocation = ${departureLocation} and ArrivalLocation = ${arrivalLocation} and StartTime > GETDATE()`
    );
    if (!snap.recordset[0]) throw new Error("No record found!");
    return snap.recordset[0];
  } catch (err) {
    throw Error(err);
  }
};

module.exports = {
  AllCompanies,
  LocationBusses,
  CompanyBusses,
};
